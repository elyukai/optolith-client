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

type professionDependency =
  | Sex(SexPrerequisite.t)
  | Race(RacePrerequisite.t)
  | Culture(CulturePrerequisite.t);

type professionPrerequisite =
  | Activatable(ActivatablePrerequisite.t)
  | Increasable(IncreasablePrerequisite.t);

type t =
  | Activatable(ActivatablePrerequisite.t)
  | Increasable(IncreasablePrerequisite.t)
  | PrimaryAttribute(PrimaryAttributePrerequisite.t)
  | Sex(SexPrerequisite.t)
  | Race(RacePrerequisite.t)
  | Culture(CulturePrerequisite.t)
  | Pact(PactPrerequisite.t)
  | Social(SocialPrerequisite.t);

type tDisAdv =
  | CommonSuggestedByRCP
  | Activatable(ActivatablePrerequisite.t)
  | Increasable(IncreasablePrerequisite.t)
  | PrimaryAttribute(PrimaryAttributePrerequisite.t)
  | Sex(SexPrerequisite.t)
  | Race(RacePrerequisite.t)
  | Culture(CulturePrerequisite.t)
  | Pact(PactPrerequisite.t)
  | Social(SocialPrerequisite.t);

type tWithLevel =
  | Single(t)
  | ByLevel(IntMap.t(t));

type tWithLevelDisAdv =
  | Single(tDisAdv)
  | ByLevel(IntMap.t(tDisAdv));
