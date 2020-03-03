import { foldr, List } from "../List"
import { add } from "../Num"
import { empty, insertWith, OrderedMap } from "../OrderedMap"

/**
 * `count` of each element in the list.
 */
export const count = <A> (xs: List<A>): OrderedMap<A, number> =>
  foldr ((x: A) => insertWith (add) (x) (1)) (empty) (xs)
