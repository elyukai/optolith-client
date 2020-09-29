/**
 * This module contains definitions and simple utility functions for both the
 * dynamic and the static parts of a skill.
 */

module Dynamic: {
  type t = {
    id: int,
    value: int,
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
   * `getValueDef maybeSkill` takes a skill's dynamic entry that might not
   * exist and returns the value of that skill. If the skill is not yet defined,
   * it's value is `0`.
   */
  let getValueDef: Ley_Option.t(t) => int;
};

module Static: {
  module Application: {
    type t = {
      id: int,
      name: string,
      prerequisite: option(Prerequisite.activatable),
    };
  };

  module Use: {
    type t = {
      id: int,
      name: string,
      prerequisite: Prerequisite.activatable,
    };
  };

  type t = {
    id: int,
    name: string,
    prerequisite: Prerequisite.activatable,
  };

  let decode: (list(string), Js.Json.t) => Ley_Option.t(t);
};
