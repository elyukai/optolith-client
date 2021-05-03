(** Generate functions for working with foldable structures. *)

module type S = sig
  type 'a t

  val foldr : ('a -> 'b -> 'b) -> 'b -> 'a t -> 'b
  (** [foldr f init x] reduces the container [x] from right to left by
      accumulating it's values with the function [f], which takes the current
      value in the container and the current accumulated value. [init] is the
      accumulated value at the beginning. *)

  val foldl : ('a -> 'b -> 'a) -> 'a -> 'b t -> 'a
  (** [foldl f init x] reduces the container [x] from left to right by
      accumulating it's values with the function [f], which takes the current
      value in the container and the current accumulated value. [init] is the
      accumulated value at the beginning. *)

  val equal : 'a -> 'a -> bool
  (** [equal x y] is [true] if and only if [x] equals [y]. *)
end

module type T = sig
  type 'a t

  val foldr : ('a -> 'b -> 'b) -> 'b -> 'a t -> 'b
  (** [foldr f init x] reduces the container [x] from right to left by
      accumulating it's values with the function [f], which takes the current
      value in the container and the current accumulated value. [init] is the
      accumulated value at the beginning. *)

  val foldl : ('a -> 'b -> 'a) -> 'a -> 'b t -> 'a
  (** [foldl f init x] reduces the container [x] from left to right by
      accumulating it's values with the function [f], which takes the current
      value in the container and the current accumulated value. [init] is the
      accumulated value at the beginning. *)

  val foldl' : ('a -> 'b -> 'b) -> 'b -> 'a t -> 'b
  (** [foldl' f init x] reduces the container [x] from left to right by
      accumulating it's values with the function [f], which takes the current
      value in the container and the current accumulated value. [init] is the
      accumulated value at the beginning. *)

  val toList : 'a t -> 'a list
  (** [toList x] converts the container [x] to a list. *)

  val null : 'a t -> bool
  (** [null x] checks whether the container [x] is empty. *)

  val length : 'a t -> int
  (** [length x] returns the length of the container [x]. *)

  val elem : 'a -> 'a t -> bool
  (** [elem e x] returns if the value [e] occurs in the container [x]. *)

  val sum : int t -> int
  (** [sum x] returns the sum of the values in [x]. *)

  val maximum : int t -> int
  (** [maximum x] returns the largest integer in [x]. *)

  val minimum : int t -> int
  (** [minimum x] returns the smallest integer in [x]. *)

  val concat : 'a list t -> 'a list
  (** [concat x] concatenates all elements in [x]. *)

  val concatMap : ('a -> 'b list) -> 'a t -> 'b list
  (** [concatMap f x] maps the function [f] over all the elements of container
      [x] and concatenates the resulting lists. *)

  val con : bool t -> bool
  (** [con x] is the conjunction (logical AND) of all elements in the container.
      *)

  val dis : bool t -> bool
  (** [dis x] is the disjunction (logical OR) of all elements in the container.
      *)

  val any : ('a -> bool) -> 'a t -> bool
  (** [any pred x] returns true if at least one value in the container [x]
      matches the given predicate [pred]. *)

  val all : ('a -> bool) -> 'a t -> bool
  (** [all pred x] returns true if all values in the container [x] matche the
      given predicate [pred]. *)

  val notElem : 'a -> 'a t -> bool
  (** [notElem e x] returns if the value [e] does not occur in the container
      [x]. *)

  val find : ('a -> bool) -> 'a t -> 'a option
  (** [find pred x] takes a predicate [pred] and a structure [x] and returns the
      leftmost element of the structure matching the predicate, or [None] if
      there is no such element. *)
end

module Make (Arg : S) : T with type 'a t = 'a Arg.t = struct
  type 'a t = 'a Arg.t

  let foldr = Arg.foldr

  let foldl = Arg.foldl

  let foldl' f init x = foldl (fun acc e -> f e acc) init x

  let toList x = foldr (fun e xs -> e :: xs) [] x

  let null x = foldl (fun _ _ -> false) true x

  let length x = foldl (fun len _ -> len + 1) 0 x

  let any f x =
    foldl (fun res e -> match f e with true -> true | false -> res) false x

  let all f x =
    foldl (fun res e -> match f e with true -> res | false -> false) true x

  let elem e x = any (fun x' -> Arg.equal e x') x

  let sum x = foldl ( + ) 0 x

  let maximum xs = foldl Js.Math.max_int Js.Int.min xs

  let minimum xs = foldl Js.Math.min_int Js.Int.max xs

  let concat x = foldl ( @ ) [] x

  let concatMap f x = foldl (fun rs e -> f e @ rs) [] x

  let con x = foldl (fun acc e -> acc && e) true x

  let dis x = foldl (fun acc e -> acc || e) false x

  let notElem e x = all (fun x' -> not (Arg.equal e x')) x

  let find f x =
    foldl
      (fun res e ->
        match res with
        | Some _ as x -> x
        | None -> (
            match f e with
            | true -> ( Some e [@explicit_arity] )
            | false -> None ))
      None x
end
