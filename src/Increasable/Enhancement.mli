type t = {
  id : int;
  name : string;
  level : int;
  effect : string;
  prerequisite : int option;
      (** The enhancement requires another enhancement. *)
  src : PublicationRef.list;
  errata : Erratum.list;
}

module Decode : sig
  type multilingual

  val multilingual : multilingual Json.Decode.decoder

  val resolveTranslations : Locale.Order.t -> multilingual -> t option
end
