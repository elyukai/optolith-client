/**
 * This function is used to make sure that the `switch` is exhaustive. Place it
 * in the `default` case of the `switch`.
 * @param x - The value that is used in the `switch`.
 */
export function assertExhaustive(_x: never): never {
  throw new Error("The switch is not exhaustive.")
}
