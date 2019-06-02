interface whilePred {
  <A, A1 extends A> (pred: (x: A) => x is A1): (f: (x: A1) => A) => (x: A) => A
  <A> (pred: (x: A) => boolean): (f: (x: A) => A) => (x: A) => A
}

/**
 * `whilePred :: (a -> Bool) -> (a -> a) -> a -> a`
 *
 * `whilePred pred f x` runs `f x` recursively as long as the predicate `pred`
 * returns `True` on `x`.
 *
 * It's the functional version of the imperative `while`-loop. First, the value
 * is checked, then it's going to be mapped over, then checked again, mapped
 * over again, and so on. As long as the predicate returns `True`.
 */
export const whilePred: whilePred =
  <A>
  (pred: (x: A) => boolean) =>
  (f: (x: A) => A) =>
  (x: A): A =>
    pred (x) ? whilePred (pred) (f) (f (x)) : x
