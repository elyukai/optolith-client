import { Either } from "./Either";


// PROTOTYPE

interface MarketPrototype {
  readonly isMarket: true
}

const MarketPrototype =
  Object.freeze<MarketPrototype> ({
    isMarket: true,
  })


// CONSTRUCTOR

export interface Market<A, B, S, T> extends MarketPrototype {
  readonly to: (x: B) => T
  readonly fro: (x: S) => Either<T, A>
}

/**
 * `Market :: (b -> t) -> (s -> Either t a) -> Market a b s t`
 */
export const Market =
  <B, T> (to: (x: B) => T) =>
  <S, A> (fro: (x: S) => Either<T, A>): Market<A, B, S, T> =>
    Object.create (
      MarketPrototype,
      {
        to: {
          value: to,
        },
        fro: {
          value: fro,
        },
      }
    )


// CUSTOM FUNCTIONS

/**
 * `isMarket :: a -> Bool`
 *
 * The `isMarket` function returns `True` if its argument is a `Market`.
 */
export const isMarket =
  (x: any): x is Market<any, any, any, any> =>
    typeof x === "object" && x !== null && Object.getPrototypeOf (x) === MarketPrototype
