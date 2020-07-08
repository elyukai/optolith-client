[@react.component]
let make = (~className="", ~items) =>
  <ul className>
    {items
     |> Ley_List.map(e => <li> {React.string(e)} </li>)
     |> Ley_List.listToArray
     |> ReasonReact.array}
  </ul>;
