[@react.component]
let make = (~className, ~overlay=?, ~src, ~onClick, ~alt) =>
  <div
    className={ClassNames.fold([
      Ley_Option.Monad.return("avatar-wrapper"),
      className,
    ])}
    onClick>
    {Ley_Option.fromOption(React.null, overlay)}
    <img className="avatar" src alt />
  </div>;
