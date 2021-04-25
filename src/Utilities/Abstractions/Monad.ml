(** Generate functions for working with monadic structures. *)

module type S = sig
  type 'a t

  val pure : 'a -> 'a t
  (** [pure x] lifts the value [x] into the type. *)

  val fmap : ('a -> 'b) -> 'a t -> 'b t
  (** [fmap f x] applies [f] to all values in [x]. *)

  val bind : ('a -> 'b t) -> 'a t -> 'b t
  (** [bind f x] applies [f] to all values in [x] and unwraps the results. *)
end

module type Infix = sig
  type 'a t

  val ( >>= ) : 'a t -> ('a -> 'b t) -> 'b t
  (** [f >>= x] applies [f] to all values in [x] and unwraps the results. *)

  val ( =<< ) : ('a -> 'b t) -> 'a t -> 'b t
  (** [x =<< f] applies [f] to all values in [x] and unwraps the results. *)

  val ( >> ) : 'a t -> 'b t -> 'b t
  (** [x >> y] applies [y] to all values in [x] without using them and unwraps
      the results. *)

  val ( << ) : 'a t -> 'b t -> 'a t
  (** [y << x] applies [<] to all values in [x] without using them and unwraps
      the results. *)

  val ( >=> ) : ('a -> 'b t) -> ('b -> 'c t) -> 'a -> 'c t
  (** [(f >=> g) x] composes [f] and [g], both returning a wrapped value. [x] is
      applied to [f] and then the unwrapped value is applied to [g]. *)

  val ( <=< ) : ('b -> 'c t) -> ('a -> 'b t) -> 'a -> 'c t
  (** [(g <=< f) x] composes [f] and [g], both returning a wrapped value. [x] is
      applied to [f] and then the unwrapped value is applied to [g]. *)
end

module MakeInfix (Arg : S) : Infix with type 'a t = 'a Arg.t = struct
  type 'a t = 'a Arg.t

  let ( >>= ) x f = Arg.bind f x

  let ( =<< ) x f = f >>= x

  let ( >> ) x y = x >>= fun _ -> y

  let ( << ) y x = x >>= fun _ -> y

  let ( >=> ) f g x = x |> f >>= g

  let ( <=< ) g f x = (f >=> g) x
end

module type T = sig
  type 'a t

  val return : 'a -> 'a t
  (** [return x] lifts the value [x] into the type. *)

  val join : 'a t t -> 'a t
  (** [join x] removes one structure level. *)

  val liftM2 : ('a -> 'b -> 'c) -> 'a t -> 'b t -> 'c t
  (** Lift a function to be applied to two wrapped values and returns the result
      unwrapped. *)

  val liftM3 : ('a -> 'b -> 'c -> 'd) -> 'a t -> 'b t -> 'c t -> 'd t
  (** Lift a function to be applied to three wrapped values and returns the
      result unwrapped. *)

  val liftM4 :
    ('a -> 'b -> 'c -> 'd -> 'e) -> 'a t -> 'b t -> 'c t -> 'd t -> 'e t
  (** Lift a function to be applied to four wrapped values and returns the
      result unwrapped. *)

  val liftM5 :
    ('a -> 'b -> 'c -> 'd -> 'e -> 'f) ->
    'a t ->
    'b t ->
    'c t ->
    'd t ->
    'e t ->
    'f t
  (** Lift a function to be applied to five wrapped values and returns the
      result unwrapped. *)
end

module Make (Arg : S) : T with type 'a t = 'a Arg.t = struct
  type 'a t = 'a Arg.t

  let return = Arg.pure

  let join x = Arg.bind (fun y -> y) x

  let liftM2 f a b = Arg.bind (fun a' -> Arg.fmap (fun b' -> f a' b') b) a

  let liftM3 f a b c =
    Arg.bind
      (fun a' -> Arg.bind (fun b' -> Arg.fmap (fun c' -> f a' b' c') c) b)
      a

  let liftM4 f a b c d =
    Arg.bind
      (fun a' ->
        Arg.bind
          (fun b' ->
            Arg.bind (fun c' -> Arg.fmap (fun d' -> f a' b' c' d') d) c)
          b)
      a

  let liftM5 f a b c d e =
    Arg.bind
      (fun a' ->
        Arg.bind
          (fun b' ->
            Arg.bind
              (fun c' ->
                Arg.bind (fun d' -> Arg.fmap (fun e' -> f a' b' c' d' e') e) d)
              c)
          b)
      a
end
