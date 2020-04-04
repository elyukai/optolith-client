open GenericHelpers;

[@genType "SexPrerequisite"]
type sex = Sex.t;

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

type activatableId =
  | Advantage(int)
  | Disadvantage(int)
  | SpecialAbility(int);

[@genType "ActivatablePrerequisite"]
type activatable = {
  id: activatableId,
  active: bool,
  sid: Maybe.t(Ids.selectOptionId),
  sid2: Maybe.t(Ids.selectOptionId),
  level: Maybe.t(int),
};

type activatableSkillId =
  | Spell(int)
  | LiturgicalChant(int);

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

type increasableId =
  | Attribute(int)
  | Skill(int)
  | CombatTechnique(int)
  | Spell(int)
  | LiturgicalChant(int);

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
        | "Advantage" => json |> int |> (x => Advantage(x))
        | "Disadvantage" => json |> int |> (x => Disadvantage(x))
        | "SpecialAbility" => json |> int |> (x => SpecialAbility(x))
        | _ => raise(DecodeError("Unknown activatable ID scope: " ++ scope))
        }
    );

  let scopedSelectOptionId = (json): Ids.selectOptionId =>
    json
    |> field("scope", string)
    |> (
      scope =>
        switch (scope) {
        | "Skill" => json |> int |> (x => Ids.Skill(x))
        | "CombatTechnique" => json |> int |> (x => Ids.CombatTechnique(x))
        | "Spell" => json |> int |> (x => Ids.Spell(x))
        | "Cantrip" => json |> int |> (x => Ids.Cantrip(x))
        | "LiturgicalChant" => json |> int |> (x => Ids.LiturgicalChant(x))
        | "Blessing" => json |> int |> (x => Ids.Blessing(x))
        | _ =>
          raise(DecodeError("Unknown select option ID scope: " ++ scope))
        }
    );

  let selectOptionId = (json): Ids.selectOptionId =>
    json |> oneOf([map(x => Ids.Generic(x), int), scopedSelectOptionId]);

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
        | "Spell" => json |> int |> ((x) => (Spell(x): activatableSkillId))
        | "LiturgicalChant" =>
          json |> int |> ((x) => (LiturgicalChant(x): activatableSkillId))
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
        | "Attribute" => json |> int |> (x => Attribute(x))
        | "Skill" => json |> int |> (x => Skill(x))
        | "CombatTechnique" => json |> int |> (x => CombatTechnique(x))
        | "Spell" => json |> int |> (x => Spell(x))
        | "LiturgicalChant" => json |> int |> (x => LiturgicalChant(x))
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
};
