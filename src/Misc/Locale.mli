module Order : sig
  type t
  (** The user defines in which order languages should be used to fill the app
      with data. *)

  val fromList : string list -> t
  (** [fromList xs] returns the order of locale identifiers defined by a list in
      descending order, from the most preferred locale to the least preferred
      locale. *)

  val toList : t -> string list
  (** [toList order] returns the order of locale identifiers as a list in
      descending order, from the most preferred locale to the least preferred
      locale. *)

  val getPreferred : t -> string
  (** [getPreferred order] returns the main preferred locale identifier from the
      order of possible locales. *)
end

module Supported : sig
  type t = { id : string; name : string; region : string }
  (** A language supported in Optolith. It's id is it's IETF language tag
      (BCP47), and it features the languages name as well as the region name
      defined in the standard. *)

  val systemLocaleToId : t Ley_StrMap.t -> string -> string
  (** Derive the default locale's id from the system locale's id. *)

  module Decode : sig
    val map : t Ley_StrMap.t Json.Decode.decoder
  end
end

val filterBySupported : string -> Supported.t Ley_StrMap.t -> Order.t -> Order.t
(** [filterBySupported defaultLocale supportedLocales localeOrder] filters the
    order of locales set by the user by the locales that are supported. If this
    causes the order to be empty, a default locale will be used. *)
