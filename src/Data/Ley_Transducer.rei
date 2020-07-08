/**
 * Efficient complex list transforms.
 *
 * This module provides transducer functions to transduce a list. A transducer
 * is a reducer function that returns another reducer. This way, they can be
 * chained. Common operations like `map` or `filter` can be efficiently chained
 * so that the list will be only traversed once.
 */

type fold('a, 'b) = ('a, 'b) => 'b;

type transducer('a, 'b, 'c) = fold('b, 'c) => fold('a, 'c);

/**
 * The identity transducer. Useful if you need to return a transducer from a
 * function but the transducer is based on conditions.
 */
let idT: transducer('a, 'a, 'b);

/**
 * The transducer version of `map`. Transforms every element using the passed
 * transformation function.
 *
 * Used for right-to-left composition of transducers.
 */
let (<$~): ('a => 'b) => transducer('a, 'b, 'c);

/**
 * The transducer version of `map`. Transforms every element using the passed
 * transformation function.
 *
 * Used for left-to-right composition of transducers.
 */
let (<&~): (fold('b, 'c), 'a => 'b) => fold('a, 'c);

/**
 * The transducer version of `filter`. Applies the passed predicate and only
 * keeps entries that match the predicate.
 *
 * Used for right-to-left composition of transducers.
 */
let (~<<): ('a => bool) => transducer('a, 'a, 'b);

/**
 * The transducer version of `filter`. Applies the passed predicate and only
 * keeps entries that match the predicate.
 *
 * Used for right-to-left composition of transducers.
 */
let (>>~): (fold('a, 'b), 'a => bool) => fold('a, 'b);

/**
 * The transducer version of `mapOption`. Applies the given function to every
 * element in the structure. If the function returns a `Some`, it's value
 * replaces the previous value (`map`). If the function returns `None`, the
 * value is removed from the list (`filter`).
 *
 * Used for left-to-right composition of transducers.
 */
let mapOptionT: ('a => option('b)) => transducer('a, 'b, 'c);

/**
 * `transduceList t xs` applies the transducer `t` to the list `xs`.
 */
let transduceList: (transducer('a, 'b, list('b)), list('a)) => list('b);
