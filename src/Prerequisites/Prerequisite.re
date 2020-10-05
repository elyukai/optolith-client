let oneOrManyInt =
  Json.Decode.(
    oneOf([
      map((id): OneOrMany.t(int) => One(id), int),
      map((id): OneOrMany.t(int) => Many(id), list(int)),
    ])
  );

module Sex = {
  include Sex;

  let decode = json =>
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

module Race = {
  type t = {
    id: OneOrMany.t(int),
    active: bool,
  };

  let decode =
    Json.Decode.(
      oneOf([
        json => {id: json |> oneOrManyInt, active: true},
        json => {
          id: json |> field("id", oneOrManyInt),
          active: json |> field("active", bool),
        },
      ])
    );
};

module Culture = {
  type t = OneOrMany.t(int);

  let decode = oneOrManyInt;
};

module SocialStatus = {
  type t = int;

  let decode = Json.Decode.int;
};

module Pact = {
  type t = {
    category: int,
    domain: option(OneOrMany.t(int)),
    level: option(int),
  };

  let decode = json =>
    JsonStrict.{
      category: json |> field("category", int),
      domain: json |> optionalField("domain", oneOrManyInt),
      level: json |> optionalField("level", int),
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

  let decode = json =>
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

module Activatable = {
  type t = {
    id: Id.Activatable.t,
    active: bool,
    options: list(Id.Activatable.SelectOption.t),
    level: option(int),
  };

  let decode = json =>
    JsonStrict.{
      id: json |> field("id", Id.Activatable.Decode.t),
      active: json |> field("active", bool),
      options:
        json |> field("options", list(Id.Activatable.SelectOption.Decode.t)),
      level: json |> optionalField("level", int),
    };
};

module ActivatableMultiEntry = {
  type activatableIds =
    | Advantages(list(int))
    | Disadvantages(list(int))
    | SpecialAbilities(list(int));

  let decodeList = (f, json): activatableIds =>
    Json.Decode.(json |> field("value", list(int)) |> f);

  let decodeIds =
    Json.Decode.(
      field("scope", string)
      |> andThen(
           fun
           | "Advantage" => decodeList(xs => Advantages(xs))
           | "Disadvantage" => decodeList(xs => Disadvantages(xs))
           | "SpecialAbility" => decodeList(xs => SpecialAbilities(xs))
           | str =>
             raise(DecodeError("Unknown activatable ID scope: " ++ str)),
         )
    );

  type t = {
    id: activatableIds,
    active: bool,
    options: list(Id.Activatable.SelectOption.t),
    level: option(int),
  };

  let decode = json =>
    JsonStrict.{
      id: json |> field("id", decodeIds),
      active: json |> field("active", bool),
      options:
        json |> field("options", list(Id.Activatable.SelectOption.Decode.t)),
      level: json |> optionalField("level", int),
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

  let decode = json =>
    JsonStrict.{
      id: json |> field("id", Id.Activatable.Decode.t),
      active: json |> field("active", bool),
      firstOption:
        json
        |> field("firstOption", list(Id.Activatable.SelectOption.Decode.t)),
      otherOptions:
        json
        |> field("otherOptions", list(Id.Activatable.SelectOption.Decode.t)),
      level: json |> optionalField("level", int),
    };
};

module Increasable = {
  type t = {
    id: Id.Increasable.t,
    value: int,
  };

  let decode = json =>
    Json.Decode.{
      id: json |> field("id", Id.Increasable.Decode.t),
      value: json |> field("value", int),
    };
};

module IncreasableMultiEntry = {
  type increasableIds =
    | Attributes(list(int))
    | Skills(list(int))
    | CombatTechniques(list(int))
    | Spells(list(int))
    | LiturgicalChants(list(int));

  let decodeList = (f, json): increasableIds =>
    Json.Decode.(json |> field("value", list(int)) |> f);

  let decodeIds =
    Json.Decode.(
      field("scope", string)
      |> andThen(
           fun
           | "Attribute" => decodeList(xs => Attributes(xs))
           | "Skill" => decodeList(xs => Skills(xs))
           | "CombatTechnique" => decodeList(xs => CombatTechniques(xs))
           | "Spell" => decodeList(xs => Spells(xs))
           | "LiturgicalChant" => decodeList(xs => LiturgicalChants(xs))
           | str =>
             raise(DecodeError("Unknown increasable ID scope: " ++ str)),
         )
    );

  type t = {
    id: increasableIds,
    value: int,
  };

  let decode = json =>
    Json.Decode.{
      id: json |> field("id", decodeIds),
      value: json |> field("value", int),
    };
};

module DisplayOption = {
  type t =
    | Generate
    | Hide
    | ReplaceWith(string);

  module Translation = {
    type t = string;

    let t = Json.Decode.string;
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual =
    | MultilingualGenerate
    | MultilingualHide
    | MultilingualReplaceWith(TranslationMap.t);

  let decodeMultilingual = json =>
    JsonStrict.(
      json
      |> optionalField(
           "displayOption",
           field("type", string)
           |> andThen(
                fun
                | "Hide" => (_ => MultilingualHide)
                | "ByLevel" => (
                    json =>
                      json
                      |> field("value", TranslationMap.Decode.t)
                      |> (mp => MultilingualReplaceWith(mp))
                  )
                | str =>
                  raise(DecodeError("Unknown display option type: " ++ str)),
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

module Config = {
  type t('a) = {
    value: 'a,
    displayOption: DisplayOption.t,
  };

  type multilingual('a) = {
    value: 'a,
    displayOption: DisplayOption.multilingual,
  };

  let decodeMultilingual = (decoder, wrap: 'a => 'b, json) =>
    Json.Decode.(
      (
        {
          value: json |> field("value", decoder) |> wrap,
          displayOption: json |> DisplayOption.decodeMultilingual,
        }:
          multilingual('b)
      )
    );

  let resolveTranslations =
      (langs, {value, displayOption}: multilingual('a)): t('a) => {
    value,
    displayOption: DisplayOption.resolveTranslations(langs, displayOption),
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

  type multilingual = Config.multilingual(value);

  let decodeMultilingual =
    Json.Decode.(
      field("type", string)
      |> andThen(
           fun
           | "Sex" => Config.decodeMultilingual(Sex.decode, v => Sex(v))
           | "Race" => Config.decodeMultilingual(Race.decode, v => Race(v))
           | "Culture" =>
             Config.decodeMultilingual(Culture.decode, v => Culture(v))
           | "Pact" => Config.decodeMultilingual(Pact.decode, v => Pact(v))
           | "SocialStatus" =>
             Config.decodeMultilingual(SocialStatus.decode, v =>
               SocialStatus(v)
             )
           | "PrimaryAttribute" =>
             Config.decodeMultilingual(PrimaryAttribute.decode, v =>
               PrimaryAttribute(v)
             )
           | "Activatable" =>
             Config.decodeMultilingual(Activatable.decode, v =>
               Activatable(v)
             )
           | "ActivatableMultiEntry" =>
             Config.decodeMultilingual(ActivatableMultiEntry.decode, v =>
               ActivatableMultiEntry(v)
             )
           | "ActivatableMultiSelect" =>
             Config.decodeMultilingual(ActivatableMultiSelect.decode, v =>
               ActivatableMultiSelect(v)
             )
           | "Increasable" =>
             Config.decodeMultilingual(Increasable.decode, v =>
               Increasable(v)
             )
           | "IncreasableMultiEntry" =>
             Config.decodeMultilingual(IncreasableMultiEntry.decode, v =>
               IncreasableMultiEntry(v)
             )
           | str => raise(DecodeError("Unknown prerequisite type: " ++ str)),
         )
    );

  let resolveTranslations = Config.resolveTranslations;

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
};

module Profession = {
  type value =
    | Sex(Sex.t)
    | Race(Race.t)
    | Culture(Culture.t)
    | Activatable(Activatable.t)
    | Increasable(Increasable.t);

  type t = Config.t(value);

  type multilingual = Config.multilingual(value);

  let decodeMultilingual =
    Json.Decode.(
      field("type", string)
      |> andThen(
           fun
           | "Sex" => Config.decodeMultilingual(Sex.decode, v => Sex(v))
           | "Race" => Config.decodeMultilingual(Race.decode, v => Race(v))
           | "Culture" =>
             Config.decodeMultilingual(Culture.decode, v => Culture(v))
           | "Activatable" =>
             Config.decodeMultilingual(Activatable.decode, v =>
               Activatable(v)
             )
           | "Increasable" =>
             Config.decodeMultilingual(Increasable.decode, v =>
               Increasable(v)
             )
           | str => raise(DecodeError("Unknown prerequisite type: " ++ str)),
         )
    );

  let resolveTranslations = Config.resolveTranslations;

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

  type multilingual = Config.multilingual(value);

  let decodeMultilingual =
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
           | "Sex" => Config.decodeMultilingual(Sex.decode, v => Sex(v))
           | "Race" => Config.decodeMultilingual(Race.decode, v => Race(v))
           | "Culture" =>
             Config.decodeMultilingual(Culture.decode, v => Culture(v))
           | "Pact" => Config.decodeMultilingual(Pact.decode, v => Pact(v))
           | "SocialStatus" =>
             Config.decodeMultilingual(SocialStatus.decode, v =>
               SocialStatus(v)
             )
           | "PrimaryAttribute" =>
             Config.decodeMultilingual(PrimaryAttribute.decode, v =>
               PrimaryAttribute(v)
             )
           | "Activatable" =>
             Config.decodeMultilingual(Activatable.decode, v =>
               Activatable(v)
             )
           | "ActivatableMultiEntry" =>
             Config.decodeMultilingual(ActivatableMultiEntry.decode, v =>
               ActivatableMultiEntry(v)
             )
           | "ActivatableMultiSelect" =>
             Config.decodeMultilingual(ActivatableMultiSelect.decode, v =>
               ActivatableMultiSelect(v)
             )
           | "Increasable" =>
             Config.decodeMultilingual(Increasable.decode, v =>
               Increasable(v)
             )
           | "IncreasableMultiEntry" =>
             Config.decodeMultilingual(IncreasableMultiEntry.decode, v =>
               IncreasableMultiEntry(v)
             )
           | str => raise(DecodeError("Unknown prerequisite type: " ++ str)),
         )
    );

  let resolveTranslations = Config.resolveTranslations;

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
};

module Collection = {
  module Plain = {
    type t('a) = list('a);

    let decodeMultilingual = Json.Decode.list;

    let resolveTranslations = (langs, f, xs) =>
      xs |> Ley_List.map(f(langs));
  };

  module ByLevel = {
    type t('a) =
      | Plain(list('a))
      | ByLevel(Ley_IntMap.t(list('a)));

    let decodeMultilingual = decoder =>
      Json.Decode.(
        field("type", string)
        |> andThen(
             fun
             | "Plain" => (
                 json => json |> list(decoder) |> (xs => Plain(xs))
               )
             | "ByLevel" => (
                 json =>
                   json
                   |> list(json =>
                        (
                          json |> field("level", int),
                          json |> field("prerequisites", list(decoder)),
                        )
                      )
                   |> (xs => ByLevel(Ley_IntMap.fromList(xs)))
               )
             | str =>
               raise(DecodeError("Unknown prerequisite list type: " ++ str)),
           )
      );

    let resolveTranslations = (langs, f, x) =>
      switch (x) {
      | Plain(xs) => xs |> Ley_List.map(f(langs)) |> (xs => Plain(xs))
      | ByLevel(mp) =>
        mp |> Ley_IntMap.map(Ley_List.map(f(langs))) |> (mp => ByLevel(mp))
      };

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
  };

  module Make = (Wrapper: Decoder.SubTypeWrapper, Main: Decoder.SubType) => {
    type t = Wrapper.t(Main.t);

    type multilingual = Wrapper.t(Main.multilingual);

    let decodeMultilingual =
      Wrapper.decodeMultilingual(Main.decodeMultilingual);

    let resolveTranslations = (langs, x) =>
      Wrapper.resolveTranslations(langs, Main.resolveTranslations, x);
  };

  module General = Make(ByLevel, General);

  module Profession = Make(Plain, Profession);

  module AdvantageDisadvantage = Make(ByLevel, AdvantageDisadvantage);
};
