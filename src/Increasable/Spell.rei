module Dynamic: {
  type value =
    | Inactive
    | Active(int);

  type t = {
    id: int,
    value,
    dependencies: list(Increasable.dependency),
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
  let getValueDef:
    option(Hero.ActivatableSkill.t) => Hero.ActivatableSkill.value;

  /**
   * Converts the liturgical chant value to an int, where `Inactive` results in
   * `0`.
   */
  let valueToInt: Hero.ActivatableSkill.value => int;

  /**
   * Checks if the liturgical chant is active.
   */
  let isActive: Hero.ActivatableSkill.t => bool;

  /**
   * Checks if the liturgical chant is active.
   */
  let isActiveM: option(Hero.ActivatableSkill.t) => bool;
};
