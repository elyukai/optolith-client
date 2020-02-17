import { Either, fromRight_, isLeft, Left, Right, second } from "../../../Data/Either"
import { ident } from "../../../Data/Function"
import { ifElse } from "../ifElse"
import { cons } from "./Array"


/**
 * `mapM :: (a -> Either e b) -> [a] -> Either e [b]`
 *
 * `mapM f xs` takes a function and a list and maps the function over every
 * element in the list. If the function returns a `Left`, it is immediately
 * returned by the function. If `f` did not return any `Left`, the list of
 * unwrapped return values is returned as a `Right`. If `xs` is empty,
 * `Right []` is returned.
 */
export const mapM =
  <E, A, B>
  (f: (x: A) => Either<E, B>) =>
  (xs: A[]): Either<E, B[]> =>
    xs.length === 0
    ? Right ([])
    : ifElse <Either<E, B>, Left<E>> (isLeft)
             <Either<E, B[]>> (ident)
             (y => second (cons (fromRight_ (y)))
                          (mapM (f) (xs .slice (1))))
             (f (xs [0]))
