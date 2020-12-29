(** [gsum first last] returns the Gaussian sum, summing up all integers between
    and including [first] and [last].

    @example {[
      gsum 1 100 == 1 + 2 + ... + 99 + 100 == 5050
    ]}
    *)
let gsum first last =
  Js.Math.floor
    (Js.Int.toFloat (last - first + 1) /. 2.0 *. Js.Int.toFloat (first + last))
