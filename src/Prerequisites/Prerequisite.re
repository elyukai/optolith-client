let oneOrManyInt =
  Json.Decode.(
    oneOf([
      map((id): OneOrMany.t(int) => One(id), int),
      map((id): OneOrMany.t(int) => Many(id), list(int)),
    ])
  );

module Sex = {
  include Sex;

  module Decode = {
    let t = json =>
      Json.Decode.(
        json
        |> string
        |> (
          fun
          | "m" => Male
          | "f" => Female
          | str => raise(DecodeError("Unknown sex prerequisite: " ++ str))
        )
      );
  };
};

module Race = {
  type t = {
    id: OneOrMany.t(int),
    active: bool,
  };

  module Decode = {
    let t =
      Json.Decode.(
        oneOf([
          json => {id: json |> oneOrManyInt, active: true},
          json => {
            id: json |> field("races", oneOrManyInt),
            active: json |> field("active", bool),
          },
        ])
      );
  };
};

module Culture = {
  type t = OneOrMany.t(int);

  module Decode = {
    let t = oneOrManyInt;
  };
};

module PrimaryAttribute = {
  type primaryAttributeType =
    | Magical
    | Blessed;

  type t = {
    value: int,
    scope: primaryAttributeType,
  };

  module Decode = {
    let t = json =>
      Json.Decode.{
        scope:
          json
          |> field("type", string)
          |> (
            fun
            | "blessed" => Blessed
            | "magical" => Magical
            | str =>
              raise(DecodeError("Unknown primary attribute type: " ++ str))
          ),
        value: json |> field("value", int),
      };
  };
};

module Pact = {
  type t = {
    category: int,
    domain: option(OneOrMany.t(int)),
    level: option(int),
  };

  module Decode = {
    let t = json =>
      Json_Decode_Strict.{
        category: json |> field("category", int),
        domain: json |> optionalField("domain", oneOrManyInt),
        level: json |> optionalField("level", int),
      };
  };
};

module SocialStatus = {
  type t = int;

  module Decode = {
    let t = Json.Decode.int;
  };
};

module Activatable = {
  type t = {
    id: Id.Activatable.t,
    active: bool,
    options: list(Id.Activatable.SelectOption.t),
    level: option(int),
  };

  module Decode = {
    let t = json =>
      Json_Decode_Strict.{
        id: json |> field("id", Id.Activatable.Decode.t),
        active: json |> field("active", bool),
        options:
          json
          |> optionalField(
               "options",
               list(Id.Activatable.SelectOption.Decode.t),
             )
          |> Ley_Option.fromOption([]),
        level: json |> optionalField("level", int),
      };
  };
};

module ActivatableMultiEntry = {
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

  module Decode = {
    let activatableIdList = (f, json): activatableIds =>
      Json.Decode.(json |> field("value", list(int)) |> f);

    let activatableIds =
      Json.Decode.(
        field("scope", string)
        |> andThen(
             fun
             | "Advantage" => activatableIdList(xs => Advantages(xs))
             | "Disadvantage" => activatableIdList(xs => Disadvantages(xs))
             | "SpecialAbility" =>
               activatableIdList(xs => SpecialAbilities(xs))
             | str =>
               raise(DecodeError("Unknown activatable ID scope: " ++ str)),
           )
      );

    let t = json =>
      Json_Decode_Strict.{
        id: json |> field("id", activatableIds),
        active: json |> field("active", bool),
        options:
          json
          |> optionalField(
               "options",
               list(Id.Activatable.SelectOption.Decode.t),
             )
          |> Ley_Option.fromOption([]),
        level: json |> optionalField("level", int),
      };
  };
};

module ActivatableMultiSelect = {
  type t = {
    id: Id.Activatable.t,
    active: bool,
    firstOption: list(Id.Activatable.SelectOption.t),
    otherOptions: list(Id.Activatable.SelectOption.t),
    level: option(int),
  };

