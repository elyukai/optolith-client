open GenericHelpers;

[@genType]
[@genType.as "SexPrerequisite"]
type sex = Hero.sex;

[@genType]
[@genType.as "RacePrerequisite"]
type race = {
  id: oneOrMany(int),
  active: bool,
};

[@genType]
[@genType.as "CulturePrerequisite"]
type culture = oneOrMany(int);

[@genType]
[@genType.as "SocialPrerequisite"]
type socialStatus = int;

[@genType]
[@genType.as "PactPrerequisite"]
type pact = {
  category: int,
  domain: option(oneOrMany(int)),
  level: option(int),
};

type primaryAttributeType =
  | Magical
  | Blessed;

[@genType]
[@genType.as "PrimaryAttributePrerequisite"]
type primaryAttribute = {
  value: int,
  scope: primaryAttributeType,
};

type activatableId = [
  | `Advantage(int)
  | `Disadvantage(int)
  | `SpecialAbility(int)
];

[@genType]
[@genType.as "ActivatablePrerequisite"]
type activatable = {
  id: activatableId,
  active: bool,
  sid: option(Ids.selectOptionId),
  sid2: option(Ids.selectOptionId),
  level: option(int),
};

type activatableSkillId = [ | `Spell(int) | `LiturgicalChant(int)];

[@genType]
[@genType.as "ActivatableSkillPrerequisite"]
type activatableSkill = {
  id: activatableSkillId,
  active: bool,
};

[@genType]
[@genType.as "ActivatableMultiEntryPrerequisite"]
type activatableMultiEntry = {
  id: list(activatableId),
  active: bool,
  sid: option(Ids.selectOptionId),
  sid2: option(Ids.selectOptionId),
  level: option(int),
};

[@genType]
[@genType.as "ActivatableMultiSelectPrerequisite"]
type activatableMultiSelect = {
  id: activatableId,
  active: bool,
  sid: list(Ids.selectOptionId),
  sid2: option(Ids.selectOptionId),
  level: option(int),
};

type increasableId = [
  | `Attribute(int)
  | `Skill(int)
  | `CombatTechnique(int)
  | `Spell(int)
  | `LiturgicalChant(int)
];

[@genType]
[@genType.as "IncreasablePrerequisite"]
type increasable = {
  id: increasableId,
  value: int,
};

[@genType]
[@genType.as "IncreasableMultiEntryPrerequisite"]
type increasableMultiEntry = {
  id: list(increasableId),
  value: int,
};

[@genType]
[@genType.as "PrerequisitesForProfession"]
type tProfession = {
  sex: option(sex),
  race: option(race),
  culture: option(culture),
  activatable: list(activatable),
  increasable: list(increasable),
};

[@genType]
[@genType.as "Prerequisites"]
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

[@genType]
[@genType.as "PrerequisitesWithLevels"]
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
  levels: Ley.IntMap.t(t),
};

[@genType]
[@genType.as "PrerequisitesForDisAdvWithLevels"]
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
  levels: Ley.IntMap.t(t),
};

[@genType]
[@genType.as "OverridePrerequisite"]
type overridePrerequisite =
  | Hide
  | ReplaceWith(string);

[@genType]
[@genType.as "OverridePrerequisites"]
type tIndex = {
  sex: option(overridePrerequisite),
  race: option(overridePrerequisite),
  culture: option(overridePrerequisite),
  pact: option(overridePrerequisite),
  social: option(overridePrerequisite),
  primaryAttribute: option(overridePrerequisite),
  activatable: Ley.IntMap.t(overridePrerequisite),
  activatableMultiEntry: Ley.IntMap.t(overridePrerequisite),
  activatableMultiSelect: Ley.IntMap.t(overridePrerequisite),
  increasable: Ley.IntMap.t(overridePrerequisite),
  increasableMultiEntry: Ley.IntMap.t(overridePrerequisite),
};

