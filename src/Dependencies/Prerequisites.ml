module Sex = struct
  type t = Sex.prerequisite

  module Decode = struct
    let t = Sex.Decode.prerequisite
  end
end

module Race = struct
  type t = { id : int NonEmptyList.t; active : bool }

  module Decode = struct
    open Json.Decode

    let t =
      oneOf
        [
          (fun json ->
            { id = json |> NonEmptyList.Decode.one_or_many int; active = true });
          (fun json ->
            {
              id = json |> field "races" (NonEmptyList.Decode.one_or_many int);
              active = json |> field "active" bool;
            });
        ]
  end
end

module Culture = struct
  type t = int NonEmptyList.t

  module Decode = struct
    open Json.Decode

    let t = NonEmptyList.Decode.one_or_many int
  end
end

module PrimaryAttribute = struct
  type t = Magical of int | Blessed of int

  module Decode = struct
    open Json.Decode

    let t =
      field "type" string
      |> andThen (function
           | "Blessed" -> field "value" int |> map (fun value -> Blessed value)
           | "Magical" -> field "value" int |> map (fun value -> Magical value)
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"PrimaryAtribute"
                 ~invalid:str)
  end
end

module Pact = struct
  type t = {
    category : int;
    domain : int NonEmptyList.t option;
    level : int option;
  }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    let t json =
      {
        category = json |> field "category" int;
        domain =
          json |> optionalField "domain" (NonEmptyList.Decode.one_or_many int);
        level = json |> optionalField "level" int;
      }
  end
end

module SocialStatus = struct
  type t = int

  module Decode = struct
    let t = Json.Decode.int
  end
end

module State = struct
  type t = int NonEmptyList.t

  module Decode = struct
    open Json.Decode

    let t = NonEmptyList.Decode.one_or_many int
  end
end

module Rule = struct
  type t = IdGroup.ExtensionRule.t

  module Decode = struct
    let t = IdGroup.ExtensionRule.Decode.t
  end
end

module Publication = struct
  type t = int

  module Decode = struct
    let t = Json.Decode.int
  end
end

module Activatable = struct
  module AnyOf = struct
    module Select = struct
      type t = {
        id : IdGroup.Activatable.t;
        active : bool;
        firstOption : IdGroup.SelectOption.t NonEmptyList.t;
        otherOptions : IdGroup.SelectOption.t list;
        level : int option;
      }

      module Decode = struct
        open Json.Decode
        open JsonStrict

        let t json =
          {
            id = json |> field "id" IdGroup.Activatable.Decode.t;
            active = json |> field "active" bool;
            firstOption =
              json
              |> field "firstOption"
                   (NonEmptyList.Decode.t IdGroup.SelectOption.Decode.t);
            otherOptions =
              json
              |> optionalField "otherOptions"
                   (list IdGroup.SelectOption.Decode.t)
              |> Option.fromOption [];
            level = json |> optionalField "level" int;
          }
      end
    end

    type t = {
      id : IdGroup.Activatable.Many.t;
      active : bool;
      options : IdGroup.SelectOption.t list;
      level : int option;
    }

    module Decode = struct
      open Json.Decode
      open JsonStrict

      let t json =
        {
          id = json |> field "id" IdGroup.Activatable.Many.Decode.t;
          active = json |> field "active" bool;
          options =
            json
            |> optionalField "options" (list IdGroup.SelectOption.Decode.t)
            |> Option.fromOption [];
          level = json |> optionalField "level" int;
        }
    end
  end

  type t = {
    id : IdGroup.Activatable.t;
    active : bool;
    options : IdGroup.SelectOption.t list;
    level : int option;
  }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    let t json =
      {
        id = json |> field "id" IdGroup.Activatable.Decode.t;
        active = json |> field "active" bool;
        options =
          json
          |> optionalField "options" (list IdGroup.SelectOption.Decode.t)
          |> Option.fromOption [];
        level = json |> optionalField "level" int;
      }
  end
end

module Rated = struct
  module AnyOf = struct
    type t = { id : IdGroup.Rated.Many.t; value : int }

    module Decode = struct
      let t json =
        Json.Decode.
          {
            id = json |> field "id" IdGroup.Rated.Many.Decode.t;
            value = json |> field "value" int;
          }
    end
  end

  type t = { id : IdGroup.Rated.t; value : int }

  module Decode = struct
    let t json =
      Json.Decode.
        {
          id = json |> field "id" IdGroup.Rated.Decode.t;
          value = json |> field "value" int;
        }
  end
end

