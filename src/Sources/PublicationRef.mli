type page = Single of int | Range of int * int

type t = { id : int; occurrences : page list }
(**
 * A reference for a static entry it occurs in a certain publication, defined by
 * `id` on a set of pages.
 *)

module Decode : sig
  val make_list : Locale.Order.t -> t list Json.Decode.decoder
end

type nonrec list = t list
