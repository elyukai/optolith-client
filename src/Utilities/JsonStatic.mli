(** Utility types for static data JSON decoders. *)

type 'a make_assoc = Locale.Order.t -> (int * 'a) option Json.Decode.decoder
(** A decoder returning a pair that can be used to build an [IntMap]. *)
