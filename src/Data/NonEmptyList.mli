(** A special list type which is guaranteed to have at least one element. *)

type 'a t

val from_list : 'a list -> 'a t option
(** Construct a non-empty list from an ordinary list. Returns [Some] if the list
    contains at least one element and a [None] if the list is empty. *)

val to_list : 'a t -> 'a list
(** Converts a non-empty list to a ordinary list. *)

module Decode : sig
  val t : 'a Json.Decode.decoder -> Js.Json.t -> 'a t
  (** Decodes a JSON array into an ['a t] using the given decoder on each
      element.

      Returns an ['a t] if the JSON value is a non-empty JSON array and all its
      elements are successfully decoded.

      @raise [DecodeError] if unsuccessful *)
end
