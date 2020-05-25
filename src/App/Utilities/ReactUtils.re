/**
 * Alias of `React.string`.
 */
let s = React.string;
/**
 * Alias of `React.array`.
 */
let arr = React.array;

let list = xs => xs |> Array.of_list |> React.array;

let optionR = (f, x) => Ley.Option.option(React.null, f, x);

let eventTargetToDom = (x: Js.t({..})): Dom.eventTarget_like(Dom._node('a)) =>
  Obj.magic(x);
