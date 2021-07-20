module Order : sig
  type t
  (** The user defines in which order languages should be used to fill the app
      with data. *)

  val from_list : string -> string list -> t
  (** [from_list def xs] returns the order of locale identifiers defined by a
      list in descending order, from the most preferred locale to the least
      preferred locale. The default value usually is an available locale closest
      to the system language. *)

  val to_list : t -> string list
  (** [to_list order] returns the order of locale identifiers as a list in
      descending order, from the most preferred locale to the least preferred
      locale. *)

  val preferred : t -> string
  (** [preferred order] returns the main preferred locale identifier from the
      order of possible locales. *)
end

module Supported : sig
  type t = {
    id : string;  (** The IETF language tag (BCP47). *)
    name : string;
    region : string;
  }
  (** A language supported in Optolith. It features the language's identifier
      and name as well as the region name defined in the BCP47 standard. *)

  val system_locale_to_id : t StrMap.t -> string -> string
  (** Derive the default locale's id from the system locale's id. *)

  module Decode : sig
    val make_strmap : t StrMap.t Decoders_bs.Decode.decoder
  end
end

(* val filterBySupported : string -> Supported.t Ley_StrMap.t -> Order.t -> Order.t
(** [filterBySupported defaultLocale supportedLocales localeOrder] filters the
    order of locales set by the user by the locales that are supported. If this
    causes the order to be empty, a default locale will be used. *) *)
