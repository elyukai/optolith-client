/**
 * A dice definition.
 *
 * `2D6` equals to `{ amount: 2, sides: 6 }`
 */
type t = {
  amount: int,
  sides: int,
};

/**
 * Return a random integer between 1 (included) and the passed parameter
 * (included).
 * @example rollDice (6) // D6
 */
let rollDie = sides =>
  Js.Math.floor(Js.Math.random() *. Js.Int.toFloat(sides)) |> Int.inc;

/**
 * Subtract the second from the *absolute* value of the first while keeping it's
 * sign.
 *
 * ```reason
 * 5 -| 2 === 3
 * -5 -| 2 === -3
 * ```
 */
let (-|) = (a, b) => a >= 0 ? a - b : a + b;

let rec rollDiceAux = (~amount, ~sides) =>
  Int.abs(amount) <= 1
    ? [rollDie(sides)]
    : [rollDie(sides), ...rollDiceAux(~amount=amount -| 1, ~sides)];

/**
 * Rolls multiple dice with equal sides.
 * @example rollDice ({ amount: 2, sides: 6}) // 2D6
 */
let rollDice = ({amount, sides}) => rollDiceAux(~amount, ~sides);

let rec rollDiceSumAux = (~amount, ~sides) =>
  Int.abs(amount) <= 1
    ? rollDie(sides)
    : rollDie(sides) + rollDiceSumAux(~amount=amount -| 1, ~sides);

/**
 * Rolls multiple dice with equal sides and returns the sum of it's results.
 * @example rollDice ({ amount: 2, sides: 6}) // 2D6
 */
let rollDiceSum = ({amount, sides}) => rollDiceSumAux(~amount, ~sides);

let rec rollDiceSumMapAux = (~map: (t, int) => int, ~amount, ~sides) =>
  Int.abs(amount) <= 1
    ? rollDie(sides) |> map({amount, sides})
    : (rollDie(sides) |> map({amount, sides}))
      + rollDiceSumMapAux(~map, ~amount=amount -| 1, ~sides);

/**
 * Rolls multiple dice with equal sides and passes each die result to the passed
 * function together with the dice config.
 */
let rollDiceSumMap = (f: (t, int) => int, {amount, sides}) =>
  rollDiceSumMapAux(~map=f, ~amount, ~sides);
