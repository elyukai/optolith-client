type sex = Hero.sex;

type race = {
  id: OneOrMany.t(int),
  active: bool,
};

type culture = OneOrMany.t(int);

type socialStatus = int;

type pact = {
  category: int,
  domain: option(OneOrMany.t(int)),
  level: option(int),
};

type primaryAttributeType =
  | Magical
  | Blessed;

type primaryAttribute = {
  value: int,
  scope: primaryAttributeType,
};

type activatable = {
  id: Id.activatable,
  active: bool,
  sid: option(Id.selectOption),
  sid2: option(Id.selectOption),
  level: option(int),
};

type activatableIds =
  | Advantages(list(int))
  | Disadvantages(list(int))
  | SpecialAbilities(list(int));

type activatableMultiEntry = {
  id: activatableIds,
  active: bool,
  sid: option(Id.selectOption),
  sid2: option(Id.selectOption),
  level: option(int),
};

type activatableMultiSelect = {
  id: Id.activatable,
  active: bool,
  sid: list(Id.selectOption),
  sid2: option(Id.selectOption),
  level: option(int),
};

type increasable = {
  id: Id.increasable,
  value: int,
};

type increasableIds =
  | Attributes(list(int))
  | Skills(list(int))
  | CombatTechniques(list(int))
  | Spells(list(int))
  | LiturgicalChants(list(int));

type increasableMultiEntry = {
  id: increasableIds,
  value: int,
};

type tProfession = {
  sex: option(sex),
  race: option(race),
  culture: option(culture),
  activatable: list(activatable),
  increasable: list(increasable),
};

type t = {
  sex: option(sex),
  race: option(race),
  culture: option(culture),
  pact: option(pact),
  social: option(socialStatus),
  primaryAttribute: option(primaryAttribute),
  activatable: list(activatable),
  activatableMultiEntry: list(activatableMultiEntry),
  activatableMultiSelect: list(activatableMultiSelect),
  increasable: list(increasable),
  increasableMultiEntry: list(increasableMultiEntry),
};

let empty = {
  sex: None,
  race: None,
  culture: None,
  pact: None,
  social: None,
  primaryAttribute: None,
  activatable: [],
  activatableMultiEntry: [],
  activatableMultiSelect: [],
  increasable: [],
  increasableMultiEntry: [],
};

type tWithLevel = {
  sex: option(sex),
  race: option(race),
  culture: option(culture),
  pact: option(pact),
  social: option(socialStatus),
  primaryAttribute: option(primaryAttribute),
  activatable: list(activatable),
  activatableMultiEntry: list(activatableMultiEntry),
  activatableMultiSelect: list(activatableMultiSelect),
  increasable: list(increasable),
  increasableMultiEntry: list(increasableMultiEntry),
  levels: Ley_IntMap.t(t),
};

type tWithLevelDisAdv = {
  commonSuggestedByRCP: bool,
  sex: option(sex),
  race: option(race),
  culture: option(culture),
  pact: option(pact),
  social: option(socialStatus),
  primaryAttribute: option(primaryAttribute),
  activatable: list(activatable),
  activatableMultiEntry: list(activatableMultiEntry),
  activatableMultiSelect: list(activatableMultiSelect),
  increasable: list(increasable),
  increasableMultiEntry: list(increasableMultiEntry),
  levels: Ley_IntMap.t(t),
};

type overridePrerequisite =
  | Hide
  | ReplaceWith(string);

type tIndex = {
  sex: option(overridePrerequisite),
  race: option(overridePrerequisite),
  culture: option(overridePrerequisite),
  pact: option(overridePrerequisite),
  social: option(overridePrerequisite),
  primaryAttribute: option(overridePrerequisite),
  activatable: Ley_IntMap.t(overridePrerequisite),
  activatableMultiEntry: Ley_IntMap.t(overridePrerequisite),
  activatableMultiSelect: Ley_IntMap.t(overridePrerequisite),
  increasable: Ley_IntMap.t(overridePrerequisite),
  increasableMultiEntry: Ley_IntMap.t(overridePrerequisite),
};

