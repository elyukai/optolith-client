(** A [NonEmpty] list is a list that always has at least one element, but is
    otherwise identical to a traditional [list] type. *)

(** The non-empty list. *)
type 'a t = NonEmpty of 'a * 'a list

(** Constructors *)

val one : 'a -> 'a t
(** [one x] constructs a [NonEmpty] list from a single element. *)

val make : 'a -> 'a list -> 'a t
(** [make x xs] constructs a [NonEmpty] list from a safe head element and a
    possibly-empty tail.*)

include Functor.T with type 'a t := 'a t

include Foldable.T with type 'a t := 'a t

(** Basic functions *)

val at : int -> 'a t -> 'a option
(** Returns the element at the passed index. If the index is invalid (index
    negative or index >= list length), [Nothing] is returned, otherwise a
    [Just] of the found element. *)

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

val take : int -> 'a t -> 'a list
(** [take n], applied to a list [xs], returns the prefix of [xs] of length [n],
    or [xs] itself if [n > length xs]. *)

module Index : sig
  val setAt : int -> 'a -> 'a t -> 'a t
  (** [setAt] sets the element at the index.

      If the index is negative or exceeds list length, the original list will be
      returned. *)

  val modifyAt : int -> ('a -> 'a) -> 'a t -> 'a t
  (** [modifyAt] applies a function to the element at the index.

      If the index is negative or exceeds list length, the original list will be
      returned. *)

  val insertAt : int -> 'a -> 'a t -> 'a t
  (** [insertAt] inserts an element at the given position so that all elements
      starting at and including that index will be moved by one (1).

      If the index is negative or exceeds list length, the original list will be
      returned. (If the index is equal to the list length, the insertion can be
      carried out.) *)

  val imap : (int -> 'a -> 'b) -> 'a t -> 'b t
  (** [imap f xs] is the list obtained by applying [f] to each element of [xs].
      *)
end

module Decode : sig
  val t : 'a Decoders_bs.Decode.decoder -> 'a t Decoders_bs.Decode.decoder

  val t_safe :
    'a Decoders_bs.Decode.decoder -> 'a t option Decoders_bs.Decode.decoder

  val one_or_many :
    'a Decoders_bs.Decode.decoder -> 'a t Decoders_bs.Decode.decoder

  val one_or_many_safe :
    'a Decoders_bs.Decode.decoder -> 'a t option Decoders_bs.Decode.decoder
end
