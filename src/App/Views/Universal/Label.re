open ReactUtils;

[@react.component]
let make = (~name, ~labelText) =>
  labelText
  |> Ley_Option.ensure(Ley_List.Extra.notNullStr)
  |> optionR(str => <label htmlFor=name> {s(str)} </label>);
