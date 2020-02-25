/**
 * The list of values in the subrange defined by a bounding pair.
 *
 * The arguments specify the lower and upper bounds of a contiguous subrange of
 * values.
 */
let rec range = (l, u) =>
  l > u ? [] : l === u ? [u] : [l, ...range(l + 1, u)];
