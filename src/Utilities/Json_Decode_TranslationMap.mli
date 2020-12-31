type 'a partial
(** A partially decoded translation map, usually located at the [translations]
    property of a record. *)

(** The type and decoder for a translation record.

    A separate module is used to not fill the main module with too many
    helpers if they are needed. *)
module type EntityTranslation = sig
  type t
  (** The record type with language-specific values. It represents the
      equivalent of the YAML file's content at the keys of the [translations]
      property. Any adjustments to improve the usability in code should be
      handled in [make]. *)

  val t : t Json.Decode.decoder
  (** [t json] decodes the passed JSON as the record with language-specific
      values.

      @raise [DecodeError] if one decoder did not succeed. *)

  val pred : t -> bool
  (** This predicate is used to further filter translations. They are going to
      be filtered by language importance first and then this predicate is
      checked. If the translations should not be filtered by additional
      parameters, this function should always return [true]. *)
end

module Make (E : EntityTranslation) : sig
  type t = E.t partial

  val t : t Json.Decode.decoder
  (** Decodes a set of [Decodable] values. *)

  val getFromLanguageOrder : Locale.Order.t -> t -> E.t option
  (** [getFromLanguageOrderWith pred langs mp] takes a predicate, an ordered
      list of languages and the language. The languages should be ordered by
      importance in descending order. It returns the [EntityTranslation] value
      of the most important language that exists where the predicate returns
      [true] on the result. Otherwise, [None] is returned.

      @example {[
        getFromLanguageOrder f [Dutch; English; German] { Dutch = x; English = y; German = z} = Some x
        (* If f returns false on Dutch: *)
        getFromLanguageOrder f [Dutch; English; German] { Dutch = x; English = y; German = z} = Some y
        getFromLanguageOrder f [Dutch; English; German] { English = y; German = z} = Some y
        getFromLanguageOrder f [Dutch; English; German] { French = a; Italian = b } = None
      ]}
      *)
end
