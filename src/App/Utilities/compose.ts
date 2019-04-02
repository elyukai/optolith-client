import { ApplicativeName } from "../../Control/Applicative";
import { ExplA, isPrism, Lens, Lens_, Prism, Traversal } from "../../Data/Lens";

interface composeL {
  <A, B, C> (ab: Lens_<A, B>, bc: Lens_<B, C>): Lens_<A, C>
  <A, B, C, D> (ab: Lens_<A, B>, bc: Lens_<B, C>, cd: Lens_<C, D>): Lens_<A, D>
}

/**
 * Combine lenses to focus on deeper parts of an object at once.
 */
export const composeL: composeL =
  (...ls: Lens_<any, any>[]) => (x: any): any =>
    ls .reduceRight<any> ((y, l) => l (y), x)


type LensOrPrism<S, T, A, B> = Lens<S, T, A, B> | ExplA<Prism<S, T, A, B>>

interface composeP {
  <A0, A1, B0, B1, C0, C1>
  (
    ab: LensOrPrism<A0, A1, B0, B1>,
    bc: LensOrPrism<B0, B1, C0, C1>): (t: ApplicativeName) => Traversal<A0, A1, C0, C1>

  <A0, A1, B0, B1, C0, C1>
  (
    ab: ExplA<Prism<A0, A1, B0, B1>>,
    bc: ExplA<Prism<B0, B1, C0, C1>>): ExplA<Prism<A0, A1, C0, C1>>

  <A0, A1, B0, B1, C0, C1, D0, D1>
  (
    ab: LensOrPrism<A0, A1, B0, B1>,
    bc: LensOrPrism<B0, B1, C0, C1>,
    cd: LensOrPrism<C0, C1, D0, D1>): (t: ApplicativeName) => Traversal<A0, A1, D0, D1>

  <A0, A1, B0, B1, C0, C1, D0, D1>
  (
    ab: ExplA<Prism<A0, A1, B0, B1>>,
    bc: ExplA<Prism<B0, B1, C0, C1>>,
    cd: ExplA<Prism<C0, C1, D0, D1>>): ExplA<Prism<A0, A1, D0, D1>>
}

/**
 * Combine lenses and prisms to focus on deeper parts of an object at once.
 */
export const composeP: composeP =
  (...ls: LensOrPrism<any, any, any, any>[]) =>
  (t: ApplicativeName) =>
  (x: any): any =>
    ls .reduceRight<any> ((y, l) => isPrism (l) ? l (t) (y) : l (y), x)
