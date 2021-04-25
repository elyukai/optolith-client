type 'a t
(** A translation map, usually located at the [translations] property of a
    record. *)

val preferred : Locale.Order.t -> 'a t -> 'a option
(** [preferred langs mp] takes an ordered list of languages and the language.
    The languages should be ordered by importance in descending order. It
    returns the [EntityTranslation] value of the most important language that
    exists where the predicate returns [true] on the result. Otherwise, [None]
    is returned.

    @example {[
      getFromLanguageOrder f [Dutch; English; German] { Dutch = x; English = y; German = z} = Some x
      (* If f returns false on Dutch: *)
      getFromLanguageOrder f [Dutch; English; German] { Dutch = x; English = y; German = z} = Some y
      getFromLanguageOrder f [Dutch; English; German] { English = y; German = z} = Some y
      getFromLanguageOrder f [Dutch; English; German] { French = a; Italian = b } = None
    ]}
    *)

module Decode : sig
  val t : 'a Json.Decode.decoder -> 'a t Json.Decode.decoder
  (** [t decoder json] decodes the passed JSON as the record with
      language-specific values.

      @raise [DecodeError] if one decoder did not succeed. *)

  val t_opt : 'a option Json.Decode.decoder -> 'a t Json.Decode.decoder
  (** [t decoder json] decodes the passed JSON as the record with
      language-specific values. If the passed decoder returns [None], it is
      handled as if the translation is not present.

      @raise [DecodeError] if one decoder did not succeed. *)
end
