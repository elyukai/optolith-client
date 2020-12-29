(** Types and functions that must be provided for an entity in order to derive
    the final decoders. *)
module type Entity = sig
  type t

  module Translation : Json_Decode_TranslationMap.EntityTranslation

  type multilingual

  val multilingual :
    (Js.Json.t -> Translation.t Json_Decode_TranslationMap.partial) ->
    Js.Json.t ->
    multilingual

  val make : Locale.order -> multilingual -> Translation.t -> t option

  (** Accessors are needed to provide the final translation to [make] as well as
      to get the id of the entry for [toAssoc]. *)
  module Accessors : sig
    val id : t -> int

    val translations :
      multilingual -> Translation.t Json_Decode_TranslationMap.partial
  end
end

type 'a decodeAssoc = Locale.order -> Js.Json.t -> (int * 'a) option

(** The [Nested] module is for entities nested inside other entities. Decoding
    them requires other and less functions than what a top-level entity needs.
    *)
module Nested = struct
  (** The subtype of a main entity from the YAML database. It needs to provide
      different decoders in order to be able to be decoded in the main type
      decoders. *)
  module type S = sig
    type t

    module Decode : sig
      type multilingual

      val multilingual : multilingual Json.Decode.decoder

      val resolveTranslations : Locale.order -> multilingual -> t option
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
        Locale.order -> (Locale.order -> 'a -> 'b option) -> 'a t -> 'b t option
    end
  end

  (** Functor to derive the final decoders from the types and functions for the
      nested entity. *)
  module Make (E : Entity) = struct
    module TranslationMap = Json_Decode_TranslationMap.Make (E.Translation)

    type multilingual = E.multilingual

    let multilingual = E.multilingual TranslationMap.t

    let resolveTranslations langs x =
      Ley_Option.Infix.(
        x |> E.Accessors.translations
        |> TranslationMap.getFromLanguageOrder langs
        >>= E.make langs x)
  end
end

(** Functor to derive the final decoders from the types and functions for the
    entity. *)
module Make (E : Entity) = struct
  include Nested.Make (E)

  let t langs json = json |> multilingual |> resolveTranslations langs

  let toAssoc (x : E.t) = (E.Accessors.id x, x)

  let assoc langs json = Ley_Option.Infix.(t langs json <&> toAssoc)
end
