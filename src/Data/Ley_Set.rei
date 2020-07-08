module type Comparable = {
  type t;
  let compare: (t, t) => int;
};

module Make:
  (Key: Comparable) =>
   {
    type key = Key.t;

    type t;

    module Foldable: {
      let foldr: ((key, 'a) => 'a, 'a, t) => 'a;

      let foldl: (('a, key) => 'a, 'a, t) => 'a;

      let toList: t => list(key);

      let null: t => bool;

      let length: t => int;

      let elem: (key, t) => bool;

      let concatMap: (key => t, t) => t;

      let any: (key => bool, t) => bool;

      let all: (key => bool, t) => bool;

      let notElem: (key, t) => bool;

      let find: (key => bool, t) => option(key);
    };

    // CONSTRUCTION

    let empty: t;

    let singleton: key => t;

    let fromList: list(key) => t;

    // INSERTION/DELETION

    let insert: (key, t) => t;

    let delete: (key, t) => t;

    let toggle: (key, t) => t;

    // QUERY

    let member: (key, t) => bool;

    let notMember: (key, t) => bool;

    let size: t => int;

    // COMBINE

    /**
     * Excludes the items from both sets.
     */
    let union: (t, t) => t;

    /**
     * Excludes the items in the second set from the first.
     */
    let difference: (t, t) => t;

    // FILTER

    let filter: (key => bool, t) => t;

    // MAP

    let map: (key => key, t) => t;

    // CONVERSION LIST

    let elems: t => list(key);
  };
