/**
 * @module Data/Queue
 *
 * A queue is a data structure that follows the First In, First Out (FIFO)
 * principle: It is kind of a special list, where you can push elements to the
 * end (only to the end) and only remove elements from the start.
 *
 * Queues also implement an iterator, which provides an alternative way to
 * convert a queue to a different data structure in a more imperative
 * environment, e.g. async/await blocks.
 *
 * @example
 *
 * ```ts
 * pipe_ (
 *   empty, // Queue []
 *   enqueue (1), // Queue [1]
 *   enqueue (2), // Queue [1, 2],
 *   peekFst, // Just 1
 * )
 *
 * pipe_ (
 *   singleton (1), // Queue [1]
 *   enqueue (2), // Queue [1, 2],
 *   dequeue, // (Just 1, Queue [2])
 *   snd,
 *   dequeue, // (Just 2, Queue [])
 *   snd,
 *   dequeue // (Nothing, Queue [])
 * )
 * ```
 *
 * @author Lukas Obermann
 */

import { Type, TypeName } from "./Data"
import { List } from "./List"
import { Maybe } from "./Maybe"
import { Pair } from "./Tuple"


// PROTOTYPE

interface QueuePrototype<A> extends Type<TypeName.Queue> {
  [Symbol.iterator] (): IterableIterator<A>
}

const QueuePrototype =
  Object.freeze<QueuePrototype<any>> ({
    [Symbol.iterator] (this: Queue<any>) {
      return this.values[Symbol.iterator] ()
    },
    "@@type": TypeName.Queue,
  })


// CONSTRUCTION

export interface Queue<A> extends QueuePrototype<A> {
  readonly values: readonly A[]
}

export { Queue as T }

/**
 * Construct a new Queue from the passed parameters.
 */
const QueueC = <A>(...xs: A[]): Queue<A> =>
  Object.create (
    QueuePrototype,
    {
      values: {
        value: xs,
        enumerable: true,
      },
    }
  )

/**
 * ```haskell
 * empty :: Queue a
 * ```
 *
 * The empty queue.
 */
export const empty: Queue<any> = QueueC ()

/**
 * ```haskell
 * singleton :: a -> Queue a
 * ```
 *
 * A queue with a single element.
 */
export const singleton: <A> (x: A) => Queue<A> = x => QueueC (x)

// LOOKUP

/**
 * ```haskell
 * peek :: Queue a -> List a
 * ```
 *
 * Returns all elements in the queue in order.
 */
export const peek: <A> (qu: Queue<A>) => List<A> =
  qu => List (...qu)

/**
 * ```haskell
 * peekFst :: Queue a -> Maybe a
 * ```
 *
 * Returns the first element in the queue.
 */
export const peekFst: <A> (qu: Queue<A>) => Maybe<A> =
  ([ head ]) => Maybe (head)

/**
 * ```haskell
 * size :: Queue a -> Int
 * ```
 *
 * The amount of elements in the queue.
 */
export const size: <A> (qu: Queue<A>) => number =
  qu => qu .values .length

// INSERTION

/**
 * ```haskell
 * enqueue :: a -> Queue a -> Queue a
 * ```
 *
 * Inserts an element at the end of the query.
 */
export const enqueue: <A> (x: A) => (qu: Queue<A>) => Queue<A> =
  x => qu => QueueC (...qu, x)

// DELETION

/**
 * ```haskell
 * dequeue :: Queue a -> (Maybe a, Queue a)
 * ```
 *
 * Removes an element from the start of the queue. Returns a `Just` of the
 * element if the queue was not empty, otherwise `Nothing`, aside the remaining
 * queue.
 */
export const dequeue: <A> (qu: Queue<A>) => Pair<Maybe<A>, Queue<A>> =
  ([ head, ...tail ]) => Pair (Maybe (head), QueueC (...tail))
