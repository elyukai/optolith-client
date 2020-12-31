type t = {
  id: int,
  name: string,
  numId: option(int),
  primary: option(int),
  aeMod: option(float),
  canLearnCantrips: bool,
  canLearnSpells: bool,
  canLearnRituals: bool,
  allowMultipleTraditions: bool,
  isDisAdvAPMaxHalved: bool,
  areDisAdvRequiredApplyToMagActionsOrApps: bool,
};

module Decode: {let assoc: Json_Decode_Static.decodeAssoc(t);};
