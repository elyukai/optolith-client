module Id = struct
  type t = int

  module Decode = struct
    let t = Json.Decode.int
  end
end

module Name = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module NameInLibrary = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module Levels = struct
  type t = int

  module Decode = struct
    let t = Json.Decode.int
  end
end

module Maximum = struct
  type t = int

  module Decode = struct
    let t = Json.Decode.int
  end
end

module Input = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module Rules = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module Effect = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module CombatSpecialAbilityType = struct
  type t = Passive | BaseManeuver | SpecialManeuver

  module Decode = struct
    let t =
      Json.Decode.(
        string
        |> map (function
             | "Passive" -> Passive
             | "BaseManeuver" -> BaseManeuver
             | "SpecialManeuver" -> SpecialManeuver
             | str ->
                 raise
                   (DecodeError ("Unknown CombatSpecialAbilityType: " ^ str))))
  end
end

module Penalty = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module AeCost = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module Volume = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module BindingCost = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module Property = struct
  type t = DependingOnProperty | Single of int

  module Decode = struct
    let t =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Passive" -> fun _ -> DependingOnProperty
             | "Single" -> field "value" int |> map (fun x -> Single x)
             | str -> raise (DecodeError ("Unknown Property: " ^ str))))
  end
end

module Aspect = struct
  type t = int

  module Decode = struct
    let t = Json.Decode.int
  end
end

module AdvancedSpecialAbilities = struct
  type slot =
    | Single of {
        id : int;
        option :
          OptolithClient.Id.Activatable.SelectOption.t NonEmptyList.t option;
            (** Only one specific select option or one of a set of select
                options is allowed for the referenced advanced special
                ability. *)
      }
    | OneOf of int list

  type t = slot * slot * slot

  module Decode = struct
    let slot =
      Json_Decode_Strict.(
        oneOf
          [
            list int |> map (fun xs -> OneOf xs);
            (fun json ->
              Single
                {
                  id = json |> field "id" int;
                  option =
                    json
                    |> optionalField "option"
                         (NonEmptyList.Decode.one_or_many
                            OptolithClient.Id.Activatable.SelectOption.Decode.t);
                });
          ])

    let t = Json.Decode.tuple3 slot slot slot
  end
end

