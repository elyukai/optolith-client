/**
 * `not :: Bool -> Bool`
 *
 * This function returns `True` on `False` and vice versa.
 */
let not = (!);

/**
 * `notP :: (a -> Bool) -> a -> Bool`
 *
 * This function inverts the output of the passed predicate function.
 */
let notP = f => f |> (!);

/**
 * `otherwise :: Bool`
 *
 * `otherwise` is defined as the value `True`. It helps to make guards more
 * readable. eg.
 *
 * ```haskell
 * f x | x < 0     = ...
 *     | otherwise = ...
 * ```
 */
let otherwise = true;

/**
 * `bool :: a -> a -> Bool -> a`
 *
 * Case analysis for the `Bool` type. `bool x y p` evaluates to `x` when `p` is
 * `False`, and evaluates to `y` when `p` is `True`.
 *
 * This is equivalent to `if p then y else x`; that is, one can think of it as
 * an if-then-else construct with its arguments reordered.
 */
let bool = (x, y, cond) => cond ? y : x;

/**
 * `bool_ :: (() -> a) -> (() -> a) -> Bool -> a`
 *
 * Case analysis for the `Bool` type. `bool f g p` evaluates to the return value
 * of `f` when `p` is `False`, and evaluates to the return value of `g` when `p`
 * is `True`.
 *
 * This is equivalent to `if p then g () else f ()`; that is, one can think of
 * it as an if-then-else construct with its arguments reordered.
 *
 * Lazy version of `bool`.
 */
let bool_ = (f, g, cond) => cond ? g() : f();
