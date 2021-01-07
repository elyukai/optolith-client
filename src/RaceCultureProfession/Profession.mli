module Static : sig
  module Options : sig
    type 'a variant_override = Remove | Override of 'a

    type skill_specialization =
      | Specific of int OneOrMany.t
      | FromGroup of int OneOrMany.t

    type language_script = int

    type second_combat_technique = { amount : int; value : int }

    type combat_technique = {
      amount : int;
      value : int;
      second : second_combat_technique option;
      sid : int list;
    }

    type cantrip = { amount : int; sid : int list }

    type curse = int

    type terrain_knowledge = int list

    type skill = {
      gr : int option;
          (** If specified, only choose from skills of the specified group. *)
      value : int;  (** The AP value the user can spend. *)
    }

    type activatable_skill = { id : int list; value : int }

    type variant = {
      skill_specialization : skill_specialization variant_override option;
      language_script : language_script option;
      combat_technique : combat_technique variant_override option;
      cantrip : cantrip option;
      curse : curse option;
      terrain_knowledge : terrain_knowledge option;
      skill : skill option;
      spells : activatable_skill list option;
      liturgical_chants : activatable_skill list option;
      guild_mage_unfamiliar_spell : bool;
    }

    type t = {
      skill_specialization : skill_specialization option;
      language_script : language_script option;
      combat_technique : combat_technique option;
      cantrip : cantrip option;
      curse : curse option;
      terrain_knowledge : terrain_knowledge option;
      skill : skill option;
      spells : activatable_skill list option;
      liturgical_chants : activatable_skill list option;
      guild_mage_unfamiliar_spell : bool;
    }
  end

  type name = Const of string | BySex of { m : string; f : string }

  module Variant : sig
    type t = {
      id : int;
      name : name;
      ap_value : int;
      prerequisites : Prerequisite.Collection.Profession.t;
      options : Options.variant;
      special_abilities : Prerequisite.Activatable.t list;
      melee_combat_techniques : int Ley_IntMap.t;
      ranged_combat_techniques : int Ley_IntMap.t;
      skills : int Ley_IntMap.t;
      spells : int Ley_IntMap.t;
      rituals : int Ley_IntMap.t;
      liturgical_chants : int Ley_IntMap.t;
      ceremonies : int Ley_IntMap.t;
      blessings : int list;
      preceding_text : string option;
      full_text : string option;
      concluding_text : string option;
    }
  end

  type t = {
    id : int;
    name : name;
    subname : name option;
    ap_value : int option;
    prerequisites : Prerequisite.Collection.Profession.t;
    prerequisites_start : string option;
    options : Options.t;
    special_abilities : Prerequisite.Activatable.t list;
    melee_combat_techniques : int Ley_IntMap.t;
    ranged_combat_techniques : int Ley_IntMap.t;
    skills : int Ley_IntMap.t;
    spells : int Ley_IntMap.t;
    rituals : int Ley_IntMap.t;
    liturgical_chants : int Ley_IntMap.t;
    ceremonies : int Ley_IntMap.t;
    blessings : int list;
    suggested_advantages : int list;
    suggested_advantages_text : string option;
    suggested_disadvantages : int list;
    suggested_disadvantages_text : string option;
    unsuitable_advantages : int list;
    unsuitable_advantages_text : string option;
    unsuitable_disadvantages : int list;
    unsuitable_disadvantages_text : string option;
    variants : Variant.t Ley_IntMap.t;
    is_variant_required : bool;
    curriculum : int option;
    gr : int;
    sgr : int;
        (** Divides the groups into smaller subgroups, e.g. "Mage", "Blessed One of the Twelve Gods" or "Fighter". *)
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end

module Dynamic : sig
  type id = Base of int | WithVariant of { base : int; variant : int }

  type t = { id : id; static : Static.t option }
end
