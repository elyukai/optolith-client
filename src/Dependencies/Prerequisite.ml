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
    open Decoders_bs.Decode

    let t =
      string
      >>= function
      | "Male" -> succeed Male
      | "Female" -> succeed Female
      | _ -> fail "Expected a binary sex"
  end
end

module Race = struct
  type t = { id : int NonEmptyList.t; active : bool }

  module Decode = struct
    open Decoders_bs.Decode

    let t =
      one_of
        [
          ( "Simple",
            NonEmptyList.Decode.one_or_many int
            >>= fun id -> succeed { id; active = true } );
          ( "Extended",
            field "races" (NonEmptyList.Decode.one_or_many int)
            >>= fun id ->
            field "active" bool >>= fun active -> succeed { id; active } );
        ]
  end
end

module Culture = struct
  type t = int NonEmptyList.t

  module Decode = struct
    open Decoders_bs.Decode

    let t = NonEmptyList.Decode.one_or_many int
  end
end

module PrimaryAttribute = struct
  type t = Magical of int | Blessed of int

  module Decode = struct
    open Decoders_bs.Decode

    let t =
      field "type" string
      >>= function
      | "Blessed" -> field "value" int >|= fun value -> Blessed value
      | "Magical" -> field "value" int >|= fun value -> Magical value
      | _ -> fail "Expected a primary attribute type"
  end
end

module Pact = struct
  type t = {
    category : int;
    domain : int NonEmptyList.t option;
    level : int option;
  }

  module Decode = struct
    open Decoders_bs.Decode

    let t =
      field "category" int
      >>= fun category ->
      field_opt "domain" (NonEmptyList.Decode.one_or_many int)
      >>= fun domain ->
      field_opt "level" int >>= fun level -> succeed { category; domain; level }
  end
end

module SocialStatus = struct
  type t = int

  module Decode = struct
    let t = Decoders_bs.Decode.int
  end
end

module State = struct
  type t = int NonEmptyList.t

  module Decode = struct
    open Decoders_bs.Decode

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
    let t = Decoders_bs.Decode.int
  end
end

