type t = {
  id : int;
  name : string;
  maxLevel : int option;
  specializations : string Ley_IntMap.t;
  specializationInput : string option;
  continent : int;
  isExtinct : bool;
  src : PublicationRef.list;
  errata : Erratum.list;
}

module Decode : sig
  val assoc : t Json_Decode_Static.decodeAssoc
end
