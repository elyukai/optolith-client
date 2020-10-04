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

module DisplayOption: {
  type t =
    | Generate
    | Hide
    | ReplaceWith(string);
};

module Config: {
  type t('a) = {
    value: 'a,
    displayOption: DisplayOption.t,
  };
};

module Unified: {
  type value =
    | CommonSuggestedByRCP
    | Sex(Sex.t)
    | Race(Race.t)
    | Culture(Culture.t)
    | Pact(Pact.t)
    | SocialStatus(SocialStatus.t)
    | PrimaryAttribute(PrimaryAttribute.t)
    | Activatable(Activatable.t)
    | ActivatableMultiEntry(ActivatableMultiEntry.t)
    | ActivatableMultiSelect(ActivatableMultiSelect.t)
    | Increasable(Increasable.t)
    | IncreasableMultiEntry(IncreasableMultiEntry.t);

  type t = Config.t(value);
};

module General: {
  type value =
    | Sex(Sex.t)
    | Race(Race.t)
    | Culture(Culture.t)
    | Pact(Pact.t)
    | SocialStatus(SocialStatus.t)
    | PrimaryAttribute(PrimaryAttribute.t)
    | Activatable(Activatable.t)
    | ActivatableMultiEntry(ActivatableMultiEntry.t)
    | ActivatableMultiSelect(ActivatableMultiSelect.t)
    | Increasable(Increasable.t)
    | IncreasableMultiEntry(IncreasableMultiEntry.t);

  type t = Config.t(value);

  type multilingual;

  let decodeMultilingual: Json.Decode.decoder(multilingual);

  let resolveTranslations: (list(string), multilingual) => t;

  let unify: t => Unified.t;
};

module Profession: {
  type value =
    | Sex(Sex.t)
    | Race(Race.t)
    | Culture(Culture.t)
    | Activatable(Activatable.t)
    | Increasable(Increasable.t);

  type t = Config.t(value);

  type multilingual;

  let decodeMultilingual: Json.Decode.decoder(multilingual);

  let resolveTranslations: (list(string), multilingual) => t;

  let unify: t => Unified.t;
};

module AdvantageDisadvantage: {
  type value =
    | CommonSuggestedByRCP
    | Sex(Sex.t)
    | Race(Race.t)
    | Culture(Culture.t)
    | Pact(Pact.t)
    | SocialStatus(SocialStatus.t)
    | PrimaryAttribute(PrimaryAttribute.t)
    | Activatable(Activatable.t)
    | ActivatableMultiEntry(ActivatableMultiEntry.t)
    | ActivatableMultiSelect(ActivatableMultiSelect.t)
    | Increasable(Increasable.t)
    | IncreasableMultiEntry(IncreasableMultiEntry.t);

  type t = Config.t(value);

  type multilingual;

  let decodeMultilingual: Json.Decode.decoder(multilingual);

  let resolveTranslations: (list(string), multilingual) => t;

  let unify: t => Unified.t;
};

module Collection: {
  module ByLevel: {
    type t('a) =
      | Plain(list('a))
      | ByLevel(Ley_IntMap.t(list('a)));

    /**
     * `getFirstLevel prerequisites` returns a list of the prerequisites that
     * must always be met to activate the associated entry.
     */
    let getFirstLevel: t('a) => list('a);

    /**
     * `concatRange oldLevel newLevel prerequisites` returns a list of the
     * prerequisites of the matching levels of the passed prerequisites.
     */
    let concatRange: (option(int), option(int), t('a)) => list('a);
  };

  module General: {
    type t = ByLevel.t(General.t);

    type multilingual;

    let decodeMultilingual: Json.Decode.decoder(multilingual);

    let resolveTranslations: (list(string), multilingual) => t;
  };

  module Profession: {
    type t = list(Profession.t);

    type multilingual;

    let decodeMultilingual: Json.Decode.decoder(multilingual);

    let resolveTranslations: (list(string), multilingual) => t;
  };

  module AdvantageDisadvantage: {
    type t = ByLevel.t(AdvantageDisadvantage.t);

    type multilingual;

    let decodeMultilingual: Json.Decode.decoder(multilingual);

    let resolveTranslations: (list(string), multilingual) => t;
  };
};
