(** Generate functions for working with functorial structures. *)

module type S = sig
  type 'a t

  val fmap : ('a -> 'b) -> 'a t -> 'b t
  (** [fmap f x] applies [f] to all values in [x]. *)
end

module type Infix = sig
  type 'a t

  val ( <$> ) : ('a -> 'b) -> 'a t -> 'b t
  (** [f <$> x] applies [f] to all values in [x]. *)

  val ( <&> ) : 'a t -> ('a -> 'b) -> 'b t
  (** [x <&> f] applies [f] to all values in [x]. *)

  val ( <$ ) : 'a -> 'b t -> 'a t
  (** [x <$ y] replaces all values in [y] with [x]. *)

  val ( $> ) : 'a t -> 'b -> 'b t
  (** [x $> y] replaces all values in [x] with [y]. *)
end

module MakeInfix (Arg : S) : Infix with type 'a t = 'a Arg.t = struct
  type 'a t = 'a Arg.t

  let ( <$> ) = Arg.fmap

  let ( <&> ) x f = f <$> x

  let ( <$ ) x y = Arg.fmap (fun _ -> x) y

  let ( $> ) x y = y <$ x
end

module type T = sig
  type 'a t

  val fmap : ('a -> 'b) -> 'a t -> 'b t
  (** [fmap f x] applies [f] to all values in [x]. *)
end

module Make (Arg : S) : T with type 'a t = 'a Arg.t = struct
  type 'a t = 'a Arg.t

  let fmap = Arg.fmap
end
