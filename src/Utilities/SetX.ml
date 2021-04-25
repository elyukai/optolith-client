module type Comparable = sig
  type t

  val compare : t -> t -> int
end

module type T = sig
  type key

  type t

  val foldr : (key -> 'a -> 'a) -> 'a -> t -> 'a

  val foldl : ('a -> key -> 'a) -> 'a -> t -> 'a

  val toList : t -> key list

  val null : t -> bool

  val length : t -> int

  val elem : key -> t -> bool

  val concatMap : (key -> t) -> t -> t

  val any : (key -> bool) -> t -> bool

  val all : (key -> bool) -> t -> bool

  val notElem : key -> t -> bool

  val find : (key -> bool) -> t -> key option

  val empty : t

  val singleton : key -> t

  val fromList : key list -> t

  val insert : key -> t -> t

  val delete : key -> t -> t

  val toggle : key -> t -> t

  val member : key -> t -> bool

  val notMember : key -> t -> bool

  val size : t -> int

  val disjoint : t -> t -> bool

  val union : t -> t -> t
  (** Excludes the items from both sets. *)

  val difference : t -> t -> t
  (** Excludes the items in the second set from the first. *)

  val filter : (key -> bool) -> t -> t

  val map : (key -> key) -> t -> t

  val elems : t -> key list
end

module Make (Key : Comparable) : T with type key = Key.t = struct
  type key = Key.t

  module TypedSet = Set.Make (Key)

  type t = TypedSet.t

  let foldr f initial s = TypedSet.fold f s initial

  let foldl =
    ( fun f initial s -> TypedSet.fold (Function.flip f) s initial
      : ('a -> key -> 'a) -> 'a -> t -> 'a )

  let toList = TypedSet.elements

  let null = TypedSet.is_empty

  let length = TypedSet.cardinal

  let elem x = TypedSet.exists (fun y -> Key.compare x y == 0)

  let concatMap f s =
    TypedSet.fold (fun x acc -> TypedSet.union acc (f x)) s TypedSet.empty

  let any pred s = s |> TypedSet.for_all (fun x -> x |> pred |> not) |> not

  let all pred = TypedSet.for_all (fun x -> x |> pred)

  let notElem x s = not (elem x s)

  let find pred s = TypedSet.find_first_opt pred s

  let empty = TypedSet.empty

  let singleton = TypedSet.singleton

  let fromList = TypedSet.of_list

  let insert = TypedSet.add

  let delete = TypedSet.remove

  let toggle x s =
    match elem x s with true -> delete x s | false -> insert x s

  let member = elem

  let notMember = notElem

  let size = length

  let disjoint xs ys = TypedSet.inter xs ys |> TypedSet.is_empty

  let union = TypedSet.union

  let difference = TypedSet.diff

  let filter = TypedSet.filter

  let map = TypedSet.map

  let elems = toList
end