[@genType]
[@genType.as "OverridePrerequisitesWithLevels"]
type tIndexWithLevel = {
  sex: option(overridePrerequisite),
  race: option(overridePrerequisite),
  culture: option(overridePrerequisite),
  pact: option(overridePrerequisite),
  social: option(overridePrerequisite),
  primaryAttribute: option(overridePrerequisite),
  activatable: Ley.IntMap.t(overridePrerequisite),
  activatableMultiEntry: Ley.IntMap.t(overridePrerequisite),
  activatableMultiSelect: Ley.IntMap.t(overridePrerequisite),
  increasable: Ley.IntMap.t(overridePrerequisite),
  increasableMultiEntry: Ley.IntMap.t(overridePrerequisite),
  levels: Ley.IntMap.t(tIndex),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;
  open Ley.Option.Functor;
  open Ley.Option.Monad;
  open Ley.Option.Alternative;

  let oneOrManyInt =
    oneOf([
      map((id): GenericHelpers.oneOrMany(int) => One(id), int),
      map((id): GenericHelpers.oneOrMany(int) => Many(id), list(int)),
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
        | "Advantage" => json |> int |> (x => `Advantage(x))
        | "Disadvantage" => json |> int |> (x => `Disadvantage(x))
        | "SpecialAbility" => json |> int |> (x => `SpecialAbility(x))
        | _ => raise(DecodeError("Unknown activatable ID scope: " ++ scope))
        }
    );

  let scopedSelectOptionId = (json): Ids.selectOptionId =>
    json
    |> field("scope", string)
    |> (
      scope =>
        switch (scope) {
        | "Skill" => json |> int |> (x => `Skill(x))
        | "CombatTechnique" => json |> int |> (x => `CombatTechnique(x))
        | "Spell" => json |> int |> (x => `Spell(x))
        | "Cantrip" => json |> int |> (x => `Cantrip(x))
        | "LiturgicalChant" => json |> int |> (x => `LiturgicalChant(x))
        | "Blessing" => json |> int |> (x => `Blessing(x))
        | _ =>
          raise(DecodeError("Unknown select option ID scope: " ++ scope))
        }
    );

  let selectOptionId = (json): Ids.selectOptionId =>
    json |> oneOf([map(x => `Generic(x), int), scopedSelectOptionId]);

  let activatable = (json): activatable => {
    id: json |> field("id", activatableId),
    active: json |> field("active", bool),
    sid: json |> field("sid", maybe(selectOptionId)),
    sid2: json |> field("sid2", maybe(selectOptionId)),
    level: json |> field("level", maybe(int)),
  };

  let activatableMultiEntry = (json): activatableMultiEntry => {
    id: json |> field("id", list(activatableId)),
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

  let activatableSkillId = json =>
    json
    |> field("scope", string)
    |> (
      scope =>
        switch (scope) {
        | "Spell" => json |> int |> ((x) => (`Spell(x): activatableSkillId))
        | "LiturgicalChant" =>
          json |> int |> ((x) => (`LiturgicalChant(x): activatableSkillId))
        | _ =>
          raise(DecodeError("Unknown activatable skill ID scope: " ++ scope))
        }
    );

  let activatableSkill = json => {
    id: json |> field("id", activatableSkillId),
    active: json |> field("active", bool),
  };

  let increasableId = json =>
    json
    |> field("scope", string)
    |> (
      scope =>
        switch (scope) {
        | "Attribute" => json |> int |> (x => `Attribute(x))
        | "Skill" => json |> int |> (x => `Skill(x))
        | "CombatTechnique" => json |> int |> (x => `CombatTechnique(x))
        | "Spell" => json |> int |> (x => `Spell(x))
        | "LiturgicalChant" => json |> int |> (x => `LiturgicalChant(x))
        | _ => raise(DecodeError("Unknown increasable ID scope: " ++ scope))
        }
    );

  let increasable = (json): increasable => {
    id: json |> field("id", increasableId),
    value: json |> field("value", int),
  };

  let increasableMultiEntry = (json): increasableMultiEntry => {
    id: json |> field("id", list(increasableId)),
    value: json |> field("value", int),
  };

  let tProfession = json => {
    sex: json |> optionalField("sexPrerequisite", sex),
    race: json |> optionalField("racePrerequisite", race),
    culture: json |> optionalField("culturePrerequisite", culture),
    activatable:
      json
      |> optionalField("activatablePrerequisites", list(activatable))
      |> Ley.Option.fromOption([]),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(increasable))
      |> Ley.Option.fromOption([]),
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
      |> Ley.Option.fromOption([]),
    activatableMultiEntry:
      json
      |> optionalField(
           "activatableMultiEntryPrerequisites",
           list(activatableMultiEntry),
         )
      |> Ley.Option.fromOption([]),
    activatableMultiSelect:
      json
      |> optionalField(
           "activatableMultiSelectPrerequisites",
           list(activatableMultiSelect),
         )
      |> Ley.Option.fromOption([]),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(increasable))
      |> Ley.Option.fromOption([]),
    increasableMultiEntry:
      json
      |> optionalField(
           "increasableMultiEntryPrerequisites",
           list(increasableMultiEntry),
         )
      |> Ley.Option.fromOption([]),
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
      |> Ley.Option.fromOption([]),
    activatableMultiEntry:
      json
      |> optionalField(
           "activatableMultiEntryPrerequisites",
           list(activatableMultiEntry),
         )
      |> Ley.Option.fromOption([]),
    activatableMultiSelect:
      json
      |> optionalField(
           "activatableMultiSelectPrerequisites",
           list(activatableMultiSelect),
         )
      |> Ley.Option.fromOption([]),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(increasable))
      |> Ley.Option.fromOption([]),
    increasableMultiEntry:
      json
      |> optionalField(
           "increasableMultiEntryPrerequisites",
           list(increasableMultiEntry),
         )
      |> Ley.Option.fromOption([]),
    levels:
      json
      |> optionalField("levelPrerequisites", list(level))
      |> Ley.Option.fromOption([])
      |> Ley.IntMap.fromList,
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
      |> Ley.Option.fromOption([]),
    activatableMultiEntry:
      json
      |> optionalField(
           "activatableMultiEntryPrerequisites",
           list(activatableMultiEntry),
         )
      |> Ley.Option.fromOption([]),
    activatableMultiSelect:
      json
      |> optionalField(
           "activatableMultiSelectPrerequisites",
           list(activatableMultiSelect),
         )
      |> Ley.Option.fromOption([]),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(increasable))
      |> Ley.Option.fromOption([]),
    increasableMultiEntry:
      json
      |> optionalField(
           "increasableMultiEntryPrerequisites",
           list(increasableMultiEntry),
         )
      |> Ley.Option.fromOption([]),
    levels:
      json
      |> optionalField("levelPrerequisites", list(level))
      |> Ley.Option.fromOption([])
      |> Ley.IntMap.fromList,
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
    Ley.IntMap.empty
    |> (
      mp =>
        Ley.List.Foldable.foldr(
          x => Ley.IntMap.insert(x, Hide),
          mp,
          univ |> Ley.Option.fromOption([]),
        )
        |> (
          mp =>
            Ley.List.Foldable.foldr(
              ((k, replacement)) =>
                Ley.IntMap.insert(k, ReplaceWith(replacement)),
              mp,
              l10n |> Ley.Option.fromOption([]),
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
    Ley.IntMap.empty
    |> (
      mp =>
        Ley.List.Foldable.foldr(
          ((k, x)) => Ley.IntMap.insert(k, (Some(x), None)),
          mp,
          univ |> Ley.Option.fromOption([]),
        )
        |> (
          mp =>
            Ley.List.Foldable.foldr(
              ((k, x)) =>
                Ley.IntMap.alter(
                  my =>
                    Ley.Option.option(
                      (None, Some(x)),
                      y => (fst(y), Some(x)),
                      my,
                    )
                    |> (y => Some(y)),
                  k,
                ),
              mp,
              l10n |> Ley.Option.fromOption([]),
            )
            |> Ley.IntMap.map(((muniv, ml10n)) => tIndex(muniv, ml10n))
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
