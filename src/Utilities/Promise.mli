(** Utility functions for working with [Promise] objects in asynchronous
    contexts. *)

type 'a t = 'a Js.Promise.t

val traverse : ('a -> 'b Js.Promise.t) -> 'a list -> 'b list Js.Promise.t
(** [traverse f arr] maps [f] over all values of [arr], collecting the results.
    Not tail-recursive. *)

val traversei :
  (int -> 'a -> 'b Js.Promise.t) -> 'a list -> 'b list Js.Promise.t
(** [traversei f arr] maps [f] over all values of [arr], collecting the results.
    Not tail-recursive. *)

module Infix : sig
  include Functor.Infix with type 'a t := 'a t

  include Monad.Infix with type 'a t := 'a t
end
