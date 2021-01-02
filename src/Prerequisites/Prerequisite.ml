module Sex = struct
  type t = Sex.t

  module Decode = struct
    let t =
      Json.Decode.(
        string
        |> map (function
             | "m" -> Sex.Male
             | "f" -> Female
             | str -> raise (DecodeError ("Unknown sex prerequisite: " ^ str))))
  end
end

module Race = struct
  type t = { id : int NonEmptyList.t; active : bool }

  module Decode = struct
    let t =
      Json.Decode.(
        oneOf
          [
            (fun json ->
              {
                id = json |> NonEmptyList.Decode.one_or_many int;
                active = true;
              });
            (fun json ->
              {
                id = json |> field "races" (NonEmptyList.Decode.one_or_many int);
                active = json |> field "active" bool;
              });
          ])
  end
end

module Culture = struct
  type t = int NonEmptyList.t

  module Decode = struct
    let t = NonEmptyList.Decode.one_or_many Json.Decode.int
  end
end

module PrimaryAttribute = struct
  type t = Magical of int | Blessed of int

  module Decode = struct
    let t =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Blessed" ->
                 field "value" int |> map (fun value -> Blessed value)
             | "Magical" ->
                 field "value" int |> map (fun value -> Magical value)
             | str ->
                 raise (DecodeError ("Unknown primary attribute type: " ^ str))))
  end
end

module Pact = struct
  type t = {
    category : int;
    domain : int NonEmptyList.t option;
    level : int option;
  }

  module Decode = struct
    let t json =
      Json_Decode_Strict.
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

module Activatable = struct
  type t = {
    id : Id.Activatable.t;
    active : bool;
    options : Id.Activatable.SelectOption.t list;
    level : int option;
  }

  module Decode = struct
    let t json =
      Json_Decode_Strict.
        {
          id = json |> field "id" Id.Activatable.Decode.t;
          active = json |> field "active" bool;
          options =
            json
            |> optionalField "options"
                 (list Id.Activatable.SelectOption.Decode.t)
            |> Ley_Option.fromOption [];
          level = json |> optionalField "level" int;
        }
  end
end

module ActivatableMultiEntry = struct
  type activatableIds =
    | Advantages of int list
    | Disadvantages of int list
    | SpecialAbilities of int list

  type t = {
    id : activatableIds;
    active : bool;
    options : Id.Activatable.SelectOption.t list;
    level : int option;
  }

  module Decode = struct
    let activatableIds =
      Json.Decode.(
        field "scope" string
        |> andThen (function
             | "Advantage" ->
                 field "value" (list int) |> map (fun xs -> Advantages xs)
             | "Disadvantage" ->
                 field "value" (list int) |> map (fun xs -> Disadvantages xs)
             | "SpecialAbility" ->
                 field "value" (list int) |> map (fun xs -> SpecialAbilities xs)
             | str ->
                 raise (DecodeError ("Unknown activatable ID scope: " ^ str))))

    let t json =
      Json_Decode_Strict.
        {
          id = json |> field "id" activatableIds;
          active = json |> field "active" bool;
          options =
            json
            |> optionalField "options"
                 (list Id.Activatable.SelectOption.Decode.t)
            |> Ley_Option.fromOption [];
          level = json |> optionalField "level" int;
        }
  end
end

module ActivatableMultiSelect = struct
  type t = {
    id : Id.Activatable.t;
    active : bool;
    firstOption : Id.Activatable.SelectOption.t list;
    otherOptions : Id.Activatable.SelectOption.t list;
    level : int option;
  }

  module Decode = struct
    let t json =
      Json_Decode_Strict.
        {
          id = json |> field "id" Id.Activatable.Decode.t;
          active = json |> field "active" bool;
          firstOption =
            json
            |> field "firstOption" (list Id.Activatable.SelectOption.Decode.t);
          otherOptions =
            json
            |> optionalField "otherOptions"
                 (list Id.Activatable.SelectOption.Decode.t)
            |> Ley_Option.fromOption [];
          level = json |> optionalField "level" int;
        }
  end
