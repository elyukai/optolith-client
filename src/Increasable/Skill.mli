(**
 * This module contains definitions and simple utility functions for both the
 * dynamic and the static parts of a skill.
 *)

module Static : sig
  module Application : sig
    type t = {
      id : int;
      name : string;
      prerequisite : Prerequisite.Activatable.t option;
    }
  end

  module Use : sig
    type t = {
      id : int;
      name : string;
      prerequisite : Prerequisite.Activatable.t;
    }
  end

  type encumbrance = True | False | Maybe of string option

  type t = {
    id : int;
    name : string;
    check : SkillCheck.t;
    encumbrance : encumbrance;
    gr : int;
    ic : IC.t;
    applications : Application.t Ley_IntMap.t;
    applicationsInput : string option;
    uses : Use.t Ley_IntMap.t;
    tools : string option;
    quality : string;
    failed : string;
    critical : string;
    botch : string;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end

module Dynamic : Increasable.Dynamic.T with type static = Static.t
