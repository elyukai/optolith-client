// @ts-check
const { Queue, empty, peek, peekFst, size, enqueue, dequeue } = require('../Queue');
const { List } = require('../List')
const { Pair } = require('../Tuple')
const { Nothing, Just } = require('../Maybe')

describe ("Construction", () => {
  describe ("Queue constructor", () => {
    it ("returns an filled queue containing the parameters", () => {
      expect (Queue (1, 3, 2)) .toEqual ({ values: [1, 3, 2] })
    })
  })

  describe ("empty", () => {
    it ("is an empty queue", () => {
      expect (empty) .toEqual (Queue ())
    })
  })
})

describe ("Lookup", () => {
  describe ("peek", () => {
    it ("returns a list with the element in the queue", () => {
      expect (peek (Queue ())) .toEqual (List ())
      expect (peek (Queue (1, 3, 2))) .toEqual (List (1, 3, 2))
    })
  })

  describe ("peekFst", () => {
    it ("returns Nothing on an empty queue", () => {
      expect (peekFst (Queue ())) .toEqual (Nothing)
    })

    it ("returns a Just of the first element if the queue is not empty", () => {
      expect (peekFst (Queue (1, 3, 2))) .toEqual (Just (1))
    })
  })

  describe ("size", () => {
    it ("returns the size of the queue", () => {
      expect (size (Queue ())) .toEqual (0)
      expect (size (Queue (1, 3, 2))) .toEqual (3)
    })
  })
})

describe ("Insertion", () => {
  describe ("enqueue", () => {
    it ("inserts the first element in an empty queue", () => {
      expect (enqueue (1) (Queue ())) .toEqual (Queue (1))
    })

    it ("inserts an element at the end of an existing queue", () => {
      expect (enqueue (1) (Queue (1, 3, 2))) .toEqual (Queue (1, 3, 2, 1))
    })
  })
})

describe ("Deletion", () => {
  describe ("dequeue", () => {
    it ("returns Nothing if the queue is empty", () => {
      expect (dequeue (Queue ())) .toEqual (Pair (Nothing, Queue ()))
    })

    it ("inserts an element at the end of an existing queue", () => {
      expect (dequeue (Queue (1, 3, 2))) .toEqual (Pair (Just (1), Queue (3, 2)))
    })
  })
})
