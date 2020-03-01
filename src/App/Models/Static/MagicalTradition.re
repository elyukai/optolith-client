type t = {
  id: string,
  numId: option(int),
  name: string,
  primary: option(string),
  aeMod: option(float),
  canLearnCantrips: bool,
  canLearnSpells: bool,
  canLearnRituals: bool,
  allowMultipleTraditions: bool,
  isDisAdvAPMaxHalved: bool,
  areDisAdvRequiredApplyToMagActionsOrApps: bool,
};
