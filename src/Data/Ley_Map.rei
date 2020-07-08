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

      let find: ('a => bool, t('a)) => option('a);
    };

    module Traversable: {
      let mapMEither: ('a => result('b, 'c), t('a)) => result(t('b), 'c);
    };

    let null: t('a) => bool;

    let size: t('a) => int;

    let member: (key, t('a)) => bool;

    let notMember: (key, t('a)) => bool;

    let lookup: (key, t('a)) => option('a);

    let findWithDefault: ('a, key, t('a)) => 'a;

    let empty: t('a);

    let singleton: (key, 'a) => t('a);

    let insert: (key, 'a, t('a)) => t('a);

    let insertWith: (('a, 'a) => 'a, key, 'a, t('a)) => t('a);

    let insertWithKey: ((key, 'a, 'a) => 'a, key, 'a, t('a)) => t('a);

    let insertLookupWithKey:
      ((key, 'a, 'a) => 'a, key, 'a, t('a)) => (option('a), t('a));

    let delete: (key, t('a)) => t('a);

    let adjust: ('a => 'a, key, t('a)) => t('a);

    let adjustWithKey: ((key, 'a) => 'a, key, t('a)) => t('a);

    let update: ('a => option('a), key, t('a)) => t('a);

    let updateWithKey: ((key, 'a) => option('a), key, t('a)) => t('a);

    let updateLookupWithKey:
      ((key, 'a) => option('a), key, t('a)) => (option('a), t('a));

    let alter: (option('a) => option('a), key, t('a)) => t('a);

    let union: (t('a), t('a)) => t('a);

    let map: ('a => 'b, t('a)) => t('b);

    let mapWithKey: ((key, 'a) => 'b, t('a)) => t('b);

    let foldrWithKey: ((key, 'a, 'b) => 'b, 'b, t('a)) => 'b;

    let foldlWithKey: (('a, key, 'b) => 'a, 'a, t('b)) => 'a;

    let elems: t('a) => list('a);

    let keys: t('a) => list(key);

    let assocs: t('a) => list((key, 'a));

    let fromList: list((key, 'a)) => t('a);

    let fromArray: array((key, 'a)) => t('a);

    let filter: ('a => bool, t('a)) => t('a);

    let filterWithKey: ((key, 'a) => bool, t('a)) => t('a);

    let mapMaybe: ('a => option('b), t('a)) => t('b);

    let mapMaybeWithKey: ((key, 'a) => option('b), t('a)) => t('b);

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
    let countByM: ('a => option(key), list('a)) => t(int);

    /**
     * `groupByKey f xs` groups the elements of the list `xs` by the key
     * returned by passing the respective element to `f` in a map.
     */
    let groupBy: ('a => key, list('a)) => t(list('a));
  };
