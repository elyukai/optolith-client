import { Identity, isIdentity } from "../Control/Monad/Identity";
import { DataStructure, DataStructureType } from "./Data";
import { isEither, isLeft, Left, Right } from "./Either";
import { Const, isConst } from "./Functor/Const";
import { Internals } from "./Internals";
import { isList, List } from "./List";
import { isJust, isMaybe, Just, Nothing } from "./Maybe";
import { assocs, OrderedMap } from "./OrderedMap";
import { OrderedSet } from "./OrderedSet";
import { isRecord, Record, RecordBase } from "./Record";
import { fst, isTuple, snd, Tuple } from "./Tuple";

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


export interface ConstS<A> extends DataStructure<DataStructureType.Identity> {
  value: A
}

const isConstS = (x: any): x is ConstS<any> => typeof x === "object"
                                               && x !== null
                                               && x ["@@type"] === DataStructureType.Const
                                               && x .hasOwnProperty ("value")

export interface IdentityS<A> extends DataStructure<DataStructureType.Identity> {
  value: A
}

const isIdentityS = (x: any): x is IdentityS<any> => typeof x === "object"
                                                     && x !== null
                                                     && x ["@@type"] === DataStructureType.Identity
                                                     && x .hasOwnProperty ("value")

export interface LeftS<A> extends DataStructure<DataStructureType.Left> {
  value: A
}

const isLeftS = (x: any): x is LeftS<any> => typeof x === "object"
                                             && x !== null
                                             && x ["@@type"] === DataStructureType.Left
                                             && x .hasOwnProperty ("value")

export interface RightS<A> extends DataStructure<DataStructureType.Right> {
  value: A
}

const isRightS = (x: any): x is RightS<any> => typeof x === "object"
                                               && x !== null
                                               && x ["@@type"] === DataStructureType.Right
                                               && x .hasOwnProperty ("value")

export type EitherS<L, R> = LeftS<L> | RightS<R>

export interface ListS<A> extends DataStructure<DataStructureType.List> {
  values: A[]
}

const isListS = (x: any): x is ListS<any> => typeof x === "object"
                                             && x !== null
                                             && x ["@@type"] === DataStructureType.List
                                             && x .hasOwnProperty ("value")

export interface JustS<A> extends DataStructure<DataStructureType.Just> {
  value: A
}

const isJustS = (x: any): x is JustS<any> => typeof x === "object"
                                             && x !== null
                                             && x ["@@type"] === DataStructureType.Just
                                             && x .hasOwnProperty ("value")

export interface NothingS extends DataStructure<DataStructureType.Right> { }

const isNothingS = (x: any): x is NothingS => typeof x === "object"
                                              && x !== null
                                              && x ["@@type"] === DataStructureType.Nothing

export type MaybeS<L, R> = LeftS<L> | RightS<R>

export interface OrderedMapS<K, A> extends DataStructure<DataStructureType.OrderedMap> {
  values: [K, A][]
}

const isOrderedMapS = (x: any): x is OrderedMapS<any, any> => typeof x === "object"
                                                              && x !== null
                                                              && x ["@@type"] ===
                                                                DataStructureType.OrderedMap
                                                              && x .hasOwnProperty ("values")

export interface OrderedSetS<A> extends DataStructure<DataStructureType.OrderedSet> {
  values: A[]
}

const isOrderedSetS = (x: any): x is OrderedSetS<any> => typeof x === "object"
                                                         && x !== null
                                                         && x ["@@type"] ===
                                                           DataStructureType.OrderedSet
                                                         && x .hasOwnProperty ("value")

export interface RecordS<A extends RecordBase, N extends string>
  extends DataStructure<DataStructureType.Record> {
    name: N
    values: A
  }

const isRecordS = (x: any): x is RecordS<any, any> => typeof x === "object"
                                                      && x !== null
                                                      && x ["@@type"] === DataStructureType.Record
                                                      && x .hasOwnProperty ("name")
                                                      && x .hasOwnProperty ("values")

export interface TupleS<A extends any[]> extends DataStructure<DataStructureType.Tuple> {
  values: A
}

const isTupleS = (x: any): x is TupleS<any> => typeof x === "object"
                                               && x !== null
                                               && x ["@@type"] === DataStructureType.Tuple
                                               && x .hasOwnProperty ("values")

export const serialize = (x: Serializable): Serialized => {
  if (isConst (x)) {
    return {
      "@@type": DataStructureType.Const,
      value: serialize (x .value),
    }
  }

  if (isIdentity (x)) {
    return {
      "@@type": DataStructureType.Identity,
      value: serialize (x .value),
    }
  }

  if (isEither (x)) {
    if (isLeft (x)) {
      return {
        "@@type": DataStructureType.Left,
        value: serialize (x .value),
      }
    }

    return {
      "@@type": DataStructureType.Right,
      value: serialize (x .value),
    }
  }

  if (isList (x)) {
    return {
      "@@type": DataStructureType.List,
      values: [...x] .map (serialize),
    }
  }

  if (isMaybe (x)) {
    if (isJust (x)) {
      return {
        "@@type": DataStructureType.Just,
        value: serialize (x .value),
      }
    }

    return {
      "@@type": DataStructureType.Nothing,
    }
  }

  if (Internals.isOrderedMap (x)) {
    return {
      "@@type": DataStructureType.OrderedMap,
      values: [...assocs (x)] .map (p => [serialize (fst (p)), serialize (snd (p))]),
    }
  }

  if (Internals.isOrderedSet (x)) {
    return {
      "@@type": DataStructureType.List,
      values: [...x] .map (serialize),
    }
  }

  if (isRecord (x)) {
    return {
      "@@type": DataStructureType.Record,
      name: x .name,
      values: Object.entries (x .values)
        .reduce<{ [key: string]: Serialized }> (
          (acc, [k, v]) => ({ ...acc, [k]: serialize (v) }),
          {}
        )
    }
  }

  if (isTuple (x)) {
    return Object.entries (x .values)
      .reduce<Serialized[]> (
        (acc, [k, v]) => {
          const new_acc = [...acc]

          new_acc [Number.parseInt (k)] = serialize (v)

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
        (acc, [k, v]) => ({ ...acc, [k]: serialize (v) }),
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
    return OrderedMap.fromArray (x .values .map (([k, v]) => [deserialize (k), deserialize (v)]))
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
        (acc, [k, v]) => ({ ...acc, [k]: deserialize (v) }),
        {}
      )
  }

  return x
}
