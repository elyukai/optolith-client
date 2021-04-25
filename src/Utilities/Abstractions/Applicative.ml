(** Generate functions for working with applicative structures. *)

module type S = sig
  include Functor.T

  val pure : 'a -> 'a t
  (** [pure x] lifts the value [x] into the type. *)

  val ap : ('a -> 'b) t -> 'a t -> 'b t
  (** [ap f x] applies all functions in [f] to all values in [x]. *)
end

module type Infix = sig
  type 'a t

  val ( <*> ) : ('a -> 'b) t -> 'a t -> 'b t
  (** [f <*> x] applies all functions in [f] to all values in [x]. *)

  val ( <**> ) : 'a t -> ('a -> 'b) t -> 'b t
  (** [x <**> f] applies all functions in [f] to all values in [x]. *)
end

module MakeInfix (Arg : S) : Infix with type 'a t = 'a Arg.t = struct
  type 'a t = 'a Arg.t

  let ( <*> ) = Arg.ap

  let ( <**> ) x f = f <*> x
end

module type T = sig
  type 'a t

  val pure : 'a -> 'a t
  (** [pure x] lifts the value [x] into the type. *)

  val liftA2 : ('a -> 'b -> 'c) -> 'a t -> 'b t -> 'c t
  (** [liftA2 f x y] applies the function [f] to the values in [x] and [y]. *)
end

module Make (Arg : S) : T with type 'a t = 'a Arg.t = struct
  type 'a t = 'a Arg.t

  let pure = Arg.pure

  let liftA2 f x y = Arg.ap (Arg.fmap f x) y
end

module Alternative = struct
  module type S = sig
    type 'a t

    val empty : 'a t
    (** [empty] is the empty representation of the structure. *)

    val alt : 'a t -> 'a t -> 'a t
    (** [alt x y] returns [x] if it is not empty, otherwise [y]. *)
  end

  module type Infix = sig
    type 'a t

    val ( <|> ) : 'a t -> 'a t -> 'a t
    (** [x <|> y] returns [x] if it is not empty, otherwise [y]. *)
  end

  module MakeInfix (Arg : S) : Infix with type 'a t = 'a Arg.t = struct
    type 'a t = 'a Arg.t

    let ( <|> ) = Arg.alt
  end

  module type T = sig
    type 'a t

    val empty : 'a t
    (** [empty] is the empty representation of the structure. *)
  end

  module Make (Arg : S) : T with type 'a t = 'a Arg.t = struct
    type 'a t = 'a Arg.t

    let empty = Arg.empty
  end
end
