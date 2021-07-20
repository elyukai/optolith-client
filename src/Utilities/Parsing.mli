(** Utility types, functions and other extensions for decoders. *)

type ('id, 'a) make_assoc =
  Locale.Order.t -> ('id * 'a) option Decoders_bs.Decode.decoder
(** A decoder returning a pair that can be used to build an [IntMap]. *)

module Infix : sig
  val ( >>=:: ) :
    'a Decoders_bs.Decode.decoder ->
    ('a -> 'b Decoders_bs.Decode.decoder) ->
    'b Decoders_bs.Decode.decoder
  (** [head >>=:: tail] is the infix version of
      [Decoders_bs.Decode.uncons tail head]. *)
end
