module type Comparable = {
  type t;
  let compare: (t, t) => int;
};

module Make:
  (Key: Comparable) =>
   {
    type key = Key.t;

    type t('a);

    module Foldable: {
      [@genType "foldr"]
      let foldr: (('a, 'b) => 'b, 'b, t('a)) => 'b;

      [@genType "foldl"]
      let foldl: (('a, 'b) => 'a, 'a, t('b)) => 'a;

      [@genType "toList"]
      let toList: t('a) => list((key, 'a));

      [@genType "fnull"]
      let null: t('a) => bool;

      [@genType "length"]
      let length: t('a) => int;

      [@genType "elem"]
      let elem: ('a, t('a)) => bool;

      [@genType "sum"]
      let sum: t(int) => int;

      [@genType "product"]
      let product: t(int) => int;

      [@genType "maximum"]
      let maximum: t(int) => int;

      [@genType "minimum"]
      let minimum: t(int) => int;

      [@genType "concat"]
      let concat: t(list('a)) => list('a);

      [@genType "concatMap"]
      let concatMap: ('a => t('b), t('a)) => t('b);

      [@genType "and"]
      let con: t(bool) => bool;

      [@genType "or"]
      let dis: t(bool) => bool;

      [@genType "any"]
      let any: ('a => bool, t('a)) => bool;

      [@genType "all"]
      let all: ('a => bool, t('a)) => bool;

      [@genType "notElem"]
      let notElem: ('a, t('a)) => bool;

      [@genType "find"]
      let find: ('a => bool, t('a)) => Maybe.t('a);
    };

    module Traversable: {
      [@genType "mapMEither"]
      let mapMEither:
        ('a => Either.t('b, 'c), t('a)) => Either.t('b, t('c));
    };

    [@genType "fnull"]
    let null: t('a) => bool;

    [@genType]
    let size: t('a) => int;

    [@genType]
    let member: (key, t('a)) => bool;

    [@genType]
    let notMember: (key, t('a)) => bool;

    [@genType]
    let lookup: (key, t('a)) => Maybe.t('a);

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
      ((key, 'a, 'a) => 'a, key, 'a, t('a)) => (Maybe.t('a), t('a));

    [@genType "sdelete"]
    let delete: (key, t('a)) => t('a);

    [@genType]
    let adjust: ('a => 'a, key, t('a)) => t('a);

    [@genType]
    let adjustWithKey: ((key, 'a) => 'a, key, t('a)) => t('a);

    [@genType]
    let update: ('a => Maybe.t('a), key, t('a)) => t('a);

    [@genType]
    let updateWithKey: ((key, 'a) => Maybe.t('a), key, t('a)) => t('a);

    [@genType]
    let updateLookupWithKey:
      ((key, 'a) => Maybe.t('a), key, t('a)) => (Maybe.t('a), t('a));

    [@genType]
    let alter: (Maybe.t('a) => Maybe.t('a), key, t('a)) => t('a);

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
    let mapMaybe: ('a => Maybe.t('b), t('a)) => t('b);

    [@genType]
    let mapMaybeWithKey: ((key, 'a) => Maybe.t('b), t('a)) => t('b);

    /**
     * Takes a function and a list. The function is mapped over the list and the
     * return value is used as the key which's value is increased by one every
     * time the value is returned. This way, you can count elements grouped by
     * the value the mapping function returns.
     */
    let countBy: ('a => key, list('a)) => t(int);

    /**
     * Takes a function and a list. The function is mapped over the list and for
     * each `Just` it returns, the value at the key contained in the `Just` is
     * increased by one. This way, you can count elements grouped by the value
     * the mapping function returns, but you can also ignore values, which is
     * not possible with `countBy`.
     */
    let countByM: ('a => Maybe.t(key), list('a)) => t(int);
  };
