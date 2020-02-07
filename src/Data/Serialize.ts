import { hasOwnProperty } from "../App/Utilities/Object"
import { Identity, isIdentity } from "../Control/Monad/Identity"
import { Type, TypeName } from "./Data"
import { isEither, isLeft, Left, Right } from "./Either"
import { Const, isConst } from "./Functor/Const"
import { Internals } from "./Internals"
import { isList, List } from "./List"
import { isJust, isMaybe, Just, Nothing } from "./Maybe"
import { assocs, OrderedMap } from "./OrderedMap"
import { OrderedSet } from "./OrderedSet"
import { isRecord, Record, RecordBase } from "./Record"
import { fst, isTuple, snd, Tuple } from "./Tuple"

export type Serializable = string
                         | number
                         | boolean
                         | Serializable[]
                         | { [key: string]: Serializable }
                         | Const<Serializable, Serializable>
                         | Identity<Serializable>
                         | Left<Serializable>
                         | Right<Serializable>
                         | Internals.Nil
                         | Internals.Cons<Serializable>
                         | Just<Serializable>
                         | Nothing
                         | Internals.OrderedMap<Serializable, Serializable>
                         | Internals.OrderedSet<Serializable>
                         | Record<{ [key: string]: Serializable } & { "@@name": string }>
                         | Tuple<Serializable[]>

export type Serialized = string
                       | number
                       | boolean
                       | Serialized[]
                       | { [key: string]: Serialized }
                       | ConstS<Serialized>
                       | IdentityS<Serialized>
                       | LeftS<Serialized>
                       | RightS<Serialized>
                       | ListS<Serialized>
                       | JustS<Serialized>
                       | NothingS
                       | OrderedMapS<Serialized, Serialized>
                       | OrderedSetS<Serialized>
                       | RecordS<{ [key: string]: Serialized }, string>
                       | TupleS<Serialized[]>


export interface ConstS<A> extends Type<TypeName.Identity> {
  value: A
}

const isConstS = (x: any): x is ConstS<any> => typeof x === "object"
                                               && x !== null
                                               && x ["@@type"] === TypeName.Const
                                               && hasOwnProperty ("value") (x)

export interface IdentityS<A> extends Type<TypeName.Identity> {
  value: A
}

const isIdentityS = (x: any): x is IdentityS<any> => typeof x === "object"
                                                     && x !== null
                                                     && x ["@@type"] === TypeName.Identity
                                                     && hasOwnProperty ("value") (x)

export interface LeftS<A> extends Type<TypeName.Left> {
  value: A
}

const isLeftS = (x: any): x is LeftS<any> => typeof x === "object"
                                             && x !== null
                                             && x ["@@type"] === TypeName.Left
                                             && hasOwnProperty ("value") (x)

export interface RightS<A> extends Type<TypeName.Right> {
  value: A
}

const isRightS = (x: any): x is RightS<any> => typeof x === "object"
                                               && x !== null
                                               && x ["@@type"] === TypeName.Right
                                               && hasOwnProperty ("value") (x)

export type EitherS<L, R> = LeftS<L> | RightS<R>

export interface ListS<A> extends Type<TypeName.List> {
  values: A[]
}

const isListS = (x: any): x is ListS<any> => typeof x === "object"
                                             && x !== null
                                             && x ["@@type"] === TypeName.List
                                             && hasOwnProperty ("value") (x)

export interface JustS<A> extends Type<TypeName.Just> {
  value: A
}

const isJustS = (x: any): x is JustS<any> => typeof x === "object"
                                             && x !== null
                                             && x ["@@type"] === TypeName.Just
                                             && hasOwnProperty ("value") (x)

export interface NothingS extends Type<TypeName.Right> { }

const isNothingS = (x: any): x is NothingS => typeof x === "object"
                                              && x !== null
                                              && x ["@@type"] === TypeName.Nothing

export type MaybeS<L, R> = LeftS<L> | RightS<R>

export interface OrderedMapS<K, A> extends Type<TypeName.OrderedMap> {
  values: [K, A][]
}

const isOrderedMapS = (x: any): x is OrderedMapS<any, any> => typeof x === "object"
                                                              && x !== null
                                                              && x ["@@type"]
                                                                === TypeName.OrderedMap
                                                              && hasOwnProperty ("values") (x)

export interface OrderedSetS<A> extends Type<TypeName.OrderedSet> {
  values: A[]
}

