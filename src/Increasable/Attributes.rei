/**
 * Takes an attribute's hero entry that might not exist and returns the value of
 * that attribute. Note: If the attribute is not yet defined, it's value is `0`.
 */
let getValueDef: Ley_Option.t(Hero.Attribute.t) => int;

/**
 * `getSkillCheckValues heroAttrs check` returns the values of the attributes
 * defined in the `check` triple by id.
 */
let getSkillCheckValues:
  (Ley_IntMap.t(Hero.Attribute.t), (int, int, int)) => (int, int, int);
