/**
 * `id :: a -> a`
 *
 * The identity function.
 *
 * The I combinator.
 */
export const ident = <A> (x: A): A => x

export type ident<A> = (x: A) => A

/**
 * `const :: a -> b -> a`
 *
 * Returns the first parameter. The second parameter is ignored.
 *
 * The K combinator.
 */
export const cnst = <A> (x: A) => (_?: any): A => x

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
export const thrush = <A> (x: A) => <B> (f: (x: A) => B): B => f (x)

/**
 * `join :: (a -> a -> b) -> (a -> b)`
 *
 * `join f x == f x x`
 *
 * The W combinator.
 */
export const join =
  <A, B>
  (f: (x1: A) => (x2: A) => B) =>
  (x: A): B =>
    f (x) (x)

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
export const on =
  <B, C>
  (b: (x: B) => (y: B) => C) =>
  <A>
  (u: (x: A) => B) =>
  (x: A) =>
  (y: A): C =>
    b (u (x)) (u (y))

/**
 * `onF :: (a -> b) -> (b -> b -> c) -> a -> a -> c`
 *
 * `onF u b x y` runs the binary function `b` on the results of applying unary
 * function `u` to two arguments `x` and `y`. From the opposite perspective, it
 * transforms two inputs and combines the outputs.
 *
 * Flipped version of `on`.
 */
export const onF =
  <A, B>
  (u: (x: A) => B) =>
  <C>
  (b: (x: B) => (y: B) => C) =>
  (x: A) =>
  (y: A): C =>
    b (u (x)) (u (y))

/**
 * `flip :: (a -> b -> c) -> (b -> a -> c)`
 *
 * Reverses the order of the first two arguments of a curried function.
 */
export const flip =
  <A, B, C>
  (f: (p1: A) => (p2: B) => C) =>
  (p1: B) =>
  (p2: A): C =>
    f (p2) (p1)

/**
 * `blackbird :: (c -> d) -> (a -> b -> c) -> a -> b -> d`
 *
 * `blackbird f g x y` passes `x` and `y` (in this order) to `g`, the result is
 * then passed to `f`. The result of `f` is returned.
 *
 * B1 combinator
 */
export const blackbird =
  <C, D> (f: (z: C) => D) =>
  <A, B> (g: (x: A) => (y: B) => C) =>
  (x: A) =>
  (y: B): D =>
    f (g (x) (y))

/**
 * `blackbirdF :: (a -> b -> c) -> (c -> d) -> a -> b -> d`
 *
 * `blackbirdF g f x y` passes `x` and `y` (in this order) to `g`, the result is
 * then passed to `f`. The result of `f` is returned.
 *
 * B1 combinator, flipped version
 */
export const blackbirdF =
  <A, B, C> (g: (x: A) => (y: B) => C) =>
  <D> (f: (z: C) => D) =>
    blackbird (f) (g)

export const genericMap2 =
  <A, D, E>
  (f: (g: (z: D) => E) => (x: A) => A) =>
  <B, C>
  (g: (x: B) => (y: C) => (z: D) => E) =>
  (y: B) =>
  (z: C) =>
  (x: A) =>
    f (g (y) (z)) (x)

export const genericMap2F =
  <B, C, D, E>
  (g: (x: B) => (y: C) => (z: D) => E) =>
  <A>
  (f: (g: (z: D) => E) => (x: A) => A) =>
    genericMap2 (f) (g)


// Type Helpers


/**
 * Get type of first parameter.
 */
export type Param1<A> = A extends (x: infer B) => any ? B : never


// NAMESPACED FUNCTIONS

export const Functn = {
  ident,
  cnst,
  thrush,
  join,
  on,
  onF,
  flip,
  blackbird,
  blackbirdF,
}
