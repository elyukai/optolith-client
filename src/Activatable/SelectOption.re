type wikiEntry =
  | Blessing(Blessing.t)
  | Cantrip(Cantrip.t)
  | CombatTechnique(CombatTechnique.Static.t)
  | LiturgicalChant(LiturgicalChant.Static.t)
  | Skill(Skill.Static.t)
  | Spell(Spell.Static.t);

type t = {
  id: Id.Activatable.SelectOption.t,
  name: string,
  apValue: option(int),
  prerequisites: Prerequisite.Collection.General.t,
  description: option(string),
  isSecret: option(bool),
  languages: option(list(int)),
  continent: option(int),
  isExtinct: option(bool),
  specializations: option(list(string)),
  specializationInput: option(string),
  animalGr: option(int),
  animalLevel: option(int),
  enhancementTarget: option(int),
  enhancementLevel: option(int),
  wikiEntry: option(wikiEntry),
  // needed to be able to filter valid applications without altering the static
  // entry
  applications: option(list(Skill.Static.Application.t)),
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

let showId = (id: Id.Activatable.SelectOption.t) =>
  switch (id) {
  | (Generic, x) => "Generic(" ++ Ley_Int.show(x) ++ ")"
  | (Skill, x) => "Skill(" ++ Ley_Int.show(x) ++ ")"
  | (CombatTechnique, x) => "CombatTechnique(" ++ Ley_Int.show(x) ++ ")"
  | (Spell, x) => "Spell(" ++ Ley_Int.show(x) ++ ")"
  | (Cantrip, x) => "Cantrip(" ++ Ley_Int.show(x) ++ ")"
  | (LiturgicalChant, x) => "LiturgicalChant(" ++ Ley_Int.show(x) ++ ")"
  | (Blessing, x) => "Blessing(" ++ Ley_Int.show(x) ++ ")"
  | (SpecialAbility, x) => "SpecialAbility(" ++ Ley_Int.show(x) ++ ")"
  };

module Map = Ley_Map.Make(Id.Activatable.SelectOption);

type map = Map.t(t);

module Translations = {
  type t = {
    name: string,
    description: option(string),
    errata: list(Erratum.t),
  };

  let decode = json =>
    JsonStrict.{
      name: json |> field("name", string),
      description: json |> optionalField("description", string),
      errata: json |> field("errata", Erratum.decodeList),
    };
};

module TranslationMap = TranslationMap.Make(Translations);

type multilingual = {
  id: int,
  apValue: option(int),
  prerequisites: Prerequisite.Collection.General.multilingual,
  src: list(PublicationRef.multilingual),
  translations: TranslationMap.t,
};

let decodeMultilingual = json =>
  JsonStrict.{
    id: json |> field("id", int),
    apValue: json |> optionalField("apValue", int),
    prerequisites:
      json
      |> field(
           "prerequisites",
           Prerequisite.Collection.General.decodeMultilingual,
         ),
    src: json |> field("src", PublicationRef.decodeMultilingualList),
    translations: json |> field("translations", TranslationMap.decode),
  };

let resolveTranslations = (langs, x) =>
  Ley_Option.Infix.(
    x.translations
    |> TranslationMap.getFromLanguageOrder(langs)
    <&> (
      translation => {
        id: (Generic, x.id),
        name: translation.name,
        description: translation.description,
        apValue: x.apValue,
        prerequisites:
          Prerequisite.Collection.General.resolveTranslations(
            langs,
            x.prerequisites,
          ),
        isSecret: None,
        languages: None,
        continent: None,
        isExtinct: None,
        specializations: None,
        specializationInput: None,
        animalGr: None,
        animalLevel: None,
        enhancementTarget: None,
        enhancementLevel: None,
        wikiEntry: None,
        applications: None,
        src: PublicationRef.resolveTranslationsList(langs, x.src),
        errata: translation.errata,
      }
    )
  );

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);

module ResolveCategories = {
  type category =
    | Blessings
    | Cantrips
    | CombatTechniques
    | LiturgicalChants
    | Skills
    | Spells;

