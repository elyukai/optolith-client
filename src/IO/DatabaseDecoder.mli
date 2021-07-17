module Entities : sig
  val decode_files :
    set_progress:(float -> unit) ->
    Locale.Order.t ->
    'a ->
    DatabaseReader.Entities.t ->
    Static.t
  (** [decode_files ~set_progress] decodes all database entries as their
      respective entity types and collects them as a single static record. *)
end
