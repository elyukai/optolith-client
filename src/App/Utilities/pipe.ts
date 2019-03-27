interface pipe {
  <A, B, C> (ab: (a: A) => B, bc: (b: B) => C): (a: A) => C
  <A, B, C, D> (ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (a: A) => D

  <A, B, C, D, E>
  (
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E
  ): (a: A) => E

  <A, B, C, D, E, F>
  (
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F
  ): (a: A) => F

  <A, B, C, D, E, F, G>
  (
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G
  ): (a: A) => G

  <A, B, C, D, E, F, G, H>
  (
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H
  ): (a: A) => H

  <A, B, C, D, E, F, G, H, I>
  (
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I
  ): (a: A) => I

  <A, B, C, D, E, F, G, H, I, J>
  (
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J
  ): (a: A) => J

  <A, B, C, D, E, F, G, H, I, J, K>
  (
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K
  ): (a: A) => K
}

/**
 * Creates a new function that runs each of the functions supplied as parameters
 * in turn, passing the return value of each function invocation to the next
 * function invocation, beginning with whatever arguments were passed to the
 * initial invocation.
 */
export const pipe: pipe =
  (...fs: ((x: any) => any)[]) => (x: any): any =>
    fs .reduce<any> ((y, f) => f (y), x)

interface pipe_ {
  <A, B, C> (a: A, ab: (a: A) => B, bc: (b: B) => C): C
  <A, B, C, D> (a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D

  <A, B, C, D, E>
  (
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E
  ): E

  <A, B, C, D, E, F>
  (
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F
  ): F

  <A, B, C, D, E, F, G>
  (
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G
  ): G

  <A, B, C, D, E, F, G, H>
  (
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H
  ): H

  <A, B, C, D, E, F, G, H, I>
  (
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I
  ): I

  <A, B, C, D, E, F, G, H, I, J>
  (
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J
  ): J

  <A, B, C, D, E, F, G, H, I, J, K>
  (
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K
  ): K
}

/**
 * Creates a new function that runs each of the functions supplied as parameters
 * in turn, passing the return value of each function invocation to the next
 * function invocation, beginning with whatever arguments were passed to the
 * initial invocation.
 */
export const pipe_: pipe_ =
  (x: any, ...fs: ((x: any) => any)[]): any =>
    fs .reduce<any> ((y, f) => f (y), x)
