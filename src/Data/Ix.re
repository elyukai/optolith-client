/**
 * The list of values in the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
[@gentype]
let rec range = ((l, u)) =>
  l > u ? [] : l === u ? [u] : [l, ...range((l + 1, u))];

/**
 * Returns `True` the given subscript lies in the range defined the bounding
 * pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
let inRange = ((l, u), x) => l <= x && x <= u;

/**
 * The position of a subscript in the subrange.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 *
 * @raise [Invalid_argument] if index out of range.
 */
[@gentype]
let index = (p, x) =>
  inRange(p, x)
    ? x - fst(p) : raise(invalid_arg("Ix.index: Index out of range."));

/**
 * The size of the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
[@gentype]
let rangeSize = ((l, u)) => l <= u ? u - l + 1 : 0;
