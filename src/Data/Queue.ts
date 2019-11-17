import { DataStructure, DataStructureType } from "./Data"
import { List } from "./List"
import { Maybe } from "./Maybe"
import { Pair } from "./Tuple"


// PROTOTYPE

interface QueuePrototype<A> extends DataStructure<DataStructureType.Queue> {
  [Symbol.iterator] (): IterableIterator<A>
}

const QueuePrototype =
  Object.freeze<QueuePrototype<any>> ({
    [Symbol.iterator] (this: Queue<any>) {
      return this.values[Symbol.iterator] ()
    },
    "@@type": DataStructureType.Queue,
  })


// CONSTRUCTION

export interface Queue<A> extends QueuePrototype<A> {
  readonly values: readonly A[]
}

export const Queue = <A>(...xs: A[]): Queue<A> =>
  Object.create (
    QueuePrototype,
    {
      values: {
        value: xs,
        enumerable: true,
      },
    }
  )

export { Queue as T }

/**
 * `empty :: Queue a`
 *
 * The empty queue.
 */
export const empty: Queue<any> = Queue ()

// LOOKUP

/**
 * `peek :: Queue a -> List a`
 *
 * Returns all elements in the queue in order.
 */
export const peek: <A> (qu: Queue<A>) => List<A> =
  qu => List (...qu)

/**
 * `peekFst :: Queue a -> List a`
 *
 * Returns the first element in the queue.
 */
export const peekFst: <A> (qu: Queue<A>) => Maybe<A> =
  ([head]) => Maybe (head)

/**
 * `size :: Queue a -> Int`
 *
 * The amount of elements in the queue.
 */
export const size: <A> (qu: Queue<A>) => number =
  qu => qu .values .length

// INSERTION

/**
 * `enqueue :: a -> Queue a -> Queue a`
 *
 * Inserts an element at the end of the query.
 */
export const enqueue: <A> (x: A) => (qu: Queue<A>) => Queue<A> =
  x => qu => Queue (...qu, x)

// DELETION

/**
 * `dequeue :: Queue a -> (Maybe a, Queue a)`
 *
 * Removes an element from the start of the queue. Returns a `Just` of the
 * element if the queue was not empty, otherwise `Nothing`, aside the remaining
 * queue.
 */
export const dequeue: <A> (qu: Queue<A>) => Pair<Maybe<A>, Queue<A>> =
  ([head, ...tail]) => Pair (Maybe (head), Queue (...tail))
