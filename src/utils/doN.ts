import { Monad } from '../types/algebraic';
import { Just, Maybe } from './dataUtils';

/**
 * EXPERIMENT to implement Haskell's do notation in TypeScript
 *
 * NOT TYPE SAFE!
 */
// tslint:disable-next-line:variable-name
export const UNSAFE_doM = <M extends Monad<any>>(f: () => Iterator<M>): M => {
  const generator = f ();

  const step = (value?: M extends Monad<infer I> ? I : undefined): M => {
    const result = generator.next (value);

    return result.done ? result.value as M : result.value.bind (step) as M;
  };

  return step ();
};

const test = UNSAFE_doM (function* (): Iterator<Maybe<number>> {
  const a: number = yield Just (1);
  const b: number = yield Just (2);

  return a + b;
});
