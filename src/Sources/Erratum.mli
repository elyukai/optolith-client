type t = { date : Js.Date.t; description : string }
(** A erratum for a static entry. It is set to the date of when that erratum was
    official and describes what has changed. *)

type nonrec list = t list

module Decode : sig
  val list : list Decoders_bs.Decode.decoder
end
