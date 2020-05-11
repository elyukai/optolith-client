module IntSet =
  Ley_Set.Make({
    type t = int;
    let compare = compare;
  });

type key = IntSet.key;

type t = IntSet.t;

type intset = IntSet.t;

module Foldable = {
  include IntSet.Foldable;

  let sum = foldr((+), 0);

  let product = foldr(( * ), 1);

  let maximum = foldr(Js.Math.max_int, Js.Int.min);

  let minimum = foldr(Js.Math.min_int, Js.Int.max);
};

// CONSTRUCTION

let empty = IntSet.empty;

let singleton = IntSet.singleton;

let fromList = IntSet.fromList;

// INSERTION/DELETION

let insert = IntSet.insert;

let delete = IntSet.delete;

let toggle = IntSet.toggle;

// QUERY

let member = IntSet.member;

let notMember = IntSet.notMember;

let size = IntSet.size;

// COMBINE

let union = IntSet.union;

let difference = IntSet.difference;

// FILTER

let filter = IntSet.filter;

// MAP

let map = IntSet.map;

// CONVERSION LIST

let elems = IntSet.elems;
