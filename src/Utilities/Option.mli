(** Utility functions for working with optional types. *)

type 'a t = 'a option

include Functor.T with type 'a t := 'a t

include Applicative.T with type 'a t := 'a t

include Applicative.Alternative.T with type 'a t := 'a t

include Monad.T with type 'a t := 'a t

include Foldable.T with type 'a t := 'a t

val sappend : 'a list t -> 'a list t -> 'a list t
(** Concatenates the lists contained in the two [Maybe]s, if both are of type
    [Just a]. If at least one of them is [Nothing], it returns the first
    element. *)

val is_some : 'a t -> bool
(** Checks if the passed value is a [Just]. *)

val is_none : 'a t -> bool
(** Checks if the passed value is [Nothing]. *)

val fromSome : 'a t -> 'a
(** The [fromJust] function extracts the element out of a [Just] and throws an
    error if its argument is [Nothing]. *)

val value : 'a option -> default:'a -> 'a
(** [value o ~default] is [v] if [o] is [Some v] and [default] otherwise. *)

val fold : none:'a -> some:('b -> 'a) -> 'b option -> 'a
(** [fold ~none ~some o] is [none] if [o] is [None] and [some v] if [o] is
    [Some v]. *)

val listToOption : 'a list -> 'a t
(** The [listToMaybe] function returns [Nothing] on an empty list or [Just a]
    where [a] is the first element of the list. *)

val optionToList : 'a t -> 'a list
(** The [maybeToList] function returns an empty list when given [Nothing] or a
    singleton list when not given [Nothing]. *)

val catOptions : 'a t list -> 'a list
(** The [catMaybes] function takes a list of [Maybe]s and returns a list of all
    the [Just] values. *)

val mapOption : ('a -> 'b t) -> 'a list -> 'b list
(** The [mapMaybe] function is a version of [map] which can throw out elements.
    If particular, the functional argument returns something of type [Maybe b].
    If this is [Nothing], no element is added on to the result list. If it is
    [Just b], then [b] is included in the result list. *)

val ensure : ('a -> bool) -> 'a -> 'a t
(** Creates a new [Just a] from the given value if the given predicate evaluates
    to [True]. Otherwise returns [Nothing]. *)

val imapOption : (int -> 'a -> 'b t) -> 'a list -> 'b list
(** The [imapMaybe] function is a version of [map] which can throw out elements.
    If particular, the functional argument returns something of type [Maybe b].
    If this is [Nothing], no element is added on to the result list. If it is
    [Just b], then [b] is included in the result list.

    A version of [mapMaybe] so that the function receives the index of the
    element as well. *)

val liftDef : ('a -> 'a t) -> 'a -> 'a
(** [liftDef f x] applies the function [f] to [x]. If [f] returns a [Some], it's
    inner value is returned. If [f] returns [None], [x] is returned unchanged.
    *)

module Infix : sig
  include Functor.Infix with type 'a t := 'a t

  include Applicative.Infix with type 'a t := 'a t

  include Applicative.Alternative.Infix with type 'a t := 'a t

  include Monad.Infix with type 'a t := 'a t
end
