interface pipe {
  <A extends any[], B, C> (ab: (...a: A) => B, bc: (b: B) => C): (...a: A) => C
  <A extends any[], B, C, D> (ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (...a: A) => D

  <A extends any[], B, C, D, E>
  (
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E
  ): (...a: A) => E

  <A extends any[], B, C, D, E, F>
  (
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F
  ): (...a: A) => F

  <A extends any[], B, C, D, E, F, G>
  (
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G
  ): (...a: A) => G

  <A extends any[], B, C, D, E, F, G, H>
  (
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H
  ): (...a: A) => H

  <A extends any[], B, C, D, E, F, G, H, I>
  (
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I
  ): (...a: A) => I

  <A extends any[], B, C, D, E, F, G, H, I, J>
  (
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J
  ): (...a: A) => J

  <A extends any[], B, C, D, E, F, G, H, I, J, K>
  (
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K
  ): (...a: A) => K

  <A extends any[], B, C, D, E, F, G, H, I, J, K, L>
  (
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: L) => L
  ): (...a: A) => L

  <A extends any[], B, C, D, E, F, G, H, I, J, K, L, M>
  (
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (k: L) => M
  ): (...a: A) => M
}

/**
 * Creates a new function that runs each of the functions supplied as parameters
 * in turn, passing the return value of each function invocation to the next
 * function invocation, beginning with whatever arguments were passed to the
 * initial invocation.
 */
export const pipe: pipe =
  (...fs: ((...x: any[]) => any)[]) => (...x: any[]): any =>
    fs.length === 0
    ? x
    : fs.length === 1
    ? fs [0] (...x)
    : fs .slice (1) .reduce<any> ((y, f) => f (y), fs [0] (...x))

interface pipe_ {
  <A, B> (a: A, ab: (a: A) => B): B
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

  <A, B, C, D, E, F, G, H, I, J, K, L>
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
    jk: (j: J) => K,
    kl: (k: K) => L
  ): L
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
