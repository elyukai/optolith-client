[@react.component]
let make = (~name, ~checked, ~disabled, ~onChange) =>
  <div
    className={ClassNames.fold([
      Some("switch"),
      ClassNames.cond("disabled", disabled),
    ])}>
    <input type_="checkbox" onChange name id=name checked disabled />
    <div className="switch-border"> <div className="switch-handle" /> </div>
  </div>;
