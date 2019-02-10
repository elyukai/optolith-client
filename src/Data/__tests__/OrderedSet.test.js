// @ts-check
const { List } = require('../List');
const { OrderedSet } = require('../OrderedSet');
const { fromArray, fromUniqueElements, fromSet } = require('../OrderedSet');

// CONSTRUCTOR

test ('fromUniqueElements', () => {
  expect (fromUniqueElements (1, 2, 3) .value)
    .toEqual (new Set ([1, 2, 3]))
  expect (fromUniqueElements (1, 2, 3, 1) .value)
    .toEqual (new Set ([1, 2, 3]))
  expect (fromUniqueElements () .value)
    .toEqual (new Set ())
})

test ('fromArray', () => {
  expect (fromArray ([1, 2, 3]) .value)
    .toEqual (new Set ([1, 2, 3]))
  expect (fromArray ([1, 2, 3, 1]) .value)
    .toEqual (new Set ([1, 2, 3]))
  expect (fromArray ([]) .value)
    .toEqual (new Set ())
})

test ('fromSet', () => {
  expect (fromSet (new Set ([1, 2, 3])) .value)
    .toEqual (new Set ([1, 2, 3]))
  expect (fromSet (new Set ([1, 2, 3, 1])) .value)
    .toEqual (new Set ([1, 2, 3]))
  expect (fromSet (new Set ()) .value)
    .toEqual (new Set ())
})

test ('[Symbol.iterator]', () => {
  expect ([...fromArray (['a', 'b', 'c'])])
    .toEqual (['a', 'b', 'c'])
})

// CONSTRUCTION

test ('empty', () => {
  expect (OrderedSet.empty)
    .toEqual (fromArray ([]))
})

test ('singleton', () => {
  expect (OrderedSet.singleton('a'))
    .toEqual (fromArray (['a']))
})

test ('fromList', () => {
  expect (OrderedSet.fromList (List (1, 2, 3)) .value)
    .toEqual (new Set([1, 2, 3]))
})

// INSERTION

test ('insert', () => {
  expect (OrderedSet.insert ('d') (fromArray (['a', 'b', 'c'])))
    .toEqual (fromArray (['a', 'b', 'c', 'd']))
})

// DELETION

test ('sdelete', () => {
  expect (OrderedSet.sdelete ('c') (fromArray (['a', 'b', 'c'])))
    .toEqual (fromArray (['a', 'b']))
  expect (OrderedSet.sdelete ('d') (fromArray (['a', 'b', 'c'])))
    .toEqual (fromArray (['a', 'b', 'c']))
})

// QUERY

test ('member', () => {
  expect (OrderedSet.member ('b') (fromArray (['a', 'b', 'c'])))
    .toBeTruthy ()
  expect (OrderedSet.member ('d') (fromArray ([])))
    .toBeFalsy ()
})

test ('notMember', () => {
  expect (OrderedSet.notMember ('b') (fromArray (['a', 'b', 'c'])))
    .toBeFalsy ()
  expect (OrderedSet.notMember ('d') (fromArray ([])))
    .toBeTruthy ()
})

test ('size', () => {
  expect (OrderedSet.size (fromArray (['a', 'b', 'c'])))
    .toEqual (3)
  expect (OrderedSet.size (fromArray ([])))
    .toEqual (0)
})

// COMBINE

test ('union', () => {
  expect (OrderedSet.union (fromArray (['a', 'b', 'c']))
                           (fromArray (['c', 'd', 'e'])))
    .toEqual (fromArray (['a', 'b', 'c', 'd', 'e']))
})

// FILTER

test ('filter', () => {
  expect (OrderedSet.filter (e => e > 'a') (fromArray (['a', 'b', 'c'])))
    .toEqual (fromArray (['b', 'c']))
})

// MAP

test ('map', () => {
  expect (OrderedSet.map (e => e + '+') (fromArray (['a', 'b', 'c'])))
    .toEqual (fromArray (['a+', 'b+', 'c+']))
})

// CONVERSION LIST

test ('elems', () => {
  expect (OrderedSet.elems (fromArray (['a', 'b', 'c'])))
    .toEqual (List ('a', 'b', 'c'))
})

// CUSTOM FUNCTIONS

test ('toSet', () => {
  expect (OrderedSet.toSet (fromArray (['a', 'b', 'c'])))
    .toEqual (new Set(['a', 'b', 'c']))
})

test ('toArray', () => {
  expect (OrderedSet.toArray (fromArray (['a', 'b', 'c'])))
    .toEqual (['a', 'b', 'c'])
})

test ('toggle', () => {
  expect (OrderedSet.toggle ('c') (fromArray (['a', 'b', 'c'])))
    .toEqual (fromArray (['a', 'b']))
  expect (OrderedSet.toggle ('d') (fromArray (['a', 'b', 'c'])))
    .toEqual (fromArray (['a', 'b', 'c', 'd']))
})

test ('isOrderedSet', () => {
  expect (OrderedSet.isOrderedSet (fromArray (['a', 'b', 'c'])))
    .toEqual (true)
  expect (OrderedSet.isOrderedSet (3)) .toEqual (false)
})
