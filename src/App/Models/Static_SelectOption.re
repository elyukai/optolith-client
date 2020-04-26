type wikiEntry =
  | Blessing(Static_Blessing.t)
  | Cantrip(Static_Cantrip.t)
  | CombatTechnique(Static_CombatTechnique.t)
  | LiturgicalChant(Static_LiturgicalChant.t)
  | Skill(Static_Skill.t)
  | Spell(Static_Spell.t);

type t = {
  id: Ids.selectOptionId,
  name: string,
  cost: Maybe.t(int),
  prerequisites: Static_Prerequisites.t,
  description: Maybe.t(string),
  isSecret: Maybe.t(bool),
  languages: Maybe.t(list(int)),
  continent: Maybe.t(int),
  isExtinct: Maybe.t(bool),
  specializations: Maybe.t(list(string)),
  specializationInput: Maybe.t(string),
  animalGr: Maybe.t(int),
  animalLevel: Maybe.t(int),
  target: Maybe.t(int),
  wikiEntry: Maybe.t(wikiEntry),
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Ord = {
  type t = Ids.selectOptionId;

  let%private outerToInt = (id: Ids.selectOptionId) =>
    switch (id) {
    | `Generic(_) => 1
    | `Skill(_) => 2
    | `CombatTechnique(_) => 3
    | `Spell(_) => 4
    | `Cantrip(_) => 5
    | `LiturgicalChant(_) => 6
    | `Blessing(_) => 7
    };

  let%private innerToInt = (id: Ids.selectOptionId) =>
    switch (id) {
    | `Generic(x) => x
    | `Skill(x) => x
    | `CombatTechnique(x) => x
    | `Spell(x) => x
    | `Cantrip(x) => x
    | `LiturgicalChant(x) => x
    | `Blessing(x) => x
    };

  /**
   * `compare x y` returns `0` if `x` is equal to `y`, a negative integer if `x`
   * is less than `y`, and a positive integer if `x` is greater than `y`.
   */
  let compare = (x, y) => {
    let x' = outerToInt(x);
    let y' = outerToInt(y);

    if (x' === y') {
      innerToInt(x) - innerToInt(y);
    } else {
      x' - y';
    };
  };
};

let showId = (id: Ids.selectOptionId) =>
  switch (id) {
  | `Generic(x) => "Generic(" ++ Int.show(x) ++ ")"
  | `Skill(x) => "Skill(" ++ Int.show(x) ++ ")"
  | `CombatTechnique(x) => "CombatTechnique(" ++ Int.show(x) ++ ")"
  | `Spell(x) => "Spell(" ++ Int.show(x) ++ ")"
  | `Cantrip(x) => "Cantrip(" ++ Int.show(x) ++ ")"
  | `LiturgicalChant(x) => "LiturgicalChant(" ++ Int.show(x) ++ ")"
  | `Blessing(x) => "Blessing(" ++ Int.show(x) ++ ")"
  };

module SelectOptionMap = Data_Map.Make(Ord);

type map = SelectOptionMap.t(t);

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type tL10n = {
    id: Ids.selectOptionId,
    name: string,
    description: Maybe.t(string),
    specializations: Maybe.t(list(string)),
    specializationInput: Maybe.t(string),
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", Static_Prerequisites.Decode.selectOptionId),
    name: json |> field("name", string),
    description: json |> optionalField("description", string),
    specializations: json |> optionalField("specializations", list(string)),
    specializationInput: json |> optionalField("specializationInput", string),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  type tUniv = {
    id: Ids.selectOptionId,
    cost: Maybe.t(int),
    prerequisites: Static_Prerequisites.t,
    isSecret: Maybe.t(bool),
    languages: Maybe.t(list(int)),
    continent: Maybe.t(int),
    isExtinct: Maybe.t(bool),
    animalGr: Maybe.t(int),
    animalLevel: Maybe.t(int),
  };

  let tUniv = json => {
    id: json |> field("id", Static_Prerequisites.Decode.selectOptionId),
    cost: json |> optionalField("cost", int),
    prerequisites: json |> Static_Prerequisites.Decode.t,
    isSecret: json |> optionalField("isSecret", bool),
    languages: json |> optionalField("languages", list(int)),
    continent: json |> optionalField("continent", int),
    isExtinct: json |> optionalField("isExtinct", bool),
    animalGr: json |> optionalField("animalGr", int),
    animalLevel: json |> optionalField("animalLevel", int),
  };

  let t = (univ, l10n) => {
    id: univ.id,
    name: l10n.name,
    cost: univ.cost,
    prerequisites: univ.prerequisites,
    description: l10n.description,
    isSecret: univ.isSecret,
    languages: univ.languages,
    continent: univ.continent,
    isExtinct: univ.isExtinct,
    specializations: l10n.specializations,
    specializationInput: l10n.specializationInput,
    animalGr: univ.animalGr,
    animalLevel: univ.animalLevel,
    target: Maybe.Nothing,
    wikiEntry: Maybe.Nothing,
    src: l10n.src,
    errata: l10n.errata,
  };

  type category =
    | Blessings
    | Cantrips
    | CombatTechniques
    | LiturgicalChants
    | Skills
    | Spells;

  let category = json =>
    json
    |> string
    |> (
      str =>
        switch (str) {
        | "BLESSINGS" => Blessings
        | "CANTRIPS" => Cantrips
        | "COMBAT_TECHNIQUES" => CombatTechniques
        | "LITURGICAL_CHANTS" => LiturgicalChants
        | "SKILLS" => Skills
        | "SPELLS" => Spells
        | _ => raise(DecodeError("Unknown select option category: " ++ str))
        }
    );

  type categoryWithGroups = {
    category,
    groups: Maybe.t(list(int)),
  };

  let categoryWithGroups = json => {
    category: json |> field("category", category),
    groups: json |> optionalField("groups", list(int)),
  };

  let entryToSelectOption = (~id, ~name, ~wikiEntry, ~src, ~errata) => {
    id,
    name,
    cost: Maybe.Nothing,
    prerequisites: Static_Prerequisites.empty,
    description: Maybe.Nothing,
    isSecret: Maybe.Nothing,
    languages: Maybe.Nothing,
    continent: Maybe.Nothing,
    isExtinct: Maybe.Nothing,
    specializations: Maybe.Nothing,
    specializationInput: Maybe.Nothing,
    animalGr: Maybe.Nothing,
    animalLevel: Maybe.Nothing,
    target: Maybe.Nothing,
    wikiEntry: Maybe.Just(wikiEntry),
    src,
    errata,
  };

  let insertEntry = (s: t) => SelectOptionMap.insert(s.id, s);

  let resolveWithoutGroups = (f, mp, xs) =>
    IntMap.Foldable.foldr(x => x |> f |> insertEntry, xs, mp);

  let resolveGroups = (f, g, grs, mp, xs) =>
    IntMap.Foldable.foldr(
      x =>
        ListH.Foldable.elem(g(x), grs) ? x |> f |> insertEntry : Function.id,
      xs,
      mp,
    );

  let blessingToSelectOption = (x: Static_Blessing.t) =>
    entryToSelectOption(
      ~id=`Blessing(x.id),
      ~name=x.name,
      ~wikiEntry=Blessing(x),
      ~src=x.src,
      ~errata=x.errata,
    );

  let resolveBlessings = resolveWithoutGroups(blessingToSelectOption);

  let cantripToSelectOption = (x: Static_Cantrip.t) =>
    entryToSelectOption(
      ~id=`Cantrip(x.id),
      ~name=x.name,
      ~wikiEntry=Cantrip(x),
      ~src=x.src,
      ~errata=x.errata,
    );

  let resolveCantrips = resolveWithoutGroups(cantripToSelectOption);

  let combatTechniqueToSelectOption = (x: Static_CombatTechnique.t) =>
    entryToSelectOption(
      ~id=`CombatTechnique(x.id),
      ~name=x.name,
      ~wikiEntry=CombatTechnique(x),
      ~src=x.src,
      ~errata=x.errata,
    );

  let resolveCombatTechniques = mgrs =>
    switch (mgrs) {
    | Maybe.Just(grs) =>
      resolveGroups(combatTechniqueToSelectOption, x => x.gr, grs)
    | Maybe.Nothing => resolveWithoutGroups(combatTechniqueToSelectOption)
    };

  let liturgicalChantToSelectOption = (x: Static_LiturgicalChant.t) =>
    entryToSelectOption(
      ~id=`LiturgicalChant(x.id),
      ~name=x.name,
      ~wikiEntry=LiturgicalChant(x),
      ~src=x.src,
      ~errata=x.errata,
    );

  let resolveLiturgicalChants = mgrs =>
    switch (mgrs) {
    | Maybe.Just(grs) =>
      resolveGroups(liturgicalChantToSelectOption, x => x.gr, grs)
    | Maybe.Nothing => resolveWithoutGroups(liturgicalChantToSelectOption)
    };

  let skillToSelectOption = (x: Static_Skill.t) =>
    entryToSelectOption(
      ~id=`Skill(x.id),
      ~name=x.name,
      ~wikiEntry=Skill(x),
      ~src=x.src,
      ~errata=x.errata,
    );

  let resolveSkills = mgrs =>
    switch (mgrs) {
    | Maybe.Just(grs) => resolveGroups(skillToSelectOption, x => x.gr, grs)
    | Maybe.Nothing => resolveWithoutGroups(skillToSelectOption)
    };

  let spellToSelectOption = (x: Static_Spell.t) =>
    entryToSelectOption(
      ~id=`Spell(x.id),
      ~name=x.name,
      ~wikiEntry=Spell(x),
      ~src=x.src,
      ~errata=x.errata,
    );

  let resolveSpells = mgrs =>
    switch (mgrs) {
    | Maybe.Just(grs) => resolveGroups(spellToSelectOption, x => x.gr, grs)
    | Maybe.Nothing => resolveWithoutGroups(spellToSelectOption)
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
    |> Maybe.fromMaybe([])
    |> ListH.Foldable.foldr(
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
         SelectOptionMap.empty,
       );

  let l10nToSelectOption = (l10n: tL10n) => {
    id: l10n.id,
    name: l10n.name,
    cost: Maybe.Nothing,
    prerequisites: Static_Prerequisites.empty,
    description: l10n.description,
    isSecret: Maybe.Nothing,
    languages: Maybe.Nothing,
    continent: Maybe.Nothing,
    isExtinct: Maybe.Nothing,
    specializations: l10n.specializations,
    specializationInput: l10n.specializationInput,
    animalGr: Maybe.Nothing,
    animalLevel: Maybe.Nothing,
    target: Maybe.Nothing,
    wikiEntry: Maybe.Nothing,
    src: l10n.src,
    errata: l10n.errata,
  };

  let mergeUnivIntoSelectOption = (univ: tUniv, x: t) =>
    Maybe.Alternative.{
      id: x.id,
      name: x.name,
      cost: univ.cost <|> x.cost,
      prerequisites: univ.prerequisites,
      description: x.description,
      isSecret: univ.isSecret <|> x.isSecret,
      languages: univ.languages <|> x.languages,
      continent: univ.continent <|> x.continent,
      isExtinct: univ.isExtinct <|> x.isExtinct,
      specializations: x.specializations,
      specializationInput: x.specializationInput,
      animalGr: univ.animalGr <|> x.animalGr,
      animalLevel: univ.animalLevel <|> x.animalLevel,
      target: x.target,
      wikiEntry: x.wikiEntry,
      src: x.src,
      errata: x.errata,
    };

  let mergeSelectOptions = (ml10ns, munivs, fromCategories) =>
    fromCategories
    |> Maybe.maybe(
         Function.id,
         (l10ns, mp) =>
           ListH.Foldable.foldr(
             (l10n: tL10n, mp') =>
               if (SelectOptionMap.member(l10n.id, mp')) {
                 raise(
                   DecodeError(
                     "mergeSelectOptions: Key "
                     ++ showId(l10n.id)
                     ++ "already in use",
                   ),
                 );
               } else {
                 SelectOptionMap.insert(
                   l10n.id,
                   l10nToSelectOption(l10n),
                   mp',
                 );
               },
             mp,
             l10ns,
           ),
         ml10ns,
       )
    |> Maybe.maybe(
         Function.id,
         (univs, mp) =>
           ListH.Foldable.foldr(
             (univ: tUniv, mp') =>
               SelectOptionMap.adjust(
                 mergeUnivIntoSelectOption(univ),
                 univ.id,
                 mp',
               ),
             mp,
             univs,
           ),
         munivs,
       );
};
