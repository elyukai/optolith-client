type key = int;

[@genType.import "../shims/IntSet.shim"]
type t;

[@genType "IntSet"]
type intset = t;

module Foldable: {
  [@genType]
  let foldr: ((key, 'a) => 'a, 'a, t) => 'a;

  [@genType]
  let foldl: (('a, key) => 'a, 'a, t) => 'a;

  [@genType]
  let toList: t => list(key);

  [@genType "fnull"]
  let null: t => bool;

  [@genType "flength"]
  let length: t => int;

  [@genType]
  let elem: (key, t) => bool;

  [@genType]
  let sum: t => int;

  [@genType]
  let product: t => int;

  [@genType]
  let maximum: t => int;

  [@genType]
  let minimum: t => int;

  [@genType]
  let concatMap: (key => t, t) => t;

  [@genType]
  let any: (key => bool, t) => bool;

  [@genType]
  let all: (key => bool, t) => bool;

  [@genType]
  let notElem: (key, t) => bool;

  [@genType]
  let find: (key => bool, t) => option(key);
};

// CONSTRUCTION

[@genType]
let empty: t;

[@genType]
let singleton: key => t;

[@genType]
let fromList: list(key) => t;

// INSERTION/DELETION

[@genType]
let insert: (key, t) => t;

[@genType "sdelete"]
let delete: (key, t) => t;

[@genType]
let toggle: (key, t) => t;

// QUERY

[@genType]
let member: (key, t) => bool;

[@genType]
let notMember: (key, t) => bool;

[@genType]
let size: t => int;

// COMBINE

/**
 * Excludes the items from both sets.
 */
[@genType]
let union: (t, t) => t;

/**
 * Excludes the items in the second set from the first.
 */
[@genType]
let difference: (t, t) => t;

// FILTER

[@genType]
let filter: (key => bool, t) => t;

// MAP

[@genType]
let map: (key => key, t) => t;

// CONVERSION LIST

[@genType]
let elems: t => list(key);
