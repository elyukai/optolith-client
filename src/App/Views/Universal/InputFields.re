module Integer = {
  let roughCheck = [%re "/-?[0-9]*/g"];
  let strictCheck = [%re "/|0|-?[1-9][0-9]*/g"];

  let isRoughValid = Js.Re.test_(roughCheck);
  let isStrictValid = Js.Re.test_(strictCheck);

  let unsafeInputToInt = input => input === "" ? 0 : Int.read(input);

  let make = (~value, ~onChange) => {
    let (internalValue, setInternalValue) = React.useState(() => value);
    let (valid, setValid) = React.useState(() => isStrictValid(value));

    let handleChange =
      React.useCallback1(
        event =>
          event->ReactEvent.Form.target##value
          |> (
            newValue =>
              if (isRoughValid(newValue)) {
                setInternalValue(_ => newValue);

                let strictValid = isStrictValid(newValue);

                setValid(_ => strictValid);

                if (strictValid) {
                  onChange(newValue);
                };
              }
          ),
        [|onChange|],
      );

    let handleBlur =
      React.useCallback1(
        _ => {
          setInternalValue(_ => value);
          setValid(_ => true);
        },
        [|value|],
      );

    <input
      type_="number"
      className={valid ? "" : "invalid"}
      value=internalValue
      onChange=handleChange
      onBlur=handleBlur
    />;
  };
};
