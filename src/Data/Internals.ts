import { Type, TypeName } from "./Data"
import { RecordIBase } from "./Record"

export namespace Internals {
  export type Either<A, B> = Left<A> | Right<B>
  export type List<A> = Internals.Nil | Internals.Cons<A>
  export type Maybe<A> = Internals.Just<A> | Internals.Nothing
  export type Nullable = null | undefined

  export interface OrderedMap<K, A> extends Internals.OrderedMapPrototype<K, A> {
    readonly value: ReadonlyMap<K, A>
  }

  export interface OrderedSet<A> extends Internals.OrderedSetPrototype<A> {
    readonly value: ReadonlySet<A>
  }

  export type Pair<A, B> = Tuple<[A, B]>

  export interface RecordBase {
    [key: string]: any
  }

  export interface Record<A extends RecordIBase<any>> extends RecordPrototype {
    readonly values: Readonly<Required<A>>
    readonly defaultValues: Readonly<A>
    readonly keys: OrderedSet<string>
    readonly unique: symbol
    readonly name: A["@@name"]
    readonly prototype: RecordPrototype
  }

  export interface Tuple<A extends any[]> extends Internals.TuplePrototype {
    readonly phantom: A
    readonly values: { [index: number]: any }
    readonly length: number
    readonly prototype: Internals.TuplePrototype
  }

  // Prototypes

  interface ConstPrototype extends Type<TypeName.Const> {
    readonly isConst: true
  }

  const ConstPrototype =
    Object.freeze<ConstPrototype> ({
      isConst: true,
      "@@type": TypeName.Const,
    })

  interface IdentityPrototype extends Type<TypeName.Identity> {
    readonly isIdentity: true
  }

  const IdentityPrototype =
    Object.freeze<IdentityPrototype> ({
      isIdentity: true,
      "@@type": TypeName.Identity,
    })

  interface LeftPrototype extends Type<TypeName.Left> {
    readonly isLeft: true
    readonly isRight: false
  }

  const LeftPrototype =
    Object.freeze<LeftPrototype> ({
      isLeft: true,
      isRight: false,
      "@@type": TypeName.Left,
    })

  interface RightPrototype extends Type<TypeName.Right> {
    readonly isLeft: false
    readonly isRight: true
  }

  const RightPrototype: RightPrototype =
    Object.freeze<RightPrototype> ({
      isLeft: false,
      isRight: true,
      "@@type": TypeName.Right,
    })

  interface ListPrototype<A> extends Type<TypeName.List> {
    readonly isList: true
    [Symbol.iterator] (): IterableIterator<A>
  }

  const ListPrototype =
    Object.freeze<ListPrototype<any>> ({
      isList: true,
      * [Symbol.iterator] () {
        // tslint:disable-next-line: no-this-assignment
        let current = this as List<any>

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        while (!isNil (current)) {
          yield current .x
          current = current .xs
        }
      },
      "@@type": TypeName.List,
    })

  interface JustPrototype extends Type<TypeName.Just> {
    readonly isJust: true
    readonly isNothing: false
  }

  const JustPrototype =
    Object.freeze<JustPrototype> ({
      isJust: true,
      isNothing: false,
      "@@type": TypeName.Just,
    })

  interface NothingPrototype extends Type<TypeName.Nothing> {
    readonly isJust: false
    readonly isNothing: true
  }

  const NothingPrototype: NothingPrototype =
    Object.freeze<NothingPrototype> ({
      isJust: false,
      isNothing: true,
      "@@type": TypeName.Nothing,
    })

  export interface OrderedMapPrototype<K, A> extends Type<TypeName.OrderedMap> {
    [Symbol.iterator] (): IterableIterator<[K, A]>
    readonly isOrderedMap: true
  }

  const OrderedMapPrototype =
    Object.freeze<OrderedMapPrototype<any, any>> ({
        [Symbol.iterator] (this: OrderedMap<any, any>) {
          return this .value [Symbol.iterator] ()
        },
        isOrderedMap: true,
        "@@type": TypeName.OrderedMap,
    })

  export interface OrderedSetPrototype<A> extends Type<TypeName.OrderedSet> {
    [Symbol.iterator] (): IterableIterator<A>
    readonly isOrderedSet: true
  }

