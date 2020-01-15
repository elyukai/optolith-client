import { Just, Maybe, maybe, Nothing } from "../../Data/Maybe";
import { Pair } from "../../Data/Tuple";

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
export const getSelPair: <A> (pred: (x: A) => boolean) =>
                         (getView: (x: A) => JSX.Element) =>
                         <B> (f: (x: B) => Maybe<A>) =>
                         (x: B) => SelectionValidView =
  <A> (pred: (x: A) => boolean) =>
  (getView: (x: A) => JSX.Element) =>
  <B> (f: (x: B) => Maybe<A>) =>
  (x: B): SelectionValidView =>
    maybe <SelectionValidView>
          (Pair (true, Nothing))
          ((a: A) => Pair (pred (a), Just (getView (a))))
          (f (x))
