open ReactUtils;

[@react.component]
let make = (~name, ~labelText) =>
  labelText
  |> Ley.Option.ensure(Ley.List.Extra.notNullStr)
  |> optionR(str => <label htmlFor=name> {s(str)} </label>);
