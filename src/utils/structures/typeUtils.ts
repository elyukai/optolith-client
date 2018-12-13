import { Some } from "./Maybe.new";

export interface Functor<A extends Some> {
  readonly ['@@type/Functor']: {
    fmap: <B extends Some>(f: (x: A) => B) => (m: Functor<A>) => Functor<B>;
    mapReplace: <B extends Some>(x: A) => (xs: Functor<B>) => Functor<A>;
  };
}
