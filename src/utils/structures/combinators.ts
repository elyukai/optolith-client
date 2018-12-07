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
