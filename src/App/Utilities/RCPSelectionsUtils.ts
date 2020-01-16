import { Just, Maybe, maybe, Nothing } from "../../Data/Maybe";
import { Pair, Tuple } from "../../Data/Tuple";
import { sel1 } from "../../Data/Tuple/Select";

type SelectionValidView = Pair<boolean, Maybe<JSX.Element>>

/**
 * ```haskell
 * getSelPair :: (a -> Bool)
 *            -> (a -> JSX.Element)
 *            -> (b -> Maybe a)
 *            -> b
 *            -> (Bool, Maybe JSX.Element)
 * ```
 *
 * Returns for a part of the selections (`b`) and if the current selection is
 * valid as well as the corresponding view.
 */
export const getSelPair =
  <A, A1 extends [boolean, ...any[]]> (pred: (x: A) => Tuple<A1>) =>
  (getView: (x: A, res: Tuple<A1>) => JSX.Element) =>
  <B> (f: (x: B) => Maybe<A>) =>
  (x: B): SelectionValidView =>
    maybe <SelectionValidView>
          (Pair (true, Nothing))
          ((a: A) => {
            const res = pred (a)

            return Pair (sel1 (res), Just (getView (a, res)))
          })
          (f (x))
