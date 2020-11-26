type t = int;

/**
 * `compare x y` compares two integers and returns an ordering that is to be
 * read *x ordering y*, e.g. if `LT`, `x` is lower than `y`.
 */
let compare = (x: int, y: int) => x < y ? Ley_Ord.LT : x > y ? GT : EQ;

/**
 * `max x y` returns the larger of its two arguments.
 */
let max = (x: int, y: int) => x > y ? x : y;

/**
 * `max x y` returns the smaller of its two arguments.
 */
let min = (x: int, y: int) => x < y ? x : y;

/**
 * `minmax x y` returns a pair `(a, b)` where `a` is the smaller and `b` the
 * larger of `x` and `y`.
 */
let minmax = (x: int, y: int) => x < y ? (x, y) : (y, x);

/**
 * `inc x` increments its argument by 1.
 */
let inc = (x: int) => x + 1;

/**
 * `dec x` decrements its argument by 1.
 */
let dec = (x: int) => x - 1;

/**
 * `negate x` negates its argument.
 */
let negate = (x: int) => - x;

/**
 * `abs x` returns the absolute value of its argument.
 */
let abs = (x: int) => x < 0 ? - x : x;

/**
 * `even x` checks if its argument is even.
 */
let even = (x: int) => x mod 2 === 0;

/**
 * `odd x` checks if its argument is odd.
 */
let odd = (x: int) => x mod 2 === 1;

let rec modUntilNoRemainder = (x, div) => {
  let rem = x mod div;

  if (rem === 0) {
    abs(div);
  } else {
    modUntilNoRemainder(div, rem);
  };
};

/**
 * `gcd x y` is the greatest (positive) integer that divides both `x` and `y`;
 * for example `gcd (-3) 6 = 3`, `gcd (-3) (-6) = 3`, `gcd 0 4 = 4`. `gcd 0 0`
 * raises a runtime error.
 */
let gcd = (x, y) =>
  switch (x, y) {
  | (0, 0) => raise(invalid_arg("gcd: Both inputs cannot be 0."))
  | (0, a)
  | (a, 0) => a
  | (a, b) =>
    let (lower, upper) = minmax(a, b);
    modUntilNoRemainder(lower, upper);
  };

/**
 * `lcm x y` is the smallest positive integer that both `x` and `y` divide.
 */
let lcm = (x, y) =>
  switch (x, y) {
  | (0, 0) => raise(invalid_arg("lcm: Both inputs cannot be 0."))
  | (0, _)
  | (_, 0) => 0
  | (a, b) => a * b / gcd(a, b)
  };

/**
 * Sign of a number. The functions abs and signum should satisfy the law:
 *
 * ```haskell
 * abs x * signum x == x
 * ```
 *
 * For real numbers, the `signum` is either `-1` (negative), `0` (zero) or `1`
 * (positive).
 */
let signum = x => x < 0 ? (-1) : x > 0 ? 1 : 0;

/**
 * `show x` converts its argument to a string.
 */
let show = Js.Int.toString;

/**
 * `unsafeRead x` converts its argument to an integer, but raises an exception
 * if the given string is not a valid representation of an integer.
 */
let unsafeRead = int_of_string;

/**
 * `readOption x` converts its argument to an integer in a `Some` and returns
 * `None` if the given string is not a valid representation of an integer.
 */
let readOption = int_of_string_opt;
