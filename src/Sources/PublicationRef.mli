type page = Single of int | Range of int * int

type t = { id : int; occurrences : page list }
(**
 * A reference for a static entry it occurs in a certain publication, defined by
 * `id` on a set of pages.
 *)

module Decode : sig
  type multilingual

  val multilingualList : multilingual list Json.Decode.decoder

  val resolveTranslationsList : Locale.Order.t -> multilingual list -> t list
end

type nonrec list = t list
