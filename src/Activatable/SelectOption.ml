type staticEntry =
  | Blessing of Blessing.Static.t
  | Cantrip of Cantrip.Static.t
  | CombatTechnique of CombatTechnique.Static.t
  | LiturgicalChant of LiturgicalChant.Static.t
  | Skill of Skill.Static.t
  | Spell of Spell.Static.t
  | TradeSecret of TradeSecret.t
  | Language of Language.t
  | Script of Script.t
  | AnimalShape of AnimalShape.t

type t = {
  id: Id.Activatable.SelectOption.t;
  name: string;
  apValue: int option;
  prerequisites: Prerequisite.Collection.General.t;
  description: string option;
  isSecret: bool option;
  languages: int list option;
  continent: int option;
  isExtinct: bool option;
  specializations: string list option;
  specializationInput: string option;
  animalGr: int option;
  animalLevel: int option;
  enhancementTarget: int option;
  enhancementLevel: int option;
  staticEntry: staticEntry option;
  (** needed to be able to filter valid applications without altering the static
      entry *)
  applications: Skill.Static.Application.t list option;
  src: PublicationRef.t list;
  errata: Erratum.t list
}

let showId (id: Id.Activatable.SelectOption.t) =
  match (id) with
  | Generic(x) -> "Generic(" ^ Ley_Int.show(x) ^ ")"
  | Skill(x) -> "Skill(" ^ Ley_Int.show(x) ^ ")"
  | CombatTechnique(x) -> "CombatTechnique(" ^ Ley_Int.show(x) ^ ")"
  | Spell(x) -> "Spell(" ^ Ley_Int.show(x) ^ ")"
  | Cantrip(x) -> "Cantrip(" ^ Ley_Int.show(x) ^ ")"
  | LiturgicalChant(x) -> "LiturgicalChant(" ^ Ley_Int.show(x) ^ ")"
  | Blessing(x) -> "Blessing(" ^ Ley_Int.show(x) ^ ")"
  | SpecialAbility(x) -> "SpecialAbility(" ^ Ley_Int.show(x) ^ ")"
  | TradeSecret(x) -> "TradeSecret(" ^ Ley_Int.show(x) ^ ")"
  | Language(x) -> "Language(" ^ Ley_Int.show(x) ^ ")"
  | Script(x) -> "Script(" ^ Ley_Int.show(x) ^ ")"
  | AnimalShape(x) -> "AnimalShape(" ^ Ley_Int.show(x) ^ ")"

module Map = Ley_Map.Make(Id.Activatable.SelectOption)

type map = t Map.t

module Decode = {
  module Preset = struct

  end

  type explicit = Preset of {
    id: Id.Activatable.SelectOption.t;
    prerequisites: Prerequisite.Collection.General.t option;
    apValue: int option;
    src: PublicationRef.t list option;
  } |Custom of {
    id: int;
    prerequisites: Prerequisite.Collection.General.t option;
    apValue: int option;
    src: PublicationRef.t list option;

  }
  module Translation = {
    type t = {
      name: string,
      description: option(string),
      errata: option(list(Erratum.t)),
    };

    let t = json =>
      JsonStrict.{
        name: json |> field("name", string),
        description: json |> optionalField("description", string),
        errata: json |> optionalField("errata", Erratum.Decode.list),
      };
  };

  module TranslationMap = TranslationMap.Make(Translation);

  let selectOptionId =
    Json.Decode.(int |> map(x => Id.Activatable.SelectOption.Generic(x)));

