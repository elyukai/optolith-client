open GenericHelpers;

[@genType "SexPrerequisite"]
type sex = Hero.sex;

[@genType "RacePrerequisite"]
type race = {
  id: oneOrMany(int),
  active: bool,
};

[@genType "CulturePrerequisite"]
type culture = oneOrMany(int);

[@genType "SocialPrerequisite"]
type socialStatus = int;

[@genType "PactPrerequisite"]
type pact = {
  category: int,
  domain: Maybe.t(oneOrMany(int)),
  level: Maybe.t(int),
};

type primaryAttributeType =
  | Magical
  | Blessed;

[@genType "PrimaryAttributePrerequisite"]
type primaryAttribute = {
  value: int,
  scope: primaryAttributeType,
};

type activatableId = [
  | `Advantage(int)
  | `Disadvantage(int)
  | `SpecialAbility(int)
];

[@genType "ActivatablePrerequisite"]
type activatable = {
  id: activatableId,
  active: bool,
  sid: Maybe.t(Ids.selectOptionId),
  sid2: Maybe.t(Ids.selectOptionId),
  level: Maybe.t(int),
};

type activatableSkillId = [ | `Spell(int) | `LiturgicalChant(int)];

[@genType "ActivatableSkillPrerequisite"]
type activatableSkill = {
  id: activatableSkillId,
  active: bool,
};

[@genType "ActivatableMultiEntryPrerequisite"]
type activatableMultiEntry = {
  id: list(activatableId),
  active: bool,
  sid: Maybe.t(Ids.selectOptionId),
  sid2: Maybe.t(Ids.selectOptionId),
  level: Maybe.t(int),
};

[@genType "ActivatableMultiSelectPrerequisite"]
type activatableMultiSelect = {
  id: activatableId,
  active: bool,
  sid: list(Ids.selectOptionId),
  sid2: Maybe.t(Ids.selectOptionId),
  level: Maybe.t(int),
};

type increasableId = [
  | `Attribute(int)
  | `Skill(int)
  | `CombatTechnique(int)
  | `Spell(int)
  | `LiturgicalChant(int)
];

[@genType "IncreasablePrerequisite"]
type increasable = {
  id: increasableId,
  value: int,
};

[@genType "IncreasableMultiEntryPrerequisite"]
type increasableMultiEntry = {
  id: list(increasableId),
  value: int,
};

[@genType "PrerequisitesForProfession"]
type tProfession = {
  sex: Maybe.t(sex),
  race: Maybe.t(race),
  culture: Maybe.t(culture),
  activatable: list(activatable),
  increasable: list(increasable),
};

[@genType "Prerequisites"]
type t = {
  sex: Maybe.t(sex),
  race: Maybe.t(race),
  culture: Maybe.t(culture),
  pact: Maybe.t(pact),
  social: Maybe.t(socialStatus),
  primaryAttribute: Maybe.t(primaryAttribute),
  activatable: list(activatable),
  activatableMultiEntry: list(activatableMultiEntry),
  activatableMultiSelect: list(activatableMultiSelect),
  increasable: list(increasable),
  increasableMultiEntry: list(increasableMultiEntry),
};

let empty = {
  sex: Maybe.Nothing,
  race: Maybe.Nothing,
  culture: Maybe.Nothing,
  pact: Maybe.Nothing,
  social: Maybe.Nothing,
  primaryAttribute: Maybe.Nothing,
  activatable: [],
  activatableMultiEntry: [],
  activatableMultiSelect: [],
  increasable: [],
  increasableMultiEntry: [],
};

[@genType "PrerequisitesWithLevels"]
type tWithLevel = {
  sex: Maybe.t(sex),
  race: Maybe.t(race),
  culture: Maybe.t(culture),
  pact: Maybe.t(pact),
  social: Maybe.t(socialStatus),
  primaryAttribute: Maybe.t(primaryAttribute),
  activatable: list(activatable),
  activatableMultiEntry: list(activatableMultiEntry),
  activatableMultiSelect: list(activatableMultiSelect),
  increasable: list(increasable),
  increasableMultiEntry: list(increasableMultiEntry),
  levels: IntMap.t(t),
};

