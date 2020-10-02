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

module All = {
  type t('a) =
    | Plain(list('a))
    | ByLevel(Ley_IntMap.t(list('a)));

  let decode = decoder =>
    Json.Decode.(
      field("type", string)
      |> andThen(
           fun
           | "Plain" => (json => json |> list(decoder) |> (xs => Plain(xs)))
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
};

module DisplayOption = {
  type t =
    | Generate
    | Hide
    | ReplaceWith(string);

  module Translation = {
    type t = string;

    let decode = Json.Decode.string;
  };

  module TranslationMap = TranslationMap.Make(Translation);

  let decode = (langs, json) =>
    JsonStrict.(
      json
      |> optionalField(
           "displayOption",
           field("type", string)
           |> andThen(
                fun
                | "Hide" => (_ => Hide)
                | "ByLevel" => (
                    json =>
                      json
                      |> field("value", TranslationMap.decode)
                      |> TranslationMap.getFromLanguageOrder(langs)
                      |> Ley_Option.fromOption(Chars.mdash)
                      |> (str => ReplaceWith(str))
                  )
                | str =>
                  raise(DecodeError("Unknown display option type: " ++ str)),
              ),
         )
      |> Ley_Option.fromOption(Generate)
    );
};

let decodeSingle = (langs, decoder, wrap, json) =>
  Json.Decode.(
    wrap(
      json |> field("value", decoder),
      json |> DisplayOption.decode(langs),
    )
  );

module Profession = {
  type t =
    | Sex(Sex.t, DisplayOption.t)
    | Race(Race.t, DisplayOption.t)
    | Culture(Culture.t, DisplayOption.t)
    | Activatable(Activatable.t, DisplayOption.t)
    | Increasable(Increasable.t, DisplayOption.t);

  type all = list(t);

  let decode = langs =>
    All.decode(
      Json.Decode.(
        field("type", string)
        |> andThen(
             fun
             | "Sex" => decodeSingle(langs, Sex.decode, (v, d) => Sex(v, d))
             | "Race" =>
               decodeSingle(langs, Race.decode, (v, d) => Race(v, d))
             | "Culture" =>
               decodeSingle(langs, Culture.decode, (v, d) => Culture(v, d))
             | "Activatable" =>
               decodeSingle(langs, Activatable.decode, (v, d) =>
                 Activatable(v, d)
               )
             | "Increasable" =>
               decodeSingle(langs, Increasable.decode, (v, d) =>
                 Increasable(v, d)
               )
             | str =>
               raise(DecodeError("Unknown prerequisite type: " ++ str)),
           )
      ),
    );
};

module AdvantageDisadvantage = {
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

  let decode = langs =>
    All.decode(
      Json.Decode.(
        field("type", string)
        |> andThen(
             fun
             | "CommonSuggestedByRCP" => (_ => CommonSuggestedByRCP)
             | "Sex" => decodeSingle(langs, Sex.decode, (v, d) => Sex(v, d))
             | "Race" =>
               decodeSingle(langs, Race.decode, (v, d) => Race(v, d))
             | "Culture" =>
               decodeSingle(langs, Culture.decode, (v, d) => Culture(v, d))
             | "Pact" =>
               decodeSingle(langs, Pact.decode, (v, d) => Pact(v, d))
             | "SocialStatus" =>
               decodeSingle(langs, SocialStatus.decode, (v, d) =>
                 SocialStatus(v, d)
               )
             | "PrimaryAttribute" =>
               decodeSingle(langs, PrimaryAttribute.decode, (v, d) =>
                 PrimaryAttribute(v, d)
               )
             | "Activatable" =>
               decodeSingle(langs, Activatable.decode, (v, d) =>
                 Activatable(v, d)
               )
             | "ActivatableMultiEntry" =>
               decodeSingle(langs, ActivatableMultiEntry.decode, (v, d) =>
                 ActivatableMultiEntry(v, d)
               )
             | "ActivatableMultiSelect" =>
               decodeSingle(langs, ActivatableMultiSelect.decode, (v, d) =>
                 ActivatableMultiSelect(v, d)
               )
             | "Increasable" =>
               decodeSingle(langs, Increasable.decode, (v, d) =>
                 Increasable(v, d)
               )
             | "IncreasableMultiEntry" =>
               decodeSingle(langs, IncreasableMultiEntry.decode, (v, d) =>
                 IncreasableMultiEntry(v, d)
               )
             | str =>
               raise(DecodeError("Unknown prerequisite type: " ++ str)),
           )
      ),
    );
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

let decode = langs =>
  All.decode(
    Json.Decode.(
      field("type", string)
      |> andThen(
           fun
           | "Sex" => decodeSingle(langs, Sex.decode, (v, d) => Sex(v, d))
           | "Race" => decodeSingle(langs, Race.decode, (v, d) => Race(v, d))
           | "Culture" =>
             decodeSingle(langs, Culture.decode, (v, d) => Culture(v, d))
           | "Pact" => decodeSingle(langs, Pact.decode, (v, d) => Pact(v, d))
           | "SocialStatus" =>
             decodeSingle(langs, SocialStatus.decode, (v, d) =>
               SocialStatus(v, d)
             )
           | "PrimaryAttribute" =>
             decodeSingle(langs, PrimaryAttribute.decode, (v, d) =>
               PrimaryAttribute(v, d)
             )
           | "Activatable" =>
             decodeSingle(langs, Activatable.decode, (v, d) =>
               Activatable(v, d)
             )
           | "ActivatableMultiEntry" =>
             decodeSingle(langs, ActivatableMultiEntry.decode, (v, d) =>
               ActivatableMultiEntry(v, d)
             )
           | "ActivatableMultiSelect" =>
             decodeSingle(langs, ActivatableMultiSelect.decode, (v, d) =>
               ActivatableMultiSelect(v, d)
             )
           | "Increasable" =>
             decodeSingle(langs, Increasable.decode, (v, d) =>
               Increasable(v, d)
             )
           | "IncreasableMultiEntry" =>
             decodeSingle(langs, IncreasableMultiEntry.decode, (v, d) =>
               IncreasableMultiEntry(v, d)
             )
           | str => raise(DecodeError("Unknown prerequisite type: " ++ str)),
         )
    ),
  );
