module type Comparable = sig
  type t

  val compare : t -> t -> int
end

module type T = sig
  type key

  type 'a t

  include Foldable.T with type 'a t := 'a t

  val null : 'a t -> bool

  val size : 'a t -> int

  val member : key -> 'a t -> bool

  val notMember : key -> 'a t -> bool

  val lookup : key -> 'a t -> 'a option

  val findWithDefault : 'a -> key -> 'a t -> 'a

  val empty : 'a t

  val singleton : key -> 'a -> 'a t

  val insert : key -> 'a -> 'a t -> 'a t

  val insertWith : ('a -> 'a -> 'a) -> key -> 'a -> 'a t -> 'a t

  val insertWithKey : (key -> 'a -> 'a -> 'a) -> key -> 'a -> 'a t -> 'a t

  val insertLookupWithKey :
    (key -> 'a -> 'a -> 'a) -> key -> 'a -> 'a t -> 'a option * 'a t

  val delete : key -> 'a t -> 'a t

  val adjust : ('a -> 'a) -> key -> 'a t -> 'a t

  val adjustWithKey : (key -> 'a -> 'a) -> key -> 'a t -> 'a t

  val update : ('a -> 'a option) -> key -> 'a t -> 'a t

  val updateWithKey : (key -> 'a -> 'a option) -> key -> 'a t -> 'a t

  val updateLookupWithKey :
    (key -> 'a -> 'a option) -> key -> 'a t -> 'a option * 'a t

  val alter : ('a option -> 'a option) -> key -> 'a t -> 'a t

  val union : 'a t -> 'a t -> 'a t

  val map : ('a -> 'b) -> 'a t -> 'b t

  val mapWithKey : (key -> 'a -> 'b) -> 'a t -> 'b t

  val foldrWithKey : (key -> 'a -> 'b -> 'b) -> 'b -> 'a t -> 'b

  val foldlWithKey : ('a -> key -> 'b -> 'a) -> 'a -> 'b t -> 'a

  val elems : 'a t -> 'a list

  val keys : 'a t -> key list

  val assocs : 'a t -> (key * 'a) list

  val fromList : (key * 'a) list -> 'a t

  val from_list_with : ('a -> key * 'b) -> 'a list -> 'b t

  val fromArray : (key * 'a) array -> 'a t

  val filter : ('a -> bool) -> 'a t -> 'a t

  val filterWithKey : (key -> 'a -> bool) -> 'a t -> 'a t

  val mapOption : ('a -> 'b option) -> 'a t -> 'b t

  val mapOptionWithKey : (key -> 'a -> 'b option) -> 'a t -> 'b t

  (** Zipping *)

  val zip : 'a t -> 'b t -> ('a * 'b) t
  (** `zip mp1 mp2` merges the maps `mp1` and `mp2` so that the resulting map
      contains only keys that are in both source maps and their values are a
      pair of the values from the source maps. *)

  val zipOption : 'a t -> 'b t -> ('a * 'b option) t
  (** `zipOption mp1 mp2` merges the maps `mp1` and `mp2` so that the resulting
      map contains only keys that are in `mp1` and their values are a pair of
      the values from `mp1` and the optional value from `mp2`, since the key
      does not need to exist in `mp2`. *)

  (** Counting *)

  val countWith : ('a -> bool) -> 'a t -> int
  (** `countWith pred mp` takes a predicate function and a map. The predicate is
      used to count elements based on if the predicate returns `true`. *)

  val countWithKey : (key -> 'a -> bool) -> 'a t -> int
  (** `countWithKey pred mp` takes a predicate function and a map. The predicate
      is used to count elements based on if the predicate returns `true`. *)

  val countBy : ('a -> key) -> 'a list -> int t
  (** Takes a function and a list. The function is mapped over the list and the
      return value is used as the key which's value is increased by one every
      time the value is returned. This way, you can count elements grouped by
      the value the mapping function returns. *)

  val countByM : ('a -> key option) -> 'a list -> int t
  (** Takes a function and a list. The function is mapped over the list and for
      each `Just` it returns, the value at the key contained in the `Just` is
      increased by one. This way, you can count elements grouped by the value
      the mapping function returns, but you can also ignore values, which is not
      possible with `countBy`. *)

  val groupBy : ('a -> key) -> 'a list -> 'a list t
  (** `groupByKey f xs` groups the elements of the list `xs` by the key returned
      by passing the respective element to `f` in a map. *)
end

module Make (Key : Comparable) : T with type key = Key.t = struct
  type key = Key.t

  module TypedMap = Map.Make (Key)

  type 'a t = 'a TypedMap.t

  include (
    Foldable.Make (struct
      type nonrec 'a t = 'a t

      let foldr f initial mp = TypedMap.fold (fun _ v acc -> f v acc) mp initial

      let foldl f initial mp = TypedMap.fold (fun _ v acc -> f acc v) mp initial

      let equal = ( == )
    end) :
      Foldable.T with type 'a t := 'a t)

  let null mp = TypedMap.is_empty mp

  let size = TypedMap.cardinal

  let member = TypedMap.mem

  let notMember key mp = not (member key mp)

  let lookup key mp =
    TypedMap.find_first_opt (fun k -> Key.compare k key == 0) mp
    |> Option.Infix.( <$> ) snd

  let findWithDefault default key mp = mp |> lookup key |> Option.value ~default

  let empty = TypedMap.empty

  let singleton = TypedMap.singleton

  let insert = TypedMap.add

  let insertWith f key value mp =
    insert key (Option.fold ~none:value ~some:(f value) (lookup key mp)) mp

  let insertWithKey f key value mp =
    insert key (Option.fold ~none:value ~some:(f key value) (lookup key mp)) mp

  let insertLookupWithKey f key value mp =
    let old = lookup key mp in
    (old, insert key (Option.fold ~none:value ~some:(f key value) old) mp)

  let delete = TypedMap.remove

  let adjust f key mp =
    TypedMap.update key
      (fun mx -> match mx with Some x -> Some (f x) | None -> None)
      mp

  let adjustWithKey f key mp =
    TypedMap.update key
      (fun mx -> match mx with Some x -> Some (f key x) | None -> None)
      mp

  let update f key mp =
    TypedMap.update key
      (fun mx -> match mx with Some x -> f x | None -> None)
      mp

  let updateWithKey f key mp =
    TypedMap.update key
      (fun mx -> match mx with Some x -> f key x | None -> None)
      mp

  let updateLookupWithKey f key mp =
    let old = lookup key mp in
    ( old,
      TypedMap.update key
        (fun mx -> match mx with Some x -> f key x | None -> None)
        mp )

  let alter f key mp = TypedMap.update key (fun mx -> mx |> f) mp

  let union mp1 mp2 = TypedMap.union (fun _ x _ -> Some x) mp1 mp2

  let map = TypedMap.map

  let mapWithKey = TypedMap.mapi

  let foldrWithKey f initial mp =
    TypedMap.fold (fun key v acc -> f key v acc) mp initial

  let foldlWithKey f initial mp =
    TypedMap.fold (fun key v acc -> f acc key v) mp initial

  let elems mp = mp |> TypedMap.bindings |> List.map snd

  let keys mp = mp |> TypedMap.bindings |> List.map fst

  let assocs = TypedMap.bindings

  let fromList ps = List.fold_left (fun mp (k, v) -> insert k v mp) empty ps

  let from_list_with f ps =
    let insert_item mp x =
      let k, v = f x in
      insert k v mp
    in
    List.fold_left insert_item empty ps

  let fromArray ps = Array.fold_left (fun mp (k, v) -> insert k v mp) empty ps

  let filter pred mp = TypedMap.filter (fun _ x -> pred x) mp

  let filterWithKey = TypedMap.filter

  let mapOption f mp =
    let insert_item k x acc =
      match f x with Some y -> insert k y acc | None -> acc
    in
    TypedMap.fold insert_item mp empty

  let mapOptionWithKey f mp =
    let insert_item k x acc =
      match f k x with Some y -> insert k y acc | None -> acc
    in
    TypedMap.fold insert_item mp empty

  let zip mp1 mp2 =
    mapOptionWithKey
      (fun k v1 ->
        let open Option.Infix in
        Tuple.pair v1 <$> lookup k mp2)
      mp1

  let zipOption mp1 mp2 = mapWithKey (fun k v1 -> (v1, lookup k mp2)) mp1

  let countWith pred mp =
    foldr
      (fun x -> match pred x with true -> Int.succ | false -> Function.id)
      0 mp

  let countWithKey pred mp =
    foldrWithKey
      (fun key x ->
        match pred key x with true -> Int.succ | false -> Function.id)
      0 mp

  let countBy f xs =
    let increment_acc acc =
      acc |> Option.fold ~none:1 ~some:Int.succ |> Option.pure
    in
    let count_key mp x = alter increment_acc (f x) mp in
    List.fold_left count_key empty xs

  let countByM f xs =
    let increment_acc acc =
      acc |> Option.fold ~none:1 ~some:Int.succ |> Option.pure
    in
    let count_key mp key = alter increment_acc key mp in
    let ensure_key mp x = f x |> Option.fold ~none:mp ~some:(count_key mp) in
    List.fold_left ensure_key empty xs

  let groupBy f xs =
    let prepend_acc x acc =
      acc |> Option.fold ~none:[ x ] ~some:(List.cons x) |> Option.pure
    in
    let extend_key mp x = alter (prepend_acc x) (f x) mp in
    List.fold_left extend_key empty xs
end
