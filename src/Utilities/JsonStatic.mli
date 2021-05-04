(** Utility types and functions for static data JSON decoders. *)

val raise_unknown_variant : variant_name:string -> invalid:string -> 'a
(** Utility function for throwing an exception if a string is not part of a
    variant. *)

type ('id, 'a) make_assoc =
  Locale.Order.t -> ('id * 'a) option Json.Decode.decoder
(** A decoder returning a pair that can be used to build an [IntMap]. *)
