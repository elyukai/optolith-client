let oneOrManyInt: Json.Decode.decoder(OneOrMany.t(int));

module Sex: {
  type t = Sex.t;

  let decode: Json.Decode.decoder(t);
};

module Race: {
  type t = {
    id: OneOrMany.t(int),
    active: bool,
  };

  let decode: Json.Decode.decoder(t);
};

module Culture: {
  type t = OneOrMany.t(int);

  let decode: Json.Decode.decoder(t);
};

module SocialStatus: {
  type t = int;

  let decode: Json.Decode.decoder(t);
};

module Pact: {
  type t = {
    category: int,
    domain: option(OneOrMany.t(int)),
    level: option(int),
  };

  let decode: Json.Decode.decoder(t);
};

module PrimaryAttribute: {
  type primaryAttributeType =
    | Magical
    | Blessed;

  type t = {
    value: int,
    scope: primaryAttributeType,
  };

  let decode: Json.Decode.decoder(t);
};

module Activatable: {
  type t = {
    id: Id.Activatable.t,
    active: bool,
    options: list(Id.Activatable.SelectOption.t),
    level: option(int),
  };

  let decode: Json.Decode.decoder(t);
};

module ActivatableMultiEntry: {
  type activatableIds =
    | Advantages(list(int))
    | Disadvantages(list(int))
    | SpecialAbilities(list(int));

  type t = {
    id: activatableIds,
    active: bool,
    options: list(Id.Activatable.SelectOption.t),
    level: option(int),
  };

  let decode: Json.Decode.decoder(t);
};

module ActivatableMultiSelect: {
  type t = {
    id: Id.Activatable.t,
    active: bool,
    firstOption: list(Id.Activatable.SelectOption.t),
    otherOptions: list(Id.Activatable.SelectOption.t),
    level: option(int),
  };

  let decode: Json.Decode.decoder(t);
};

module Increasable: {
  type t = {
    id: Id.Increasable.t,
    value: int,
  };

  let decode: Json.Decode.decoder(t);
};

module IncreasableMultiEntry: {
  type increasableIds =
    | Attributes(list(int))
    | Skills(list(int))
    | CombatTechniques(list(int))
    | Spells(list(int))
    | LiturgicalChants(list(int));

  type t = {
    id: increasableIds,
    value: int,
  };

  let decode: Json.Decode.decoder(t);
};

module All: {
  type t('a) =
    | Plain(list('a))
    | ByLevel(Ley_IntMap.t(list('a)));
};

module DisplayOption: {
  type t =
    | Generate
    | Hide
    | ReplaceWith(string);
};

module Profession: {
  type t =
    | Sex(Sex.t, DisplayOption.t)
    | Race(Race.t, DisplayOption.t)
    | Culture(Culture.t, DisplayOption.t)
    | Activatable(Activatable.t, DisplayOption.t)
    | Increasable(Increasable.t, DisplayOption.t);

  type all = All.t(t);

  let decode: Json.Decode.decoder(all);
};

module AdvantageDisadvantage: {
  type t =
    | CommonSuggestedByRCP
    | Sex(Sex.t, DisplayOption.t)
    | Race(Race.t, DisplayOption.t)
    | Culture(Culture.t, DisplayOption.t)
    | Pact(Pact.t, DisplayOption.t)
    | SocialStatus(SocialStatus.t, DisplayOption.t)
    | PrimaryAttribute(PrimaryAttribute.t, DisplayOption.t)
    | Activatable(Activatable.t, DisplayOption.t)
    | ActivatableMultiEntry(ActivatableMultiEntry.t, DisplayOption.t)
    | ActivatableMultiSelect(ActivatableMultiSelect.t, DisplayOption.t)
    | Increasable(Increasable.t, DisplayOption.t)
    | IncreasableMultiEntry(IncreasableMultiEntry.t, DisplayOption.t);

  type all = All.t(t);

  let decode: Json.Decode.decoder(all);
};

type t =
  | Sex(Sex.t, DisplayOption.t)
  | Race(Race.t, DisplayOption.t)
  | Culture(Culture.t, DisplayOption.t)
  | Pact(Pact.t, DisplayOption.t)
  | SocialStatus(SocialStatus.t, DisplayOption.t)
  | PrimaryAttribute(PrimaryAttribute.t, DisplayOption.t)
  | Activatable(Activatable.t, DisplayOption.t)
  | ActivatableMultiEntry(ActivatableMultiEntry.t, DisplayOption.t)
  | ActivatableMultiSelect(ActivatableMultiSelect.t, DisplayOption.t)
  | Increasable(Increasable.t, DisplayOption.t)
  | IncreasableMultiEntry(IncreasableMultiEntry.t, DisplayOption.t);

type all = All.t(t);

let decode: Json.Decode.decoder(all);
