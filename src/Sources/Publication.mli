type t = {
  id : int;
  name : string;
  nameAbbr : string;
  isCore : bool;
  isAdultContent : bool;
}
(** A publication. It contains the name, the abbreviation and some configuration
    options. *)

module Decode : sig
  val assoc : t Json_Decode_Static.decodeAssoc
end
