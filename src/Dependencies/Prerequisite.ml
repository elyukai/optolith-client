module Sex = struct
  type t = Male | Female

  let matches (sex : Sex.t) (prerequisite : t) =
    match (prerequisite, sex) with
    | Male, Male | Female, Female -> true
    | Male, Female | Female, Male -> false
    | Male, BalThani { as_male = as_sex; _ }
    | Male, Tsajana { as_male = as_sex; _ }
    | Male, Custom { binary_handling = { as_male = as_sex; _ }; _ }
    | Female, BalThani { as_female = as_sex; _ }
    | Female, Tsajana { as_female = as_sex; _ }
    | Female, Custom { binary_handling = { as_female = as_sex; _ }; _ } ->
        as_sex

  module Decode = struct
    open Json.Decode

    let t =
      string
      |> map (function
           | "Male" -> (Male : t)
           | "Female" -> Female
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"Sex" ~invalid:str)
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

module Influence = struct
  type t = { id : int; active : bool }

  module Decode = struct
    open Json.Decode

    let t json =
      { id = json |> field "id" int; active = json |> field "active" bool }
  end
end

module Activatable = struct
  module AnyOf = struct
    module Select = struct
      type t = {
        id : IdGroup.Activatable.t;
        active : bool;
        first_option : IdGroup.SelectOption.t NonEmptyList.t;
        other_options : IdGroup.SelectOption.t list;
        level : int option;
      }

      module Decode = struct
        open Json.Decode
        open JsonStrict

        let t json =
          {
            id = json |> field "id" IdGroup.Activatable.Decode.t;
            active = json |> field "active" bool;
            first_option =
              json
              |> field "firstOption"
                   (NonEmptyList.Decode.t IdGroup.SelectOption.Decode.t);
            other_options =
              json
              |> optionalField "otherOptions"
                   (list IdGroup.SelectOption.Decode.t)
              |> Option.value ~default:[];
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
            |> Option.value ~default:[];
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
          |> Option.value ~default:[];
        level = json |> optionalField "level" int;
      }
  end
end

module Rated = struct
  module AnyOf = struct
    type t = { id : IdGroup.Rated.Many.t; value : int }

    module Decode = struct
      open Json.Decode

      let t json =
        {
          id = json |> field "id" IdGroup.Rated.Many.Decode.t;
          value = json |> field "value" int;
        }
    end
  end

  type t = { id : IdGroup.Rated.t; value : int }

  module Decode = struct
    open Json.Decode

    let t json =
      {
        id = json |> field "id" IdGroup.Rated.Decode.t;
        value = json |> field "value" int;
      }
  end
end

module AnimistPower = struct
  type t = { id : IdGroup.AnimistPower.t; level : int option; value : int }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    let t json =
      {
        id = json |> field "id" IdGroup.AnimistPower.Decode.t;
        level = json |> optionalField "level" int;
        value = json |> field "value" int;
      }
  end
end

module Enhancement = struct
  type t = int

  module Decode = struct
    let t = Json.Decode.int
  end
end

module DisplayMode = struct
  type t = Generate | Hide | ReplaceWith of string

  module Decode = struct
    open Json.Decode

    type translation = string

    let translation = string

    type multilingual =
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
               JsonStatic.raise_unknown_variant ~variant_name:"DisplayMode"
                 ~invalid:str)

    let make locale_order json =
      json |> multilingual
      |> fun multilingual ->
      match multilingual with
      | MultilingualHide -> Hide
      | MultilingualReplaceWith mp ->
          mp
          |> TranslationMap.preferred locale_order
          |> Option.value ~default:Chars.mdash
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
  type 'a t = { value : 'a; displayMode : DisplayMode.t; when_ : When.t list }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    type 'a multilingual = {
      value : 'a;
      displayOption : DisplayMode.t option;
      when_ : When.t NonEmptyList.t option;
    }

    let multilingual locale_order decoder (wrap : 'a -> 'b) json :
        'b multilingual =
      {
        value = json |> field "value" decoder |> wrap;
        displayOption =
          json
          |> optionalField "displayOption"
               (DisplayMode.Decode.make locale_order);
        when_ =
          json |> optionalField "when" (NonEmptyList.Decode.t When.Decode.t);
      }

    let make locale_order decoder (wrap : 'a -> 'b) json =
      json
      |> multilingual locale_order decoder wrap
      |> fun multilingual : 'b t ->
      {
        value = multilingual.value;
        displayMode =
          multilingual.displayOption
          |> Option.value ~default:DisplayMode.Generate;
        when_ =
          multilingual.when_ |> Option.fold ~none:[] ~some:NonEmptyList.to_list;
      }
  end
end

