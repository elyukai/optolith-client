module Id : sig
  type t = int

  module Decode : sig
    val t : int Json.Decode.decoder
  end
end

module Name : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module NameInLibrary : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module Levels : sig
  type t = int

  module Decode : sig
    val t : int Json.Decode.decoder
  end
end

module Maximum : sig
  type t = int

  module Decode : sig
    val t : int Json.Decode.decoder
  end
end

module Input : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module Rules : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module Effect : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module CombatSpecialAbilityType : sig
  type t = Passive | BaseManeuver | SpecialManeuver

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module Penalty : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module AeCost : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module Volume : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module BindingCost : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module Property : sig
  type t = DependingOnProperty | Single of int

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module Aspect : sig
  type t = int

  module Decode : sig
    val t : int Json.Decode.decoder
  end
end

module AdvancedSpecialAbilities : sig
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

  module Decode : sig
    val slot : slot Json.Decode.decoder

    val t : (slot * slot * slot) Json.Decode.decoder
  end
end

module ApplicableCombatTechniques : sig
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

  module Decode : sig
    val generalRestriction : generalRestriction Json.Decode.decoder

    val meleeRestriction : meleeRestriction Json.Decode.decoder

    val rangedRestriction : rangedRestriction Json.Decode.decoder

    val specificRestriction : specificRestriction Json.Decode.decoder

    val specific : specific Json.Decode.decoder

    val t : t Json.Decode.decoder
  end
end

module PrerequisitesReplacement : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module PrerequisitesStart : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module PrerequisitesEnd : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module ApValue : sig
  type t = Flat of int | PerLevel of int list | Option

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module ApValueReplacement : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module ApValueAppend : sig
  type t = string

  module Decode : sig
    val t : string Json.Decode.decoder
  end
end

module Decode : sig
  (** Required types, accessors and decoders to compose the final decoder *)
  module type Entity = sig
    type t
    (** The entity record type. *)

    module Translation : Json_Decode_TranslationMap.EntityTranslation

    type multilingual
    (** The record type with language-independent types. It represents the
        equivalent of a YAML file's content. Any adjustments to improve the
        usability in code should be handled in [make]. *)

    val multilingual :
      (Js.Json.t -> Translation.t Json_Decode_TranslationMap.partial) ->
      Js.Json.t ->
      multilingual
    (** [t decodeTranslations json] decodes the passed JSON as the record with
        language-independent values. It has to decode the language-dependent values
        using [decodeTranslations].

        @raise [DecodeError] if one decoder did not succeed. *)

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
    (** [make langs multilingual translation] merges the multilingual record with
        the record of the most wanted language available and should handle any
        type conversions that differ from the JSON schema for the YAML files. If
        inputs needs to be verified logically, this can be done here and [None]
        can be returned to exclude invalid entries. [langs] can be used to resolve
        translations of nested entities. *)

    (** Accessors for record properties needed because of abstract types. *)
    module Accessors : sig
      val translations :
        multilingual -> Translation.t Json_Decode_TranslationMap.partial
      (** [translations x] returns the [translations] property from the
          [multilingual] record. *)
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

  (** Create unified decoders using the passed entity module. *)
  module Make (E : Entity) : sig
    val assoc : E.t decodeAssoc
    (** [assoc localeOrder json] decodes the passed JSON into a value of type [t]
        of the passed module. It returns [None] if no matching translation could
        be found. It returns a pair to be used for inserting into a map.

        @raise [DecodeError] if one decoder did not succeed. *)
  end
end
