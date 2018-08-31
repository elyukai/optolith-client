type Flip = <T, U, R>(f: (p1: T) => (p2: U) => R) => (p1: U) => (p2: T) => R;

/**
 * `flip :: (a -> b -> c) -> (b -> a -> c)`
 *
 * Reverses the order of the first two arguments of a curried function.
 */
export const flip: Flip = f => p1 => p2 => f (p2) (p1);