type tIndexWithLevel = {
  sex: option(overridePrerequisite),
  race: option(overridePrerequisite),
  culture: option(overridePrerequisite),
  pact: option(overridePrerequisite),
  social: option(overridePrerequisite),
  primaryAttribute: option(overridePrerequisite),
  activatable: Ley_IntMap.t(overridePrerequisite),
  activatableMultiEntry: Ley_IntMap.t(overridePrerequisite),
  activatableMultiSelect: Ley_IntMap.t(overridePrerequisite),
  increasable: Ley_IntMap.t(overridePrerequisite),
  increasableMultiEntry: Ley_IntMap.t(overridePrerequisite),
  levels: Ley_IntMap.t(tIndex),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;
  open Ley_Option.Functor;
  open Ley_Option.Monad;
  open Ley_Option.Alternative;

  let oneOrManyInt =
    oneOf([
      map((id): OneOrMany.t(int) => One(id), int),
      map((id): OneOrMany.t(int) => Many(id), list(int)),
    ]);

  let sex = json =>
    json
    |> string
    |> (
      (str) => (
        switch (str) {
        | "m" => Male
        | "f" => Female
        | _ => raise(DecodeError("Unknown sex prerequisite: " ++ str))
        }: sex
      )
    );

  let race =
    oneOf([
      (json) => ({id: json |> oneOrManyInt, active: true}: race),
      (json) => (
        {
          id: json |> field("id", oneOrManyInt),
          active: json |> field("active", bool),
        }: race
      ),
    ]);

  let culture = oneOrManyInt;

  let primaryAttribute = json => {
    scope:
      json
      |> field("type", string)
      |> (
        (str) => (
          switch (str) {
          | "blessed" => Blessed
          | "magical" => Magical
          | _ =>
            raise(DecodeError("Unknown primary attribute type: " ++ str))
          }: primaryAttributeType
        )
      ),
    value: json |> field("value", int),
  };

  let pact = json => {
    category: json |> field("category", int),
    domain: json |> field("domain", maybe(oneOrManyInt)),
    level: json |> field("level", maybe(int)),
  };

  let socialStatus = int;

  let activatableId = json =>
    json
    |> field("scope", string)
    |> (
      scope =>
        switch (scope) {
        | "Advantage" => json |> field("value", int) |> (x => `Advantage(x))
        | "Disadvantage" =>
          json |> field("value", int) |> (x => `Disadvantage(x))
        | "SpecialAbility" =>
          json |> field("value", int) |> (x => `SpecialAbility(x))
        | _ => raise(DecodeError("Unknown activatable ID scope: " ++ scope))
        }
    );

  let activatableIds = json =>
    json
    |> field("scope", string)
    |> (
      scope =>
        switch (scope) {
        | "Advantage" =>
          json |> field("value", list(int)) |> (xs => Advantages(xs))
        | "Disadvantage" =>
          json |> field("value", list(int)) |> (xs => Disadvantages(xs))
        | "SpecialAbility" =>
          json |> field("value", list(int)) |> (xs => SpecialAbilities(xs))
        | _ => raise(DecodeError("Unknown activatable ID scope: " ++ scope))
        }
    );

  let scopedSelectOptionId = (json): Id.selectOption =>
    json
    |> field("scope", string)
    |> (
      scope =>
        switch (scope) {
        | "Skill" => json |> field("value", int) |> (x => `Skill(x))
        | "CombatTechnique" =>
          json |> field("value", int) |> (x => `CombatTechnique(x))
        | "Spell" => json |> field("value", int) |> (x => `Spell(x))
        | "Cantrip" => json |> field("value", int) |> (x => `Cantrip(x))
        | "LiturgicalChant" =>
          json |> field("value", int) |> (x => `LiturgicalChant(x))
        | "Blessing" => json |> field("value", int) |> (x => `Blessing(x))
        | "SpecialAbility" =>
          json |> field("value", int) |> (x => `SpecialAbility(x))
        | _ =>
          raise(DecodeError("Unknown select option ID scope: " ++ scope))
        }
    );

  let selectOptionId = (json): Id.selectOption =>
    json |> oneOf([map(x => `Generic(x), int), scopedSelectOptionId]);

  let activatable = (json): activatable => {
    id: json |> field("id", activatableId),
    active: json |> field("active", bool),
    sid: json |> field("sid", maybe(selectOptionId)),
    sid2: json |> field("sid2", maybe(selectOptionId)),
    level: json |> field("level", maybe(int)),
  };

  let activatableMultiEntry = (json): activatableMultiEntry => {
    id: json |> field("id", activatableIds),
    active: json |> field("active", bool),
    sid: json |> field("sid", maybe(selectOptionId)),
    sid2: json |> field("sid2", maybe(selectOptionId)),
    level: json |> field("level", maybe(int)),
  };

  let activatableMultiSelect = (json): activatableMultiSelect => {
    id: json |> field("id", activatableId),
    active: json |> field("active", bool),
    sid: json |> field("sid", list(selectOptionId)),
    sid2: json |> field("sid2", maybe(selectOptionId)),
    level: json |> field("tier", maybe(int)),
  };

  let increasableId = json =>
    json
    |> field("scope", string)
    |> (
      scope =>
        switch (scope) {
        | "Attribute" => json |> field("value", int) |> (x => `Attribute(x))
        | "Skill" => json |> field("value", int) |> (x => `Skill(x))
        | "CombatTechnique" =>
          json |> field("value", int) |> (x => `CombatTechnique(x))
        | "Spell" => json |> field("value", int) |> (x => `Spell(x))
        | "LiturgicalChant" =>
          json |> field("value", int) |> (x => `LiturgicalChant(x))
        | _ => raise(DecodeError("Unknown increasable ID scope: " ++ scope))
        }
    );

  let increasableIds = json =>
    json
    |> field("scope", string)
    |> (
      scope =>
        switch (scope) {
        | "Attribute" =>
          json |> field("value", list(int)) |> (xs => Attributes(xs))
        | "Skill" => json |> field("value", list(int)) |> (xs => Skills(xs))
        | "CombatTechnique" =>
          json |> field("value", list(int)) |> (xs => CombatTechniques(xs))
        | "Spell" => json |> field("value", list(int)) |> (xs => Spells(xs))
        | "LiturgicalChant" =>
          json |> field("value", list(int)) |> (xs => LiturgicalChants(xs))
        | _ => raise(DecodeError("Unknown increasable ID scope: " ++ scope))
        }
    );

  let increasable = (json): increasable => {
    id: json |> field("id", increasableId),
    value: json |> field("value", int),
  };

  let increasableMultiEntry = (json): increasableMultiEntry => {
    id: json |> field("id", increasableIds),
    value: json |> field("value", int),
  };

  let tProfession = json => {
    sex: json |> optionalField("sexPrerequisite", sex),
    race: json |> optionalField("racePrerequisite", race),
    culture: json |> optionalField("culturePrerequisite", culture),
    activatable:
      json
      |> optionalField("activatablePrerequisites", list(activatable))
      |> Ley_Option.fromOption([]),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(increasable))
      |> Ley_Option.fromOption([]),
  };

  let t = (json): t => {
    sex: json |> optionalField("sexPrerequisite", sex),
    race: json |> optionalField("racePrerequisite", race),
    culture: json |> optionalField("culturePrerequisite", culture),
    pact: json |> optionalField("pactPrerequisite", pact),
    social: json |> optionalField("socialStatusPrerequisite", socialStatus),
    primaryAttribute:
      json |> optionalField("primaryAttributePrerequisite", primaryAttribute),
    activatable:
      json
      |> optionalField("activatablePrerequisites", list(activatable))
      |> Ley_Option.fromOption([]),
    activatableMultiEntry:
      json
      |> optionalField(
           "activatableMultiEntryPrerequisites",
           list(activatableMultiEntry),
         )
      |> Ley_Option.fromOption([]),
    activatableMultiSelect:
      json
      |> optionalField(
           "activatableMultiSelectPrerequisites",
           list(activatableMultiSelect),
         )
      |> Ley_Option.fromOption([]),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(increasable))
      |> Ley_Option.fromOption([]),
    increasableMultiEntry:
      json
      |> optionalField(
           "increasableMultiEntryPrerequisites",
           list(increasableMultiEntry),
         )
      |> Ley_Option.fromOption([]),
  };

  let level = json => (json |> field("level", int), json |> t);

  let tWithLevel = (json): tWithLevel => {
    sex: json |> optionalField("sexPrerequisite", sex),
    race: json |> optionalField("racePrerequisite", race),
    culture: json |> optionalField("culturePrerequisite", culture),
    pact: json |> optionalField("pactPrerequisite", pact),
    social: json |> optionalField("socialStatusPrerequisite", socialStatus),
    primaryAttribute:
      json |> optionalField("primaryAttributePrerequisite", primaryAttribute),
    activatable:
      json
      |> optionalField("activatablePrerequisites", list(activatable))
      |> Ley_Option.fromOption([]),
    activatableMultiEntry:
      json
      |> optionalField(
           "activatableMultiEntryPrerequisites",
           list(activatableMultiEntry),
         )
      |> Ley_Option.fromOption([]),
    activatableMultiSelect:
      json
      |> optionalField(
           "activatableMultiSelectPrerequisites",
           list(activatableMultiSelect),
         )
      |> Ley_Option.fromOption([]),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(increasable))
      |> Ley_Option.fromOption([]),
    increasableMultiEntry:
      json
      |> optionalField(
           "increasableMultiEntryPrerequisites",
           list(increasableMultiEntry),
         )
      |> Ley_Option.fromOption([]),
    levels:
      json
      |> optionalField("levelPrerequisites", list(level))
      |> Ley_Option.fromOption([])
      |> Ley_IntMap.fromList,
  };

  let tWithLevelDisAdv = json => {
    commonSuggestedByRCP:
      json |> field("hasToBeCommonOrSuggestedByRCP", bool),
    sex: json |> optionalField("sexPrerequisite", sex),
    race: json |> optionalField("racePrerequisite", race),
    culture: json |> optionalField("culturePrerequisite", culture),
    pact: json |> optionalField("pactPrerequisite", pact),
    social: json |> optionalField("socialStatusPrerequisite", socialStatus),
    primaryAttribute:
      json |> optionalField("primaryAttributePrerequisite", primaryAttribute),
    activatable:
      json
      |> optionalField("activatablePrerequisites", list(activatable))
      |> Ley_Option.fromOption([]),
    activatableMultiEntry:
      json
      |> optionalField(
           "activatableMultiEntryPrerequisites",
           list(activatableMultiEntry),
         )
      |> Ley_Option.fromOption([]),
    activatableMultiSelect:
      json
      |> optionalField(
           "activatableMultiSelectPrerequisites",
           list(activatableMultiSelect),
         )
      |> Ley_Option.fromOption([]),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(increasable))
      |> Ley_Option.fromOption([]),
    increasableMultiEntry:
      json
      |> optionalField(
           "increasableMultiEntryPrerequisites",
           list(increasableMultiEntry),
         )
      |> Ley_Option.fromOption([]),
    levels:
      json
      |> optionalField("levelPrerequisites", list(level))
      |> Ley_Option.fromOption([])
      |> Ley_IntMap.fromList,
  };

  let replacementAtIndex = json => (
    json |> field("index", int),
    json |> field("replacement", string),
  );

  type tIndexL10n = {
    sex: option(string),
    race: option(string),
    culture: option(string),
    pact: option(string),
    social: option(string),
    primaryAttribute: option(string),
    activatable: option(list((int, string))),
    activatableMultiEntry: option(list((int, string))),
    activatableMultiSelect: option(list((int, string))),
    increasable: option(list((int, string))),
    increasableMultiEntry: option(list((int, string))),
  };

  let tIndexL10n = json => {
    sex: json |> optionalField("sexPrerequisite", string),
    race: json |> optionalField("racePrerequisite", string),
    culture: json |> optionalField("culturePrerequisite", string),
    pact: json |> optionalField("pactPrerequisite", string),
    social: json |> optionalField("socialStatusPrerequisite", string),
    primaryAttribute:
      json |> optionalField("primaryAttributePrerequisite", string),
    activatable:
      json
      |> optionalField("activatablePrerequisites", list(replacementAtIndex)),
    activatableMultiEntry:
      json
      |> optionalField(
           "activatableMultiEntryPrerequisites",
           list(replacementAtIndex),
         ),
    activatableMultiSelect:
      json
      |> optionalField(
           "activatableMultiSelectPrerequisites",
           list(replacementAtIndex),
         ),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(replacementAtIndex)),
    increasableMultiEntry:
      json
      |> optionalField(
           "increasableMultiEntryPrerequisites",
           list(replacementAtIndex),
         ),
  };

  type tIndexUniv = {
    sex: option(bool),
    race: option(bool),
    culture: option(bool),
    pact: option(bool),
    social: option(bool),
    primaryAttribute: option(bool),
    activatable: option(list(int)),
    activatableMultiEntry: option(list(int)),
    activatableMultiSelect: option(list(int)),
    increasable: option(list(int)),
    increasableMultiEntry: option(list(int)),
  };

  let tIndexUniv = json => {
    sex: json |> optionalField("sexPrerequisite", bool),
    race: json |> optionalField("racePrerequisite", bool),
    culture: json |> optionalField("culturePrerequisite", bool),
    pact: json |> optionalField("pactPrerequisite", bool),
    social: json |> optionalField("socialStatusPrerequisite", bool),
    primaryAttribute:
      json |> optionalField("primaryAttributePrerequisite", bool),
    activatable:
      json |> optionalField("activatablePrerequisites", list(int)),
    activatableMultiEntry:
      json |> optionalField("activatableMultiEntryPrerequisites", list(int)),
    activatableMultiSelect:
      json |> optionalField("activatableMultiSelectPrerequisites", list(int)),
    increasable:
      json |> optionalField("increasablePrerequisites", list(int)),
    increasableMultiEntry:
      json |> optionalField("increasableMultiEntryPrerequisites", list(int)),
  };

  let mergeSingleOverride = (univ, l10n) =>
    l10n
    <&> (x => ReplaceWith(x))
    <|> (univ >>= (x => x ? Some(Hide) : None));

  let mergeMapOverride = (univ, l10n) =>
    Ley_IntMap.empty
    |> (
      mp =>
        Ley_List.Foldable.foldr(
          x => Ley_IntMap.insert(x, Hide),
          mp,
          univ |> Ley_Option.fromOption([]),
        )
        |> (
          mp =>
            Ley_List.Foldable.foldr(
              ((k, replacement)) =>
                Ley_IntMap.insert(k, ReplaceWith(replacement)),
              mp,
              l10n |> Ley_Option.fromOption([]),
            )
        )
    );

  let tIndex = (univ, l10n: option(tIndexL10n)): tIndex => {
    sex: mergeSingleOverride(univ >>= (x => x.sex), l10n >>= (x => x.sex)),
    race: mergeSingleOverride(univ >>= (x => x.race), l10n >>= (x => x.race)),
    culture:
      mergeSingleOverride(
        univ >>= (x => x.culture),
        l10n >>= (x => x.culture),
      ),
    pact: mergeSingleOverride(univ >>= (x => x.pact), l10n >>= (x => x.pact)),
    social:
      mergeSingleOverride(univ >>= (x => x.social), l10n >>= (x => x.social)),
    primaryAttribute:
      mergeSingleOverride(
        univ >>= (x => x.primaryAttribute),
        l10n >>= (x => x.primaryAttribute),
      ),
    activatable:
      mergeMapOverride(
        univ >>= (x => x.activatable),
        l10n >>= (x => x.activatable),
      ),
    activatableMultiEntry:
      mergeMapOverride(
        univ >>= (x => x.activatableMultiEntry),
        l10n >>= (x => x.activatableMultiEntry),
      ),
    activatableMultiSelect:
      mergeMapOverride(
        univ >>= (x => x.activatableMultiSelect),
        l10n >>= (x => x.activatableMultiSelect),
      ),
    increasable:
      mergeMapOverride(
        univ >>= (x => x.increasable),
        l10n >>= (x => x.increasable),
      ),
    increasableMultiEntry:
      mergeMapOverride(
        univ >>= (x => x.increasableMultiEntry),
        l10n >>= (x => x.increasableMultiEntry),
      ),
  };

  let tIndexL10nAtLevel = json => (
    json |> field("level", int),
    json |> field("hide", tIndexL10n),
  );

  type tIndexWithLevelL10n = {
    sex: option(string),
    race: option(string),
    culture: option(string),
    pact: option(string),
    social: option(string),
    primaryAttribute: option(string),
    activatable: option(list((int, string))),
    activatableMultiEntry: option(list((int, string))),
    activatableMultiSelect: option(list((int, string))),
    increasable: option(list((int, string))),
    increasableMultiEntry: option(list((int, string))),
    levels: option(list((int, tIndexL10n))),
  };

  let tIndexWithLevelL10n = json => {
    sex: json |> optionalField("sexPrerequisite", string),
    race: json |> optionalField("racePrerequisite", string),
    culture: json |> optionalField("culturePrerequisite", string),
    pact: json |> optionalField("pactPrerequisite", string),
    social: json |> optionalField("socialStatusPrerequisite", string),
    primaryAttribute:
      json |> optionalField("primaryAttributePrerequisite", string),
    activatable:
      json
      |> optionalField("activatablePrerequisites", list(replacementAtIndex)),
    activatableMultiEntry:
      json
      |> optionalField(
           "activatableMultiEntryPrerequisites",
           list(replacementAtIndex),
         ),
    activatableMultiSelect:
      json
      |> optionalField(
           "activatableMultiSelectPrerequisites",
           list(replacementAtIndex),
         ),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(replacementAtIndex)),
    increasableMultiEntry:
      json
      |> optionalField(
           "increasableMultiEntryPrerequisites",
           list(replacementAtIndex),
         ),
    levels: json |> optionalField("levels", list(tIndexL10nAtLevel)),
  };

  let tIndexUnivAtLevel = json => (
    json |> field("level", int),
    json |> field("hide", tIndexUniv),
  );

  type tIndexWithLevelUniv = {
    sex: option(bool),
    race: option(bool),
    culture: option(bool),
    pact: option(bool),
    social: option(bool),
    primaryAttribute: option(bool),
    activatable: option(list(int)),
    activatableMultiEntry: option(list(int)),
    activatableMultiSelect: option(list(int)),
    increasable: option(list(int)),
    increasableMultiEntry: option(list(int)),
    levels: option(list((int, tIndexUniv))),
  };

  let tIndexWithLevelUniv = json => {
    sex: json |> optionalField("sexPrerequisite", bool),
    race: json |> optionalField("racePrerequisite", bool),
    culture: json |> optionalField("culturePrerequisite", bool),
    pact: json |> optionalField("pactPrerequisite", bool),
    social: json |> optionalField("socialStatusPrerequisite", bool),
    primaryAttribute:
      json |> optionalField("primaryAttributePrerequisite", bool),
    activatable:
      json |> optionalField("activatablePrerequisites", list(int)),
    activatableMultiEntry:
      json |> optionalField("activatableMultiEntryPrerequisites", list(int)),
    activatableMultiSelect:
      json |> optionalField("activatableMultiSelectPrerequisites", list(int)),
    increasable:
      json |> optionalField("increasablePrerequisites", list(int)),
    increasableMultiEntry:
      json |> optionalField("increasableMultiEntryPrerequisites", list(int)),
    levels: json |> optionalField("levels", list(tIndexUnivAtLevel)),
  };

  /**
   * Merge all univ and l10n overrides.
   *
   * Inserts all univs first, then adds the l10ns and finally merges them.
   */
  let mergeIndexLevels = (univ, l10n) =>
    Ley_IntMap.empty
    |> (
      mp =>
        Ley_List.Foldable.foldr(
          ((k, x)) => Ley_IntMap.insert(k, (Some(x), None)),
          mp,
          univ |> Ley_Option.fromOption([]),
        )
        |> (
          mp =>
            Ley_List.Foldable.foldr(
              ((k, x)) =>
                Ley_IntMap.alter(
                  my =>
                    Ley_Option.option(
                      (None, Some(x)),
                      y => (fst(y), Some(x)),
                      my,
                    )
                    |> (y => Some(y)),
                  k,
                ),
              mp,
              l10n |> Ley_Option.fromOption([]),
            )
            |> Ley_IntMap.map(((muniv, ml10n)) => tIndex(muniv, ml10n))
        )
    );

  let tIndexWithLevel =
      (univ, l10n: option(tIndexWithLevelL10n)): tIndexWithLevel => {
    sex: mergeSingleOverride(univ >>= (x => x.sex), l10n >>= (x => x.sex)),
    race: mergeSingleOverride(univ >>= (x => x.race), l10n >>= (x => x.race)),
    culture:
      mergeSingleOverride(
        univ >>= (x => x.culture),
        l10n >>= (x => x.culture),
      ),
    pact: mergeSingleOverride(univ >>= (x => x.pact), l10n >>= (x => x.pact)),
    social:
      mergeSingleOverride(univ >>= (x => x.social), l10n >>= (x => x.social)),
    primaryAttribute:
      mergeSingleOverride(
        univ >>= (x => x.primaryAttribute),
        l10n >>= (x => x.primaryAttribute),
      ),
    activatable:
      mergeMapOverride(
        univ >>= (x => x.activatable),
        l10n >>= (x => x.activatable),
      ),
    activatableMultiEntry:
      mergeMapOverride(
        univ >>= (x => x.activatableMultiEntry),
        l10n >>= (x => x.activatableMultiEntry),
      ),
    activatableMultiSelect:
      mergeMapOverride(
        univ >>= (x => x.activatableMultiSelect),
        l10n >>= (x => x.activatableMultiSelect),
      ),
    increasable:
      mergeMapOverride(
        univ >>= (x => x.increasable),
        l10n >>= (x => x.increasable),
      ),
    increasableMultiEntry:
      mergeMapOverride(
        univ >>= (x => x.increasableMultiEntry),
        l10n >>= (x => x.increasableMultiEntry),
      ),
    levels:
      mergeIndexLevels(univ >>= (x => x.levels), l10n >>= (x => x.levels)),
  };
};