  module Decode = {
    let t = json =>
      Json_Decode_Strict.{
        id: json |> field("id", Id.Activatable.Decode.t),
        active: json |> field("active", bool),
        firstOption:
          json
          |> field("firstOption", list(Id.Activatable.SelectOption.Decode.t)),
        otherOptions:
          json
          |> optionalField(
               "otherOptions",
               list(Id.Activatable.SelectOption.Decode.t),
             )
          |> Ley_Option.fromOption([]),
        level: json |> optionalField("level", int),
      };
  };
};

module Increasable = {
  type t = {
    id: Id.Increasable.t,
    value: int,
  };

  module Decode = {
    let t = json =>
      Json.Decode.{
        id: json |> field("id", Id.Increasable.Decode.t),
        value: json |> field("value", int),
      };
  };
};

module IncreasableMultiEntry = {
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

  module Decode = {
    let increasableIdList = (f, json): increasableIds =>
      Json.Decode.(json |> field("value", list(int)) |> f);

    let increasableIds =
      Json.Decode.(
        field("scope", string)
        |> andThen(
             fun
             | "Attribute" => increasableIdList(xs => Attributes(xs))
             | "Skill" => increasableIdList(xs => Skills(xs))
             | "CombatTechnique" =>
               increasableIdList(xs => CombatTechniques(xs))
             | "Spell" => increasableIdList(xs => Spells(xs))
             | "LiturgicalChant" =>
               increasableIdList(xs => LiturgicalChants(xs))
             | str =>
               raise(DecodeError("Unknown increasable ID scope: " ++ str)),
           )
      );

    let t = json =>
      Json.Decode.{
        id: json |> field("id", increasableIds),
        value: json |> field("value", int),
      };
  };
};

module DisplayOption = {
  type t =
    | Generate
    | Hide
    | ReplaceWith(string);

  module Decode = {
    module Translation = {
      type t = string;

      let t = Json.Decode.string;
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual =
      | MultilingualGenerate
      | MultilingualHide
      | MultilingualReplaceWith(TranslationMap.t);

    let multilingual = json =>
      Json_Decode_Strict.(
        json
        |> optionalField(
             "displayOption",
             field("type", string)
             |> andThen(
                  fun
                  | "Hide" => (_ => MultilingualHide)
                  | "ReplaceWith" => (
                      json =>
                        json
                        |> field("value", TranslationMap.Decode.t)
                        |> (mp => MultilingualReplaceWith(mp))
                    )
                  | str =>
                    raise(
                      DecodeError("Unknown display option type: " ++ str),
                    ),
                ),
           )
        |> Ley_Option.fromOption(MultilingualGenerate)
      );

    let resolveTranslations = (langs, x) =>
      switch (x) {
      | MultilingualGenerate => Generate
      | MultilingualHide => Hide
      | MultilingualReplaceWith(mp) =>
        mp
        |> TranslationMap.Decode.getFromLanguageOrder(langs)
        |> Ley_Option.fromOption(Chars.mdash)
        |> (str => ReplaceWith(str))
      };
  };
};

module Config = {
  type t('a) = {
    value: 'a,
    displayOption: DisplayOption.t,
  };

  module Decode = {
    type multilingual('a) = {
      value: 'a,
      displayOption: DisplayOption.Decode.multilingual,
    };

    let multilingual = (decoder, wrap: 'a => 'b, json) =>
      Json.Decode.(
        (
          {
            value: json |> field("value", decoder) |> wrap,
            displayOption: json |> DisplayOption.Decode.multilingual,
          }:
            multilingual('b)
        )
      );

    let resolveTranslations =
        (langs, {value, displayOption}: multilingual('a)): t('a) => {
      value,
      displayOption:
        DisplayOption.Decode.resolveTranslations(langs, displayOption),
    };
  };
};

module Unified = {
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

module General = {
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

  let unify = (x: t): Unified.t => {
    value:
      switch (x.value) {
      | Sex(x) => Sex(x)
      | Race(x) => Race(x)
      | Culture(x) => Culture(x)
      | Pact(x) => Pact(x)
      | SocialStatus(x) => SocialStatus(x)
      | PrimaryAttribute(x) => PrimaryAttribute(x)
      | Activatable(x) => Activatable(x)
      | ActivatableMultiEntry(x) => ActivatableMultiEntry(x)
      | ActivatableMultiSelect(x) => ActivatableMultiSelect(x)
      | Increasable(x) => Increasable(x)
      | IncreasableMultiEntry(x) => IncreasableMultiEntry(x)
      },
    displayOption: x.displayOption,
  };