module ApplicableCombatTechniques = struct
  type generalRestriction =
    | Improvised
    | PointedBlade
    | Mount
    | Race of int  (** Only from a certain race *)
    | ExcludeTechniques of OptolithClient.Id.CombatTechnique.t list

  type meleeRestriction =
    | Improvised
    | PointedBlade
    | Mount
    | HasParry
    | OneHanded
    | Race of int  (** Only from a certain race *)
    | ExcludeTechniques of int list

  type rangedRestriction =
    | Improvised
    | PointedBlade
    | Mount
    | Race of int  (** Only from a certain race *)
    | ExcludeTechniques of int list

  type specificRestriction =
    | Improvised
    | PointedBlade
    | Mount
    | Race of int  (** Only from a certain race *)
    | Level of int  (** Only for a certain level of the special ability *)
    | Weapons of int list  (** Only certain weapons *)

  type specific = {
    id : OptolithClient.Id.CombatTechnique.t;
    restrictions : specificRestriction list;
  }

  type t =
    | All of generalRestriction list
    | AllMelee of meleeRestriction list
    | AllRanged of rangedRestriction list
    | Specific of specific list
    | DependingOnCombatStyle
    | NotApplicable  (** This is represented by a dash. *)

  module Decode = struct
    let generalRestriction =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Improvised" -> fun _ -> (Improvised : generalRestriction)
             | "PointedBlade" -> fun _ -> (PointedBlade : generalRestriction)
             | "Mount" -> fun _ -> (Mount : generalRestriction)
             | "Race" ->
                 field "value" int
                 |> map (fun x -> (Race x : generalRestriction))
             | "ExcludeTechniques" ->
                 field "value" (list OptolithClient.Id.CombatTechnique.Decode.t)
                 |> map (fun xs -> (ExcludeTechniques xs : generalRestriction))
             | str ->
                 raise (DecodeError ("Unknown general restriction: " ^ str))))

    let meleeRestriction =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Improvised" -> fun _ -> (Improvised : meleeRestriction)
             | "PointedBlade" -> fun _ -> (PointedBlade : meleeRestriction)
             | "Mount" -> fun _ -> (Mount : meleeRestriction)
             | "HasParry" -> fun _ -> HasParry
             | "OneHanded" -> fun _ -> OneHanded
             | "Race" ->
                 field "value" int |> map (fun x -> (Race x : meleeRestriction))
             | "ExcludeTechniques" ->
                 field "value" (list int)
                 |> map (fun xs -> (ExcludeTechniques xs : meleeRestriction))
             | str -> raise (DecodeError ("Unknown melee restriction: " ^ str))))

    let rangedRestriction =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Improvised" -> fun _ -> (Improvised : rangedRestriction)
             | "PointedBlade" -> fun _ -> (PointedBlade : rangedRestriction)
             | "Mount" -> fun _ -> (Mount : rangedRestriction)
             | "Race" ->
                 field "value" int
                 |> map (fun x -> (Race x : rangedRestriction))
             | "ExcludeTechniques" ->
                 field "value" (list int)
                 |> map (fun xs -> (ExcludeTechniques xs : rangedRestriction))
             | str -> raise (DecodeError ("Unknown ranged restriction: " ^ str))))

    let specificRestriction =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Improvised" -> fun _ -> (Improvised : specificRestriction)
             | "PointedBlade" -> fun _ -> (PointedBlade : specificRestriction)
             | "Mount" -> fun _ -> (Mount : specificRestriction)
             | "Race" ->
                 field "value" int
                 |> map (fun x -> (Race x : specificRestriction))
             | "Level" ->
                 field "value" int
                 |> map (fun x -> (Level x : specificRestriction))
             | "Weapons" ->
                 field "value" (list int)
                 |> map (fun xs -> (Weapons xs : specificRestriction))
             | str ->
                 raise (DecodeError ("Unknown specific restriction: " ^ str))))

    let specific json =
      Json_Decode_Strict.
        {
          id = json |> field "id" OptolithClient.Id.CombatTechnique.Decode.t;
          restrictions =
            json
            |> optionalField "restrictions" (list specificRestriction)
            |> Ley_Option.fromOption [];
        }

    let t =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "None" -> fun _ -> NotApplicable
             | "DependingOnCombatStyle" -> fun _ -> DependingOnCombatStyle
             | "All" ->
                 field "value" (list generalRestriction)
                 |> map (fun xs -> All xs)
             | "AllMelee" ->
                 field "value" (list meleeRestriction)
                 |> map (fun xs -> AllMelee xs)
             | "AllRanged" ->
                 field "value" (list rangedRestriction)
                 |> map (fun xs -> AllRanged xs)
             | "Specific" ->
                 field "value" (list specific) |> map (fun xs -> Specific xs)
             | str ->
                 raise
                   (DecodeError
                      ("Unknown applicable combat techniques option: " ^ str))))
  end
end

module PrerequisitesReplacement = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module PrerequisitesStart = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module PrerequisitesEnd = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module ApValue = struct
  type t = Flat of int | PerLevel of int list | Option

  module Decode = struct
    let t =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Flat" -> field "value" int |> map (fun x -> Flat x)
             | "PerLevel" ->
                 field "value" (list int) |> map (fun xs -> PerLevel xs)
             | "Option" -> fun _ -> Option
             | str -> raise (DecodeError ("Unknown AP value: " ^ str))))
  end
end

module ApValueReplacement = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module ApValueAppend = struct
  type t = string

  module Decode = struct
    let t = Json.Decode.string
  end
end