  type multilingual = {
    id: Id.Activatable.SelectOption.t,
    apValue: int option,
    prerequisites: Prerequisite.Collection.General.Decode.multilingual,
    src: list(PublicationRef.Decode.multilingual),
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    JsonStrict.{
      id: json |> field("id", selectOptionId),
      apValue: json |> optionalField("apValue", int),
      prerequisites:
        json
        |> field(
             "prerequisites",
             Prerequisite.Collection.General.Decode.multilingual,
           ),
      src: json |> field("src", PublicationRef.Decode.multilingualList),
      translations: json |> field("translations", TranslationMap.Decode.t),
    };

  let multilingualAssoc = json => json |> multilingual |> (x => (x.id, x));

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.Decode.getFromLanguageOrder(langs)
      <&> (
        translation => {
          id: x.id,
          name: translation.name,
          description: translation.description,
          apValue: x.apValue,
          prerequisites:
            Prerequisite.Collection.General.Decode.resolveTranslations(
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
          staticEntry: None,
          applications: None,
          src: PublicationRef.Decode.resolveTranslationsList(langs, x.src),
          errata: translation.errata |> Ley_Option.fromOption([]),
        }
      )
    );

  module Category = {
    type t =
      | Blessings
      | Cantrips
      | CombatTechniques(list(int))
      | LiturgicalChants(list(int))
      | Skills(list(int))
      | Spells(list(int))
      | TradeSecrets
      | Languages
      | Scripts
      | AnimalShapes
      | SpellEnhancements
      | LiturgicalChantEnhancements;

    let t =
      JsonStrict.(
        field("category", string)
        |> andThen(
             fun
             | "Blessings" => (_ => Blessings)
             | "Cantrips" => (_ => Cantrips)
             | "CombatTechniques" => (
                 json =>
                   json
                   |> optionalField("groups", list(int))
                   |> Ley_Option.fromOption([])
                   |> (xs => CombatTechniques(xs))
               )
             | "LiturgicalChants" => (
                 json =>
                   json
                   |> optionalField("groups", list(int))
                   |> Ley_Option.fromOption([])
                   |> (xs => LiturgicalChants(xs))
               )
             | "Skills" => (
                 json =>
                   json
                   |> optionalField("groups", list(int))
                   |> Ley_Option.fromOption([])
                   |> (xs => Skills(xs))
               )
             | "Spells" => (
                 json =>
                   json
                   |> optionalField("groups", list(int))
                   |> Ley_Option.fromOption([])
                   |> (xs => Spells(xs))
               )
             | "TradeSecrets" => (_ => TradeSecrets)
             | "Languages" => (_ => Languages)
             | "Scripts" => (_ => Scripts)
             | "AnimalShapes" => (_ => AnimalShapes)
             | "SpellEnhancements" => (_ => SpellEnhancements)
             | "LiturgicalChantEnhancements" => (
                 _ => LiturgicalChantEnhancements
               )
             | str =>
               raise(DecodeError("Unknown select option category: " ^ str)),
           )
      );
  };

  module ResolveCategories = {
    let entryToSelectOption = (~id, ~name, ~staticEntry, ~src, ~errata) => {
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
      staticEntry: Some(staticEntry),
      applications: None,
      src,
      errata,
    };

    let insertEntry = (s: t) => Map.insert(s.id, s);

    let mergeMaps = (mp1, mp2) => Map.foldr(insertEntry, mp2, mp1);

    let resolveWithoutGroups = (f, mp, xs) =>
      Ley_IntMap.foldr(x => x |> f |> insertEntry, xs, mp);

    let resolveGroups = (f, g, grs, mp, xs) =>
      Ley_IntMap.foldr(
        x =>
          Ley_List.elem(g(x), grs) ? x |> f |> insertEntry : Ley_Function.id,
        xs,
        mp,
      );

    let blessingToSelectOption = (x: Blessing.Static.t) =>
      entryToSelectOption(
        ~id=Blessing(x.id),
        ~name=x.name,
        ~staticEntry=Blessing(x),
        ~src=x.src,
        ~errata=x.errata,
      );

    let resolveBlessings = resolveWithoutGroups(blessingToSelectOption);

    let cantripToSelectOption = (x: Cantrip.Static.t) =>
      entryToSelectOption(
        ~id=Cantrip(x.id),
        ~name=x.name,
        ~staticEntry=Cantrip(x),
        ~src=x.src,
        ~errata=x.errata,
      );

    let resolveCantrips = resolveWithoutGroups(cantripToSelectOption);

    let combatTechniqueToSelectOption = (x: CombatTechnique.Static.t) =>
      entryToSelectOption(
        ~id=CombatTechnique(x.id),
        ~name=x.name,
        ~staticEntry=CombatTechnique(x),
        ~src=x.src,
        ~errata=x.errata,
      );

    let resolveCombatTechniques =
      fun
      | [] => resolveWithoutGroups(combatTechniqueToSelectOption)
      | grs => resolveGroups(combatTechniqueToSelectOption, x => x.gr, grs);

    let liturgicalChantToSelectOption = (x: LiturgicalChant.Static.t) =>
      entryToSelectOption(
        ~id=LiturgicalChant(x.id),
        ~name=x.name,
        ~staticEntry=LiturgicalChant(x),
        ~src=x.src,
        ~errata=x.errata,
      );

    let resolveLiturgicalChants =
      fun
      | [] => resolveWithoutGroups(liturgicalChantToSelectOption)
      | grs => resolveGroups(liturgicalChantToSelectOption, x => x.gr, grs);

    let skillToSelectOption = (x: Skill.Static.t) =>
      entryToSelectOption(
        ~id=Skill(x.id),
        ~name=x.name,
        ~staticEntry=Skill(x),
        ~src=x.src,
        ~errata=x.errata,
      );

    let resolveSkills =
      fun
      | [] => resolveWithoutGroups(skillToSelectOption)
      | grs => resolveGroups(skillToSelectOption, x => x.gr, grs);

    let spellToSelectOption = (x: Spell.Static.t) =>
      entryToSelectOption(
        ~id=Spell(x.id),
        ~name=x.name,
        ~staticEntry=Spell(x),
        ~src=x.src,
        ~errata=x.errata,
      );

    let resolveSpells =
      fun
      | [] => resolveWithoutGroups(spellToSelectOption)
      | grs => resolveGroups(spellToSelectOption, x => x.gr, grs);

    let tradeSecretToSelectOption = (x: TradeSecret.t) =>
      entryToSelectOption(
        ~id=TradeSecret(x.id),
        ~name=x.name,
        ~staticEntry=TradeSecret(x),
        ~src=x.src,
        ~errata=x.errata,
      );

    let resolveTradeSecrets = resolveWithoutGroups(tradeSecretToSelectOption);

    let languageToSelectOption = (x: Language.t) =>
      entryToSelectOption(
        ~id=Language(x.id),
        ~name=x.name,
        ~staticEntry=Language(x),
        ~src=x.src,
        ~errata=x.errata,
      );

    let resolveLanguages = resolveWithoutGroups(languageToSelectOption);

    let scriptToSelectOption = (x: Script.t) =>
      entryToSelectOption(
        ~id=Script(x.id),
        ~name=x.name,
        ~staticEntry=Script(x),
        ~src=x.src,
        ~errata=x.errata,
      );

    let resolveScripts = resolveWithoutGroups(scriptToSelectOption);

    let animalShapeToSelectOption = (src, errata, x: AnimalShape.t) =>
      entryToSelectOption(
        ~id=AnimalShape(x.id),
        ~name=x.name,
        ~staticEntry=AnimalShape(x),
        ~src,
        ~errata,
      );

    let resolveAnimalShapes = (src, errata) =>
      resolveWithoutGroups(animalShapeToSelectOption(src, errata));

    /**
     * Takes an array of select option categories and resolves them into a list of
     * select options.
     */
    let resolveCategories =
        (
          ~blessings,
          ~cantrips,
          ~combatTechniques,
          ~liturgicalChants,
          ~skills,
          ~spells,
          ~tradeSecrets,
          ~languages,
          ~scripts,
          ~animalShapes,
          ~spellEnhancements,
          ~liturgicalChantEnhancements,
          ~src,
          ~errata,
          categories,
        ) =>
      categories
      |> Ley_Option.fromOption([])
      |> Ley_List.foldr(
           (cat: Category.t) =>
             switch (cat) {
             | Blessings => resolveBlessings(blessings)
             | Cantrips => resolveCantrips(cantrips)
             | CombatTechniques(groups) =>
               resolveCombatTechniques(groups, combatTechniques)
             | LiturgicalChants(groups) =>
               resolveLiturgicalChants(groups, liturgicalChants)
             | Skills(groups) => resolveSkills(groups, skills)
             | Spells(groups) => resolveSpells(groups, spells)
             | TradeSecrets => resolveTradeSecrets(tradeSecrets)
             | Languages => resolveLanguages(languages)
             | Scripts => resolveScripts(scripts)
             | AnimalShapes => resolveAnimalShapes(src, errata, animalShapes)
             | SpellEnhancements => mergeMaps(spellEnhancements)
             | LiturgicalChantEnhancements =>
               mergeMaps(liturgicalChantEnhancements)
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
    //
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

    let mergeSelectOptions = (explicits, fromCategories) =>
      fromCategories
      |> (
        prev =>
          Map.foldl((mp, x: t) => Map.insert(x.id, x, mp), prev, explicits)
      );
    // |> Ley_Option.option(
    //      Ley_Function.id,
    //      (l10ns, mp) =>
    //        Ley_List.foldr(
    //          (l10n: tL10n, mp') =>
    //            if (Map.member(l10n.id, mp')) {
    //              raise(
    //                DecodeError(
    //                  "mergeSelectOptions: Key "
    //                  ^ showId(l10n.id)
    //                  ^ "already in use",
    //                ),
    //              );
    //            } else {
    //              Map.insert(l10n.id, l10nToSelectOption(l10n), mp');
    //            },
    //          mp,
    //          l10ns,
    //        ),
    //      ml10ns,
    //    )
    // |> Ley_Option.option(
    //      Ley_Function.id,
    //      (univs, mp) =>
    //        Ley_List.foldr(
    //          (univ: tUniv, mp') =>
    //            Map.adjust(mergeUnivIntoSelectOption(univ), univ.id, mp'),
    //          mp,
    //          univs,
    //        ),
    //      munivs,
    //    );
  };
};
