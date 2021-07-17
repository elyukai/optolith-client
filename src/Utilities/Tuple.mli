(** Utility functions for working with tuples. *)

val pair : 'a -> 'b -> 'a * 'b
(** [pair x y] is [(x, y)]. *)

include Bifunctor.T with type ('a, 'b) t := 'a * 'b

val fst : 'a * 'b -> 'a
(** Return the first component of a pair. *)

val snd : 'a * 'b -> 'b
(** Return the second component of a pair. *)

val curry : ('a * 'b -> 'c) -> 'a -> 'b -> 'c
(** [curry] transforms an uncurried function to a curried one. *)

val uncurry : ('a -> 'b -> 'c) -> 'a * 'b -> 'c
(** [uncurry] transforms a curried function to an uncurried one. *)

val swap : 'a * 'b -> 'b * 'a
(** Swap the components of a pair. *)
