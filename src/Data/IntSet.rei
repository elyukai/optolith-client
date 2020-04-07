type key = int;

[@genType.import "../shims/IntSet.shim"]
type t;

[@genType "IntSet"]
type intset = t;

module Foldable: {
  [@genType "foldr"]
  let foldr: ((key, 'a) => 'a, 'a, t) => 'a;

  [@genType "foldl"]
  let foldl: (('a, key) => 'a, 'a, t) => 'a;

  [@genType "toList"]
  let toList: t => list(key);

  [@genType "null"]
  let null: t => bool;

  [@genType "length"]
  let length: t => int;

  [@genType "elem"]
  let elem: (key, t) => bool;

  [@genType "sum"]
  let sum: t => int;

  [@genType "product"]
  let product: t => int;

  [@genType "maximum"]
  let maximum: t => int;

  [@genType "minimum"]
  let minimum: t => int;

  [@genType "concatMap"]
  let concatMap: (key => t, t) => t;

  [@genType "any"]
  let any: (key => bool, t) => bool;

  [@genType "all"]
  let all: (key => bool, t) => bool;

  [@genType "notElem"]
  let notElem: (key, t) => bool;

  [@genType "find"]
  let find: (key => bool, t) => Maybe.t(key);
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