  module Decode = {
    type multilingual = Config.Decode.multilingual(value);

    let multilingual =
      Json.Decode.(
        field("type", string)
        |> andThen(
             fun
             | "Sex" => Config.Decode.multilingual(Sex.Decode.t, v => Sex(v))
             | "Race" =>
               Config.Decode.multilingual(Race.Decode.t, v => Race(v))
             | "Culture" =>
               Config.Decode.multilingual(Culture.Decode.t, v => Culture(v))
             | "Pact" =>
               Config.Decode.multilingual(Pact.Decode.t, v => Pact(v))
             | "SocialStatus" =>
               Config.Decode.multilingual(SocialStatus.Decode.t, v =>
                 SocialStatus(v)
               )
             | "PrimaryAttribute" =>
               Config.Decode.multilingual(PrimaryAttribute.Decode.t, v =>
                 PrimaryAttribute(v)
               )
             | "Activatable" =>
               Config.Decode.multilingual(Activatable.Decode.t, v =>
                 Activatable(v)
               )
             | "ActivatableMultiEntry" =>
               Config.Decode.multilingual(ActivatableMultiEntry.Decode.t, v =>
                 ActivatableMultiEntry(v)
               )
             | "ActivatableMultiSelect" =>
               Config.Decode.multilingual(ActivatableMultiSelect.Decode.t, v =>
                 ActivatableMultiSelect(v)
               )
             | "Increasable" =>
               Config.Decode.multilingual(Increasable.Decode.t, v =>
                 Increasable(v)
               )
             | "IncreasableMultiEntry" =>
               Config.Decode.multilingual(IncreasableMultiEntry.Decode.t, v =>
                 IncreasableMultiEntry(v)
               )
             | str =>
               raise(DecodeError("Unknown prerequisite type: " ++ str)),
           )
      );

    let resolveTranslations = Config.Decode.resolveTranslations;
  };
};

module Profession = {
  type value =
    | Sex(Sex.t)
    | Race(Race.t)
    | Culture(Culture.t)
    | Activatable(Activatable.t)
    | Increasable(Increasable.t);

  type t = Config.t(value);

  let unify = (x: t): Unified.t => {
    value:
      switch (x.value) {
      | Sex(x) => Sex(x)
      | Race(x) => Race(x)
      | Culture(x) => Culture(x)
      | Activatable(x) => Activatable(x)
      | Increasable(x) => Increasable(x)
      },
    displayOption: x.displayOption,
  };

  module Decode = {
    type multilingual = Config.Decode.multilingual(value);

    let multilingual =
      Json.Decode.(
        field("type", string)
        |> andThen(
             fun
             | "Sex" => Config.Decode.multilingual(Sex.Decode.t, v => Sex(v))
             | "Race" =>
               Config.Decode.multilingual(Race.Decode.t, v => Race(v))
             | "Culture" =>
               Config.Decode.multilingual(Culture.Decode.t, v => Culture(v))
             | "Activatable" =>
               Config.Decode.multilingual(Activatable.Decode.t, v =>
                 Activatable(v)
               )
             | "Increasable" =>
               Config.Decode.multilingual(Increasable.Decode.t, v =>
                 Increasable(v)
               )
             | str =>
               raise(DecodeError("Unknown prerequisite type: " ++ str)),
           )
      );

    let resolveTranslations = Config.Decode.resolveTranslations;
  };
};

module AdvantageDisadvantage = {
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

  let unify = (x: t): Unified.t => {
    value:
      switch (x.value) {
      | CommonSuggestedByRCP => CommonSuggestedByRCP
      | Sex(x) => Sex(x)
      | Race(x) => Race(x)
      | Culture(x) => Culture(x)
      | Pact(x) => Pact(x)
      | SocialStatus(x) => SocialStatus(x)
      | PrimaryAttribute(x) => PrimaryAttribute(x)
      | Activatable(x) => Activatable(x)
      | ActivatableMultiEntry(x) => ActivatableMultiEntry(x)
      | ActivatableMultiSelect(x) => ActivatableMultiSelect(x)
      | Increasable(x) => Increasable(x)
      | IncreasableMultiEntry(x) => IncreasableMultiEntry(x)
      },
    displayOption: x.displayOption,
  };

