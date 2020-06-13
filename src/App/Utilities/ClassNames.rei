/**
 * Takes a list of CSS classes and returns a string containing all classes from
 * `Some`s.
 */
let fold: list(option(string)) => string;

/**
 * A helper function to add classes for `fold` conditionally.
 */
let cond: (string, bool) => option(string);

/**
 * A helper function to add a safe class (that cannot be optional) to the list
 * of classes.
 */
let safe: 'a => option('a);