module Influence = struct
  type t = { id : int; active : bool }

  module Decode = struct
    open Decoders_bs.Decode

    let t =
      field "id" int
      >>= fun id -> field "active" bool >>= fun active -> succeed { id; active }
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
        open Decoders_bs.Decode

        let t =
          field "id" IdGroup.Activatable.Decode.t
          >>= fun id ->
          field "active" bool
          >>= fun active ->
          field "firstOption"
            (NonEmptyList.Decode.t IdGroup.SelectOption.Decode.t)
          >>= fun first_option ->
          field_opt "otherOptions" (list IdGroup.SelectOption.Decode.t)
          >>= fun otherOptions ->
          field_opt "level" int
          >>= fun level ->
          succeed
            {
              id;
              active;
              first_option;
              other_options = Option.value ~default:[] otherOptions;
              level;
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
      open Decoders_bs.Decode

      let t =
        field "id" IdGroup.Activatable.Many.Decode.t
        >>= fun id ->
        field "active" bool
        >>= fun active ->
        field_opt "options" (list IdGroup.SelectOption.Decode.t)
        >>= fun options ->
        field_opt "level" int
        >>= fun level ->
        succeed
          { id; active; options = options |> Option.value ~default:[]; level }
    end
  end

  type t = {
    id : IdGroup.Activatable.t;
    active : bool;
    options : IdGroup.SelectOption.t list;
    level : int option;
  }

  module Decode = struct
    open Decoders_bs.Decode

    let t =
      field "id" IdGroup.Activatable.Decode.t
      >>= fun id ->
      field "active" bool
      >>= fun active ->
      field_opt "options" (list IdGroup.SelectOption.Decode.t)
      >>= fun options ->
      field_opt "level" int
      >>= fun level ->
      succeed
        { id; active; options = options |> Option.value ~default:[]; level }
  end
end

module Rated = struct
  module AnyOf = struct
    type t = { id : IdGroup.Rated.Many.t; value : int }

    module Decode = struct
      open Decoders_bs.Decode

      let t =
        field "id" IdGroup.Rated.Many.Decode.t
        >>= fun id -> field "value" int >>= fun value -> succeed { id; value }
    end
  end

  type t = { id : IdGroup.Rated.t; value : int }

  module Decode = struct
    open Decoders_bs.Decode

    let t =
      field "id" IdGroup.Rated.Decode.t
      >>= fun id -> field "value" int >>= fun value -> succeed { id; value }
  end
end

module AnimistPower = struct
  type t = { id : IdGroup.AnimistPower.t; level : int option; value : int }

  module Decode = struct
    open Decoders_bs.Decode

    let t =
      field "id" IdGroup.AnimistPower.Decode.t
      >>= fun id ->
      field_opt "level" int
      >>= fun level ->
      field "value" int >>= fun value -> succeed { id; level; value }
  end
end

module Enhancement = struct
  type t = int

  module Decode = struct
    let t = Decoders_bs.Decode.int
  end
end

module DisplayMode = struct
  type t = Generate | Hide | ReplaceWith of string

  module Decode = struct
    open Decoders_bs.Decode

    type translation = string

    let translation = string

    type multilingual =
      | MultilingualHide
      | MultilingualReplaceWith of translation TranslationMap.t

    let multilingual =
      field "type" string
      >>= function
      | "Hide" -> succeed MultilingualHide
      | "ReplaceWith" ->
          field "value" (TranslationMap.Decode.t translation)
          >|= fun mp -> MultilingualReplaceWith mp
      | _ -> fail "Expected a display mode"

    let make locale_order =
      multilingual
      >|= function
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
    open Decoders_bs.Decode

    let t =
      field "type" string
      >>= function
      | "Publication" ->
          field "value" Publication.Decode.t >|= fun x -> Publication x
      | _ -> fail "Expected a precondition prerequisite type"
  end
end

module Config = struct
  type 'a t = { value : 'a; displayMode : DisplayMode.t; when_ : When.t list }

  module Decode = struct
    open Decoders_bs.Decode

    type 'a multilingual = {
      value : 'a;
      displayOption : DisplayMode.t option;
      when_ : When.t NonEmptyList.t option;
    }

    let multilingual locale_order decoder wrap =
      field "value" decoder
      >>= fun value ->
      field_opt "displayOption" (DisplayMode.Decode.make locale_order)
      >>= fun displayOption ->
      field_opt "when" (NonEmptyList.Decode.t When.Decode.t)
      >>= fun when_ -> succeed { value = value |> wrap; displayOption; when_ }

    let make locale_order decoder wrap =
      multilingual locale_order decoder wrap
      >|= fun multilingual : 'b t ->
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
      open Decoders_bs.Decode

      let make locale_order =
        field "type" string
        >>= function
        | "Sex" -> Config.Decode.make locale_order Sex.Decode.t (fun v -> Sex v)
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
            Config.Decode.make locale_order PrimaryAttribute.Decode.t (fun v ->
                PrimaryAttribute v)
        | "State" ->
            Config.Decode.make locale_order State.Decode.t (fun v -> State v)
        | "Rule" ->
            Config.Decode.make locale_order Rule.Decode.t (fun v -> Rule v)
        | "Activatable" ->
            Config.Decode.make locale_order Activatable.Decode.t (fun v ->
                Activatable v)
        | "ActivatableMultiEntry" ->
            Config.Decode.make locale_order Activatable.AnyOf.Decode.t (fun v ->
                ActivatableAnyOf v)
        | "ActivatableMultiSelect" ->
            Config.Decode.make locale_order Activatable.AnyOf.Select.Decode.t
              (fun v -> ActivatableAnyOfSelect v)
        | "Increasable" ->
            Config.Decode.make locale_order Rated.Decode.t (fun v -> Rated v)
        | "IncreasableMultiEntry" ->
            Config.Decode.make locale_order Rated.AnyOf.Decode.t (fun v ->
                RatedAnyOf v)
        | _ -> fail "Expected special ability prerequisite type"
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
      open Decoders_bs.Decode

      let make locale_order =
        field "type" string
        >>= function
        | "Sex" -> Config.Decode.make locale_order Sex.Decode.t (fun v -> Sex v)
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
        | _ -> fail "Expected profession prerequisite type"
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
      open Decoders_bs.Decode

      let make locale_order =
        field "type" string
        >>= function
        | "CommonSuggestedByRCP" ->
            succeed
              ({
                 value = CommonSuggestedByRCP;
                 displayMode = Generate;
                 when_ = [];
               }
                : t)
        | "Sex" -> Config.Decode.make locale_order Sex.Decode.t (fun v -> Sex v)
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
            Config.Decode.make locale_order PrimaryAttribute.Decode.t (fun v ->
                PrimaryAttribute v)
        | "State" ->
            Config.Decode.make locale_order State.Decode.t (fun v -> State v)
        | "Rule" ->
            Config.Decode.make locale_order Rule.Decode.t (fun v -> Rule v)
        | "Activatable" ->
            Config.Decode.make locale_order Activatable.Decode.t (fun v ->
                Activatable v)
        | "ActivatableMultiEntry" ->
            Config.Decode.make locale_order Activatable.AnyOf.Decode.t (fun v ->
                ActivatableAnyOf v)
        | "ActivatableMultiSelect" ->
            Config.Decode.make locale_order Activatable.AnyOf.Select.Decode.t
              (fun v -> ActivatableAnyOfSelect v)
        | "Increasable" ->
            Config.Decode.make locale_order Rated.Decode.t (fun v -> Rated v)
        | "IncreasableMultiEntry" ->
            Config.Decode.make locale_order Rated.AnyOf.Decode.t (fun v ->
                RatedAnyOf v)
        | _ -> fail "Expected advantage/disadvantage prerequisite type"
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
      open Decoders_bs.Decode

      let make locale_order =
        field "type" string
        >>= function
        | "Sex" -> Config.Decode.make locale_order Sex.Decode.t (fun v -> Sex v)
        | "Culture" ->
            Config.Decode.make locale_order Culture.Decode.t (fun v ->
                Culture v)
        | _ -> fail "Expected arcane tradition prerequisite type"
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
      open Decoders_bs.Decode

      let make locale_order =
        field "type" string
        >>= function
        | "Special" ->
            Config.Decode.make locale_order value (Function.const Special)
        | "Culture" ->
            Config.Decode.make locale_order Culture.Decode.t (fun v ->
                Culture v)
        | _ -> fail "Expected personal trait prerequisite type"
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
      open Decoders_bs.Decode

      let make locale_order =
        field "type" string
        >>= function
        | "Rule" ->
            Config.Decode.make locale_order Rule.Decode.t (fun v -> Rule v)
        | "Culture" ->
            Config.Decode.make locale_order Rated.Decode.t (fun v -> Rated v)
        | _ -> fail "Expected spellwork prerequisite type"
    end
  end

  module Liturgy = struct
    type value = Rule of Rule.t

    type t = value Config.t

    let unify (x : t) : Unified.t =
      { x with value = (match x.value with Rule x -> Rule x) }

    module Decode = struct
      open Decoders_bs.Decode

      let make locale_order =
        field "type" string
        >>= function
        | "Rule" ->
            Config.Decode.make locale_order Rule.Decode.t (fun v -> Rule v)
        | _ -> fail "Expected liturgy prerequisite type"
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
      open Decoders_bs.Decode

      let make locale_order =
        field "type" string
        >>= function
        | "Special" ->
            Config.Decode.make locale_order value (Function.const Special)
        | "Influence" ->
            Config.Decode.make locale_order Influence.Decode.t (fun v ->
                Influence v)
        | _ -> fail "Expected influence prerequisite type"
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
      open Decoders_bs.Decode

      let make locale_order =
        field "type" string
        >>= function
        | "Race" ->
            Config.Decode.make locale_order Race.Decode.t (fun v -> Race v)
        | "Activatable" ->
            Config.Decode.make locale_order Activatable.Decode.t (fun v ->
                Activatable v)
        | _ -> fail "Expected language prerequisite type"
    end
  end

  module AnimistPower = struct
    type value = AnimistPower of AnimistPower.t

    type t = value Config.t

    let unify (x : t) : Unified.t =
      { x with value = (match x.value with AnimistPower x -> AnimistPower x) }

    module Decode = struct
      open Decoders_bs.Decode

      let make locale_order =
        field "type" string
        >>= function
        | "AnimistPower" ->
            Config.Decode.make locale_order AnimistPower.Decode.t (fun v ->
                AnimistPower v)
        | _ -> fail "Expected animist power prerequisite type"
    end
  end

  module Enhancement = struct
    type t = Enhancement of Enhancement.t

    module Decode = struct
      open Decoders_bs.Decode

      let make _ =
        field "type" string
        >>= function
        | "Enhancement" -> Enhancement.Decode.t |> map (fun v -> Enhancement v)
        | _ -> fail "Expected enhancement prerequisite type"
    end
  end
end

module Collection = struct
  module Plain = struct
    type 'a t = 'a list

    module Decode = struct
      open Decoders_bs.Decode

      let make decoder =
        field "type" string
        >>= function
        | "Plain" -> field "value" (list decoder)
        | _ -> fail "Expected collection type"
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
      open Decoders_bs.Decode

      let make decoder =
        field "type" string
        >>= function
        | "Plain" -> field "value" (list decoder) |> map plain
        | "ByLevel" ->
            let level =
              field "level" int
              >>= fun level ->
              field "prerequisites" (list decoder)
              >>= fun prerequisites -> succeed (level, prerequisites)
            in
            field "value" (list level) |> map IntMap.fromList |> map byLevel
        | _ -> fail "Expected collection type"
    end
  end

  module Make (Wrapper : sig
    type 'a t

    module Decode : sig
      val make :
        'a Decoders_bs.Decode.decoder -> 'a t Decoders_bs.Decode.decoder
    end
  end) (Main : sig
    type t

    module Decode : sig
      val make : Locale.Order.t -> t Decoders_bs.Decode.decoder
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