module Group = struct
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
      | Influence of Influence.t
      | Activatable of Activatable.t
      | ActivatableAnyOf of Activatable.AnyOf.t
      | ActivatableAnyOfSelect of Activatable.AnyOf.Select.t
      | Rated of Rated.t
      | RatedAnyOf of Rated.AnyOf.t
      | AnimistPower of AnimistPower.t
      | Other

    type t = value Config.t
  end

  module SpecialAbility = struct
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
          (match x.value with
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
          | RatedAnyOf x -> RatedAnyOf x);
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
                 Config.Decode.make locale_order State.Decode.t (fun v ->
                     State v)
             | "Rule" ->
                 Config.Decode.make locale_order Rule.Decode.t (fun v -> Rule v)
             | "Activatable" ->
                 Config.Decode.make locale_order Activatable.Decode.t (fun v ->
                     Activatable v)
             | "ActivatableMultiEntry" ->
                 Config.Decode.make locale_order Activatable.AnyOf.Decode.t
                   (fun v -> ActivatableAnyOf v)
             | "ActivatableMultiSelect" ->
                 Config.Decode.make locale_order
                   Activatable.AnyOf.Select.Decode.t (fun v ->
                     ActivatableAnyOfSelect v)
             | "Increasable" ->
                 Config.Decode.make locale_order Rated.Decode.t (fun v ->
                     Rated v)
             | "IncreasableMultiEntry" ->
                 Config.Decode.make locale_order Rated.AnyOf.Decode.t (fun v ->
                     RatedAnyOf v)
             | str ->
                 JsonStatic.raise_unknown_variant
                   ~variant_name:"Prerequisite.Group.General" ~invalid:str)
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
          (match x.value with
          | Sex x -> Sex x
          | Race x -> Race x
          | Culture x -> Culture x
          | Activatable x -> Activatable x
          | Rated x -> Rated x);
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
                 Config.Decode.make locale_order Rated.Decode.t (fun v ->
                     Rated v)
             | str ->
                 JsonStatic.raise_unknown_variant
                   ~variant_name:"Prerequisite.Group.Profession" ~invalid:str)
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
          (match x.value with
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
          | RatedAnyOf x -> RatedAnyOf x);
      }

    module Decode = struct
      open Json.Decode

      let make locale_order =
        field "type" string
        |> andThen (function
             | "CommonSuggestedByRCP" ->
                 fun _ : t ->
                   {
                     value = CommonSuggestedByRCP;
                     displayMode = Generate;
                     when_ = [];
                   }
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
                 Config.Decode.make locale_order State.Decode.t (fun v ->
                     State v)
             | "Rule" ->
                 Config.Decode.make locale_order Rule.Decode.t (fun v -> Rule v)
             | "Activatable" ->
                 Config.Decode.make locale_order Activatable.Decode.t (fun v ->
                     Activatable v)
             | "ActivatableMultiEntry" ->
                 Config.Decode.make locale_order Activatable.AnyOf.Decode.t
                   (fun v -> ActivatableAnyOf v)
             | "ActivatableMultiSelect" ->
                 Config.Decode.make locale_order
                   Activatable.AnyOf.Select.Decode.t (fun v ->
                     ActivatableAnyOfSelect v)
             | "Increasable" ->
                 Config.Decode.make locale_order Rated.Decode.t (fun v ->
                     Rated v)
             | "IncreasableMultiEntry" ->
                 Config.Decode.make locale_order Rated.AnyOf.Decode.t (fun v ->
                     RatedAnyOf v)
             | str ->
                 JsonStatic.raise_unknown_variant
                   ~variant_name:"Prerequisite.Group.AdvantageDisadvantage"
                   ~invalid:str)
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
                   ~variant_name:"Prerequisite.Group.ArcaneTradition"
                   ~invalid:str)
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
                   ~variant_name:"Prerequisite.Group.PersonalityTrait"
                   ~invalid:str)
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
                 Config.Decode.make locale_order Rated.Decode.t (fun v ->
                     Rated v)
             | str ->
                 JsonStatic.raise_unknown_variant
                   ~variant_name:"Prerequisite.Group.Spellwork" ~invalid:str)
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
                   ~variant_name:"Prerequisite.Group.Liturgy" ~invalid:str)
    end
  end

  module Influence = struct
    type value = Influence of Influence.t | Special

    type t = value Config.t

    let unify (x : t) : Unified.t =
      {
        x with
        value =
          (match x.value with Special -> Other | Influence x -> Influence x);
      }

    module Decode = struct
      open Json.Decode

      let make locale_order =
        field "type" string
        |> andThen (function
             | "Special" ->
                 Config.Decode.make locale_order Function.id
                   (Function.const Special)
             | "Influence" ->
                 Config.Decode.make locale_order Influence.Decode.t (fun v ->
                     Influence v)
             | str ->
                 JsonStatic.raise_unknown_variant
                   ~variant_name:"Prerequisite.Group.Influence" ~invalid:str)
    end
  end

  module Language = struct
    type value = Race of Race.t | Activatable of Activatable.t

    type t = value Config.t

    let unify (x : t) : Unified.t =
      {
        x with
        value =
          (match x.value with
          | Race x -> Race x
          | Activatable x -> Activatable x);
      }

    module Decode = struct
      open Json.Decode

      let make locale_order =
        field "type" string
        |> andThen (function
             | "Race" ->
                 Config.Decode.make locale_order Race.Decode.t (fun v -> Race v)
             | "Activatable" ->
                 Config.Decode.make locale_order Activatable.Decode.t (fun v ->
                     Activatable v)
             | str ->
                 JsonStatic.raise_unknown_variant
                   ~variant_name:"Prerequisite.Group.Language" ~invalid:str)
    end
  end

  module AnimistPower = struct
    type value = AnimistPower of AnimistPower.t

    type t = value Config.t

    let unify (x : t) : Unified.t =
      { x with value = (match x.value with AnimistPower x -> AnimistPower x) }

    module Decode = struct
      open Json.Decode

      let make locale_order =
        field "type" string
        |> andThen (function
             | "AnimistPower" ->
                 Config.Decode.make locale_order AnimistPower.Decode.t (fun v ->
                     AnimistPower v)
             | str ->
                 JsonStatic.raise_unknown_variant
                   ~variant_name:"Prerequisite.Group.AnimistPower" ~invalid:str)
    end
  end

  module Enhancement = struct
    type t = Enhancement of Enhancement.t

    module Decode = struct
      open Json.Decode

      let make _ =
        field "type" string
        |> andThen (function
             | "Enhancement" ->
                 Enhancement.Decode.t |> map (fun v -> Enhancement v)
             | str ->
                 JsonStatic.raise_unknown_variant
                   ~variant_name:"Prerequisite.Group.Enhancement" ~invalid:str)
    end
  end
