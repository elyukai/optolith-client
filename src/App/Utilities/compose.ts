import { Lens_ } from "../../Data/Lens";

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