end

module Increasable = struct
  type t = { id : Id.Increasable.t; value : int }

  module Decode = struct
    let t json =
      Json.Decode.
        {
          id = json |> field "id" Id.Increasable.Decode.t;
          value = json |> field "value" int;
        }
  end
end

module IncreasableMultiEntry = struct
  type increasableIds =
    | Attributes of int list
    | Skills of int list
    | CombatTechniques of int list
    | Spells of int list
    | LiturgicalChants of int list

  type t = { id : increasableIds; value : int }

  module Decode = struct
    let increasableIds =
      Json.Decode.(
        field "scope" string
        |> andThen (function
             | "Attribute" ->
                 field "value" (list int) |> map (fun xs -> Attributes xs)
             | "Skill" -> field "value" (list int) |> map (fun xs -> Skills xs)
             | "CombatTechnique" ->
                 field "value" (list int) |> map (fun xs -> CombatTechniques xs)
             | "Spell" -> field "value" (list int) |> map (fun xs -> Spells xs)
             | "LiturgicalChant" ->
                 field "value" (list int) |> map (fun xs -> LiturgicalChants xs)
             | str ->
                 raise (DecodeError ("Unknown increasable ID scope: " ^ str))))

    let t json =
      Json.Decode.
        {
          id = json |> field "id" increasableIds;
          value = json |> field "value" int;
        }
  end
end

module DisplayOption = struct
  type t = Generate | Hide | ReplaceWith of string

  module Decode = struct
    module Translation = struct
      type t = string

      let t = Json.Decode.string

      let pred _ = true
    end

    module TranslationMap = Json_Decode_TranslationMap.Make (Translation)

    type multilingual =
      | MultilingualGenerate
      | MultilingualHide
      | MultilingualReplaceWith of TranslationMap.t

    let multilingual json =
      Json_Decode_Strict.(
        json
        |> optionalField "displayOption"
             ( field "type" string
             |> andThen (function
                  | "Hide" -> fun _ -> MultilingualHide
                  | "ReplaceWith" ->
                      field "value" TranslationMap.t
                      |> map (fun mp -> MultilingualReplaceWith mp)
                  | str ->
                      raise
                        (DecodeError ("Unknown display option type: " ^ str)))
             )
        |> Ley_Option.fromOption MultilingualGenerate)

    let resolveTranslations langs x =
      match x with
      | MultilingualGenerate -> Generate
      | MultilingualHide -> Hide
      | MultilingualReplaceWith mp ->
          mp
          |> TranslationMap.getFromLanguageOrder langs
          |> Ley_Option.fromOption Chars.mdash
          |> fun str -> ReplaceWith str
  end
end

