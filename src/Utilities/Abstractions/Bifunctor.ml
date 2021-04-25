(** Generate functions for working with bifunctorial structures. *)

module type S = sig
  type ('a, 'b) t

  val bimap : ('a -> 'b) -> ('c -> 'd) -> ('a, 'c) t -> ('b, 'd) t
  (** [bimap f g x] applies [f] to the first value of bifunctor [x] and [g] to
      the second value of bifunctor [x]. *)
end

module type T = sig
  type ('a, 'b) t

  val bimap : ('a -> 'b) -> ('c -> 'd) -> ('a, 'c) t -> ('b, 'd) t
  (** [bimap f g x] applies [f] to the first value of bifunctor [x] and [g] to
      the second value of bifunctor [x]. *)

  val first : ('a -> 'b) -> ('a, 'c) t -> ('b, 'c) t
  (** [bimap f x] applies [f] to the first value of bifunctor [x]. *)

  val second : ('b -> 'c) -> ('a, 'b) t -> ('a, 'c) t
  (** [bimap f x] applies [f] to the second value of bifunctor [x]. *)
end

module Make (Arg : S) : T with type ('a, 'b) t = ('a, 'b) Arg.t = struct
  type ('a, 'b) t = ('a, 'b) Arg.t

  let bimap = Arg.bimap

  let first f = Arg.bimap f Function.id

  let second f = Arg.bimap Function.id f
end
