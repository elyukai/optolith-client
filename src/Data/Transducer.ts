import { ident } from "./Function";
import { List } from "./List";

export const mapT =
  <A, B> (f: (x: A) => B): Transducer<A, B, List<B>> =>
  foldr =>
  x =>
    foldr (f (x))

export const filterT =
  <A> (pred: (x: A) => boolean): Transducer<A, A, List<A>> =>
  foldr =>
  x =>
    pred (x) ? foldr (x) : ident as ident<List<A>>

export type Transducer<A, B, C> = (foldr: (x: B) => (acc: C) => C) => (x: A) => (acc: C) => C

export const filterMapT =
  <A, B> (t: Transducer<A, B, List<B>>) =>
  (xs: List<A>): List<B> =>
    List.foldr (t (List.consF)) (List ()) (xs)
