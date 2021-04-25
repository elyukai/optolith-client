(** Utility functions for working with indices and bounding pairs. *)

val range : int * int -> int list
(** The list of values in the subrange defined by a bounding pair.

    The first argument `[(l,u)]` is a pair specifying the lower and upper bounds
    of a contiguous subrange of values. *)

val inRange : int * int -> int -> bool
(** Returns `True` the given subscript lies in the range defined the bounding
    pair.

    The first argument `[(l,u)]` is a pair specifying the lower and upper bounds
    of a contiguous subrange of values. *)

val index : int * int -> int -> int
(** The position of a subscript in the subrange.

    The first argument `[(l,u)]` is a pair specifying the lower and upper bounds
    of a contiguous subrange of values.

    @raise [Invalid_argument] if index out of range. *)

val rangeSize : int * int -> int
(** The size of the subrange defined by a bounding pair.

    The first argument `[(l,u)]` is a pair specifying the lower and upper bounds
    of a contiguous subrange of values. *)
