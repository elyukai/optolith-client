/**
 * Returns the larger of its two arguments.
 */
let max = (x: int, y: int) => x > y ? x : y;

let show = Js.Int.toString;

let read = int_of_string;

let readMaybe = x => x |> int_of_string_opt |> Maybe.optionToMaybe;
