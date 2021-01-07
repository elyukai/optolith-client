module Static : sig
  type restricted_spellwork =
    | Spell of int
    | Ritual of int
    | Property of int
    | OneFromProperty of int
    | DemonSummoning
    | Borbaradian
    | DamageIntelligent

  type lesson_package = {
    id : int;
    name : string;
    ap_value : int;
    melee_combat_techniques : int Ley_IntMap.t;
    ranged_combat_techniques : int Ley_IntMap.t;
    skills : int Ley_IntMap.t;
    spells : int Ley_IntMap.t;
    rituals : int Ley_IntMap.t;
  }

  type t = {
    id : int;
    name : string;
    guideline : int;
    elective_spellworks : int list;
    restricted_spellworks : restricted_spellwork list;
    lesson_packages : lesson_package Ley_IntMap.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end

module Dynamic : sig
  type t = { id : int; lesson_package : int option; static : Static.t option }
end
