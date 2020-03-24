type key = int;

[@genType.import "../shims/IntMap.shim"]
type t('a);

[@genType "IntMap"]
type intmap('a) = t('a);

module Foldable: {
  let foldr: (('a, 'b) => 'b, 'b, t('a)) => 'b;

  let foldl: (('a, 'b) => 'a, 'a, t('b)) => 'a;

  let toList: t('a) => list((key, 'a));

  let null: t('a) => bool;

  let length: t('a) => int;

  let elem: ('a, t('a)) => bool;

  let sum: t(int) => int;

  let product: t(int) => int;

  let maximum: t(int) => int;

  let minimum: t(int) => int;

  let concat: t(list('a)) => list('a);

  let concatMap: ('a => t('b), t('a)) => t('b);

  let con: t(bool) => bool;

  let dis: t(bool) => bool;

  let any: ('a => bool, t('a)) => bool;

  let all: ('a => bool, t('a)) => bool;

  let notElem: ('a, t('a)) => bool;

  let find: ('a => bool, t('a)) => Maybe.t('a);
};

let size: t('a) => int;

let member: (key, t('a)) => bool;

let notMember: (key, t('a)) => bool;

let lookup: (key, t('a)) => Maybe.t('a);

let findWithDefault: ('a, key, t('a)) => 'a;

let empty: t('a);

let singleton: (key, 'a) => t('a);

let insert: (key, 'a, t('a)) => t('a);

let insertWith: (('a, 'a) => 'a, key, 'a, t('a)) => t('a);

let insertWithKey: ((key, 'a, 'a) => 'a, key, 'a, t('a)) => t('a);

let insertLookupWithKey:
  ((key, 'a, 'a) => 'a, key, 'a, t('a)) => (Maybe.t('a), t('a));

let delete: (key, t('a)) => t('a);

let adjust: ('a => 'a, key, t('a)) => t('a);

let adjustWithKey: ((key, 'a) => 'a, key, t('a)) => t('a);

let update: ('a => Maybe.t('a), key, t('a)) => t('a);

let updateWithKey: ((key, 'a) => Maybe.t('a), key, t('a)) => t('a);

let updateLookupWithKey:
  ((key, 'a) => Maybe.t('a), key, t('a)) => (Maybe.t('a), t('a));

let alter: (Maybe.t('a) => Maybe.t('a), key, t('a)) => t('a);

let union: (t('a), t('a)) => t('a);

let map: ('a => 'b, t('a)) => t('b);

let mapWithKey: ((key, 'a) => 'b, t('a)) => t('b);

let foldrWithKey: ((key, 'a, 'b) => 'b, 'b, t('a)) => 'b;

let foldlWithKey: (('a, key, 'b) => 'a, 'a, t('b)) => 'a;

let elems: t('a) => list('a);

let keys: t('a) => list(key);

let assocs: t('a) => list((key, 'a));

let fromList: list((key, 'a)) => t('a);

let filter: ('a => bool, t('a)) => t('a);

let filterWithKey: ((key, 'a) => bool, t('a)) => t('a);

let mapMaybe: ('a => Maybe.t('b), t('a)) => t('b);

let mapMaybeWithKey: ((key, 'a) => Maybe.t('b), t('a)) => t('b);

module Traversable: {
  let mapMEither: ('a => Either.t('b, 'c), t('a)) => Either.t('b, t('c));
};
