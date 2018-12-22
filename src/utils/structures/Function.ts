/**
 * `id :: a -> a`
 *
 * The identity function.
 *
 * The I combinator.
 */
export const id = <A> (x: A): A => x

/**
 * `const :: a -> b -> a`
 *
 * Returns the first parameter. The second parameter is ignored.
 *
 * The K combinator.
 */
export const cnst = <A> (x: A) => (): A => x

/**
 * `(&) :: a -> (a -> b) -> b`
 *
 * Takes a value and a function, and returns the result of applying the function
 * to the value. Reversed function application.
 *
 * Also called `then`.
 *
 * The T combinator.
 */
export const T = <A, B> (x: A) => (f: (x: A) => B): B => f (x)

/**
 * `join :: (a -> a -> b) -> (a -> b)`
 *
 * `join f x == f x x`
 *
 * The W combinator.
 */
export const join = <A, B> (f: (x1: A) => (x2: A) => B) => (x: A): B => f (x) (x)

/**
 * `on :: (b -> b -> c) -> (a -> b) -> a -> a -> c`
 *
 * `on b u x y` runs the binary function `b` on the results of applying unary
 * function `u` to two arguments `x` and `y`. From the opposite perspective, it
 * transforms two inputs and combines the outputs.
 *
 * ```((+) `on` f) x y = f x + f y```
 *
 * Typical usage: ```sortBy (compare `on` fst)```.
 */
export const on = <A, B, C> (b: (x: B) => (y: B) => C) => (u: (x: A) => B) => (x: A) => (y: A): C =>
  b (u (x)) (u (y))

export const Functn = {
  id,
  cnst,
  T,
  join,
  on,
}
