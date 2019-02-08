import { fromJust, INTERNAL_shallowEquals, isMaybe, isNothing, Just, Maybe, Nothing, Some } from "../../Data/Maybe";
import { lookup, OrderedMap } from "../../Data/OrderedMap";
import { AppState } from "../../reducers/appReducer";

// @ts-ignore
type MappedReturnType<A extends ((...args: any[]) => any)[]> = { [K in keyof A]: ReturnType<A[K]> }

type Callback<V, G extends ((state: AppState) => any)[], M extends ((mapValue: V) => any)[], R> =
  (...globalValues: MappedReturnType<G>) =>
  (...mapValueValues: MappedReturnType<M>) => R

export const createMapSelector =
  <V extends Some>
  (mapSelector: (state: AppState) => OrderedMap<string, V>) =>
  <G extends ((state: AppState) => any)[]>
  (...globalSelectors: G) =>
  <M extends ((mapValue: V) => any)[]>
  (...mapValueSelectors: M) =>
  <R extends Some>
  (f: Callback<V, G, M, R>) => {
    let prevState: AppState | undefined

    let prevMap: OrderedMap<string, V> | undefined

    const prevValues: Map<string, V> = new Map ()

    const keyMap: Map<string, [MappedReturnType<G>, MappedReturnType<M>]> = new Map ()

    let res: R | undefined

    return (key: string) => (state: AppState): Maybe<R> => {
      if (state === prevState && res !== undefined) {
        return Just (res)
      }

      prevState = state

      const map = mapSelector (state)

      const mvalue = lookup (key) (map)

      if (isNothing (mvalue)) {
        return Nothing
      }

      const value = fromJust (mvalue)

      const newGlobalValues = globalSelectors .map (g => g (state)) as MappedReturnType<G>

      if (map === prevMap || maybeEquals (value, prevValues .get (key))) {
        const prevMapValueValues = keyMap .get (key)! [1]

        prevMap = map
        prevValues .set (key, value)
        keyMap .set (key, [newGlobalValues, prevMapValueValues])

        res = f (...newGlobalValues as any)
                (...prevMapValueValues as any)

        return Just (res)
      }

      const newMapValueValues = mapValueSelectors .map (s => s (value)) as MappedReturnType<M>

      prevMap = map
      prevValues .set (key, value)
      keyMap .set (key, [newGlobalValues, newMapValueValues])

      res = f (...newGlobalValues as any)
              (...newMapValueValues as any)

      return Just (res)
    }
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
