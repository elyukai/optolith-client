type binary_handling = {
  as_male : bool;
      (** Defines if the sex should be treated as male when checking prerequisites. *)
  as_female : bool;
      (** Defines if the sex should be treated as female when checking prerequisites. *)
}
(** Defines how a non-binary sex should be treated when checking prerequisites. *)

(** A possible character's sex which may be binary or non-binary. If a sex is
    non-binary, options how to handle binary prerequisites must be specified. *)
type t =
  | Male
  | Female
  | BalThani of binary_handling
  | Tsajana of binary_handling
  | Custom of { binary_handling : binary_handling; name : string }

module Decode : sig
  val t : t Json.Decode.decoder
end

module Encode : sig
  val t : t Json.Encode.encoder
end
