import { minus } from "./math.ts"

const signPairs: [one: string, five: string][] = [
  [ "I", "V" ],
  [ "X", "L" ],
  [ "C", "D" ],
  [ "M", "ↁ" ],
]

const romanizeNatural = (num: number): string =>
  num.toString(10)
    .split("")
    .reverse()
    .map((digit, index) => {
      const pair = signPairs[index]

      if (pair === undefined) {
        return "?"
      }

      const value = parseInt(digit, 10)
      const [ one, five ] = pair

      if (value <= 3) {
        return one.repeat(value)
      }
      else if (value === 4) {
        return one + five
      }
      else if (value <= 8) {
        return five + one.repeat(value - 5)
      }
      else {
        return one + (signPairs[index + 1]?.[0] ?? "?")
      }
      })
    .reverse()
    .join("")

/**
 * Converts a number to a roman numeral.
 */
export const romanize = (num: number): string => {
  if (num === 0) {
    return "0"
  }
  else if (num < 0) {
    return minus + romanizeNatural(-num)
  }
  else {
    return romanizeNatural(num)
  }
}
