type t = { amount : int; sides : int }
(** A dice definition. [2D6] equals [{ amount = 2; sides = 6 }] *)

val rollDice : t -> int list
(** Rolls multiple dice with equal sides. *)

val rollDiceSum : t -> int
(** Rolls multiple dice with equal sides and returns the sum of it's results. *)

val rollDiceSumMap : (t -> int -> int) -> t -> int
(** Rolls multiple dice with equal sides and passes each die result to the
    passed function together with the dice config. The return value of the
    mapping function is then used to calculate the sum of all results. *)

module Decode : sig
  val t : t Json.Decode.decoder
end
