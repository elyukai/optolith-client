(** Generate functions for working with equatable structures. *)

module type S = sig
  type t

  val compare : t -> t -> int
  (** [compare x y] returns [0] if [x] is equal to [y], a negative integer if
      [x] is less than [y], and a positive integer if [x] is greater than [y].
      *)
end

module type Infix = sig
  type t

  val ( == ) : t -> t -> bool
  (** [x == y] returns [true] if [x] equals [y]. *)

  val ( != ) : t -> t -> bool
  (** [x != y] returns [true] if [x] is not equal to [y]. *)
end

module MakeInfix (Arg : S) : Infix with type t = Arg.t = struct
  type t = Arg.t

  let ( == ) x y = Arg.compare x y == 0

  let ( != ) x y = Arg.compare x y != 0
end

module type T = sig
  type t

  val compare : t -> t -> int
  (** [compare x y] returns [0] if [x] is equal to [y], a negative integer if
      [x] is less than [y], and a positive integer if [x] is greater than [y].
      *)

  val equal : t -> t -> bool
  (** [equal x y] returns [true] if [x] equals [y]. *)
end

module Make (Arg : S) : T with type t = Arg.t = struct
  type t = Arg.t

  let compare = Arg.compare

  let equal x y = Arg.compare x y == 0
end
