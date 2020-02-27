type oneOrMany('a) =
  | Single('a)
  | OneOf(list('a));

module SexPrerequisite = {
  type sex =
    | Male
    | Female;

  [@gentype]
  type t = sex;
};

module RacePrerequisite = {
  type raceId = oneOrMany(string);

  [@gentype]
  type t = {
    id: raceId,
    active: bool,
  };
};

module CulturePrerequisite = {
  type cultureId = oneOrMany(string);

  [@gentype]
  type t = cultureId;
};

module SocialPrerequisite = {
  [@gentype]
  type t = int;
};

module PactPrerequisite = {
  [@gentype]
  type t = {
    id: list(string),
    value: int,
    category: int,
    domain: option(oneOrMany(int)),
    level: option(int),
  };
};

module PrimaryAttributePrerequisite = {
  type primaryAttributeType =
    | Magical
    | Blessed;

  [@gentype]
  type t = {
    value: int,
    scope: primaryAttributeType,
  };
};

module ActivatablePrerequisite = {
  [@gentype]
  type t = {
    id: string,
    active: bool,
    sid: option(Ids.selectOptionId),
    sid2: option(Ids.selectOptionId),
    tier: option(int),
  };
};

module ActivatableMultiEntryPrerequisite = {
  [@gentype]
  type t = {
    id: list(string),
    active: bool,
    sid: option(Ids.selectOptionId),
    sid2: option(Ids.selectOptionId),
    tier: option(int),
  };
};

module ActivatableMultiSelectPrerequisite = {
  [@gentype]
  type t = {
    id: string,
    active: bool,
    sid: list(Ids.selectOptionId),
    sid2: option(Ids.selectOptionId),
    tier: option(int),
  };
};

module IncreasablePrerequisite = {
  [@gentype]
  type t = {
    id: string,
    value: int,
  };
};

module IncreasableMultiEntryPrerequisite = {
  [@gentype]
  type t = {
    id: list(string),
    value: int,
  };
};

[@gentype]
type professionDependency =
  | Sex(SexPrerequisite.t)
  | Race(RacePrerequisite.t)
  | Culture(CulturePrerequisite.t);

[@gentype]
type professionPrerequisite =
  | Activatable(ActivatablePrerequisite.t)
  | Increasable(IncreasablePrerequisite.t);

[@gentype]
type t =
  | Activatable(ActivatablePrerequisite.t)
  | Increasable(IncreasablePrerequisite.t)
  | PrimaryAttribute(PrimaryAttributePrerequisite.t)
  | Sex(SexPrerequisite.t)
  | Race(RacePrerequisite.t)
  | Culture(CulturePrerequisite.t)
  | Pact(PactPrerequisite.t)
  | Social(SocialPrerequisite.t);

[@gentype]
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
