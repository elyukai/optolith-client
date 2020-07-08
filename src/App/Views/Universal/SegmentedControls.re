type segment('a) = {
  name: string,
  label: string,
  value: option('a),
  disabled: bool,
};

module Item = {
  [@react.component]
  let make =
      (
        ~active,
        ~groupName,
        ~name,
        ~label,
        ~value,
        ~disabled,
        ~onClick: option('a) => unit,
        ~onClickSafe,
      ) => {
    let handleClick =
      React.useCallback1(
        _ => {
          onClick(value);

          switch (value) {
          | Some(x) => onClickSafe(x)
          | None => ()
          };
        },
        [|value|],
      );

    let isActive = active == value;

    let combinedName = groupName ++ "-" ++ name;

    <li
      className={ClassNames.fold([
        Some("segmented-controls-list-item"),
        ClassNames.cond("active", isActive),
        ClassNames.cond("disabled", disabled),
      ])}>
      <input
        type_="radio"
        checked=isActive
        name=groupName
        id=combinedName
        onClick=handleClick
        disabled
      />
      <label htmlFor=combinedName> {React.string(label)} </label>
    </li>;
  };
};

[@react.component]
let make =
    (
      ~active,
      ~name,
      ~options,
      ~disabled=false,
      ~label=?,
      ~onClick,
      ~onClickSafe,
    ) =>
  <div
    className={ClassNames.fold([
      Some("segmented-controls"),
      ClassNames.cond("disabled", disabled),
    ])}>
    {Ley_Option.option(
       React.null,
       str => <label> {React.string(str)} </label>,
       label,
     )}
    <ul className="segmented-controls-list">
      {options
       |> Ley_List.map(option =>
            <Item
              active
              groupName=name
              name={option.name}
              label={option.label}
              value={option.value}
              disabled={disabled || option.disabled}
              onClick
              onClickSafe
            />
          )
       |> Ley_List.listToArray
       |> React.array}
    </ul>
  </div>;