const isOrderedSetS = (x: any): x is OrderedSetS<any> => typeof x === "object"
                                                         && x !== null
                                                         && x ["@@type"]
                                                           === TypeName.OrderedSet
                                                         && hasOwnProperty ("value") (x)

export interface RecordS<A extends RecordBase, N extends string>
  extends Type<TypeName.Record> {
    name: N
    values: A
  }

const isRecordS = (x: any): x is RecordS<any, any> => typeof x === "object"
                                                      && x !== null
                                                      && x ["@@type"] === TypeName.Record
                                                      && hasOwnProperty ("name") (x)
                                                      && hasOwnProperty ("values") (x)

export interface TupleS<A extends any[]> extends Type<TypeName.Tuple> {
  values: A
}

const isTupleS = (x: any): x is TupleS<any> => typeof x === "object"
                                               && x !== null
                                               && x ["@@type"] === TypeName.Tuple
                                               && hasOwnProperty ("values") (x)

export const serialize = (x: Serializable): Serialized => {
  if (isConst (x)) {
    return {
      "@@type": TypeName.Const,
      value: serialize (x .value),
    }
  }

  if (isIdentity (x)) {
    return {
      "@@type": TypeName.Identity,
      value: serialize (x .value),
    }
  }

  if (isEither (x)) {
    if (isLeft (x)) {
      return {
        "@@type": TypeName.Left,
        value: serialize (x .value),
      }
    }

    return {
      "@@type": TypeName.Right,
      value: serialize (x .value),
    }
  }

  if (isList (x)) {
    return {
      "@@type": TypeName.List,
      values: [ ...x ] .map (serialize),
    }
  }

  if (isMaybe (x)) {
    if (isJust (x)) {
      return {
        "@@type": TypeName.Just,
        value: serialize (x .value),
      }
    }

    return {
      "@@type": TypeName.Nothing,
    }
  }

  if (Internals.isOrderedMap (x)) {
    return {
      "@@type": TypeName.OrderedMap,
      values: [ ...assocs (x) ] .map (p => [ serialize (fst (p)), serialize (snd (p)) ]),
    }
  }

  if (Internals.isOrderedSet (x)) {
    return {
      "@@type": TypeName.List,
      values: [ ...x ] .map (serialize),
    }
  }

  if (isRecord (x)) {
    return {
      "@@type": TypeName.Record,
      name: x .name,
      values: Object.entries (x .values)
        .reduce<{ [key: string]: Serialized }> (
          (acc, [ k, v ]) => ({ ...acc, [k]: serialize (v) }),
          {}
        ),
    }
  }

  if (isTuple (x)) {
    return Object.entries (x .values)
      .reduce<Serialized[]> (
        (acc, [ k, v ]) => {
          const new_acc = [ ...acc ]

          new_acc [Number.parseInt (k, 10)] = serialize (v)

          return new_acc
        },
        []
      )
  }

  if (Array.isArray (x)) {
    return x .map (serialize)
  }

  if (typeof x === "object") {
    return Object.entries (x)
      .reduce<{ [key: string]: Serialized }> (
        (acc, [ k, v ]) => ({ ...acc, [k]: serialize (v) }),
        {}
      )
  }

  return x
}

export const deserialize = (x: Serialized): Serializable => {
  if (isConstS (x)) {
    return Const (deserialize (x .value))
  }

  if (isIdentityS (x)) {
    return Identity (deserialize (x .value))
  }

  if (isLeftS (x)) {
    return Left (deserialize (x .value))
  }

  if (isRightS (x)) {
    return Right (deserialize (x .value))
  }

  if (isListS (x)) {
    return List (...x .values .map (deserialize))
  }

  if (isJustS (x)) {
    return Just (deserialize (x .value))
  }

  if (isNothingS (x)) {
    return Nothing
  }

  if (isOrderedMapS (x)) {
    return OrderedMap.fromArray (
      x .values .map (([ k, v ]) => [ deserialize (k), deserialize (v) ])
    )
  }

  if (isOrderedSetS (x)) {
    return OrderedSet.fromArray (x .values .map (deserialize))
  }

  if (isRecordS (x)) {
    // TODO: use Record Registry
  }

  if (isTupleS (x)) {
    return Tuple (...x .values .map (deserialize))
  }

  if (Array.isArray (x)) {
    return x .map (deserialize)
  }

  if (typeof x === "object") {
    return Object.entries (x)
      .reduce<{ [key: string]: Serializable }> (
        (acc, [ k, v ]) => ({ ...acc, [k]: deserialize (v) }),
        {}
      )
  }

  return x
}