module DisplayOption = struct
  type t = Generate | Hide | ReplaceWith of string

  module Decode = struct
    open Json.Decode

    type translation = string

    let translation = string

    type multilingual =
      | MultilingualGenerate
      | MultilingualHide
      | MultilingualReplaceWith of translation TranslationMap.t

    let multilingual =
      field "type" string
      |> andThen (function
           | "Hide" -> fun _ -> MultilingualHide
           | "ReplaceWith" ->
               field "value" (TranslationMap.Decode.t translation)
               |> map (fun mp -> MultilingualReplaceWith mp)
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"DisplayOption"
                 ~invalid:str)

    let make locale_order json =
      json |> multilingual |> fun multilingual ->
      match multilingual with
      | MultilingualGenerate -> Generate
      | MultilingualHide -> Hide
      | MultilingualReplaceWith mp ->
          mp
          |> TranslationMap.preferred locale_order
          |> Option.fromOption Chars.mdash
          |> fun str -> ReplaceWith str
  end
end

module When = struct
  type t = Publication of Publication.t

  module Decode = struct
    open Json.Decode

    let t =
      field "type" string
      |> andThen (function
           | "Publication" ->
               field "value" Publication.Decode.t
               |> map (fun x -> Publication x)
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"When"
                 ~invalid:str)
  end
end

