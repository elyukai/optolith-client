/**
 * `id :: a -> a`
 *
 * The identity function.
 */
export const id = <A> (x: A): A => x

/**
 * `const :: a -> b -> a`
 *
 * Returns the first parameter. The second parameter is ignored.
 */
export const cnst = <A> (x: A) => (): A => x

/**
 * `(&) :: a -> (a -> b) -> b`
 *
 * Takes a value and a function, and returns the result of applying the function
 * to the value.
 *
 * Also called `then`.
 */
export const T = <A, B> (x: A) => (f: (x: A) => B): B => f (x)

/**
 * `join :: (a -> a -> b) -> (a -> b)`
 *
 * `join f x == f x x`
 */
export const join = <A, B> (f: (x1: A) => (x2: A) => B) => (x: A): B => f (x) (x)
