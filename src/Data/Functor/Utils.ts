import { Identity } from "../../Control/Monad/Identity"
import { Either, Right } from "../Either"
import { flip } from "../Function"
import { fmap, Functor } from "../Functor"
import { List } from "../List"
import { Market } from "../Market"
import { Maybe } from "../Maybe"
import { OrderedMap } from "../OrderedMap"
import { Pair } from "../Tuple"
import { Const } from "./Const"

type FunctorMap2<A, B, C> =
  <F extends Functor<A>>
  (x: F) =>
  (y: B) =>
    F extends Const<infer A0, A> ? Const<A0, C> :
    F extends Either<any, A> ? Exclude<F, Right<any>> | Right<C> :
    F extends Identity<A> ? Identity<C> :
    F extends Promise<A> ? Promise<C> :
    F extends List<A> ? List<C> :
    F extends Maybe<A> ? Maybe<C> :
    F extends OrderedMap<infer K, A> ? OrderedMap<K, C> :
    F extends Pair<infer A1, A> ? Pair<A1, C> :
    F extends ((x: infer I) => A) ? (x: I) => C :
    F extends Market<infer A_, infer B_, infer S_, A> ? Market<A_, B_, S_, C> :
    never

/**
 * `fmap2 :: (a -> b -> c) -> f a -> b -> f c`
 */
export const fmap2 =
  <A, B, C> (f: (x: A) => (y: B) => C): FunctorMap2<A, B, C> => m => y =>
    fmap<A, C> (flip (f) (y)) (m) as any
