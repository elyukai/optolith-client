import { Tuple } from "../Tuple"
import { sel1, sel2, sel3 } from "./Select"

/**
 * `curryN :: ((a, b) -> c) -> a -> b -> c`
 *
 * `curryN` converts an uncurried function to a curried function.
 */
export const curryN =
  <A, B, C> (f: (x: A, y: B) => C) => (a: A) => (b: B): C =>
    f (a, b)

/**
 * `curryN3 :: ((a, b, c) -> d) -> a -> b -> c -> d`
 *
 * `curryN3` converts an uncurried function to a curried function.
 */
export const curryN3 =
  <A, B, C, D> (f: (a: A, b: B, c: C) => D) => (a: A) => (b: B) => (c: C): D =>
    f (a, b, c)

/**
 * `curryN4 :: ((a, b, c, d) -> e) -> a -> b -> c -> d -> e`
 *
 * `curryN4` converts an uncurried function to a curried function.
 */
export const curryN4 =
  <A, B, C, D, E> (f: (a: A, b: B, c: C, d: D) => E) => (a: A) => (b: B) => (c: C) => (d: D): E =>
    f (a, b, c, d)

/**
 * `curryN5 :: ((a, b, c, d, e) -> f) -> a -> b -> c -> d -> e -> f`
 *
 * `curryN5` converts an uncurried function to a curried function.
 */
export const curryN5 =
  <A, B, C, D, E, F> (f: (a: A, b: B, c: C, d: D, e: E) => F) =>
  (a: A) => (b: B) => (c: C) => (d: D) => (e: E): F =>
    f (a, b, c, d, e)

/**
 * `curryN6 :: ((a, b, c, d, e, f) -> g) -> a -> b -> c -> d -> e -> f -> g`
 *
 * `curryN6` converts an uncurried function to a curried function.
 */
export const curryN6 =
  <A, B, C, D, E, F, G> (fun: (a: A, b: B, c: C, d: D, e: E, f: F) => G) =>
  (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F): G =>
    fun (a, b, c, d, e, f)

/**
 * `uncurryN :: (a -> b -> c) -> (a, b) -> c`
 *
 * `uncurryN` converts a curried function to a function on pairs.
 */
export const uncurryN =
  <A, B, C> (f: (a: A) => (b: B) => C) => (x: A, y: B): C =>
    f (x) (y)

/**
 * `uncurry3 :: (a -> b -> c -> d) -> (a, b, c) -> d`
 *
 * `uncurry3` converts a curried function to a function on pairs.
 */
export const uncurry3 =
  <A, B, C, D> (f: (a: A) => (b: B) => (c: C) => D) => (x: Tuple<[A, B, C]>): D =>
    f (sel1 (x)) (sel2 (x)) (sel3 (x))

/**
 * `uncurryN3 :: (a -> b -> c -> d) -> (a, b, c) -> d`
 *
 * `uncurryN3` converts a curried function to a function on pairs.
 */
export const uncurryN3 =
  <A, B, C, D> (f: (a: A) => (b: B) => (c: C) => D) => (x: A, y: B, z: C): D =>
    f (x) (y) (z)

/**
 * `uncurryN4 :: (a -> b -> c -> d -> e) -> (a, b, c, d) -> e`
 *
 * `uncurryN4` converts a curried function to a function on pairs.
 */
export const uncurryN4 =
  <A, B, C, D, E>
  (f: (a: A) => (b: B) => (c: C) => (c: D) => E) =>
  (x: A, y: B, z: C, a: D): E =>
    f (x) (y) (z) (a)

/**
 * `uncurryN5 :: (a -> b -> c -> d -> e -> f) -> (a, b, c, d, e) -> f`
 *
 * `uncurryN5` converts a curried function to a function on pairs.
 */
export const uncurryN5 =
  <A, B, C, D, E, F>
  (f: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F) =>
  (x: A, y: B, z: C, a: D, b: E): F =>
    f (x) (y) (z) (a) (b)

/**
 * `uncurryN6 :: (a -> b -> c -> d -> e -> f -> g) -> (a, b, c, d, e, f) -> g`
 *
 * `uncurryN6` converts a curried function to a function on pairs.
 */
export const uncurryN6 =
  <A, B, C, D, E, F, G>
  (f: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => G) =>
  (x: A, y: B, z: C, a: D, b: E, c: F): G =>
    f (x) (y) (z) (a) (b) (c)

/**
 * `uncurryN7 :: (a -> b -> c -> d -> e -> f -> g -> h) -> (a, b, c, d, e, f, g) -> h`
 *
 * `uncurryN7` converts a curried function to a function on pairs.
 */
export const uncurryN7 =
  <A, B, C, D, E, F, G, H>
  (f: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => (g: G) => H) =>
  (x: A, y: B, z: C, a: D, b: E, c: F, d: G): H =>
    f (x) (y) (z) (a) (b) (c) (d)

/**
 * `uncurryN8 :: (a -> b -> c -> d -> e -> f -> g -> h -> i) -> (a, b, c, d, e, f, g, h) -> i`
 *
 * `uncurryN8` converts a curried function to a function on pairs.
 */
export const uncurryN8 =
  <A, B, C, D, E, F, G, H, I>
  (f: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => (g: G) => (h: H) => I) =>
  (x: A, y: B, z: C, a: D, b: E, c: F, d: G, e: H): I =>
    f (x) (y) (z) (a) (b) (c) (d) (e)

/**
 * `uncurryN9 :: (a -> b -> c -> d -> e -> f -> g -> h -> i -> j) -> (a, b, c, d, e, f, g, h, i) -> j`
 *
 * `uncurryN9` converts a curried function to a function on pairs.
 */
export const uncurryN9 =
  <A, B, C, D, E, F, G, H, I, J>
  (f: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) =>
      (f: F) => (g: G) => (h: H) => (i: I) => J) =>
  (x: A, y: B, z: C, a: D, b: E, c: F, d: G, e: H, g: I): J =>
    f (x) (y) (z) (a) (b) (c) (d) (e) (g)
