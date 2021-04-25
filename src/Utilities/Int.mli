(** Utility functions for working with integer values. *)

type t = int

val neg : int -> int
(** [neg x] negates its argument. *)

val succ : int -> int
(** [succ x] is [x + 1]. *)

val pred : int -> int
(** [pred x] is [x - 1]. *)

val abs : int -> int
(** [abs x] is the absolute value of [x]. That is [x] if [x] is positive and
    [neg x] if [x] is negative. *)

val compare : int -> int -> int
(** [compare x y] returns [0] if [x] is equal to [y], a negative integer if [x]
    is less than [y], and a positive integer if [x] is greater than [y]. *)

val max : int -> int -> int
(** [max x y] is the larger of its two arguments. *)

val min : int -> int -> int
(** [max x y] is the smaller of its two arguments. *)

val minmax : int -> int -> int * int
(** [minmax x y] is a pair `(a, b)` where `a` is the smaller and `b` the larger
    of `x` and `y`. *)

val even : int -> bool
(** [even x] checks if its argument is even. *)

val odd : int -> bool
(** [odd x] checks if its argument is odd. *)

val gcd : int -> int -> int
(** [gcd x y] is the greatest (positive) integer that divides both [x] and [y];
    for example [gcd (-3) 6 = 3], [gcd (-3) (-6) = 3], [gcd 0 4 = 4]. [gcd 0 0]
    raises a runtime error. *)

val lcm : int -> int -> int
(** [lcm x y] is the smallest positive integer that both [x] and [y] divide. *)

val signum : int -> int
(** Sign of a number. The functions abs and signum should satisfy the law:

    {[abs x * signum x == x]}

    For real numbers, the [signum] is either [-1] (negative), [0] (zero) or [1]
    (positive). *)