[@genType "PrerequisitesForDisAdvWithLevels"]
type tWithLevelDisAdv = {
  commonSuggestedByRCP: bool,
  sex: Maybe.t(sex),
  race: Maybe.t(race),
  culture: Maybe.t(culture),
  pact: Maybe.t(pact),
  social: Maybe.t(socialStatus),
  primaryAttribute: Maybe.t(primaryAttribute),
  activatable: list(activatable),
  activatableMultiEntry: list(activatableMultiEntry),
  activatableMultiSelect: list(activatableMultiSelect),
  increasable: list(increasable),
  increasableMultiEntry: list(increasableMultiEntry),
  levels: IntMap.t(t),
};

[@genType "OverridePrerequisite"]
type overridePrerequisite =
  | Hide
  | ReplaceWith(string);

[@genType "OverridePrerequisites"]
type tIndex = {
  sex: Maybe.t(overridePrerequisite),
  race: Maybe.t(overridePrerequisite),
  culture: Maybe.t(overridePrerequisite),
  pact: Maybe.t(overridePrerequisite),
  social: Maybe.t(overridePrerequisite),
  primaryAttribute: Maybe.t(overridePrerequisite),
  activatable: IntMap.t(overridePrerequisite),
  activatableMultiEntry: IntMap.t(overridePrerequisite),
  activatableMultiSelect: IntMap.t(overridePrerequisite),
  increasable: IntMap.t(overridePrerequisite),
  increasableMultiEntry: IntMap.t(overridePrerequisite),
};

