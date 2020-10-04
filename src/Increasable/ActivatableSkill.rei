module type Dynamic = {
  type value =
    | Inactive
    | Active(int);

  type t = {
    id: int,
    value,
    dependencies: list(Increasable.Dynamic.dependency),
  };

  /**
   * `empty id` creates a new dynamic skill instance from a skill id.
   */
  let empty: int => t;

  /**
   * `isEmpty skill` checks if the passed skill is empty.
   */
  let isEmpty: t => bool;

  /**
   * Takes an activatable skill's hero entry that might not exist and returns the
   * value of that activatable skill. Note: If the activatable skill is not yet
   * defined, it's value is `Inactive`.
   */
  let getValueDef: option(t) => value;

  /**
   * Converts the liturgical chant value to an int, where `Inactive` results in
   * `0`.
   */
  let valueToInt: value => int;

  /**
   * Checks if the liturgical chant is active.
   */
  let isActive: t => bool;

  /**
   * Checks if the liturgical chant is active.
   */
  let isActiveM: option(t) => bool;
};

module Dynamic: Dynamic;

/**
 * A module for handling the main parameters of spells and liturgical chants:
 * Casting/ritual/liturgical/ceremonial time, AE/KP cost, range and duration.
 */
module MainParameter: {
  /**
   * A unified type to store the different values: The full parameter text, an
   * abbreviated version for the character sheet and if the value is not
   * modifiable.
   */
  type t = {
    full: string,
    abbr: string,
    isNotModifiable: bool,
  };

  type translation;

  let decode: Json.Decode.decoder(translation);

  let make: (bool, translation) => t;
};
