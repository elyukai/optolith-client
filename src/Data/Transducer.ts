import { ident } from "./Function"
import { List } from "./List"

export const idT = <A, B>(g: FoldR<A, B>) => (x: A) => g (x)

export const mapT = <A, B> (f: (x: A) => B): Transducer<A, B> => g => x => g (f (x))

interface filterT {
  <A, A0 extends A> (pred: (x: A) => x is A0): Transducer<A, A0>
  <A> (pred: (x: A) => boolean): Transducer<A, A>
}

export const filterT: filterT = <A> (pred: (x: A) => boolean): Transducer<A, A> => g => x =>
  pred (x) ? g (x) : ident

export type FoldR<A, B> = (x: A) => (acc: B) => B

export type Transducer<A, B> = <C> (foldr: FoldR<B, C>) => FoldR<A, C>

export const filterMapListT =
  <A, B> (t: Transducer<A, B>) =>
  (xs: List<A>): List<B> =>
    List.foldr (t (List.consF)) (List ()) (xs)
