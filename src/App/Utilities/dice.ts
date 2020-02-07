import { subtractAbs } from "../../Data/Num"
import { Record } from "../../Data/Record"
import { Die } from "../Models/Wiki/sub/Die"

/**
 * Return a random integer between 1 (included) and the passed parameter
 * (included).
 * @example rollDice (6) // D6
 */
export const rollDie =
  (sides: number): number =>
    Math.floor (Math.random () * sides) + 1

/**
 * Returns the sum of random integers between 1 (included) and the passed
 * parameter (included).
 * @example rollDice (2) (6) // 2D6
 */
export const rollDice =
  (sides: number) => (amount: number): number =>
    Math.abs (amount) <= 1
      ? rollDie (sides)
      : rollDie (sides) + rollDice (sides) (subtractAbs (amount) (1))

/**
 * Returns the sum of random integers between 1 (included) and the passed
 * parameter (included).
 */
export const rollDiceR =
  (dice: Record<Die>) => rollDice (Die.AL.sides (dice)) (Die.AL.amount (dice))

/**
 * Returns the sum of random integers between 1 (included) and the passed
 * parameter (included) folded by the passed function. The generation of random
 * integers happens in the passed function, too.
 */
export const rollDiceFold =
  (f: (acc: number) => number) => (amount: number): number =>
    Math.abs (amount) <= 1 ? f (0) : f (rollDiceFold (f) (subtractAbs (amount) (1)))