  let category = json =>
    Json.Decode.(
      json
      |> string
      |> (
        fun
        | "BLESSINGS" => Blessings
        | "CANTRIPS" => Cantrips
        | "COMBAT_TECHNIQUES" => CombatTechniques
        | "LITURGICAL_CHANTS" => LiturgicalChants
        | "SKILLS" => Skills
        | "SPELLS" => Spells
        | str =>
          raise(DecodeError("Unknown select option category: " ++ str))
      )
    );

  type categoryWithGroups = {
    category,
    groups: option(list(int)),
  };

  let categoryWithGroups = json =>
    JsonStrict.{
      category: json |> field("category", category),
      groups: json |> optionalField("groups", list(int)),
    };

  let entryToSelectOption = (~id, ~name, ~wikiEntry, ~src, ~errata) => {
    id,
    name,
    apValue: None,
    prerequisites: Plain([]),
    description: None,
    isSecret: None,
    languages: None,
    continent: None,
    isExtinct: None,
    specializations: None,
    specializationInput: None,
    animalGr: None,
    animalLevel: None,
    enhancementTarget: None,
    enhancementLevel: None,
    wikiEntry: Some(wikiEntry),
    applications: None,
    src,
    errata,
  };

  let insertEntry = (s: t) => Map.insert(s.id, s);

  let resolveWithoutGroups = (f, mp, xs) =>
    Ley_IntMap.Foldable.foldr(x => x |> f |> insertEntry, xs, mp);

  let resolveGroups = (f, g, grs, mp, xs) =>
    Ley_IntMap.Foldable.foldr(
      x =>
        Ley_List.elem(g(x), grs) ? x |> f |> insertEntry : Ley_Function.id,
      xs,
      mp,
    );

  let blessingToSelectOption = (x: Blessing.t) =>
    entryToSelectOption(
      ~id=(Blessing, x.id),
      ~name=x.name,
      ~wikiEntry=Blessing(x),
      ~src=x.src,
      ~errata=x.errata,
    );

  let resolveBlessings = resolveWithoutGroups(blessingToSelectOption);

  let cantripToSelectOption = (x: Cantrip.t) =>
    entryToSelectOption(
      ~id=(Cantrip, x.id),
      ~name=x.name,
      ~wikiEntry=Cantrip(x),
      ~src=x.src,
      ~errata=x.errata,
    );

  let resolveCantrips = resolveWithoutGroups(cantripToSelectOption);

  let combatTechniqueToSelectOption = (x: CombatTechnique.Static.t) =>
    entryToSelectOption(
      ~id=(CombatTechnique, x.id),
      ~name=x.name,
      ~wikiEntry=CombatTechnique(x),
      ~src=x.src,
      ~errata=x.errata,
    );

  let resolveCombatTechniques = mgrs =>
    switch (mgrs) {
    | Some(grs) =>
      resolveGroups(combatTechniqueToSelectOption, x => x.gr, grs)
    | None => resolveWithoutGroups(combatTechniqueToSelectOption)
    };

  let liturgicalChantToSelectOption = (x: LiturgicalChant.Static.t) =>
    entryToSelectOption(
      ~id=(LiturgicalChant, x.id),
      ~name=x.name,
      ~wikiEntry=LiturgicalChant(x),
      ~src=x.src,
      ~errata=x.errata,
    );

  let resolveLiturgicalChants = mgrs =>
    switch (mgrs) {
    | Some(grs) =>
      resolveGroups(liturgicalChantToSelectOption, x => x.gr, grs)
    | None => resolveWithoutGroups(liturgicalChantToSelectOption)
    };

  let skillToSelectOption = (x: Skill.Static.t) =>
    entryToSelectOption(
      ~id=(Skill, x.id),
      ~name=x.name,
      ~wikiEntry=Skill(x),
      ~src=x.src,
      ~errata=x.errata,
    );

  let resolveSkills = mgrs =>
    switch (mgrs) {
    | Some(grs) => resolveGroups(skillToSelectOption, x => x.gr, grs)
    | None => resolveWithoutGroups(skillToSelectOption)
    };