module Config = struct
  type 'a t = { value : 'a; displayOption : DisplayOption.t }

  module Decode = struct
    type 'a multilingual = {
      value : 'a;
      displayOption : DisplayOption.Decode.multilingual;
    }

    let multilingual decoder (wrap : 'a -> 'b) json =
      Json.Decode.(
        ( {
            value = json |> field "value" decoder |> wrap;
            displayOption = json |> DisplayOption.Decode.multilingual;
          }
          : 'b multilingual ))

    let resolveTranslations langs ({ value; displayOption } : 'a multilingual) :
        'a t =
      {
        value;
        displayOption =
          DisplayOption.Decode.resolveTranslations langs displayOption;
      }
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
    | Activatable of Activatable.t
    | ActivatableMultiEntry of ActivatableMultiEntry.t
    | ActivatableMultiSelect of ActivatableMultiSelect.t
    | Increasable of Increasable.t
    | IncreasableMultiEntry of IncreasableMultiEntry.t

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
    | Activatable of Activatable.t
    | ActivatableMultiEntry of ActivatableMultiEntry.t
    | ActivatableMultiSelect of ActivatableMultiSelect.t
    | Increasable of Increasable.t
    | IncreasableMultiEntry of IncreasableMultiEntry.t

  type t = value Config.t

  let unify (x : t) : Unified.t =
    {
      value =
        ( match x.value with
        | Sex x -> Sex x
        | Race x -> Race x
        | Culture x -> Culture x
        | Pact x -> Pact x
        | SocialStatus x -> SocialStatus x
        | PrimaryAttribute x -> PrimaryAttribute x
        | Activatable x -> Activatable x
        | ActivatableMultiEntry x -> ActivatableMultiEntry x
        | ActivatableMultiSelect x -> ActivatableMultiSelect x
        | Increasable x -> Increasable x
        | IncreasableMultiEntry x -> IncreasableMultiEntry x );
      displayOption = x.displayOption;
    }

  module Decode = struct
    type multilingual = value Config.Decode.multilingual

    let multilingual =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Sex" -> Config.Decode.multilingual Sex.Decode.t (fun v -> Sex v)
             | "Race" ->
                 Config.Decode.multilingual Race.Decode.t (fun v -> Race v)
             | "Culture" ->
                 Config.Decode.multilingual Culture.Decode.t (fun v ->
                     Culture v)
             | "Pact" ->
                 Config.Decode.multilingual Pact.Decode.t (fun v -> Pact v)
             | "SocialStatus" ->
                 Config.Decode.multilingual SocialStatus.Decode.t (fun v ->
                     SocialStatus v)
             | "PrimaryAttribute" ->
                 Config.Decode.multilingual PrimaryAttribute.Decode.t (fun v ->
                     PrimaryAttribute v)
             | "Activatable" ->
                 Config.Decode.multilingual Activatable.Decode.t (fun v ->
                     Activatable v)
             | "ActivatableMultiEntry" ->
                 Config.Decode.multilingual ActivatableMultiEntry.Decode.t
                   (fun v -> ActivatableMultiEntry v)
             | "ActivatableMultiSelect" ->
                 Config.Decode.multilingual ActivatableMultiSelect.Decode.t
                   (fun v -> ActivatableMultiSelect v)
             | "Increasable" ->
                 Config.Decode.multilingual Increasable.Decode.t (fun v ->
                     Increasable v)
             | "IncreasableMultiEntry" ->
                 Config.Decode.multilingual IncreasableMultiEntry.Decode.t
                   (fun v -> IncreasableMultiEntry v)
             | str -> raise (DecodeError ("Unknown prerequisite type: " ^ str))))

    let resolveTranslations = Config.Decode.resolveTranslations
  end
end

module Profession = struct
  type value =
    | Sex of Sex.t
    | Race of Race.t
    | Culture of Culture.t
    | Activatable of Activatable.t
    | Increasable of Increasable.t

  type t = value Config.t

  let unify (x : t) : Unified.t =
    {
      value =
        ( match x.value with
        | Sex x -> Sex x
        | Race x -> Race x
        | Culture x -> Culture x
        | Activatable x -> Activatable x
        | Increasable x -> Increasable x );
      displayOption = x.displayOption;
    }

  module Decode = struct
    type multilingual = value Config.Decode.multilingual

    let multilingual =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Sex" -> Config.Decode.multilingual Sex.Decode.t (fun v -> Sex v)
             | "Race" ->
                 Config.Decode.multilingual Race.Decode.t (fun v -> Race v)
             | "Culture" ->
                 Config.Decode.multilingual Culture.Decode.t (fun v ->
                     Culture v)
             | "Activatable" ->
                 Config.Decode.multilingual Activatable.Decode.t (fun v ->
                     Activatable v)
             | "Increasable" ->
                 Config.Decode.multilingual Increasable.Decode.t (fun v ->
                     Increasable v)
             | str -> raise (DecodeError ("Unknown prerequisite type: " ^ str))))

    let resolveTranslations = Config.Decode.resolveTranslations
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
    | Activatable of Activatable.t
    | ActivatableMultiEntry of ActivatableMultiEntry.t
    | ActivatableMultiSelect of ActivatableMultiSelect.t
    | Increasable of Increasable.t
    | IncreasableMultiEntry of IncreasableMultiEntry.t

  type t = value Config.t

  let unify (x : t) : Unified.t =
    {
      value =
        ( match x.value with
        | CommonSuggestedByRCP -> CommonSuggestedByRCP
        | Sex x -> Sex x
        | Race x -> Race x
        | Culture x -> Culture x
        | Pact x -> Pact x
        | SocialStatus x -> SocialStatus x
        | PrimaryAttribute x -> PrimaryAttribute x
        | Activatable x -> Activatable x
        | ActivatableMultiEntry x -> ActivatableMultiEntry x
        | ActivatableMultiSelect x -> ActivatableMultiSelect x
        | Increasable x -> Increasable x
        | IncreasableMultiEntry x -> IncreasableMultiEntry x );
      displayOption = x.displayOption;
    }

  module Decode = struct
    type multilingual = value Config.Decode.multilingual

    let multilingual =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "CommonSuggestedByRCP" ->
                 fun _ ->
                   ( {
                       value = CommonSuggestedByRCP;
                       displayOption = MultilingualGenerate;
                     }
                     : multilingual )
             | "Sex" -> Config.Decode.multilingual Sex.Decode.t (fun v -> Sex v)
             | "Race" ->
                 Config.Decode.multilingual Race.Decode.t (fun v -> Race v)
             | "Culture" ->
                 Config.Decode.multilingual Culture.Decode.t (fun v ->
                     Culture v)
             | "Pact" ->
                 Config.Decode.multilingual Pact.Decode.t (fun v -> Pact v)
             | "SocialStatus" ->
                 Config.Decode.multilingual SocialStatus.Decode.t (fun v ->
                     SocialStatus v)
             | "PrimaryAttribute" ->
                 Config.Decode.multilingual PrimaryAttribute.Decode.t (fun v ->
                     PrimaryAttribute v)
             | "Activatable" ->
                 Config.Decode.multilingual Activatable.Decode.t (fun v ->
                     Activatable v)
             | "ActivatableMultiEntry" ->
                 Config.Decode.multilingual ActivatableMultiEntry.Decode.t
                   (fun v -> ActivatableMultiEntry v)
             | "ActivatableMultiSelect" ->
                 Config.Decode.multilingual ActivatableMultiSelect.Decode.t
                   (fun v -> ActivatableMultiSelect v)
             | "Increasable" ->
                 Config.Decode.multilingual Increasable.Decode.t (fun v ->
                     Increasable v)
             | "IncreasableMultiEntry" ->
                 Config.Decode.multilingual IncreasableMultiEntry.Decode.t
                   (fun v -> IncreasableMultiEntry v)
             | str -> raise (DecodeError ("Unknown prerequisite type: " ^ str))))

    let resolveTranslations = Config.Decode.resolveTranslations
  end
