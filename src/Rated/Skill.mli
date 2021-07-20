(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of a skill. *)

module Static : sig
  type linked_activatable = {
    id : IdGroup.Activatable.t;
        (** The identifier of the entry that grants the application or use. *)
    options : IdGroup.SelectOption.t list;
        (** The application or use may only be granted by specific select
            options. *)
    level : int option;
        (** The application or use may only be granted at a certain minimum
            level. *)
  }
  (** The entry that grants the application or use it is part of. *)

  (** Application of a skill. *)
  module Application : sig
    type t = {
      id : int;
      name : string;
      prerequisite : linked_activatable option;
          (** If a [Some], the entry that needs to be active to enable this
              application. If [None], the application is always part of the
              skill. *)
    }
  end

  (** Use of a skill. *)
  module Use : sig
    type t = {
      id : int;
      name : string;
      prerequisite : linked_activatable;
          (** The entry that needs to be active to enable this use. *)
    }
  end

  (** Define how encumbrance affects skill checks on this skill. *)
  type encumbrance =
    | True  (** Always. *)
    | False  (** Never. *)
    | Maybe of string option
        (** Depending on the context, which is explained in the associated
            localized string. *)

  type t = {
    id : Id.Skill.t;
    name : string;
    check : Check.t;
    encumbrance : encumbrance;
    gr : int;
    ic : ImprovementCost.t;
    applications : Application.t IntMap.t;
    applications_input : string option;
    uses : Use.t IntMap.t;
    tools : string option;
    quality : string;
    failed : string;
    critical : string;
    botch : string;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val make_assoc : (Id.Skill.t, t) Parsing.make_assoc
  end
end

module Dynamic :
  Rated.Dynamic.S with type id = Id.Skill.t and type static = Static.t

(** Skill group definitions. *)
module Group : sig
  type t = {
    id : int;
    check : Check.t;
        (** The skill group's check for the optional rule Skill Group Checks. *)
    name : string;
    fullName : string;
  }

  module Decode : sig
    val make_assoc : (int, t) Parsing.make_assoc
  end
end
