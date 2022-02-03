import "../Map"
import { Just, Nothing } from "../Maybe"

describe ("Map Prototype Extensions", () => {
  describe ("lookup", () => {
    const mp = new Map ([ [ "a", 1 ], [ "b", 2 ] ])

    it ("returns a Just of the found value", () => {
      expect (mp.lookup ("a")).toEqual (Just (1))
    })

    it ("returns Nothing if the key is not present in the map", () => {
      expect (mp.lookup ("c")).toEqual (Nothing)
    })
  })

  describe ("insert", () => {
    const mp = new Map ([ [ "a", 1 ], [ "b", 2 ] ])

    it ("adds a key-value pair to the map", () => {
      expect (mp.insert ("c", 3)).toEqual (new Map ([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]))
      expect (mp.insert ("c", 3)).not.toBe (mp)
    })

    it ("overwrites an existing key-value pair", () => {
      expect (mp.insert ("a", 3)).toEqual (new Map ([ [ "a", 3 ], [ "b", 2 ] ]))
      expect (mp.insert ("c", 3)).not.toBe (mp)
    })
  })

  describe ("insertWith", () => {
    const mp = new Map ([ [ "a", 1 ], [ "b", 2 ] ])

    it ("adds a non-existing key-value pair to the map", () => {
      expect (mp.insertWith ("c", 3, (oldValue, newValue) => oldValue + newValue))
        .toEqual (new Map ([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]))
        expect (mp.insertWith ("c", 3, (oldValue, newValue) => oldValue + newValue)).not.toBe (mp)
    })

    it ("joins the given value with the existing value", () => {
      expect (mp.insertWith ("b", 3, (oldValue, newValue) => oldValue + newValue))
        .toEqual (new Map ([ [ "a", 1 ], [ "b", 5 ] ]))
        expect (mp.insertWith ("b", 3, (oldValue, newValue) => oldValue + newValue)).not.toBe (mp)
    })
  })

  describe ("deleteAt", () => {
    const mp = new Map ([ [ "a", 1 ], [ "b", 2 ] ])

    it ("removes a key-value pair from the map", () => {
      expect (mp.deleteAt ("b")).toEqual (new Map ([ [ "a", 1 ] ]))
      expect (mp.deleteAt ("b")).not.toBe (mp)
    })

    it ("returns the original map if the key is not in the map", () => {
      expect (mp.deleteAt ("c")).toBe (mp)
    })
  })

  describe ("adjust", () => {
    const mp = new Map ([ [ "a", 1 ], [ "b", 2 ] ])

    it ("maps over an existing value", () => {
      expect (mp.adjust ("a", oldValue => oldValue + 1))
        .toEqual (new Map ([ [ "a", 2 ], [ "b", 2 ] ]))
      expect (mp.adjust ("a", oldValue => oldValue + 1)).not.toBe (mp)
    })

    it ("returns the original map if the key is not in the map", () => {
      expect (mp.adjust ("c", oldValue => oldValue + 1)).toBe (mp)
    })
  })

  describe ("alter", () => {
    const mp = new Map ([ [ "a", 1 ], [ "b", 2 ] ])

    it ("adds a key-value pair to the map", () => {
      expect (mp.alter ("c", () => Just (3)))
        .toEqual (new Map ([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]))
      expect (mp.alter ("c", () => Just (3))).not.toBe (mp)
    })

    it ("updates a value in the map", () => {
      expect (mp.alter ("a", oldValue => oldValue.map (x => x + 2)))
        .toEqual (new Map ([ [ "a", 3 ], [ "b", 2 ] ]))
      expect (mp.alter ("a", oldValue => oldValue.map (x => x + 2))).not.toBe (mp)
    })

    it ("removes a key-value pair from the map", () => {
      expect (mp.alter ("b", () => Nothing))
        .toEqual (new Map ([ [ "a", 1 ] ]))
      expect (mp.alter ("b", () => Nothing)).not.toBe (mp)
    })
  })
})
