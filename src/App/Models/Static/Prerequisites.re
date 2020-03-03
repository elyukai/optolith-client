type oneOrMany('a) =
  | Single('a)
  | OneOf(list('a));

module SexPrerequisite = {
  type sex =
    | Male
    | Female;

  type t = sex;
};

module RacePrerequisite = {
  type raceId = oneOrMany(string);

  type t = {
    id: raceId,
    active: bool,
  };
};

module CulturePrerequisite = {
  type cultureId = oneOrMany(string);

  type t = cultureId;
};

module SocialPrerequisite = {
  type t = int;
};

module PactPrerequisite = {
  type t = {
    category: int,
    domain: option(oneOrMany(int)),
    level: option(int),
  };
};

module PrimaryAttributePrerequisite = {
  type primaryAttributeType =
    | Magical
    | Blessed;

  type t = {
    value: int,
    scope: primaryAttributeType,
  };
};

module ActivatablePrerequisite = {
  type id =
    | Advantage(string)
    | Disadvantage(string)
    | SpecialAbility(string);

  type t = {
    id,
    active: bool,
    sid: option(Ids.selectOptionId),
    sid2: option(Ids.selectOptionId),
    tier: option(int),
  };
};

module ActivatableSkillPrerequisite = {
  type id =
    | Spell(string)
    | LiturgicalChant(string);

  type t = {
    id,
    active: bool,
  };
};

module ActivatableMultiEntryPrerequisite = {
  type t = {
    id: list(ActivatablePrerequisite.id),
    active: bool,
    sid: option(Ids.selectOptionId),
    sid2: option(Ids.selectOptionId),
    tier: option(int),
  };
};

module ActivatableMultiSelectPrerequisite = {
  type t = {
    id: ActivatablePrerequisite.id,
    active: bool,
    sid: list(Ids.selectOptionId),
    sid2: option(Ids.selectOptionId),
    tier: option(int),
  };
};

module IncreasablePrerequisite = {
  type id =
    | Attribute(string)
    | Skill(string)
    | CombatTechnique(string)
    | Spell(string)
    | LiturgicalChant(string);

  type t = {
    id,
    value: int,
  };
};

module IncreasableMultiEntryPrerequisite = {
  type t = {
    id: list(IncreasablePrerequisite.id),
    value: int,
  };
};

type tProfession = {
  sex: option(SexPrerequisite.t),
  race: option(RacePrerequisite.t),
  culture: option(CulturePrerequisite.t),
  activatable: list(ActivatablePrerequisite.t),
  increasable: list(IncreasablePrerequisite.t),
};

type t = {
  sex: option(SexPrerequisite.t),
  race: option(RacePrerequisite.t),
  culture: option(CulturePrerequisite.t),
  pact: option(PactPrerequisite.t),
  social: option(SocialPrerequisite.t),
  primaryAttribute: option(PrimaryAttributePrerequisite.t),
  activatable: list(ActivatablePrerequisite.t),
  activatableMultiEntry: list(ActivatableMultiEntryPrerequisite.t),
  activatableMultiSelect: list(ActivatableMultiSelectPrerequisite.t),
  increasable: list(IncreasablePrerequisite.t),
  increasableMultiEntry: list(IncreasableMultiEntryPrerequisite.t),
};

type tWithLevel = {
  sex: option(SexPrerequisite.t),
  race: option(RacePrerequisite.t),
  culture: option(CulturePrerequisite.t),
  pact: option(PactPrerequisite.t),
  social: option(SocialPrerequisite.t),
  primaryAttribute: option(PrimaryAttributePrerequisite.t),
  activatable: list(ActivatablePrerequisite.t),
  activatableMultiEntry: list(ActivatableMultiEntryPrerequisite.t),
  activatableMultiSelect: list(ActivatableMultiSelectPrerequisite.t),
  increasable: list(IncreasablePrerequisite.t),
  increasableMultiEntry: list(IncreasableMultiEntryPrerequisite.t),
  levels: IntMap.t(t),
};

type commonSuggestedByRCP =
  | Common
  | Uncommon;

type tWithLevelDisAdv = {
  commonSuggestedByRCP,
  sex: option(SexPrerequisite.t),
  race: option(RacePrerequisite.t),
  culture: option(CulturePrerequisite.t),
  pact: option(PactPrerequisite.t),
  social: option(SocialPrerequisite.t),
  primaryAttribute: option(PrimaryAttributePrerequisite.t),
  activatable: list(ActivatablePrerequisite.t),
  activatableMultiEntry: list(ActivatableMultiEntryPrerequisite.t),
  activatableMultiSelect: list(ActivatableMultiSelectPrerequisite.t),
  increasable: list(IncreasablePrerequisite.t),
  increasableMultiEntry: list(IncreasableMultiEntryPrerequisite.t),
  levels: IntMap.t(t),
};

type overwritePrerequisite =
  | Hide
  | ReplaceWith(string);

type tIndex = {
  sex: option(overwritePrerequisite),
  race: option(overwritePrerequisite),
  culture: option(overwritePrerequisite),
  pact: option(overwritePrerequisite),
  social: option(overwritePrerequisite),
  primaryAttribute: option(overwritePrerequisite),
  activatable: IntMap.t(overwritePrerequisite),
  activatableMultiEntry: IntMap.t(overwritePrerequisite),
  activatableMultiSelect: IntMap.t(overwritePrerequisite),
  increasable: IntMap.t(overwritePrerequisite),
  increasableMultiEntry: IntMap.t(overwritePrerequisite),
};

type tIndexWithLevel = {
  sex: option(overwritePrerequisite),
  race: option(overwritePrerequisite),
  culture: option(overwritePrerequisite),
  pact: option(overwritePrerequisite),
  social: option(overwritePrerequisite),
  primaryAttribute: option(overwritePrerequisite),
  activatable: IntMap.t(overwritePrerequisite),
  activatableMultiEntry: IntMap.t(overwritePrerequisite),
  activatableMultiSelect: IntMap.t(overwritePrerequisite),
  increasable: IntMap.t(overwritePrerequisite),
  increasableMultiEntry: IntMap.t(overwritePrerequisite),
  levels: IntMap.t(tIndex),
};
