import { fromJust, INTERNAL_shallowEquals, isMaybe, isNothing, Just, Maybe, Nothing, Some } from "../../Data/Maybe";
import { lookup, OrderedMap } from "../../Data/OrderedMap";

// @ts-ignore
type MappedReturnType<A extends ((...args: any[]) => any)[]> = { [K in keyof A]: ReturnType<A[K]> }

type Callback<S, V, G extends ((state: S) => any)[], M extends ((mapValue: V) => any)[], R> =
  (...globalValues: MappedReturnType<G>) =>
  (...mapValueValues: MappedReturnType<M>) => R

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
export const createMapSelector =
  <S, V extends Some>
  (mapSelector: (state: S) => OrderedMap<string, V>) =>
  <G extends ((state: S) => any)[]>
  (...globalSelectors: G) =>
  <M extends ((mapValue: V) => any)[]>
  (...mapValueSelectors: M) =>
  <R extends Some>
  (f: Callback<S, V, G, M, R>) => {
    let prevState: S | undefined

    let prevMap: OrderedMap<string, V> | undefined

    const prevValues: Map<string, V> = new Map ()

    const keyMap: Map<string, [MappedReturnType<G>, MappedReturnType<M>]> = new Map ()

    let res: R | undefined

    const g = (key_str: string) => (state: S): Maybe<R> => {
      if (state === prevState && res !== undefined) {
        return Just (res)
      }

      // const mkey_str = normalize (typeof key === "function" ? key (state) : key)

      // if (isNothing (mkey_str)) {
      //   return Nothing
      // }

      // const key_str = fromJust (mkey_str)

      prevState = state

      const map = mapSelector (state)

      const mvalue = lookup (key_str) (map)

      if (isNothing (mvalue)) {
        return Nothing
      }

      const value = fromJust (mvalue)

      const newGlobalValues = globalSelectors .map (s => s (state)) as MappedReturnType<G>

      if (map === prevMap || maybeEquals (value, prevValues .get (key_str))) {
        const prevMapValueValues = keyMap .get (key_str)! [1]

        prevMap = map
        prevValues .set (key_str, value)
        keyMap .set (key_str, [newGlobalValues, prevMapValueValues])

        res = f (...newGlobalValues as any)
                (...prevMapValueValues as any)

        return Just (res)
      }

      const newMapValueValues = mapValueSelectors .map (s => s (value)) as MappedReturnType<M>

      prevMap = map
      prevValues .set (key_str, value)
      keyMap .set (key_str, [newGlobalValues, newMapValueValues])

      res = f (...newGlobalValues as any)
              (...newMapValueValues as any)

      return Just (res)
    }

    g.getCache = () => Maybe (res)
    g.setCache = (x: R) => { res = x }

    return g
  }

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
