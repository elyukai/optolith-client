type t = {
  id : int;
  name : string;
  abbr : string;
  is_core : bool;
  is_adult_content : bool;
}
(** A publication. It contains the name, the abbreviation and some configuration
    options. *)

module Decode : sig
  val make_assoc : t JsonStatic.make_assoc
end
