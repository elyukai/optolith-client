type t = {
  id : int;
  name : string;
  apValue : int;
  languages : int list;
  continent : int;
  isExtinct : bool;
  src : PublicationRef.list;
  errata : Erratum.list;
}

module Decode : sig
  val assoc : t Json_Decode_Static.decodeAssoc
end
