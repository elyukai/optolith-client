/**
 * `whilePred :: (a -> Bool) -> (a -> a) -> a -> a`
 *
 * `whilePred pred f x` runs `f x` recursively as long as the predicate `pred`
 * returns `True` on `x`.
 */
export const whilePred =
  <A>
  (pred: (x: A) => boolean) =>
  (f: (x: A) => A) =>
  (x: A): A =>
    pred (x) ? whilePred (pred) (f) (f (x)) : x