  const OrderedSetPrototype =
    Object.freeze<OrderedSetPrototype<any>> ({
      [Symbol.iterator] (this: OrderedSet<any>) {
        return this .value [Symbol.iterator] ()
      },
      isOrderedSet: true,
      "@@type": TypeName.OrderedSet,
    })

  export interface PairPrototype {
    readonly isPair: true
  }

  const PairPrototype =
    Object.freeze<PairPrototype> ({
      isPair: true,
    })

  export interface RecordPrototype extends Type<TypeName.Record> {
    readonly isRecord: true
  }

  export const RecordPrototype =
    Object.freeze<RecordPrototype> ({
      isRecord: true,
      "@@type": TypeName.Record,
    })

  export interface TuplePrototype extends Type<TypeName.Tuple> {
    readonly isTuple: true
  }

  const TuplePrototype =
    Object.freeze<TuplePrototype> ({
      isTuple: true,
      "@@type": TypeName.Tuple,
    })


  // Functions on Prototypes

  /**
   * `isConst :: a -> Bool`
   *
   * The `isConst` function returns `True` if its argument is a `Const`.
   */
  export const isConst =
    (x: any): x is Const<any, any> =>
      typeof x === "object" && x !== null && Object.getPrototypeOf (x) === ConstPrototype

  /**
   * `isIdentity :: a -> Bool`
   *
   * The `isIdentity` function returns `True` if its argument is an `Identity`.
   */
  export const isIdentity =
    (x: any): x is Identity<any> =>
      typeof x === "object" && x !== null && Object.getPrototypeOf (x) === IdentityPrototype

  /**
   * `isLeft :: Either a b -> Bool`
   *
   * Return `True` if the given value is a `Left`-value, `False` otherwise.
   */
  export const isLeft =
    <A> (x: Either<A, any>): x is Left<A> =>
      Object.getPrototypeOf (x) === LeftPrototype

  /**
  * `isRight :: Either a b -> Bool`
  *
  * Return `True` if the given value is a `Right`-value, `False` otherwise.
  */
  export const isRight =
    <A, B> (x: Either<A, B>): x is Right<B> =>
      Object.getPrototypeOf (x) === RightPrototype

  /**
   * `isEither :: a -> Bool`
   *
   * Return `True` if the given value is an `Either`.
   */
  export const isEither =
    (x: any): x is Either<any, any> =>
      typeof x === "object" && x !== null && (isLeft (x) || isRight (x))

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  export const isNil = (xs: List<any>): xs is Nil => xs === Nil

  /**
   * Checks if the given value is a `List`.
   * @param x The value to test.
   */
  export const isList =
    <A, A1> (x: A | List<A1>): x is List<A1> =>
      typeof x === "object" && x !== null && Object.getPrototypeOf (x) === ListPrototype

  /**
   * `isJust :: Maybe a -> Bool`
   *
   * The `isJust` function returns `true` if its argument is of the form
   * `Just _`.
   */
  export const isJust =
    <A> (x: Maybe<A>): x is Just<A> =>
      Object.getPrototypeOf (x) === JustPrototype

  /**
   * `isNothing :: Maybe a -> Bool`
   *
   * The `isNothing` function returns `true` if its argument is `Nothing`.
   */
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  export const isNothing = (x: Maybe<any>): x is Nothing => x === Nothing

  /**
   * `isMaybe :: a -> Bool`
   *
   * The `isMaybe` function returns `True` if its argument is a `Maybe`.
   */
  export const isMaybe =
    <A, A0>(x: A | Maybe<A0>): x is Maybe<A0> =>
      typeof x === "object"
      && x !== null
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      && (x === Nothing || Object.getPrototypeOf (x) === JustPrototype)

  /**
   * Checks if the given value is a `OrderedMap`.
   * @param x The value to test.
   */
  export const isOrderedMap =
    (x: any): x is OrderedMap<any, any> =>
      typeof x === "object" && x !== null && Object.getPrototypeOf (x) === OrderedMapPrototype

  /**
   * Checks if the given value is a `OrderedSet`.
   * @param x The value to test.
   */
  export const isOrderedSet =
    (x: any): x is OrderedSet<any> =>
      typeof x === "object" && x !== null && Object.getPrototypeOf (x) === OrderedSetPrototype

