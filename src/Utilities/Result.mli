(** Utility functions for working with [result] types. *)

type ('a, 'e) t = ('a, 'e) result

module Extra : sig
  val fromError : 'a -> ('b, 'a) t -> 'a
  (** Return the contents of a [Error]-value or a default value otherwise.

      {[
      fromError 1 (Error 3) == 3
      fromError 1 (Ok "foo") == 1
      ]} *)

  val fromOk : 'a -> ('a, 'b) t -> 'a
  (** Return the contents of a [Ok]-value or a default value otherwise.

      {[
      fromOk 1 (Ok 3) == 3
      fromOk 1 (Error "foo") == 1
      ]} *)

  val fromResult : ('a, 'a) t -> 'a
  (** Pull the value out of an [Either] where both alternatives have the same
      type.

      {[
      fun x -> fromEither (Error x ) == x
      fun x -> fromEither (Ok x) == x
      ]} *)

  val fromError' : ('a, 'b) t -> 'b
  (** The [fromError'] function extracts the element out of a [Error] and throws
      an error if its argument is [Ok]. Much like [fromJust], using this
      function in polished code is usually a bad idea.

      {[
      fun x -> fromError' (Error  x) == x
      fun x -> fromError' (Ok x) == undefined
      ]}

      @throws TypeError *)

  val fromOk' : ('a, 'b) t -> 'a
  (** The [fromOk'] function extracts the element out of a [Ok] and throws an
      error if its argument is [Error]. Much like [fromJust], using this
      function in polished code is usually a bad idea.

      {[
      fun x -> fromOk' (Ok x) == x
      fun x -> fromOk' (Error  x) == undefined
      ]}

      @throws TypeError *)

  val resultToOption : ('a, 'b) t -> 'a option
  (** Given an [Either], convert it to a [Maybe], where [Error] becomes [Nothing].

      {[
      fun x -> eitherToMaybe (Error x) == Nothing
      fun x -> eitherToMaybe (Ok x) == Just x
      ]} *)

  val optionToResult : 'a -> 'b option -> ('b, 'a) t
  (** Given a [Maybe], convert it to an [Either], providing a suitable value for
      the [Error] should the value be [Nothing].

      {[
      fun a b -> maybeToEither a (Just b) == Ok b
      fun a -> maybeToEither a Nothing == Error a
      ]} *)

  val optionToResult' : (unit -> 'a) -> 'b option -> ('b, 'a) t
  (** Given a [Maybe], convert it to an [Either], providing a suitable value for
      the [Error] should the value be [Nothing].

      {[
      fun a b -> maybeToEither a (Just b) == Ok b
      fun a -> maybeToEither a Nothing == Error a
      ]}

      Lazy version of [maybeToEither]. *)
end

include Bifunctor.T with type ('a, 'e) t := ('a, 'e) t

module type Error = sig
  type t
end

(** Result is a bifunctor and so we need to provide the error type in advance to
    implement many single-type-parameter abstractions. *)
module WithError (E : Error) : sig
  include Functor.T with type 'a t := ('a, E.t) t

  include Applicative.T with type 'a t := ('a, E.t) t

  include Monad.T with type 'a t := ('a, E.t) t

  include Foldable.T with type 'a t := ('a, E.t) t
end

val result : ('a -> 'b) -> ('c -> 'b) -> ('a, 'c) t -> 'b
(**
 * Case analysis for the [Either] type. If the value is [Error a], apply the
 * first function to [a] if it is [Ok b], apply the second function to [b].
 *)

val errors : ('a, 'b) t list -> 'b list
(**
 * Extracts from a list of [Either] all the [Error] elements. All the [Error]
 * elements are extracted in order.
 *)

val oks : ('a, 'b) t list -> 'a list
(**
 * Extracts from a list of [Either] all the [Ok] elements. All the [Ok]
 * elements are extracted in order.
 *)

val partitionResults : ('a, 'b) t list -> 'a list * 'b list
(**
 * Partitions a list of [Either] into two lists. All the [Error] elements are
 * extracted, in order, to the first component of the output. Similarly the
 * [Ok] elements are extracted to the second component of the output.
 *)

val swap : ('a, 'b) t -> ('b, 'a) t
(**
 * Converts an [Error] into a [Ok] and a [Ok] into an [Error].
 *)