  module Decode = {
    type multilingual = Config.Decode.multilingual(value);

    let multilingual =
      Json.Decode.(
        field("type", string)
        |> andThen(
             fun
             | "CommonSuggestedByRCP" => (
                 _ => (
                   {
                     value: CommonSuggestedByRCP,
                     displayOption: MultilingualGenerate,
                   }: multilingual
                 )
               )
             | "Sex" => Config.Decode.multilingual(Sex.Decode.t, v => Sex(v))
             | "Race" =>
               Config.Decode.multilingual(Race.Decode.t, v => Race(v))
             | "Culture" =>
               Config.Decode.multilingual(Culture.Decode.t, v => Culture(v))
             | "Pact" =>
               Config.Decode.multilingual(Pact.Decode.t, v => Pact(v))
             | "SocialStatus" =>
               Config.Decode.multilingual(SocialStatus.Decode.t, v =>
                 SocialStatus(v)
               )
             | "PrimaryAttribute" =>
               Config.Decode.multilingual(PrimaryAttribute.Decode.t, v =>
                 PrimaryAttribute(v)
               )
             | "Activatable" =>
               Config.Decode.multilingual(Activatable.Decode.t, v =>
                 Activatable(v)
               )
             | "ActivatableMultiEntry" =>
               Config.Decode.multilingual(ActivatableMultiEntry.Decode.t, v =>
                 ActivatableMultiEntry(v)
               )
             | "ActivatableMultiSelect" =>
               Config.Decode.multilingual(ActivatableMultiSelect.Decode.t, v =>
                 ActivatableMultiSelect(v)
               )
             | "Increasable" =>
               Config.Decode.multilingual(Increasable.Decode.t, v =>
                 Increasable(v)
               )
             | "IncreasableMultiEntry" =>
               Config.Decode.multilingual(IncreasableMultiEntry.Decode.t, v =>
                 IncreasableMultiEntry(v)
               )
             | str =>
               raise(DecodeError("Unknown prerequisite type: " ++ str)),
           )
      );

    let resolveTranslations = Config.Decode.resolveTranslations;
  };
};

module ArcaneTradition = {
  type value =
    | Sex(Sex.t)
    | Culture(Culture.t);

  type t = Config.t(value);

  let unify = (x: t): Unified.t => {
    value:
      switch (x.value) {
      | Sex(x) => Sex(x)
      | Culture(x) => Culture(x)
      },
    displayOption: x.displayOption,
  };

  module Decode = {
    type multilingual = Config.Decode.multilingual(value);

    let multilingual =
      Json.Decode.(
        field("type", string)
        |> andThen(
             fun
             | "Sex" => Config.Decode.multilingual(Sex.Decode.t, v => Sex(v))
             | "Culture" =>
               Config.Decode.multilingual(Culture.Decode.t, v => Culture(v))
             | str =>
               raise(DecodeError("Unknown prerequisite type: " ++ str)),
           )
      );

    let resolveTranslations = Config.Decode.resolveTranslations;
  };
};

module ActivatableOnly = {
  type value = Activatable.t;

  type t = Config.t(value);

  let unify = (x: t): Unified.t => {
    value: Activatable(x.value),
    displayOption: x.displayOption,
  };

  module Decode = {
    type multilingual = Config.Decode.multilingual(value);

    let multilingual =
      Config.Decode.multilingual(Activatable.Decode.t, v => v);

    let resolveTranslations = Config.Decode.resolveTranslations;
  };
};

module IncreasableOnly = {
  type value = Increasable.t;

  type t = Config.t(value);

  let unify = (x: t): Unified.t => {
    value: Increasable(x.value),
    displayOption: x.displayOption,
  };

  module Decode = {
    type multilingual = Config.Decode.multilingual(value);

