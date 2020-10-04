type t = {
  id: int,
  name: string,
  ap: int,
  maxAttributeValue: int,
  maxSkillRating: int,
  maxCombatTechniqueRating: int,
  maxTotalAttributeValues: int,
  maxSpellsLiturgicalChants: int,
  maxUnfamiliarSpells: int,
};

let decode: list(string) => Json.Decode.decoder(option((int, t)));
