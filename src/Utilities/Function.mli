(** Combinators for function composition. *)

val id : 'a -> 'a
(** [id] is the identity function. For any argument [x], [id x] is [x]. *)

val const : 'a -> 'b -> 'a
(** [const c] is a function that always returns the value [c]. For any argument
    [x], [(const c) x] is [c]. *)

val flip : ('a -> 'b -> 'c) -> 'b -> 'a -> 'c
(** [flip f] reverses the argument order of the binary function [f]. For any
    arguments [x] and [y], [(flip f) x y] is [f y x]. *)

val negate : ('a -> bool) -> 'a -> bool
(** [negate p] is the negation of the predicate function [p]. For any argument
    [x], [(negate p) x] is [not (p x)]. *)

val on : ('b -> 'b -> 'c) -> ('a -> 'b) -> 'a -> 'a -> 'c
(** [on b u x y] runs the binary function [b] on the results of applying unary
    function [u] to two arguments [x] and [y]. From the opposite perspective, it
    transforms two inputs and combines the outputs.

    Typical usage: [sortBy (on compare fst)]. *)
