(** Unified decoders for YAML entities.

    This module provides functors to create unified decoders for YAML
    entities from the database. *)

(** Required types, accessors and decoders to compose the final decoder *)
module type Entity = sig
  type t
  (** The entity record type. *)

  module Translation : Json_Decode_TranslationMap.EntityTranslation

  type multilingual
  (** The record type with language-independent types. It represents the
      equivalent of a YAML file's content. Any adjustments to improve the
      usability in code should be handled in [make]. *)

  val multilingual :
    (Js.Json.t -> Translation.t Json_Decode_TranslationMap.partial) ->
    Js.Json.t ->
    multilingual
  (** [t decodeTranslations json] decodes the passed JSON as the record with
      language-independent values. It has to decode the language-dependent values
      using [decodeTranslations].

      @raise [DecodeError] if one decoder did not succeed. *)

  val make : Locale.Order.t -> multilingual -> Translation.t -> t option
  (** [make langs multilingual translation] merges the multilingual record with
      the record of the most wanted language available and should handle any
      type conversions that differ from the JSON schema for the YAML files. If
      inputs needs to be verified logically, this can be done here and [None]
      can be returned to exclude invalid entries. [langs] can be used to resolve
      translations of nested entities. *)

  (** Accessors for record properties needed because of abstract types. *)
  module Accessors : sig
    val id : t -> int
    (** [id x] returns the id from the passed entity [x]. *)

    val translations :
      multilingual -> Translation.t Json_Decode_TranslationMap.partial
    (** [translations x] returns the [translations] property from the
        [multilingual] record. *)
  end
end

(** The [Nested] module is for entities nested inside other entities. Decoding
    them requires other and less functions than what a top-level entity needs.

    Signatures of types and functors for top-level entities can be found below.
    *)
module Nested : sig
  (** The subtype of a main entity from the YAML database. It needs to provide
      different decoders in order to be able to be decoded in the main type
      decoders. *)
  module type S = sig
    type t

    module Decode : sig
      type multilingual

      val multilingual : multilingual Json.Decode.decoder

      val resolveTranslations : Locale.Order.t -> multilingual -> t option
    end
  end

  (** The subtype of a main entity from the YAML database. It needs to provide
      different decoders in order to be able to be decoded in the main type
      decoders. *)
  module type SafeS = sig
    type t

    module Decode : sig
      type multilingual

      val multilingual : multilingual Json.Decode.decoder

      val resolveTranslations : Locale.Order.t -> multilingual -> t
    end
  end

  (** A wrapper type of a subtype of a main entity from the YAML database. It
      needs to provide different decoders in order to be able to be decoded in the
      main type decoders, but it does, in contrast to the actual subtype, not
      differenciate between the multilingual and the single-language states. *)
  module type WrapperS = sig
    type 'a t

    module Decode : sig
      val multilingual : 'a Json.Decode.decoder -> 'a t Json.Decode.decoder

      val resolveTranslations :
        Locale.Order.t ->
        (Locale.Order.t -> 'a -> 'b option) ->
        'a t ->
        'b t option
    end
  end

  (** A wrapper type of a subtype of a main entity from the YAML database. It
      needs to provide different decoders in order to be able to be decoded in the
      main type decoders, but it does, in contrast to the actual subtype, not
      differenciate between the multilingual and the single-language states. *)
  module type WrapperSafeS = sig
    type 'a t

    module Decode : sig
      val multilingual : 'a Json.Decode.decoder -> 'a t Json.Decode.decoder

      val resolveTranslations :
        Locale.Order.t -> (Locale.Order.t -> 'a -> 'b) -> 'a t -> 'b t
    end
  end

  (** Create unified decoders using the passed nested entity module. *)
  module Make (E : Entity) : sig
    type multilingual
    (** The raw data from the database. *)

    val multilingual : multilingual Json.Decode.decoder
    (** [multilingual json] decodes a full entry from the database.

        @raise [DecodeError] if one decoder did not succeed. *)

    val resolveTranslations : Locale.Order.t -> multilingual -> E.t option
    (** [resolveTranslations locales multilingual] takes the most wanted
        translations of the entry and combines them with the
        language-independent values to form the final entry.

        The function may return [None] if either no matching language could be
        formed or the entry has been excluded using the provided configuration.
        *)
  end
end

type 'a decodeAssoc = Locale.Order.t -> Js.Json.t -> (int * 'a) option
(** [assoc localeOrder json] decodes the passed JSON into a value of type [t]
    of the passed module. It returns [None] if no matching translation could
    be found. It returns a pair to be used for inserting into a map.

    This function combines all required actions. If you can use it, you won't
    need to use [multilingual] or [resolveTranslations].

    This is the type that represents [assoc] from the [Make] functor.

    @raise [DecodeError] if one decoder did not succeed. *)

(** Create unified decoders using the passed entity module. *)
module Make (E : Entity) : sig
  val t : Locale.Order.t -> Js.Json.t -> E.t option
  (** [t localeOrder json] decodes the passed JSON into a value of type [t] of
      the passed module. It returns [None] if no matching translation could be found.

      @raise [DecodeError] if one decoder did not succeed. *)

  val assoc : Locale.Order.t -> Js.Json.t -> (int * E.t) option
  (** [assoc localeOrder json] decodes the passed JSON into a value of type [t]
      of the passed module. It returns [None] if no matching translation could
      be found. It returns a pair to be used for inserting into a map.

      @raise [DecodeError] if one decoder did not succeed. *)
end
