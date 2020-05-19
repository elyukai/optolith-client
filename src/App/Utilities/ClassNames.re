/**
 * Takes a list of CSS classes and returns a string containing all classes from
 * `Some`s.
 */
let fold = xs => xs |> Ley.Option.catOptions |> Ley.List.intercalate(" ");

/**
 * A helper function to add classes for `fold` conditionally.
 */
let cond = (className: string, condition) =>
  condition ? Some(className) : None;
