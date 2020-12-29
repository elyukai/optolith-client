type t = {
  id : int;
  name : string;
  ap : int;
  maxAttributeValue : int;
  maxSkillRating : int;
  maxCombatTechniqueRating : int;
  maxAttributeTotal : int;
  maxNumberSpellsLiturgicalChants : int;
  maxUnfamiliarSpells : int;
}

module Decode : sig
  val assoc : t Json_Decode_Static.decodeAssoc
end