  /**
   * `isPair :: a -> Bool`
   *
   * Return `True` if the given value is an pair.
   */
  export const isPair =
    (x: any): x is Pair<any, any> =>
      typeof x === "object" && x !== null && Object.getPrototypeOf (x) === PairPrototype

  /**
   * Checks if the given value is a `Record`.
   * @param x The value to test.
   */
  export const isRecord =
    <A, I extends RecordIBase<any>>(x: A | Record<I>): x is Record<I> =>
      typeof x === "object" && x !== null && Object.getPrototypeOf (x) === RecordPrototype

  /**
   * `isTuple :: a -> Bool`
   *
   * The `isTuple` function returns `True` if its argument is a `Tuple`.
   */
  export const isTuple =
    <A, A0 extends any[]>(x: A | Tuple<A0>): x is Tuple<A0> =>
      typeof x === "object" && x !== null && Object.getPrototypeOf (x) === TuplePrototype


  // Constructors

  export interface Const<A, B> extends ConstPrototype {
    readonly value: A

    /**
     * No actual field!
     */
    readonly phantom: B
  }

  /**
   * `Const :: a -> Const a b`
   */
  export const Const =
    <A, B>
    (x: A): Const<A, B> =>
      Object.create (
        ConstPrototype,
        {
          value: {
            value: x,
            enumerable: true,
          },
        }
      )

  export interface Identity<A> extends IdentityPrototype {
    readonly value: A
  }

  /**
   * `Identity :: a -> Identity a`
   */
  export const Identity =
    <A>
    (x: A): Identity<A> =>
      Object.create (
        IdentityPrototype,
        {
          value: {
            value: x,
            enumerable: true,
          },
        }
      )

  export interface Left<A> extends LeftPrototype {
    readonly value: A
  }

  /**
   * `Left :: a -> Either a b`
   *
   * Creates a new `Left` from the passed value.
   */
  export const Left =
    <A>
    (x: A): Left<A> =>
      Object.create (
        LeftPrototype,
        {
          value: {
            value: x,
            enumerable: true,
          },
        }
      )

  export interface Right<B> extends RightPrototype {
    readonly value: B
    readonly prototype: RightPrototype
  }

  /**
   * `Right :: b -> Either a b`
   *
   * Creates a new `Right` from the passed value.
   */
  export const Right =
    <B>
    (x: B): Right<B> =>
      Object.create (
        RightPrototype,
        {
          value: {
            value: x,
            enumerable: true,
          },
        }
      )

  export type NonEmptyList<A> = Cons<A>

  export interface Nil extends ListPrototype<never> { }

  export const Nil: Nil = Object.create (ListPrototype)

  export interface Cons<A> extends ListPrototype<A> {
    readonly x: A
    readonly xs: List<A>
  }

  export const Cons =
    <A> (x: A, xs: List<A>): Cons<A> =>
      Object.create (
        ListPrototype,
        {
          x: {
            value: x,
            enumerable: true,
          },
          xs: {
            value: xs,
            enumerable: true,
          },
        }
      )

  /**
   * `List :: (...a) -> [a]`
   *
   * Creates a new `List` instance from the passed arguments.
   */
  export const List =
    <A> (...values: A[]): List<A> => {
      if (values .length === 0) {
        return Nil
      }

      let h: List<A> = Nil

      for (let i = 0; i < values.length; i++) {
        const x = values[values.length - 1 - i]

        h = Cons (x, h)
      }

      return h

      // const [_head, ..._tail] = values

      // return Cons (_head, List (..._tail))
    }

  export interface Just<A> extends JustPrototype {
    readonly value: A
  }

  /**
   * `Just :: a -> Maybe a`
   *
   * Creates a new `Just` from the passed value.
   */
  export const Just = <A> (x: A): Just<A> =>
    Object.create (
      JustPrototype,
      {
        value: {
          value: x,
          enumerable: true,
        },
      }
    )

  export interface Nothing extends NothingPrototype { }

  /**
   * `Nothing :: Maybe a`
   *
   * The empty `Maybe`.
   */
  export const Nothing: Nothing = Object.create (NothingPrototype)

