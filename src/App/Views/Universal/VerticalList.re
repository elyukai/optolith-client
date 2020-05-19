[@react.component]
let make = (~className="", ~items) =>
  <ul className>
    {items
     |> Ley.List.map(e => <li> {React.string(e)} </li>)
     |> Ley.List.listToArray
     |> ReasonReact.array}
  </ul>;
