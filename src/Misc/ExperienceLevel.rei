type t = {
  id: int,
  name: string,
  ap: int,
  maxAttributeValue: int,
  maxSkillRating: int,
  maxCombatTechniqueRating: int,
  maxAttributeTotal: int,
  maxNumberSpellsLiturgicalChants: int,
  maxUnfamiliarSpells: int,
};

module Decode: {let assoc: Decoder.assocDecoder(t);};
