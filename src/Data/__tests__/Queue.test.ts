import { List } from "../List"
import { Just, Nothing } from "../Maybe"
import { dequeue, empty, enqueue, peek, peekFst, singleton, size } from "../Queue"
import { Pair } from "../Tuple"

const filledQueue1 = enqueue (2) (enqueue (3) (singleton (1)))

describe ("Construction", () => {
  describe ("empty", () => {
    it ("is an empty queue", () => {
      expect (empty) .toEqual ({ values: [] })
    })
  })

  describe ("singleton", () => {
    it ("returns a queue of size 1 with the passed parameter", () => {
      expect (singleton (1)) .toEqual ({ values: [ 1 ] })
    })
  })
})

describe ("Lookup", () => {
  describe ("peek", () => {
    it ("returns a list with the element in the queue", () => {
      expect (peek (empty)) .toEqual (List ())
      expect (peek (filledQueue1)) .toEqual (List (1, 3, 2))
    })
  })

  describe ("peekFst", () => {
    it ("returns Nothing on an empty queue", () => {
      expect (peekFst (empty)) .toEqual (Nothing)
    })

    it ("returns a Just of the first element if the queue is not empty", () => {
      expect (peekFst (filledQueue1)) .toEqual (Just (1))
    })
  })

  describe ("size", () => {
    it ("returns the size of the queue", () => {
      expect (size (empty)) .toEqual (0)
      expect (size (filledQueue1)) .toEqual (3)
    })
  })
})

describe ("Insertion", () => {
  describe ("enqueue", () => {
    it ("inserts the first element in an empty queue", () => {
      expect (enqueue (1) (empty)) .toEqual ({ values: [ 1 ] })
    })

    it ("inserts an element at the end of an existing queue", () => {
      expect (enqueue (1) (filledQueue1)) .toEqual ({ values: [ 1, 3, 2, 1 ] })
    })
  })
})

describe ("Deletion", () => {
  describe ("dequeue", () => {
    it ("returns Nothing if the queue is empty", () => {
      expect (dequeue (empty)) .toEqual (Pair (Nothing, { values: [] }))
    })

    it ("inserts an element at the end of an existing queue", () => {
      expect (dequeue (filledQueue1)) .toEqual (Pair (Just (1), { values: [ 3, 2 ] }))
    })
  })
})
