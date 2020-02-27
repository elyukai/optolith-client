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

  type t = {
    value: int,
    scope: primaryAttributeType,
  };
};

module ActivatablePrerequisite = {
  type t = {
    id: string,
    active: bool,
    sid: option(Ids.selectOptionId),
    sid2: option(Ids.selectOptionId),
    tier: option(int),
  };
};

module ActivatableMultiEntryPrerequisite = {
  type t = {
    id: list(string),
    active: bool,
    sid: option(Ids.selectOptionId),
    sid2: option(Ids.selectOptionId),
    tier: option(int),
  };
};

module ActivatableMultiSelectPrerequisite = {
  type t = {
    id: string,
    active: bool,
    sid: list(Ids.selectOptionId),
    sid2: option(Ids.selectOptionId),
    tier: option(int),
  };
};

module IncreasablePrerequisite = {
  type t = {
    id: string,
    value: int,
  };
};

module IncreasableMultiEntryPrerequisite = {
  type t = {
    id: list(string),
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