end

module ArcaneTradition = struct
  type value = Sex of Sex.t | Culture of Culture.t

  type t = value Config.t

  let unify (x : t) : Unified.t =
    {
      value = (match x.value with Sex x -> Sex x | Culture x -> Culture x);
      displayOption = x.displayOption;
    }

  module Decode = struct
    type multilingual = value Config.Decode.multilingual

    let multilingual =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Sex" -> Config.Decode.multilingual Sex.Decode.t (fun v -> Sex v)
             | "Culture" ->
                 Config.Decode.multilingual Culture.Decode.t (fun v ->
                     Culture v)
             | str -> raise (DecodeError ("Unknown prerequisite type: " ^ str))))

    let resolveTranslations = Config.Decode.resolveTranslations
  end
end

module ActivatableOnly = struct
  type value = Activatable.t

  type t = value Config.t

  let unify (x : t) : Unified.t =
    { value = Activatable x.value; displayOption = x.displayOption }

  module Decode = struct
    type multilingual = value Config.Decode.multilingual

    let multilingual =
      Config.Decode.multilingual Activatable.Decode.t (fun v -> v)

    let resolveTranslations = Config.Decode.resolveTranslations
  end
end

module IncreasableOnly = struct
  type value = Increasable.t

  type t = value Config.t

  let unify (x : t) : Unified.t =
    { value = Increasable x.value; displayOption = x.displayOption }

  module Decode = struct
    type multilingual = value Config.Decode.multilingual

    let multilingual =
      Config.Decode.multilingual Increasable.Decode.t (fun v -> v)

    let resolveTranslations = Config.Decode.resolveTranslations
  end