module Config = struct
  type 'a t = {
    value : 'a;
    displayOption : DisplayOption.t;
    when_ : When.t list;
  }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    type 'a multilingual = {
      value : 'a;
      displayOption : DisplayOption.t option;
      when_ : When.t NonEmptyList.t option;
    }

    let multilingual locale_order decoder (wrap : 'a -> 'b) json =
      ( {
          value = json |> field "value" decoder |> wrap;
          displayOption =
            json
            |> optionalField "displayOption"
                 (DisplayOption.Decode.make locale_order);
          when_ =
            json |> optionalField "when" (NonEmptyList.Decode.t When.Decode.t);
        }
        : 'b multilingual )

    let make locale_order decoder (wrap : 'a -> 'b) json =
      json |> multilingual locale_order decoder wrap |> fun multilingual ->
      ( {
          value = multilingual.value;
          displayOption =
            multilingual.displayOption
            |> Option.fromOption DisplayOption.Generate;
          when_ = multilingual.when_ |> Option.option [] NonEmptyList.to_list;
        }
        : 'b t )
  end
end

module Unified = struct
  type value =
    | CommonSuggestedByRCP
    | Sex of Sex.t
    | Race of Race.t
    | Culture of Culture.t
    | Pact of Pact.t
    | SocialStatus of SocialStatus.t
    | PrimaryAttribute of PrimaryAttribute.t
    | State of State.t
    | Rule of Rule.t
    | Activatable of Activatable.t
    | ActivatableAnyOf of Activatable.AnyOf.t
    | ActivatableAnyOfSelect of Activatable.AnyOf.Select.t
    | Rated of Rated.t
    | RatedAnyOf of Rated.AnyOf.t
    | Other

  type t = value Config.t
end

module General = struct
  type value =
    | Sex of Sex.t
    | Race of Race.t
    | Culture of Culture.t
    | Pact of Pact.t
    | SocialStatus of SocialStatus.t
    | PrimaryAttribute of PrimaryAttribute.t
    | State of State.t
    | Rule of Rule.t
    | Activatable of Activatable.t
    | ActivatableAnyOf of Activatable.AnyOf.t
    | ActivatableAnyOfSelect of Activatable.AnyOf.Select.t
    | Rated of Rated.t
    | RatedAnyOf of Rated.AnyOf.t

  type t = value Config.t

  let unify (x : t) : Unified.t =
    {
      x with
      value =
        ( match x.value with
        | Sex x -> Sex x
        | Race x -> Race x
        | Culture x -> Culture x
        | Pact x -> Pact x
        | SocialStatus x -> SocialStatus x
        | PrimaryAttribute x -> PrimaryAttribute x
        | State x -> State x
        | Rule x -> Rule x
        | Activatable x -> Activatable x
        | ActivatableAnyOf x -> ActivatableAnyOf x
        | ActivatableAnyOfSelect x -> ActivatableAnyOfSelect x
        | Rated x -> Rated x
        | RatedAnyOf x -> RatedAnyOf x );
    }

  module Decode = struct
    open Json.Decode

    let make locale_order =
      field "type" string
      |> andThen (function
           | "Sex" ->
               Config.Decode.make locale_order Sex.Decode.t (fun v -> Sex v)
           | "Race" ->
               Config.Decode.make locale_order Race.Decode.t (fun v -> Race v)
           | "Culture" ->
               Config.Decode.make locale_order Culture.Decode.t (fun v ->
                   Culture v)
           | "Pact" ->
               Config.Decode.make locale_order Pact.Decode.t (fun v -> Pact v)
           | "SocialStatus" ->
               Config.Decode.make locale_order SocialStatus.Decode.t (fun v ->
                   SocialStatus v)
           | "PrimaryAttribute" ->
               Config.Decode.make locale_order PrimaryAttribute.Decode.t
                 (fun v -> PrimaryAttribute v)
           | "State" ->
               Config.Decode.make locale_order State.Decode.t (fun v -> State v)
           | "Rule" ->
               Config.Decode.make locale_order Rule.Decode.t (fun v -> Rule v)
           | "Activatable" ->
               Config.Decode.make locale_order Activatable.Decode.t (fun v ->
                   Activatable v)
           | "ActivatableMultiEntry" ->
               Config.Decode.make locale_order Activatable.AnyOf.Decode.t
                 (fun v -> ActivatableAnyOf v)
           | "ActivatableMultiSelect" ->
               Config.Decode.make locale_order Activatable.AnyOf.Select.Decode.t
                 (fun v -> ActivatableAnyOfSelect v)
           | "Increasable" ->
               Config.Decode.make locale_order Rated.Decode.t (fun v -> Rated v)
           | "IncreasableMultiEntry" ->
               Config.Decode.make locale_order Rated.AnyOf.Decode.t (fun v ->
                   RatedAnyOf v)
           | str ->
               JsonStatic.raise_unknown_variant
                 ~variant_name:"Prerequisite.General" ~invalid:str)
  end
end

module Profession = struct
  type value =
    | Sex of Sex.t
    | Race of Race.t
    | Culture of Culture.t
    | Activatable of Activatable.t
    | Rated of Rated.t

  type t = value Config.t

  let unify (x : t) : Unified.t =
    {
      x with
      value =
        ( match x.value with
        | Sex x -> Sex x
        | Race x -> Race x
        | Culture x -> Culture x
        | Activatable x -> Activatable x
        | Rated x -> Rated x );
    }

  module Decode = struct
    open Json.Decode

    let make locale_order =
      field "type" string
      |> andThen (function
           | "Sex" ->
               Config.Decode.make locale_order Sex.Decode.t (fun v -> Sex v)
           | "Race" ->
               Config.Decode.make locale_order Race.Decode.t (fun v -> Race v)
           | "Culture" ->
               Config.Decode.make locale_order Culture.Decode.t (fun v ->
                   Culture v)
           | "Activatable" ->
               Config.Decode.make locale_order Activatable.Decode.t (fun v ->
                   Activatable v)
           | "Increasable" ->
               Config.Decode.make locale_order Rated.Decode.t (fun v -> Rated v)
           | str ->
               JsonStatic.raise_unknown_variant
                 ~variant_name:"Prerequisite.Profession" ~invalid:str)
  end
end

module AdvantageDisadvantage = struct
  type value =
    | CommonSuggestedByRCP
    | Sex of Sex.t
    | Race of Race.t
    | Culture of Culture.t
    | Pact of Pact.t
    | SocialStatus of SocialStatus.t
    | PrimaryAttribute of PrimaryAttribute.t
    | State of State.t
    | Rule of Rule.t
    | Activatable of Activatable.t
    | ActivatableAnyOf of Activatable.AnyOf.t
    | ActivatableAnyOfSelect of Activatable.AnyOf.Select.t
    | Rated of Rated.t
    | RatedAnyOf of Rated.AnyOf.t

  type t = value Config.t

  let unify (x : t) : Unified.t =
    {
      x with
      value =
        ( match x.value with
        | CommonSuggestedByRCP -> CommonSuggestedByRCP
        | Sex x -> Sex x
        | Race x -> Race x
        | Culture x -> Culture x
        | Pact x -> Pact x
        | SocialStatus x -> SocialStatus x
        | PrimaryAttribute x -> PrimaryAttribute x
        | State x -> State x
        | Rule x -> Rule x
        | Activatable x -> Activatable x
        | ActivatableAnyOf x -> ActivatableAnyOf x
        | ActivatableAnyOfSelect x -> ActivatableAnyOfSelect x
        | Rated x -> Rated x
        | RatedAnyOf x -> RatedAnyOf x );
    }

  module Decode = struct
    open Json.Decode

    let make locale_order =
      field "type" string
      |> andThen (function
           | "CommonSuggestedByRCP" ->
               fun _ ->
                 ( {
                     value = CommonSuggestedByRCP;
                     displayOption = Generate;
                     when_ = [];
                   }
                   : t )
           | "Sex" ->
               Config.Decode.make locale_order Sex.Decode.t (fun v -> Sex v)
           | "Race" ->
               Config.Decode.make locale_order Race.Decode.t (fun v -> Race v)
           | "Culture" ->
               Config.Decode.make locale_order Culture.Decode.t (fun v ->
                   Culture v)
           | "Pact" ->
               Config.Decode.make locale_order Pact.Decode.t (fun v -> Pact v)
           | "SocialStatus" ->
               Config.Decode.make locale_order SocialStatus.Decode.t (fun v ->
                   SocialStatus v)
           | "PrimaryAttribute" ->
               Config.Decode.make locale_order PrimaryAttribute.Decode.t
                 (fun v -> PrimaryAttribute v)
           | "State" ->
               Config.Decode.make locale_order State.Decode.t (fun v -> State v)
           | "Rule" ->
               Config.Decode.make locale_order Rule.Decode.t (fun v -> Rule v)
           | "Activatable" ->
               Config.Decode.make locale_order Activatable.Decode.t (fun v ->
                   Activatable v)
           | "ActivatableMultiEntry" ->
               Config.Decode.make locale_order Activatable.AnyOf.Decode.t
                 (fun v -> ActivatableAnyOf v)
           | "ActivatableMultiSelect" ->
               Config.Decode.make locale_order Activatable.AnyOf.Select.Decode.t
                 (fun v -> ActivatableAnyOfSelect v)
           | "Increasable" ->
               Config.Decode.make locale_order Rated.Decode.t (fun v -> Rated v)
           | "IncreasableMultiEntry" ->
               Config.Decode.make locale_order Rated.AnyOf.Decode.t (fun v ->
                   RatedAnyOf v)
           | str ->
               JsonStatic.raise_unknown_variant
                 ~variant_name:"Prerequisite.AdvantageDisadvantage" ~invalid:str)
  end
end

module ArcaneTradition = struct
  type value = Sex of Sex.t | Culture of Culture.t

  type t = value Config.t

  let unify (x : t) : Unified.t =
    {
      x with
      value = (match x.value with Sex x -> Sex x | Culture x -> Culture x);
    }

  module Decode = struct
    open Json.Decode

    let make locale_order =
      field "type" string
      |> andThen (function
           | "Sex" ->
               Config.Decode.make locale_order Sex.Decode.t (fun v -> Sex v)
           | "Culture" ->
               Config.Decode.make locale_order Culture.Decode.t (fun v ->
                   Culture v)
           | str ->
               JsonStatic.raise_unknown_variant
                 ~variant_name:"Prerequisite.ArcaneTradition" ~invalid:str)
  end
end

module PersonalityTrait = struct
  type value = Culture of Culture.t | Special

  type t = value Config.t

  let unify (x : t) : Unified.t =
    {
      x with
      value = (match x.value with Special -> Other | Culture x -> Culture x);
    }

  module Decode = struct
    open Json.Decode

    let make locale_order =
      field "type" string
      |> andThen (function
           | "Special" ->
               Config.Decode.make locale_order Function.id
                 (Function.const Special)
           | "Culture" ->
               Config.Decode.make locale_order Culture.Decode.t (fun v ->
                   Culture v)
           | str ->
               JsonStatic.raise_unknown_variant
                 ~variant_name:"Prerequisite.PersonalityTrait" ~invalid:str)
  end
end

module Spellwork = struct
  type value = Rule of Rule.t | Rated of Rated.t

  type t = value Config.t

  let unify (x : t) : Unified.t =
    {
      x with
      value = (match x.value with Rule x -> Rule x | Rated x -> Rated x);
    }

  module Decode = struct
    open Json.Decode

    let make locale_order =
      field "type" string
      |> andThen (function
           | "Rule" ->
               Config.Decode.make locale_order Rule.Decode.t (fun v -> Rule v)
           | "Culture" ->
               Config.Decode.make locale_order Rated.Decode.t (fun v -> Rated v)
           | str ->
               JsonStatic.raise_unknown_variant
                 ~variant_name:"Prerequisite.Spellwork" ~invalid:str)
  end
end

module Liturgy = struct
  type value = Rule of Rule.t

  type t = value Config.t

  let unify (x : t) : Unified.t =
    { x with value = (match x.value with Rule x -> Rule x) }

  module Decode = struct
    open Json.Decode

    let make locale_order =
      field "type" string
      |> andThen (function
           | "Rule" ->
               Config.Decode.make locale_order Rule.Decode.t (fun v -> Rule v)
           | str ->
               JsonStatic.raise_unknown_variant
                 ~variant_name:"Prerequisite.Liturgy" ~invalid:str)
  end
end