  let spellToSelectOption = (x: Spell.Static.t) =>
    entryToSelectOption(
      ~id=(Spell, x.id),
      ~name=x.name,
      ~wikiEntry=Spell(x),
      ~src=x.src,
      ~errata=x.errata,
    );

  let resolveSpells = mgrs =>
    switch (mgrs) {
    | Some(grs) => resolveGroups(spellToSelectOption, x => x.gr, grs)
    | None => resolveWithoutGroups(spellToSelectOption)
    };

  /**
   * Takes an array of select option categories and resolves them into a list of
   * select options.
   */
  let resolveCategories =
      (
        blessings,
        cantrips,
        combatTechniques,
        liturgicalChants,
        skills,
        spells,
        categories,
      ) =>
    categories
    |> Ley_Option.fromOption([])
    |> Ley_List.foldr(
         cat =>
           switch (cat.category) {
           | Blessings => resolveBlessings(blessings)
           | Cantrips => resolveCantrips(cantrips)
           | CombatTechniques =>
             resolveCombatTechniques(cat.groups, combatTechniques)
           | LiturgicalChants =>
             resolveLiturgicalChants(cat.groups, liturgicalChants)
           | Skills => resolveSkills(cat.groups, skills)
           | Spells => resolveSpells(cat.groups, spells)
           },
         Map.empty,
       );
  // let l10nToSelectOption = (l10n: tL10n) => {
  //   id: l10n.id,
  //   name: l10n.name,
  //   cost: None,
  //   prerequisites: Prerequisite.empty,
  //   description: l10n.description,
  //   isSecret: None,
  //   languages: None,
  //   continent: None,
  //   isExtinct: None,
  //   specializations: l10n.specializations,
  //   specializationInput: l10n.specializationInput,
  //   animalGr: None,
  //   animalLevel: None,
  //   enhancementTarget: None,
  //   enhancementLevel: None,
  //   wikiEntry: None,
  //   applications: None,
  //   src: l10n.src,
  //   errata: l10n.errata,
  // };
  // let mergeUnivIntoSelectOption = (univ: tUniv, x: t) =>
  //   Ley_Option.Alternative.{
  //     id: x.id,
  //     name: x.name,
  //     cost: univ.cost <|> x.cost,
  //     prerequisites: univ.prerequisites,
  //     description: x.description,
  //     isSecret: univ.isSecret <|> x.isSecret,
  //     languages: univ.languages <|> x.languages,
  //     continent: univ.continent <|> x.continent,
  //     isExtinct: univ.isExtinct <|> x.isExtinct,
  //     specializations: x.specializations,
  //     specializationInput: x.specializationInput,
  //     animalGr: univ.animalGr <|> x.animalGr,
  //     animalLevel: univ.animalLevel <|> x.animalLevel,
  //     enhancementTarget: x.enhancementTarget,
  //     enhancementLevel: x.enhancementLevel,
  //     wikiEntry: x.wikiEntry,
  //     applications: None,
  //     src: x.src,
  //     errata: x.errata,
  //   };
  // let mergeSelectOptions = (ml10ns, munivs, fromCategories) =>
  //   fromCategories
  //   |> Ley_Option.option(
  //        Ley_Function.id,
  //        (l10ns, mp) =>
  //          Ley_List.Foldable.foldr(
  //            (l10n: tL10n, mp') =>
  //              if (Map.member(l10n.id, mp')) {
  //                raise(
  //                  DecodeError(
  //                    "mergeSelectOptions: Key "
  //                    ++ showId(l10n.id)
  //                    ++ "already in use",
  //                  ),
  //                );
  //              } else {
  //                Map.insert(l10n.id, l10nToSelectOption(l10n), mp');
  //              },
  //            mp,
  //            l10ns,
  //          ),
  //        ml10ns,
  //      )
  //   |> Ley_Option.option(
  //        Ley_Function.id,
  //        (univs, mp) =>
  //          Ley_List.Foldable.foldr(
  //            (univ: tUniv, mp') =>
  //              Map.adjust(mergeUnivIntoSelectOption(univ), univ.id, mp'),
  //            mp,
  //            univs,
  //          ),
  //        munivs,
  //      );
};
