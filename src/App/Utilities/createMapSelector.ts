import { ParametricSelector, Selector } from "reselect";
import { fromJust, INTERNAL_shallowEquals, isMaybe, isNothing, Just, Maybe, Nothing, Some } from "../../Data/Maybe";
import { lookup, OrderedMap } from "../../Data/OrderedMap";

/**
 * ```haskell
 * createMapSelector :: ((s, p) -> Map String v)
 *                   -> (...((s, p) -> ...a))
 *                   -> (...((v, p) -> ...b))
 *                   -> (...a -> ...b -> r)
 *                   -> String
 *                   -> (s, p)
 *                   -> Maybe r
 * ```
 *
 * `createMapSelector mapSelector (...global) (...map_value) f key` creates a
 * special selector for Redux that is based on an `OrderedMap`. The special
 * thing is that it caches the selector results based on the `key` in the map
 * that is returned from applying the `mapSelector` function to the passed
 * state. So it's basically a Reselect selector for all keys in the map
 * together. You can set `global` selector, that access the whole app state, as
 * well as `map_value` selectors, that access the value at the current key. `f`
 * takes all selector results and produces a value that is returned and also
 * cached for the current `key`.
 */
export const createMapSelector = (
  // tslint:disable-next-line: max-line-length
  <S, P, V extends Some, G extends PSelector<S, P, any>[], M extends PSelector<V, P, any>[], R extends Some>
  ({
    map: mapSelector,
    global: globalSelectors,
    value: valueSelectors,
    fold,
  }: CreateParametricMapSelectorOptions<S, P, V, G, M, R>) => {
    let prevState: S | undefined

    let prevMap: OrderedMap<string, V> | undefined

    const prevValues: Map<string, V> = new Map ()

    const keyMap: Map<string, [MappedReturnType<G>, MappedReturnType<M>]> = new Map ()

    let res: R | undefined

    const g = (key_str: string) => (state: S, props: P): Maybe<R> => {
      if (state === prevState && res !== undefined) {
        return Just (res)
      }

      // const mkey_str = normalize (typeof key === "function" ? key (state) : key)

      // if (isNothing (mkey_str)) {
      //   return Nothing
      // }

      // const key_str = fromJust (mkey_str)

      prevState = state

      const map = mapSelector (state, props)

      const mvalue = lookup (key_str) (map)

      if (isNothing (mvalue)) {
        return Nothing
      }

      const value = fromJust (mvalue)

      const newGlobalValues =
        globalSelectors .map (s => s (state, props)) as MappedReturnType<G>

      if (map === prevMap || maybeEquals (value, prevValues .get (key_str))) {
        const prevMapValueValues = keyMap .get (key_str)! [1]

        prevMap = map
        prevValues .set (key_str, value)
        keyMap .set (key_str, [newGlobalValues, prevMapValueValues])

        res = fold (...newGlobalValues as any)
                   (...prevMapValueValues as any)

        return Just (res)
      }

      const newMapValueValues =
        valueSelectors .map (s => s (value, props)) as MappedReturnType<M>

      prevMap = map
      prevValues .set (key_str, value)
      keyMap .set (key_str, [newGlobalValues, newMapValueValues])

      res = fold (...newGlobalValues as any)
                 (...newMapValueValues as any)

      return Just (res)
    }

    g.getCache = () => Maybe (res)
    g.setCache = (x: R) => { res = x }

    return g
  }
) as unknown as createMapSelector

const maybeEquals =
  (x: any, y: any) =>
    isMaybe (x) && isMaybe (y)
      ? INTERNAL_shallowEquals (x) (y)
      : x === y

// Type inference test:
//
// const test = createMapSelector (() => OrderedMap.fromUniquePairs<string, { value: number }>())
//                                (() => 2, () => "string")
//                                (() => [2], () => [true])
//                                ((test, test2) => (arr1, arr2) => ["test"])

// @ts-ignore
type MappedReturnType<A extends ((...args: any[]) => any)[]> = { [K in keyof A]: ReturnType<A[K]> }

type Callback
  <S, V, G extends Selector<S, any>[], M extends Selector<V, any>[], R> =
    (...globalValues: MappedReturnType<G>) =>
    (...mapValueValues: MappedReturnType<M>) => R