    let multilingual =
      Config.Decode.multilingual(Increasable.Decode.t, v => v);

    let resolveTranslations = Config.Decode.resolveTranslations;
  };
};

module Collection = {
  module Plain = {
    type t('a) = list('a);

    module Decode = {
      let multilingual = decoder =>
        Json.Decode.(
          field("type", string)
          |> andThen(
               fun
               | "Plain" => (json => json |> field("value", list(decoder)))
               | str =>
                 raise(
                   DecodeError(
                     "Prerequisite list type has to be set to \"Plain\". Actual: "
                     ++ str,
                   ),
                 ),
             )
        );

      let resolveTranslations = (langs, f, xs) =>
        xs |> Ley_List.map(f(langs));
    };
  };

  module ByLevel = {
    type t('a) =
      | Plain(list('a))
      | ByLevel(Ley_IntMap.t(list('a)));

    let getFirstLevel = prerequisites =>
      switch (prerequisites) {
      | Plain(xs) => xs
      | ByLevel(mp) =>
        mp |> Ley_IntMap.lookup(1) |> Ley_Option.fromOption([])
      };

    let makeRangePredicate = (oldLevel, newLevel) =>
      switch (oldLevel, newLevel) {
      // Used for changing level
      | (Some(oldLevel), Some(newLevel)) =>
        let (min, max) = Ley_Int.minmax(oldLevel, newLevel);
        Ley_Ix.inRange((min + 1, max));
      // Used for deactivating an entry
      | (Some(level), None)
      // Used for activating an entry
      | (None, Some(level)) => (>=)(level)
      | (None, None) => Ley_Function.const(true)
      };

    let filterByLevel = (pred, mp) => {
      Ley_IntMap.filterWithKey((k, _) => pred(k), mp);
    };

    let concatRange = (oldLevel, newLevel, prerequisites) => {
      let pred = makeRangePredicate(oldLevel, newLevel);

      switch (prerequisites) {
      | Plain(xs) => pred(1) ? xs : []
      | ByLevel(mp) => mp |> filterByLevel(pred) |> Ley_IntMap.concat
      };
    };

    module Decode = {
      let multilingual = decoder =>
        Json.Decode.(
          field("type", string)
          |> andThen(
               fun
               | "Plain" => (
                   json =>
                     json
                     |> field("value", list(decoder))
                     |> (xs => Plain(xs))
                 )
               | "ByLevel" => (
                   json =>
                     json
                     |> field(
                          "value",
                          list(json =>
                            (
                              json |> field("level", int),
                              json |> field("prerequisites", list(decoder)),
                            )
                          ),
                        )
                     |> (xs => ByLevel(Ley_IntMap.fromList(xs)))
                 )
               | str =>
                 raise(
                   DecodeError("Unknown prerequisite list type: " ++ str),
                 ),
             )
        );

      let resolveTranslations = (langs, f, x) =>
        switch (x) {
        | Plain(xs) => xs |> Ley_List.map(f(langs)) |> (xs => Plain(xs))
        | ByLevel(mp) =>
          mp
          |> Ley_IntMap.map(Ley_List.map(f(langs)))
          |> (mp => ByLevel(mp))
        };
    };
  };

  module Make = (Wrapper: Decoder.SubTypeWrapper, Main: Decoder.SubType) => {
    type t = Wrapper.t(Main.t);

    module Decode = {
      type multilingual = Wrapper.t(Main.Decode.multilingual);

      let multilingual =
        Wrapper.Decode.multilingual(Main.Decode.multilingual);

      let resolveTranslations = (langs, x) =>
        Wrapper.Decode.resolveTranslations(
          langs,
          Main.Decode.resolveTranslations,
          x,
        );
    };
  };

  module General = Make(ByLevel, General);

  module Profession = Make(Plain, Profession);

  module AdvantageDisadvantage = Make(ByLevel, AdvantageDisadvantage);

  module ArcaneTradition = Make(Plain, ArcaneTradition);

  module Activatable = Make(Plain, ActivatableOnly);

  module Increasable = Make(Plain, IncreasableOnly);
};
