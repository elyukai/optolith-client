type key = int;

[@genType.import "../shims/IntSet.shim"]
type t;

[@genType "IntSet"]
type intset = t;

// CONSTRUCTION

let empty: t;

let singleton: key => t;

let fromList: list(key) => t;
