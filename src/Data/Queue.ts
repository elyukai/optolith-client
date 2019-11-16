import { DataStructure, DataStructureType } from "./Data"


// PROTOTYPE

interface QueuePrototype<A> extends DataStructure<DataStructureType.Queue> {
  [Symbol.iterator] (): IterableIterator<A>
}

const QueuePrototype =
  Object.freeze<QueuePrototype<any>> ({
    * [Symbol.iterator] (this: Queue<any>) {
      return this.values[Symbol.iterator]
    },
    "@@type": DataStructureType.Queue,
  })


// CONSTRUCTOR

export interface Queue<A> {
  readonly values: readonly A[]
}

export const Queue = <A>(xs: A[]): Queue<A> =>
  Object.create (
    QueuePrototype,
    {
      values: {
        value: xs,
        enumerable: true,
      },
    }
  )