type ParametricCallback
  <S, P, V, G extends PSelector<S, P, any>[], M extends PSelector<V, P, any>[], R> =
    (...globalValues: MappedReturnType<G>) =>
    (...mapValueValues: MappedReturnType<M>) => R

interface CreatedSelector<S, R> {
  (key_str: string): (state: S) => Maybe<R>;
  getCache (): Maybe<R>;
  setCache (x: R): void;
}

interface CreatedParametricSelector<S, P, R> {
  (key_str: string): (state: S, props: P) => Maybe<R>;
  getCache (): Maybe<R>;
  setCache (x: R): void;
}

type PSelector<S, P, R> = ParametricSelector<S, P, R>

interface CreateParametricMapSelectorOptions
  // tslint:disable-next-line: max-line-length
  <S, P, V extends Some, G extends PSelector<S, P, any>[], M extends PSelector<V, P, any>[], R extends Some> {
    map: PSelector<S, P, OrderedMap<string, V>>;
    global: G;
    value: M;
    fold: ParametricCallback<S, P, V, G, M, R>;
  }

interface CreateMapSelectorOptions
  <S, V extends Some, G extends Selector<S, any>[], M extends Selector<V, any>[], R extends Some>
  extends CreateParametricMapSelectorOptions<S, any, V, G, M, R> {
    map: Selector<S, OrderedMap<string, V>>;
    global: G;
    value: M;
    fold: Callback<S, V, G, M, R>;
  }

interface CreateParametricValueMapSelectorOptions
  // tslint:disable-next-line: max-line-length
  <S, P, V extends Some, G extends Selector<S, any>[], M extends PSelector<V, P, any>[], R extends Some>
  extends CreateParametricMapSelectorOptions<S, any, V, G, M, R> {
    map: Selector<S, OrderedMap<string, V>>;
    global: G;
    value: M;
    fold: ParametricCallback<S, P, V, G, M, R>;
  }

interface createMapSelector {
  /**
   * `createMapSelector mapSelector (...global) (...map_value) f key` creates a
   * special selector for Redux that is based on an `OrderedMap`. The special
   * thing is that it caches the selector results based on the `key` in the map
   * that is returned from applying the `mapSelector` function to the passed
   * state. So it's basically a Reselect selector for all keys in the map
   * together. You can set `global` selector, that access the whole app state, as
   * well as `map_value` selectors, that access the value at the current key. `f`
   * takes all selector results and produces a value that is returned and also
   * cached for the current `key`.
   */
  <S, V extends Some, G extends Selector<S, any>[], M extends Selector<V, any>[], R extends Some>
  (options: CreateMapSelectorOptions<S, V, G, M, R>):
  CreatedSelector<S, R>

  /**
   * `createMapSelector mapSelector (...global) (...map_value) f key` creates a
   * special selector for Redux that is based on an `OrderedMap`. The special
   * thing is that it caches the selector results based on the `key` in the map
   * that is returned from applying the `mapSelector` function to the passed
   * state. So it's basically a Reselect selector for all keys in the map
   * together. You can set `global` selector, that access the whole app state, as
   * well as `map_value` selectors, that access the value at the current key. `f`
   * takes all selector results and produces a value that is returned and also
   * cached for the current `key`.
   */
  // tslint:disable-next-line: max-line-length
  <S, P, V extends Some, G extends Selector<S, any>[], M extends PSelector<V, P, any>[], R extends Some>
  (options: CreateParametricValueMapSelectorOptions<S, P, V, G, M, R>):
  CreatedParametricSelector<S, P, R>

  /**
   * `createMapSelector mapSelector (...global) (...map_value) f key` creates a
   * special selector for Redux that is based on an `OrderedMap`. The special
   * thing is that it caches the selector results based on the `key` in the map
   * that is returned from applying the `mapSelector` function to the passed
   * state. So it's basically a Reselect selector for all keys in the map
   * together. You can set `global` selector, that access the whole app state, as
   * well as `map_value` selectors, that access the value at the current key. `f`
   * takes all selector results and produces a value that is returned and also
   * cached for the current `key`.
   */
  // tslint:disable-next-line: max-line-length
  <S, P, V extends Some, G extends PSelector<S, P, any>[], M extends PSelector<V, P, any>[], R extends Some>
  (options: CreateParametricMapSelectorOptions<S, P, V, G, M, R>):
  CreatedParametricSelector<S, P, R>
}

type Concat<A extends any[], B extends any[]> = [...A, ...B]
