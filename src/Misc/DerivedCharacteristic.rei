module Dynamic: {
  /**
   * The state of a derived characteristic.
   *
   * The `base` value is the result of the given calculation. The `modifier` is
   * a value that is added to the `base` value. It's source are entries that
   * change the value of that derived characteristic. The `currentAdded` is the
   * current amount of bought points and the `permanentLost` is how many points
   * have been permanently lost. The end result of combining all values is the
   * `value`.
   */
  type state =
    | Inactive
    | Basic({
        value: int,
        base: int,
      })
    | Energy({
        value: int,
        base: int,
        modifier: int,
        currentAdded: int,
        maxAddable: int,
        permanentLost: int,
      })
    | EnergyWithBoughtBack({
        value: int,
        base: int,
        modifier: int,
        currentAdded: int,
        maxAddable: int,
        permanentLost: int,
        permanentBoughtBack: int,
      });

  type t = {
    id: int,
    calc: string,
    state,
  };
};

module Static: {
  type t = {
    id: int,
    name: string,
    short: string,
    calc: string,
    calcHalfPrimary: option(string),
    calcNoPrimary: option(string),
  };

  module Decode: {let assoc: Decoder.assocDecoder(t);};
};
