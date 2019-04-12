import { Lens_ } from "../../Data/Lens";

interface compose {
  <A, B, C> (bc: (b: B) => C, ab: (a: A) => B): (a: A) => C
  <A, B, C, D> (cd: (c: C) => D, bc: (b: B) => C, ab: (a: A) => B): (a: A) => D

  <A, B, C, D, E>
  (
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B
  ): (a: A) => E

  <A, B, C, D, E, F>
  (
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B
  ): (a: A) => F

  <A, B, C, D, E, F, G>
  (
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B
  ): (a: A) => G

  <A, B, C, D, E, F, G, H>
  (
    gh: (g: G) => H,
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B
  ): (a: A) => H

  <A, B, C, D, E, F, G, H, I>
  (
    hi: (h: H) => I,
    gh: (g: G) => H,
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B
  ): (a: A) => I

  <A, B, C, D, E, F, G, H, I, J>
  (
    ij: (i: I) => J,
    hi: (h: H) => I,
    gh: (g: G) => H,
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B
  ): (a: A) => J

  <A, B, C, D, E, F, G, H, I, J, K>
  (
    jk: (j: J) => K,
    ij: (i: I) => J,
    hi: (h: H) => I,
    gh: (g: G) => H,
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B
  ): (a: A) => K
}

/**
 * Creates a new function that runs each of the functions supplied as parameters
 * in turn, passing the return value of each function invocation to the next
 * function invocation, beginning with whatever arguments were passed to the
 * initial invocation.
 */
export const compose: compose =
  (...fs: ((x: any) => any)[]) => (x: any): any =>
    fs .reduceRight<any> ((y, f) => f (y), x)

interface composeL {
  <A, B, C> (ab: Lens_<A, B>, bc: Lens_<B, C>): Lens_<A, C>
  <A, B, C, D> (ab: Lens_<A, B>, bc: Lens_<B, C>, cd: Lens_<C, D>): Lens_<A, D>
}

/**
 * Combine lenses to focus on deeper parts of an object at once.
 */
export const composeL: composeL =
  (...ls: Lens_<any, any>[]) => (x: any): any =>
    ls .reduceRight<any> ((y, l) => l (y), x)


// type LensOrPrism<S, T, A, B> = Lens<S, T, A, B> | ExplA<Prism<S, T, A, B>>

// interface composeP {
//   <A0, A1, B0, B1, C0, C1>
//   (
//     ab: LensOrPrism<A0, A1, B0, B1>,
//     bc: LensOrPrism<B0, B1, C0, C1>): (t: ApplicativeName) => Traversal<A0, A1, C0, C1>

//   <A0, A1, B0, B1, C0, C1>
//   (
//     ab: ExplA<Prism<A0, A1, B0, B1>>,
//     bc: ExplA<Prism<B0, B1, C0, C1>>): ExplA<Prism<A0, A1, C0, C1>>

//   <A0, A1, B0, B1, C0, C1, D0, D1>
//   (
//     ab: LensOrPrism<A0, A1, B0, B1>,
//     bc: LensOrPrism<B0, B1, C0, C1>,
//     cd: LensOrPrism<C0, C1, D0, D1>): (t: ApplicativeName) => Traversal<A0, A1, D0, D1>

//   <A0, A1, B0, B1, C0, C1, D0, D1>
//   (
//     ab: ExplA<Prism<A0, A1, B0, B1>>,
//     bc: ExplA<Prism<B0, B1, C0, C1>>,
//     cd: ExplA<Prism<C0, C1, D0, D1>>): ExplA<Prism<A0, A1, D0, D1>>
// }

// /**
//  * Combine lenses and prisms to focus on deeper parts of an object at once.
//  */
// export const composeP: composeP =
//   (...ls: LensOrPrism<any, any, any, any>[]) =>
//   (t: ApplicativeName) =>
//   (x: any): any =>
//     ls .reduceRight<any> ((y, l) => isPrism (l) ? l (t) (y) : l (y), x)
