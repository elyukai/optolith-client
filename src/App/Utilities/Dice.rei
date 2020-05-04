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
 * Rolls multiple dice with equal sides.
 * @example rollDice ({ amount: 2, sides: 6}) // 2D6
 */
let rollDice: t => list(int);

/**
 * Rolls multiple dice with equal sides and returns the sum of it's results.
 * @example rollDice ({ amount: 2, sides: 6}) // 2D6
 */
let rollDiceSum: t => int;

/**
 * Rolls multiple dice with equal sides and passes each die result to the passed
 * function together with the dice config. The return value of the mapping
 * function is then used to calculate the sum of all results.
 */
let rollDiceSumMap: ((t, int) => int, t) => int;