end

module Collection = struct
  module Plain = struct
    type 'a t = 'a list

    module Decode = struct
      open Json.Decode

      let make decoder =
        field "type" string
        |> andThen (function
             | "Plain" -> field "value" (list decoder)
             | str ->
                 JsonStatic.raise_unknown_variant
                   ~variant_name:"Prerequisite.Collection.Plain" ~invalid:str)
    end
  end

  module ByLevel = struct
    type 'a t = Plain of 'a Plain.t | ByLevel of 'a Plain.t IntMap.t
    [@@bs.deriving accessors]

    let first_level = function
      | Plain xs -> xs
      | ByLevel mp -> mp |> IntMap.lookup 1 |> Option.value ~default:[]

    let concat_range ~old_level ~new_level prerequisites =
      let range_pred =
        match (old_level, new_level) with
        (* Used for changing level *)
        | Some old_level, Some new_level ->
            let min, max = Int.minmax old_level new_level in
            Ix.inRange (min + 1, max)
        (* Used for deactivating an entry *)
        | Some level, None
        (* Used for activating an entry *)
        | None, Some level ->
            ( >= ) level
        | None, None -> Function.const true
      in
      match prerequisites with
      | Plain xs -> if range_pred 1 then xs else []
      | ByLevel mp ->
          mp |> IntMap.filterWithKey (fun k _ -> range_pred k) |> IntMap.concat

    module Decode = struct
      open Json.Decode

      let make decoder =
        field "type" string
        |> andThen (function
             | "Plain" -> field "value" (list decoder) |> map plain
             | "ByLevel" ->
                 let level json =
                   ( json |> field "level" int,
                     json |> field "prerequisites" (list decoder) )
                 in
                 field "value" (list level)
                 |> map IntMap.fromList |> map byLevel
             | str ->
                 JsonStatic.raise_unknown_variant
                   ~variant_name:"Prerequisite.Collection.Plain" ~invalid:str)
    end
  end

  module Make (Wrapper : sig
    type 'a t

    module Decode : sig
      val make : 'a Json.Decode.decoder -> 'a t Json.Decode.decoder
    end
  end) (Main : sig
    type t

    module Decode : sig
      val make : Locale.Order.t -> t Json.Decode.decoder
    end
  end) =
  struct
    type t = Main.t Wrapper.t

    module Decode = struct
      let make locale_order =
        Wrapper.Decode.make (Main.Decode.make locale_order)
    end
  end

  module SpecialAbility = Make (ByLevel) (Group.SpecialAbility)
  module Profession = Make (Plain) (Group.Profession)
  module AdvantageDisadvantage = Make (ByLevel) (Group.AdvantageDisadvantage)
  module ArcaneTradition = Make (Plain) (Group.ArcaneTradition)
  module PersonalityTrait = Make (Plain) (Group.PersonalityTrait)
  module Spellwork = Make (Plain) (Group.Spellwork)
  module Liturgy = Make (Plain) (Group.Liturgy)
  module Influence = Make (Plain) (Group.Influence)
  module Language = Make (Plain) (Group.Language)
  module AnimistPower = Make (Plain) (Group.AnimistPower)
  module Enhancement = Make (Plain) (Group.Enhancement)
end
