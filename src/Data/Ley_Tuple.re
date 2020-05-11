let pair = (x, y) => (x, y);

module Bifunctor = {
  [@genType]
  let bimap = (f, g, (x, y)) => (f(x), g(y));

  [@genType]
  let first = (f, (x, y)) => (f(x), y);

  [@genType]
  let second = (f, (x, y)) => (x, f(y));
};

/**
 * Extract the first component of a pair.
 */
[@genType]
let fst = ((x, _)) => x;

/**
 * Extract the second component of a pair.
 */
[@genType]
let snd = ((_, y)) => y;

/**
 * Swap the components of a pair.
 */
[@genType]
let swap = ((x, y)) => (y, x);
