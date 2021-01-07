open Ley_Option.Infix;
open ReactUtils;

type dropdownOption('a) = {
  label: string,
  value: 'a,
};

module Item = {
  [@react.component]
  let make =
      (~active, ~equals: ('a, 'a) => bool, ~option, ~onChange, ~disabled) => {
    let isActive = equals(active, option.value);

    let handleClick =
      React.useCallback4(
        _ =>
          if (!disabled && !isActive) {
            onChange(option.value);
          },
        (isActive, option, onChange, disabled),
      );

    <div
      className={ClassNames.fold([ClassNames.cond("active", isActive)])}
      onClick=handleClick>
      {s(option.label)}
    </div>;
  };
};

type position =
  | Top
  | Bottom;

[@react.component]
let make =
    (
      ~name,
      ~label,
      ~options,
      ~valueToKey,
      ~onChange,
      ~disabled,
      ~active,
      ~equals=(===),
      ~placeholder=?,
    ) => {
  let (isOpen, setIsOpen) = React.useState(() => false);
  let (position, setPosition) = React.useState(() => Bottom);
  let containerRef = React.useRef(Js.Nullable.null);

  let handleSwitch =
    React.useCallback2(
      _ => {
        let maybeRef: option(Webapi.Dom.Element.t) =
          containerRef.current |> Js.Nullable.toOption;

        switch (maybeRef) {
        | Some(ref) when !isOpen =>
          let height =
            Js.Int.toFloat(
              Ley_Int.min(166, Ley_List.length(options) * 33 + 1),
            );

          let rect = Webapi.Dom.Element.getBoundingClientRect(ref);

          setPosition(_ =>
            Js.Int.toFloat(Webapi.Dom.Window.innerHeight(Webapi.Dom.window))
            -. 32.0
            -. Webapi.Dom.DomRect.top(rect) < height
              ? Top : Bottom
          );
        | Some(_)
        | None => ()
        };

        setIsOpen((!));
      },
      (isOpen, options),
    );

  let handleChange =
    React.useCallback2(
      option => {
        setIsOpen(_ => false);
        onChange(option);
      },
      (setIsOpen, onChange),
    );

  let handleOutsideClick =
    React.useCallback1(
      event =>
        if (isOpen) {
          containerRef.current
          |> Js.Nullable.toOption
          <&> (
            currentRef =>
              currentRef
              |> Webapi.Dom.Element.contains(
                   event
                   |> Webapi.Dom.Event.target
                   |> Webapi.Dom.EventTarget.unsafeAsElement,
                 )
              |> (!)
                ? setIsOpen(_ => false) : ()
          )
          |> ignore;
        },
      [|isOpen|],
    );

  React.useEffect1(
    () => {
      Webapi.Dom.Window.addEventListener(
        "mousedown",
        handleOutsideClick,
        Webapi.Dom.window,
      );
      Webapi.Dom.Window.addEventListener(
        "ontouchstart",
        handleOutsideClick,
        Webapi.Dom.window,
      );

      Some(
        () => {
          Webapi.Dom.Window.removeEventListener(
            "mousedown",
            handleOutsideClick,
            Webapi.Dom.window,
          );
          Webapi.Dom.Window.removeEventListener(
            "ontouchstart",
            handleOutsideClick,
            Webapi.Dom.window,
          );
        },
      );
    },
    [|handleOutsideClick|],
  );

  let activeOption =
    Ley_List.find(option => equals(active, option.value), options);

  let activetext =
    activeOption
    <&> (x => x.label)
    <|> placeholder
    |> Ley_Option.fromOption("");

  let overlayElement =
    <div className="dropdown-overlay">
      <ScrollView>
        {options
         |> Ley_List.map(option =>
              <Item
                key={option.value |> valueToKey}
                active
                equals
                disabled
                option
                onChange=handleChange
              />
            )
         |> list}
      </ScrollView>
    </div>;

  let placeholderElement =
    <div style={ReactDOMRe.Style.make(~height="0px", ())} />;

  <div
    className={ClassNames.fold([
      ClassNames.safe("dropdown"),
      ClassNames.safe(
        switch (position) {
        | Top => "dropdown--top"
        | Bottom => "dropdown--bottom"
        },
      ),
      ClassNames.cond("disabled", disabled),
    ])}
    ref={ReactDOMRe.Ref.domRef(containerRef)}>
    <Label name labelText=label />
    <div>
      {switch (position) {
       | Top when isOpen => overlayElement
       | Top
       | Bottom => placeholderElement
       }}
      <div
        onClick=handleSwitch
        className={ClassNames.fold([
          ClassNames.safe("value"),
          ClassNames.cond("placeholder", Ley_Option.isNone(activeOption)),
        ])}>
        {s(activetext)}
      </div>
      {switch (position) {
       | Bottom when isOpen => overlayElement
       | Top
       | Bottom => placeholderElement
       }}
    </div>
  </div>;
  // <select name id=name onChange>
  //   {options
  //    |> map(option =>
  //         <option value={option.value}> {s(option.label)} </option>
  //       )
  //    |> listToArray
  //    |> arr}
  // </select>
  // <input
  //   type_="number"
  //   name
  //   id=name
  //   value=internalValue
  //   onChange=handleChange
  //   onBlur=handleBlur
  //   placeholder
  // />
  // <Invalid invalidMsg />
};
