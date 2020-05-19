[@react.component]
let make = (~className=?, ~disabled=false, ~label, ~onClick) =>
  <button
    className={ClassNames.fold([
      className,
      ClassNames.cond("disabled", disabled),
    ])}
    onClick>
    {React.string(label)}
  </button>;