  export const Maybe =
    <A> (x: A | Nullable): Maybe<A> =>
      x !== null && x !== undefined ? Just (x) : Nothing

  export const _OrderedMap =
    <K, A> (x: ReadonlyMap<K, A>): OrderedMap<K, A> =>
      Object.create (
        OrderedMapPrototype,
        {
          value: {
            value: x,
            enumerable: true,
          },
        }
      )

  /**
   * `fromArray :: Array (k, a) -> Map k a`
   *
   * Creates a new `Set` instance from the passed native `Array`.
   */
  export const mapFromArray =
    (show: (x: any) => string) =>
    <K, A> (xs: readonly (readonly [K, A])[]): OrderedMap<K, A> => {
      if (Array.isArray (xs)) {
        return _OrderedMap (new Map (xs))
      }

      throw new TypeError (
        `fromArray requires an array but instead it received ${show (xs)}`
      )
    }

  export const _OrderedSet =
    <A> (x: ReadonlySet<A>): OrderedSet<A> =>
      Object.create (
        OrderedSetPrototype,
        {
          value: {
            value: x,
            enumerable: true,
          },
        }
      )

  /**
   * `fromArray :: Array a -> Set a`
   *
   * Creates a new `Set` instance from the passed native `Array`.
   */
  export const setFromArray =
    (show: (x: any) => string) =>
    <A> (xs: readonly A[]): OrderedSet<A> => {
      if (Array.isArray (xs)) {
        return _OrderedSet (new Set (xs))
      }

      throw new TypeError (
        `fromArray requires an array but instead it received ${show (xs)}`
      )
    }

  export const _Pair =
    <A, B> (firstValue: A, secondValue: B): Pair<A, B> =>
      Object.create (
        PairPrototype,
        {
          first: {
            value: firstValue,
            enumerable: true,
          },
          second: {
            value: secondValue,
            enumerable: true,
          },
        }
      )

  export const _Tuple =
    <A extends any[]> (...values: A): Tuple<A> => {
      const obj: { [index: number]: any } = {}

      values.forEach ((e, i) => {
        obj [i] = e
      })

      return Object.create (
        TuplePrototype,
        {
          values: {
            value: Object.freeze (obj),
            enumerable: true,
          },
          length: {
            value: values .length,
            enumerable: true,
          },
        }
      )
    }

  // OrderedMap

  export interface MapPrototype {
    readonly isMap: true
  }

  export interface BinPrototype extends MapPrototype {
    readonly isTip: false
  }

  export interface TipPrototype extends MapPrototype {
    readonly isTip: true
  }

  export interface Bin<K, A> extends BinPrototype {
    readonly key: K
    readonly value: A
    readonly size: number
    readonly height: number
    readonly left: Map<K, A>
    readonly right: Map<K, A>
  }

  export interface Tip extends TipPrototype { }

  export type Map<K, A> = Bin<K, A> | Tip

  const BinPrototype =
    Object.freeze<BinPrototype> ({
      isMap: true,
      isTip: false,
    })

  const TipPrototype =
    Object.freeze<TipPrototype> ({
      isMap: true,
      isTip: true,
    })

  export const Bin =
    (size: number) =>
    (height: number) =>
    <K> (key: K) =>
    <A> (value: A) =>
    (left: Map<K, A>) =>
    (right: Map<K, A>): Bin<K, A> =>
        Object.create (
          BinPrototype,
          {
            size: {
              value: size,
              enumerable: true,
            },
            height: {
              value: height,
              enumerable: true,
            },
            key: {
              value: key,
              enumerable: true,
            },
            value: {
              value,
              enumerable: true,
            },
            left: {
              value: left,
              enumerable: true,
            },
            right: {
              value: right,
              enumerable: true,
            },
          }
        )

  export const Tip: Tip = Object.create (TipPrototype)

  export const isTip = <K, A> (x: Map<K, A>): x is Tip => x === Tip

  /**
   * `isMap :: a -> Bool`
   *
   * The `isMap` function returns `True` if its argument is a `Map`.
   */
  export const isMap =
    <K, A, A0>(x: A | Map<K, A0>): x is Map<K, A0> =>
      typeof x === "object"
      && x !== null
      && (isTip (x as Map<K, A0>) || Object.getPrototypeOf (x) === BinPrototype)
}
