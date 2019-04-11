import { ParametricSelector, Selector } from "reselect";
import { cnst } from "../../Data/Function";
import { fromJust, INTERNAL_shallowEquals, isMaybe, isNothing, Just, Maybe, Nothing, Some } from "../../Data/Maybe";
import { fromMap, lookup, OrderedMap, toMap } from "../../Data/OrderedMap";

/**
 * ```haskell
 * createMapSelector :: ((s, p) -> Map String v)
 *                   -> (...(String -> (s, p) -> ...a))
 *                   -> (...((s, p) -> ...b))
 *                   -> (...((v, p) -> ...c))
 *                   -> (...a -> ...b -> ...c -> r)
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
export const createMapSelector =
  <S, P1, V extends Some>
  (mapSelector: PSelector<S, P1, OrderedMap<string, V>>) =>
  <K extends PSelectorWithKey<S, any, any>[]>
  (...globalSelectorsWithKey: K) =>
  <G extends PSelector<S, any, any>[]>
  (...globalSelectors: G) =>
  <M extends PSelector<V, any, any>[]>
  (...valueSelectors: M) =>
  <R extends Some, P extends CombineProps<P1, K, G, M> = CombineProps<P1, K, G, M>>
  (fold: Callback<S, V, K, G, M, R>): CreatedParametricSelector<S, P, V, R> => {
    let prevState: S | undefined

    let prevMap: OrderedMap<string, V> | undefined

    const prevValues: Map<string, V> = new Map ()

    const keyMap: Map<string, [MappedReturnType<G>, MappedReturnType<M>]> = new Map ()

    let resMap: Map<string, R> = new Map ()

    const g = (key_str: string) => (state: S, props: P): Maybe<R> => {
      let res = resMap .get (key_str)

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

      const newGlobalValuesWithKey =
        globalSelectorsWithKey .map (s => s (key_str) (state, props)) as
          MappedReturnType<MappedReturnType<K>>

      const newGlobalValues =
        globalSelectors .map (s => s (state, props)) as MappedReturnType<G>

      if (map === prevMap || maybeEquals (value, prevValues .get (key_str))) {
        const prevMapValueValues = keyMap .get (key_str)! [1]

        prevMap = map
        prevValues .set (key_str, value)
        keyMap .set (key_str, [newGlobalValues, prevMapValueValues])

        res = fold (...newGlobalValuesWithKey as any)
                   (...newGlobalValues as any)
                   (...prevMapValueValues as any)

        resMap .set (key_str, res)

        return Just (res)
      }

      const newMapValueValues =
        valueSelectors .map (s => s (value, props)) as MappedReturnType<M>

      prevMap = map
      prevValues .set (key_str, value)
      keyMap .set (key_str, [newGlobalValues, newMapValueValues])

      res = fold (...newGlobalValuesWithKey as any)
                 (...newGlobalValues as any)
                 (...newMapValueValues as any)

      resMap .set (key_str, res)

      return Just (res)
    }

    g.getCacheAt = (key_str: string) => Maybe (resMap .get (key_str))
    g.setCacheAt = (key_str: string) => (x: R) => { resMap .set (key_str, x) }
    g.getCache = () => fromMap (resMap)
    g.setCache = (m: OrderedMap<string, R>) => { resMap = toMap (m) as Map<string, R> }
    g.setBaseMap = (m: OrderedMap<string, V>) => { prevMap = m }
    g.setState = (s: S) => { prevState = s }

    return g
  }

/**
 * ```haskell
 * createMapSelector :: (s -> Map String v)
 *                   -> (...(s -> ...a))
 *                   -> (...(v -> ...b))
 *                   -> (...a -> ...b -> r)
 *                   -> String
 *                   -> s
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
export const createMapSelectorS =
  <S, V extends Some>
  (mapSelector: Selector<S, OrderedMap<string, V>>) =>
  <G extends Selector<S, any>[]>
  (...globalSelectors: G) =>
  <M extends Selector<V, any>[]>
  (...valueSelectors: M) =>
  <R extends Some>
  (fold: CallbackWithoutKeys<S, V, G, M, R>): CreatedSelector<S, V, R> =>
    createMapSelector (mapSelector)
                      ()
                      (...globalSelectors)
                      (...valueSelectors)
                      (cnst (fold)) as CreatedSelector<S, V, R>

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
export const createMapSelectorP =
  <S, P1, V extends Some>
  (mapSelector: PSelector<S, P1, OrderedMap<string, V>>) =>
  <G extends PSelector<S, any, any>[]>
  (...globalSelectors: G) =>
  <M extends PSelector<V, any, any>[]>
  (...valueSelectors: M) =>
  <R extends Some, P extends P1 & Props<G> & Props<M> = P1 & Props<G> & Props<M>>
  (fold: CallbackWithoutKeys<S, V, G, M, R>): CreatedParametricSelector<S, P, V, R> =>
    createMapSelector (mapSelector)
                      ()
                      (...globalSelectors)
                      (...valueSelectors)
                      (cnst (fold))

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

type Props<S> = S extends ParametricSelector<any, infer I, any>[] ? I : never

type CombineProps<
    M,
    K extends PSelectorWithKey<any, any, any>[],
    G extends PSelector<any, any, any>[],
    V extends PSelector<any, any, any>[]
  > = M & Props<MappedReturnType<K>> & Props<G> & Props<V>

type Callback
  <
    S,
    V,
    K extends PSelectorWithKey<S, any, any>[],
    G extends PSelector<S, any, any>[],
    M extends PSelector<V, any, any>[],
    R
  > =
    (...globalValuesWithKey: MappedReturnType<MappedReturnType<K>>) =>
    (...globalValues: MappedReturnType<G>) =>
    (...mapValueValues: MappedReturnType<M>) => R

type CallbackWithoutKeys
  <
    S,
    V,
    G extends PSelector<S, any, any>[],
    M extends PSelector<V, any, any>[],
    R
  > =
    (...globalValues: MappedReturnType<G>) =>
    (...mapValueValues: MappedReturnType<M>) => R

interface Cache<S, V, R> {
  getCacheAt (key_str: string): Maybe<R>
  setCacheAt (key_str: string): (x: R) => void
  getCache (): OrderedMap<string, R>
  setCache (m: OrderedMap<string, R>): void
  setBaseMap (m: OrderedMap<string, V>): void
  setState (s: S): void
}

interface CreatedSelector<S, V, R> extends Cache<S, V, R> {
  (key_str: string): (state: S) => Maybe<R>;
}

interface CreatedParametricSelector<S, P, V, R> extends Cache<S, V, R> {
  (key_str: string): (state: S, props: P) => Maybe<R>;
}

type PSelector<S, P, R> = ParametricSelector<S, P, R>

type PSelectorWithKey<S, P, R> = (key_str: string) => ParametricSelector<S, P, R>
