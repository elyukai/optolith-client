module Static : sig
  (** Defines exceptions for how frequent a single profession or group is in
      that culture. Depending on the corresponding [...All] property, if [true],
      exceptions are removed from the list, whereas if [false], only the
      exceptions are common. *)
  type frequency_exception = Single of int | Group of int

  type t = {
    id : int;
    name : string;
    language : int list;
    script : int list option;
    area_knowledge : string;
    area_knowledge_short : string;
    social_status : int list;
    common_mundane_professions_all : bool;
    common_mundane_professions_exceptions : frequency_exception list option;
    common_mundane_professions_text : string option;
    common_magic_professions_all : bool;
    common_magic_professions_exceptions : frequency_exception list option;
    common_magic_professions_text : string option;
    common_blessed_professions_all : bool;
    common_blessed_professions_exceptions : frequency_exception list option;
    common_blessed_professions_text : string option;
    common_advantages : int list;
    common_advantages_text : string option;
    common_disadvantages : int list;
    common_disadvantages_text : string option;
    uncommon_advantages : int list;
    uncommon_advantages_text : string option;
    uncommon_disadvantages : int list;
    uncommon_disadvantages_text : string option;
    common_skills : int list;
    uncommon_skills : int list;
    common_names : string;
    cultural_package_skills : int Ley_IntMap.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end

module Dynamic : sig
  type t = { id : int; static : Static.t option }
end
