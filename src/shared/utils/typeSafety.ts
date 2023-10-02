/**
 * This function is used to make sure that the `switch` is exhaustive. Place it
 * in the `default` case of the `switch`.
 * @param _x - The value that is used in the `switch`.
 * @example
 * const aorb = (x: "a" | "b") => {
 *   switch (x) {
 *     case "a": return 1
 *     case "b": return 2
 *     default: return assertExhaustive(x)
 *   }
 * }
 */
export function assertExhaustive(_x: never): never {
  throw new Error("The switch is not exhaustive.")
}
