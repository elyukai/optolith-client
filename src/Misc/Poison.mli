type level = QL | Fixed of int

type use = Weapon | Ingestion | Inhalation | Contact

type category = AnimalVenom | PlantPoison | AlchemicalPoison | MineralPoison

type t = {
  id : int;
  name : string;
  level : level;
  category : category;
  uses : use list;
  src : PublicationRef.list;
  errata : Erratum.list;
}

module Decode : sig
  val assoc : t Json_Decode_Static.decodeAssoc
end