end

module Collection = struct
  module Plain = struct
    type 'a t = 'a list

    module Decode = struct
      let multilingual decoder =
        Json.Decode.(
          field "type" string
          |> andThen (function
               | "Plain" -> fun json -> json |> field "value" (list decoder)
               | str ->
                   raise
                     (DecodeError
                        ( "Prerequisite list type has to be set to \"Plain\". \
                           Actual: " ^ str ))))

      let resolveTranslations langs f xs = xs |> Ley_List.map (f langs)
    end
  end

  module ByLevel = struct
    type 'a t = Plain of 'a list | ByLevel of 'a list Ley_IntMap.t

    let getFirstLevel = function
      | Plain xs -> xs
      | ByLevel mp -> mp |> Ley_IntMap.lookup 1 |> Ley_Option.fromOption []

    let makeRangePredicate oldLevel newLevel =
      match (oldLevel, newLevel) with
      (* Used for changing level *)
      | Some oldLevel, Some newLevel ->
          let min, max = Ley_Int.minmax oldLevel newLevel in
          Ley_Ix.inRange (min + 1, max)
      (* Used for deactivating an entry *)
      | Some level, None
      (* Used for activating an entry *)
      | None, Some level ->
          ( >= ) level
      | None, None -> Ley_Function.const true

    let filterByLevel pred mp = Ley_IntMap.filterWithKey (fun k _ -> pred k) mp

    let concatRange oldLevel newLevel prerequisites =
      let pred = makeRangePredicate oldLevel newLevel in
      match prerequisites with
      | Plain xs -> if pred 1 then xs else []
      | ByLevel mp -> mp |> filterByLevel pred |> Ley_IntMap.concat

    module Decode = struct
      let multilingual decoder =
        Json.Decode.(
          field "type" string
          |> andThen (function
               | "Plain" ->
                   field "value" (list decoder) |> map (fun xs -> Plain xs)
               | "ByLevel" ->
                   field "value"
                     (list (fun json ->
                          ( json |> field "level" int,
                            json |> field "prerequisites" (list decoder) )))
                   |> map (fun xs -> ByLevel (Ley_IntMap.fromList xs))
               | str ->
                   raise
                     (DecodeError ("Unknown prerequisite list type: " ^ str))))

      let resolveTranslations langs f x =
        match x with
        | Plain xs -> xs |> Ley_List.map (f langs) |> fun xs -> Plain xs
        | ByLevel mp ->
            mp |> Ley_IntMap.map (Ley_List.map (f langs)) |> fun mp ->
            ByLevel mp
    end
  end

  module Make
      (Wrapper : Json_Decode_Static.Nested.WrapperSafeS)
      (Main : Json_Decode_Static.Nested.SafeS) =
  struct
    type t = Main.t Wrapper.t

    module Decode = struct
      type multilingual = Main.Decode.multilingual Wrapper.t

      let multilingual = Wrapper.Decode.multilingual Main.Decode.multilingual

      let resolveTranslations langs x =
        Wrapper.Decode.resolveTranslations langs Main.Decode.resolveTranslations
          x
    end
  end

  module General = Make (ByLevel) (General)
  module Profession = Make (Plain) (Profession)
  module AdvantageDisadvantage = Make (ByLevel) (AdvantageDisadvantage)
  module ArcaneTradition = Make (Plain) (ArcaneTradition)
  module Activatable = Make (Plain) (ActivatableOnly)
  module Increasable = Make (Plain) (IncreasableOnly)
end