module Decode = struct
  (** Types and functions that must be provided for an entity in order to derive
      the final decoders. *)
  module type Entity = sig
    type t

    module Translation : Json_Decode_TranslationMap.EntityTranslation

    type multilingual

    val multilingual :
      (Js.Json.t -> Translation.t Json_Decode_TranslationMap.partial) ->
      Js.Json.t ->
      multilingual

    val make :
      resolveSelectOptions:
        (src:PublicationRef.t list ->
        errata:Erratum.list ->
        Locale.Order.t ->
        SelectOption.Decode.multilingual ->
        SelectOption.map) ->
      Locale.Order.t ->
      multilingual ->
      Translation.t ->
      (int * t) option

    (** Accessors are needed to provide the final translation to [make] as well as
        to get the id of the entry for [toAssoc]. *)
    module Accessors : sig
      val translations :
        multilingual -> Translation.t Json_Decode_TranslationMap.partial
    end
  end

  type 'a decodeAssoc =
    blessings:Blessing.Static.t Ley_IntMap.t ->
    cantrips:Cantrip.Static.t Ley_IntMap.t ->
    trade_secrets:TradeSecret.t Ley_IntMap.t ->
    languages:Language.t Ley_IntMap.t ->
    scripts:Script.t Ley_IntMap.t ->
    animal_shapes:AnimalShape.t Ley_IntMap.t ->
    animal_shape_sizes:AnimalShape.Size.t Ley_IntMap.t ->
    arcane_bard_traditions:ArcaneTradition.t Ley_IntMap.t ->
    arcane_dancer_traditions:ArcaneTradition.t Ley_IntMap.t ->
    elements:Element.t Ley_IntMap.t ->
    properties:OptolithClient.Property.t Ley_IntMap.t ->
    aspects:OptolithClient.Aspect.t Ley_IntMap.t ->
    diseases:Disease.t Ley_IntMap.t ->
    poisons:Poison.t Ley_IntMap.t ->
    melee_combat_techniques:CombatTechnique.Melee.Static.t Ley_IntMap.t ->
    ranged_combat_techniques:CombatTechnique.Ranged.Static.t Ley_IntMap.t ->
    liturgical_chants:LiturgicalChant.Static.t Ley_IntMap.t ->
    ceremonies:Ceremony.Static.t Ley_IntMap.t ->
    skills:Skill.Static.t Ley_IntMap.t ->
    spells:Spell.Static.t Ley_IntMap.t ->
    rituals:Ritual.Static.t Ley_IntMap.t ->
    Locale.Order.t ->
    Js.Json.t ->
    (int * 'a) option

  (** Functor to derive the final decoders from the types and functions for the
      entity. *)
  module Make (E : Entity) = struct
    module TranslationMap = Json_Decode_TranslationMap.Make (E.Translation)

    let multilingual = E.multilingual TranslationMap.t

    let resolveTranslations ~resolveSelectOptions langs x =
      Ley_Option.Infix.(
        x |> E.Accessors.translations
        |> TranslationMap.getFromLanguageOrder langs
        >>= E.make ~resolveSelectOptions langs x)

    let assoc ~blessings ~cantrips ~trade_secrets ~languages ~scripts
        ~animal_shapes ~animal_shape_sizes ~arcane_bard_traditions
        ~arcane_dancer_traditions ~elements ~properties ~aspects ~diseases
        ~poisons ~melee_combat_techniques ~ranged_combat_techniques
        ~liturgical_chants ~ceremonies ~skills ~spells ~rituals langs json =
      json |> multilingual
      |> resolveTranslations
           ~resolveSelectOptions:
             (SelectOption.Decode.resolve ~blessings ~cantrips ~trade_secrets
                ~languages ~scripts ~animal_shapes ~animal_shape_sizes
                ~arcane_bard_traditions ~arcane_dancer_traditions ~elements
                ~properties ~aspects ~diseases ~poisons ~melee_combat_techniques
                ~ranged_combat_techniques ~liturgical_chants ~ceremonies ~skills
                ~spells ~rituals)
           langs
  end
end
