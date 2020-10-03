type dependency = {
  source: Id.ActivatableAndSkill.t,
  target: OneOrMany.t(int),
  value: int,
};

module type Dynamic = {
  type t = {
    id: int,
    value: int,
    dependencies: list(dependency),
  };

  /**
   * `empty id` creates a new dynamic entry from an id.
   */
  let empty: int => t;

  /**
   * `isEmpty x` checks if the passed dynamic entry is empty.
   */
  let isEmpty: t => bool;

  /**
   * `getValueDef maybe` takes a dynamic entry that might
   * not exist and returns the value of that entry. If the entry is not yet
   * defined, it's value is the minimum value of the entry type, e.g. 8 for
   * attributes, 0 for skills and 6 for combat techniques.
   */
  let getValueDef: option(t) => int;
};

module type DynamicConfig = {let minValue: int;};

module Dynamic = (Config: DynamicConfig) => {
  type t = {
    id: int,
    value: int,
    dependencies: list(dependency),
  };

  let minValue = Config.minValue;

  let empty = id => {id, value: minValue, dependencies: []};

  let isEmpty = (x: t) =>
    x.value <= minValue && Ley_List.null(x.dependencies);

  let getValueDef = Ley_Option.option(minValue, (x: t) => x.value);
};
