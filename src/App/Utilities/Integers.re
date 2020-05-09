/**
 * A list of all Roman numbers from 1 to 13.
 */
let romanNumbers = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
];

/**
 * Converts a number between 1 and 13 to a Roman number.
 *
 * Example:
 *
 * ```haskell
 * toRoman 3 == Just "III"
 * ```
 */
let intToRoman = x => ListH.(romanNumbers <!!> x - 1);
