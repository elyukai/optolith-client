(** A [NonEmpty] list is a list that always has at least one element, but is
    otherwise identical to a traditional [list] type. *)

(** The non-empty list. *)
type 'a t = NonEmpty of 'a * 'a list

(** Constructors *)

val make : 'a -> 'a list -> 'a t
(** [make x xs] constructs a [NonEmpty] list from a safe head element and a
    possibly-empty tail.*)

include Functor.T with type 'a t := 'a t

(** Basic functions *)

val length : 'a t -> int
(** Number of elements in NonEmpty list. *)

val head : 'a t -> 'a
(** Extract the first element of the stream. *)

val tail : 'a t -> 'a list
(** Extract the possibly-empty tail of the stream. *)

val last : 'a t -> 'a
(** Extract the last element of the stream. *)

val init : 'a t -> 'a list
(** Extract everything except the last element of the stream. *)

val cons : 'a -> 'a t -> 'a t
(** Prepend an element to the stream. *)

val uncons : 'a t -> 'a * 'a t option
(** [uncons] produces the first element of the stream, and a stream of the
    remaining elements, if any. *)

val to_list : 'a t -> 'a list
(** [to_list] converts the non-empty list into a standard list. *)

val from_list : 'a list -> 'a t option
(** [from_list] converts the list into a standard list, if any elements are
    present. *)

module Decode : sig
  val t : 'a Json.Decode.decoder -> 'a t Json.Decode.decoder

  val t_safe : 'a Json.Decode.decoder -> 'a t option Json.Decode.decoder

  val one_or_many : 'a Json.Decode.decoder -> 'a t Json.Decode.decoder

  val one_or_many_safe :
    'a Json.Decode.decoder -> 'a t option Json.Decode.decoder
end
