/**
 * The list of values in the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
let rec range = p =>
  fst(p) < snd(p)
    ? [fst(p), ...range((fst(p) + 1, snd(p)))] : [snd(p)];
