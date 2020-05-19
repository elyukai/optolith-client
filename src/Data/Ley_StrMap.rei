type key = string;

[@genType.import "../shims/StrMap.shim"]
type t('a);

[@genType]
[@genType.as "StrMap"]
type strmap('a) = t('a);

module Foldable: {
  [@genType]
  [@genType.as "foldr"]
  let foldr: (('a, 'b) => 'b, 'b, t('a)) => 'b;

  [@genType]
  [@genType.as "foldl"]
  let foldl: (('a, 'b) => 'a, 'a, t('b)) => 'a;

  [@genType]
  [@genType.as "toList"]
  let toList: t('a) => list((key, 'a));

  [@genType]
  [@genType.as "fnull"]
  let null: t('a) => bool;

  [@genType]
  [@genType.as "flength"]
  let length: t('a) => int;

  [@genType]
  [@genType.as "elem"]
  let elem: ('a, t('a)) => bool;

  [@genType]
  [@genType.as "sum"]
  let sum: t(int) => int;

  [@genType]
  [@genType.as "product"]
  let product: t(int) => int;

  [@genType]
  [@genType.as "maximum"]
  let maximum: t(int) => int;

  [@genType]
  [@genType.as "minimum"]
  let minimum: t(int) => int;

  [@genType]
  [@genType.as "concat"]
  let concat: t(list('a)) => list('a);

  [@genType]
  [@genType.as "concatMap"]
  let concatMap: ('a => t('b), t('a)) => t('b);

  [@genType]
  [@genType.as "and"]
  let con: t(bool) => bool;

  [@genType]
  [@genType.as "or"]
  let dis: t(bool) => bool;

  [@genType]
  [@genType.as "any"]
  let any: ('a => bool, t('a)) => bool;

  [@genType]
  [@genType.as "all"]
  let all: ('a => bool, t('a)) => bool;

  [@genType]
  [@genType.as "notElem"]
  let notElem: ('a, t('a)) => bool;

  [@genType]
  [@genType.as "find"]
  let find: ('a => bool, t('a)) => option('a);
};

module Traversable: {
  [@genType]
  [@genType.as "mapMEither"]
  let mapMEither: ('a => result('b, 'c), t('a)) => result(t('b), 'c);
};

[@genType]
[@genType.as "fnull"]
let null: t('a) => bool;

[@genType]
let size: t('a) => int;

[@genType]
let member: (key, t('a)) => bool;

[@genType]
let notMember: (key, t('a)) => bool;

[@genType]
let lookup: (key, t('a)) => option('a);

[@genType]
let findWithDefault: ('a, key, t('a)) => 'a;

let empty: t('a);

[@genType]
let singleton: (key, 'a) => t('a);

[@genType]
let insert: (key, 'a, t('a)) => t('a);

[@genType]
let insertWith: (('a, 'a) => 'a, key, 'a, t('a)) => t('a);

[@genType]
let insertWithKey: ((key, 'a, 'a) => 'a, key, 'a, t('a)) => t('a);

[@genType]
let insertLookupWithKey:
  ((key, 'a, 'a) => 'a, key, 'a, t('a)) => (option('a), t('a));

[@genType]
[@genType.as "sdelete"]
let delete: (key, t('a)) => t('a);

[@genType]
let adjust: ('a => 'a, key, t('a)) => t('a);

[@genType]
let adjustWithKey: ((key, 'a) => 'a, key, t('a)) => t('a);

[@genType]
let update: ('a => option('a), key, t('a)) => t('a);

[@genType]
let updateWithKey: ((key, 'a) => option('a), key, t('a)) => t('a);

[@genType]
let updateLookupWithKey:
  ((key, 'a) => option('a), key, t('a)) => (option('a), t('a));

[@genType]
let alter: (option('a) => option('a), key, t('a)) => t('a);

[@genType]
let union: (t('a), t('a)) => t('a);

[@genType]
let map: ('a => 'b, t('a)) => t('b);

[@genType]
let mapWithKey: ((key, 'a) => 'b, t('a)) => t('b);

[@genType]
let foldrWithKey: ((key, 'a, 'b) => 'b, 'b, t('a)) => 'b;

[@genType]
let foldlWithKey: (('a, key, 'b) => 'a, 'a, t('b)) => 'a;

[@genType]
let elems: t('a) => list('a);

[@genType]
let keys: t('a) => list(key);

[@genType]
let assocs: t('a) => list((key, 'a));

[@genType]
let fromList: list((key, 'a)) => t('a);

[@genType]
let fromArray: array((key, 'a)) => t('a);

[@genType]
let filter: ('a => bool, t('a)) => t('a);

[@genType]
let filterWithKey: ((key, 'a) => bool, t('a)) => t('a);

[@genType]
let mapMaybe: ('a => option('b), t('a)) => t('b);

[@genType]
let mapMaybeWithKey: ((key, 'a) => option('b), t('a)) => t('b);

/**
 * Takes a function and a list. The function is mapped over the list and the
 * return value is used as the key which's value is increased by one every
 * time the value is returned. This way, you can count elements grouped by
 * the value the mapping function returns.
 */
[@genType]
let countBy: ('a => key, list('a)) => t(int);

/**
 * Takes a function and a list. The function is mapped over the list and for
 * each `Just` it returns, the value at the key contained in the `Just` is
 * increased by one. This way, you can count elements grouped by the value
 * the mapping function returns, but you can also ignore values, which is
 * not possible with `countBy`.
 */
[@genType]
let countByM: ('a => option(key), list('a)) => t(int);

/**
 * `groupByKey f xs` groups the elements of the list `xs` by the key
 * returned by passing the respective element to `f` in a map.
 */
[@genType]
let groupBy: ('a => key, list('a)) => t(list('a));
