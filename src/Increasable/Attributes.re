open Ley_Option;
open Hero.Attribute;

/**
   * Takes an attribute's hero entry that might not exist and returns the value
   * of that attribute. Note: If the attribute is not yet defined, it's value is
   * `8`.
   */
let getValueDef = option(8, x => x.value);

/**
   * Takes a skill check's attribute triple and returns it's values.
   */
let getSkillCheckValues = (mp, (a1, a2, a3)) => (
  Ley_IntMap.lookup(a1, mp) |> getValueDef,
  Ley_IntMap.lookup(a2, mp) |> getValueDef,
  Ley_IntMap.lookup(a3, mp) |> getValueDef,
);
