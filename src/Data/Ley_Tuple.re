let pair = (x, y) => (x, y);

module Bifunctor = {
  let bimap = (f, g, (x, y)) => (f(x), g(y));

  let first = (f, (x, y)) => (f(x), y);

  let second = (f, (x, y)) => (x, f(y));
};

/**
 * Extract the first component of a pair.
 */
let fst = ((x, _)) => x;

/**
 * Extract the second component of a pair.
 */
let snd = ((_, y)) => y;

/**
 * Swap the components of a pair.
 */
let swap = ((x, y)) => (y, x);
