/**
 * `id :: a -> a`
 *
 * The identity function.
 */
export const id = <A> (x: A): A => x;

/**
 * `const :: a -> b -> a`
 *
 * Returns the first element.
 */
export const cnst = <A> (x: A) => (): A => x;

/**
 * `(&) :: a -> (a -> b) -> b`
 *
 * Takes a value and a function, and returns the result of applying the function
 * to the value.
 */
export const T = <A, B> (x: A) => (f: (x: A) => B): B => f (x);
