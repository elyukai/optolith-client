module Integer = {
  let roughCheck = [%re "/-?[0-9]*/g"];
  let strictCheck = [%re "/0|-?[1-9][0-9]*/g"];

  let make = (~value, ~onChange) => {
    let (internalValue, setInternalValue) = React.useState(() => value);

    <input type_="number" value={Int.show(value)} />;
  };
};
