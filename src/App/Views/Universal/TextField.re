module Invalid = {
  /**
   * Iterates through a list of pairs, where the first value is a predicate for
   * the current value in the
   */
  let isValueInvalid = value =>
    Ley_List.Extra.firstJust(((isInvalid, msg: string)) =>
      isInvalid(value) ? Some(msg) : None
    );

  [@react.component]
  let make = (~invalidMsg) =>
    invalidMsg
    |> Ley_Option.option(React.null, msg => {
         <p className="error"> {React.string(msg)} </p>
       });
};

module Integer = {
  open Ley_Option;

  /**
   * Checks if the input string is roughly valid, so that only valid characters
   * can be written and some char position are ensured.
   */
  let isRoughlyValid = Js.Re.test_([%re "/-?[0-9]*/g"]);

  /**
   * Checks if the converted int input (which is not guaranteed to be an `int`
   * and thus is `option(int)` actually) passes the given bounds and other
   */
  let isValid = (~min, ~max, ~invalidChecks, convertedValue) => {
    let invalidMsg = Invalid.isValueInvalid(convertedValue, invalidChecks);

    option(
      (false, invalidMsg),
      int =>
        (
          Ley_Ix.inRange(
            (fromOption(Js.Int.min, min), fromOption(Js.Int.max, max)),
            int,
          )
          && isNone(invalidMsg),
          invalidMsg,
        ),
      convertedValue,
    );
  };

  [@react.component]
  let make =
      (
        ~name,
        ~label="",
        ~value,
        ~onChange,
        ~placeholder="",
        ~min=?,
        ~max=?,
        ~invalidChecks=[],
        ~isLazy=false,
        ~disabled=false,
      ) => {
    let (prevValue, setPrevValue) = React.useState(() => value);

    let (internalValue, setInternalValue) =
      React.useState(() => Ley_Int.show(value));

    let ((valid, invalidMsg), setValid) =
      React.useState(() =>
        value |> Ley_Option.return |> isValid(~min, ~max, ~invalidChecks)
      );

    // Reset internal value if valid value from outside changed
    if (prevValue !== value) {
      setInternalValue(_ => Ley_Int.show(value));
      setPrevValue(_ => value);
      setValid(_ => isValid(~min, ~max, ~invalidChecks, Some(value)));
    };

    let handleChange =
      React.useCallback3(
        event =>
          event
          |> ReactEvent.Form.target
          |> (
            target =>
              target##value
              |> (
                newValue =>
                  if (isRoughlyValid(newValue)) {
                    setInternalValue(_ => newValue);

                    let convertedValue = Ley_Int.readOption(newValue);

                    let (isNewValueValid, invalidMsg) =
                      isValid(~min, ~max, ~invalidChecks, convertedValue);

                    setValid(_ => (isNewValueValid, invalidMsg));

                    if (!isLazy && isNewValueValid && isSome(convertedValue)) {
                      onChange(fromSome(convertedValue));
                    };
                  }
              )
          ),
        (onChange, min, max),
      );

    let handleBlur =
      React.useCallback2(
        _ => {
          let internalInt = Ley_Int.readOption(internalValue);

          // If current input is valid, check for given bounds
          if (isSome(internalInt)) {
            let internalSafe = fromSome(internalInt);

            if (isLazy && valid) {
              onChange(internalSafe);
            } else if (isSome(min) && internalSafe < fromSome(min)) {
              setInternalValue(_ => Ley_Int.show(fromSome(min)));
            } else if (isSome(max) && internalSafe > fromSome(max)) {
              setInternalValue(_ => Ley_Int.show(fromSome(max)));
            } else {
              setInternalValue(_ => Ley_Int.show(value));
            };
          } else {
            setInternalValue(_ => Ley_Int.show(value));
          };

          setValid(_ => (true, None));
        },
        (value, internalValue),
      );

    <div
      className={ClassNames.fold([
        Some("textfield"),
        ClassNames.cond("disabled", disabled),
        ClassNames.cond("invalid", valid),
      ])}>
      <Label name labelText=label />
      <input
        type_="number"
        name
        id=name
        value=internalValue
        onChange=handleChange
        onBlur=handleBlur
        placeholder
      />
      <Invalid invalidMsg />
    </div>;
  };
};

module String = {
  let isValid = (~required, value) =>
    !required || Ley_List.Extra.notNullStr(value);

  [@react.component]
  let make =
      (
        ~name,
        ~label="",
        ~value,
        ~onChange: string => unit,
        ~placeholder="",
        ~isLazy=false,
        ~required=false,
        ~disabled=false,
      ) => {
    let (prevValue, setPrevValue) = React.useState(() => value);
    let (internalValue, setInternalValue) = React.useState(() => value);
    let (valid, setValid) = React.useState(() => isValid(~required, value));

    if (prevValue !== value) {
      setInternalValue(_ => value);
      setPrevValue(_ => value);
      setValid(_ => isValid(~required, value));
    };

    let handleChange =
      React.useCallback2(
        event =>
          event
          |> ReactEvent.Form.target
          |> (
            target =>
              target##value
              |> (
                newValue => {
                  setInternalValue(_ => newValue);

                  let isNewValueValid = isValid(~required, newValue);

                  setValid(_ => isNewValueValid);

                  if (!isLazy && isNewValueValid) {
                    onChange(newValue);
                  };
                }
              )
          ),
        (onChange, required),
      );

    let handleBlur =
      React.useCallback1(
        _ =>
          if (isLazy && valid) {
            onChange(internalValue);
          } else {
            setInternalValue(_ => value);
            setValid(_ => true);
          },
        [|value|],
      );

    <div
      className={ClassNames.fold([
        Some("textfield"),
        ClassNames.cond("disabled", disabled),
        ClassNames.cond("invalid", valid),
      ])}>
      <Label name labelText=label />
      <input
        type_="text"
        name
        id=name
        className={valid ? "" : "invalid"}
        value=internalValue
        onChange=handleChange
        onBlur=handleBlur
        placeholder
      />
    </div>;
  };
};