[@genType "OverridePrerequisitesWithLevels"]
type tIndexWithLevel = {
  sex: Maybe.t(overridePrerequisite),
  race: Maybe.t(overridePrerequisite),
  culture: Maybe.t(overridePrerequisite),
  pact: Maybe.t(overridePrerequisite),
  social: Maybe.t(overridePrerequisite),
  primaryAttribute: Maybe.t(overridePrerequisite),
  activatable: IntMap.t(overridePrerequisite),
  activatableMultiEntry: IntMap.t(overridePrerequisite),
  activatableMultiSelect: IntMap.t(overridePrerequisite),
  increasable: IntMap.t(overridePrerequisite),
  increasableMultiEntry: IntMap.t(overridePrerequisite),
  levels: IntMap.t(tIndex),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;
  open Maybe.Functor;
  open Maybe.Monad;
  open Maybe.Alternative;

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
      |> Maybe.fromMaybe([]),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(increasable))
      |> Maybe.fromMaybe([]),
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
      |> Maybe.fromMaybe([]),
    activatableMultiEntry:
      json
      |> optionalField(
           "activatableMultiEntryPrerequisites",
           list(activatableMultiEntry),
         )
      |> Maybe.fromMaybe([]),
    activatableMultiSelect:
      json
      |> optionalField(
           "activatableMultiSelectPrerequisites",
           list(activatableMultiSelect),
         )
      |> Maybe.fromMaybe([]),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(increasable))
      |> Maybe.fromMaybe([]),
    increasableMultiEntry:
      json
      |> optionalField(
           "increasableMultiEntryPrerequisites",
           list(increasableMultiEntry),
         )
      |> Maybe.fromMaybe([]),
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
      |> Maybe.fromMaybe([]),
    activatableMultiEntry:
      json
      |> optionalField(
           "activatableMultiEntryPrerequisites",
           list(activatableMultiEntry),
         )
      |> Maybe.fromMaybe([]),
    activatableMultiSelect:
      json
      |> optionalField(
           "activatableMultiSelectPrerequisites",
           list(activatableMultiSelect),
         )
      |> Maybe.fromMaybe([]),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(increasable))
      |> Maybe.fromMaybe([]),
    increasableMultiEntry:
      json
      |> optionalField(
           "increasableMultiEntryPrerequisites",
           list(increasableMultiEntry),
         )
      |> Maybe.fromMaybe([]),
    levels:
      json
      |> optionalField("levelPrerequisites", list(level))
      |> Maybe.fromMaybe([])
      |> IntMap.fromList,
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
      |> Maybe.fromMaybe([]),
    activatableMultiEntry:
      json
      |> optionalField(
           "activatableMultiEntryPrerequisites",
           list(activatableMultiEntry),
         )
      |> Maybe.fromMaybe([]),
    activatableMultiSelect:
      json
      |> optionalField(
           "activatableMultiSelectPrerequisites",
           list(activatableMultiSelect),
         )
      |> Maybe.fromMaybe([]),
    increasable:
      json
      |> optionalField("increasablePrerequisites", list(increasable))
      |> Maybe.fromMaybe([]),
    increasableMultiEntry:
      json
      |> optionalField(
           "increasableMultiEntryPrerequisites",
           list(increasableMultiEntry),
         )
      |> Maybe.fromMaybe([]),
    levels:
      json
      |> optionalField("levelPrerequisites", list(level))
      |> Maybe.fromMaybe([])
      |> IntMap.fromList,
  };

  let replacementAtIndex = json => (
    json |> field("index", int),
    json |> field("replacement", string),
  );

  type tIndexL10n = {
    sex: Maybe.t(string),
    race: Maybe.t(string),
    culture: Maybe.t(string),
    pact: Maybe.t(string),
    social: Maybe.t(string),
    primaryAttribute: Maybe.t(string),
    activatable: Maybe.t(list((int, string))),
    activatableMultiEntry: Maybe.t(list((int, string))),
    activatableMultiSelect: Maybe.t(list((int, string))),
    increasable: Maybe.t(list((int, string))),
    increasableMultiEntry: Maybe.t(list((int, string))),
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
    sex: Maybe.t(bool),
    race: Maybe.t(bool),
    culture: Maybe.t(bool),
    pact: Maybe.t(bool),
    social: Maybe.t(bool),
    primaryAttribute: Maybe.t(bool),
    activatable: Maybe.t(list(int)),
    activatableMultiEntry: Maybe.t(list(int)),
    activatableMultiSelect: Maybe.t(list(int)),
    increasable: Maybe.t(list(int)),
    increasableMultiEntry: Maybe.t(list(int)),
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
    <|> (univ >>= (x => x ? Just(Hide) : Nothing));

  let mergeMapOverride = (univ, l10n) =>
    IntMap.empty
    |> (
      mp =>
        ListH.Foldable.foldr(
          x => IntMap.insert(x, Hide),
          mp,
          univ |> Maybe.fromMaybe([]),
        )
        |> (
          mp =>
            ListH.Foldable.foldr(
              ((k, replacement)) =>
                IntMap.insert(k, ReplaceWith(replacement)),
              mp,
              l10n |> Maybe.fromMaybe([]),
            )
        )
    );

  let tIndex = (univ, l10n: Maybe.t(tIndexL10n)): tIndex => {
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
    sex: Maybe.t(string),
    race: Maybe.t(string),
    culture: Maybe.t(string),
    pact: Maybe.t(string),
    social: Maybe.t(string),
    primaryAttribute: Maybe.t(string),
    activatable: Maybe.t(list((int, string))),
    activatableMultiEntry: Maybe.t(list((int, string))),
    activatableMultiSelect: Maybe.t(list((int, string))),
    increasable: Maybe.t(list((int, string))),
    increasableMultiEntry: Maybe.t(list((int, string))),
    levels: Maybe.t(list((int, tIndexL10n))),
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
    sex: Maybe.t(bool),
    race: Maybe.t(bool),
    culture: Maybe.t(bool),
    pact: Maybe.t(bool),
    social: Maybe.t(bool),
    primaryAttribute: Maybe.t(bool),
    activatable: Maybe.t(list(int)),
    activatableMultiEntry: Maybe.t(list(int)),
    activatableMultiSelect: Maybe.t(list(int)),
    increasable: Maybe.t(list(int)),
    increasableMultiEntry: Maybe.t(list(int)),
    levels: Maybe.t(list((int, tIndexUniv))),
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
    IntMap.empty
    |> (
      mp =>
        ListH.Foldable.foldr(
          ((k, x)) => IntMap.insert(k, (Maybe.Just(x), Maybe.Nothing)),
          mp,
          univ |> Maybe.fromMaybe([]),
        )
        |> (
          mp =>
            ListH.Foldable.foldr(
              ((k, x)) =>
                IntMap.alter(
                  my =>
                    Maybe.maybe(
                      (Maybe.Nothing, Maybe.Just(x)),
                      y => (fst(y), Maybe.Just(x)),
                      my,
                    )
                    |> (y => Maybe.Just(y)),
                  k,
                ),
              mp,
              l10n |> Maybe.fromMaybe([]),
            )
            |> IntMap.map(((muniv, ml10n)) => tIndex(muniv, ml10n))
        )
    );

  let tIndexWithLevel =
      (univ, l10n: Maybe.t(tIndexWithLevelL10n)): tIndexWithLevel => {
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
