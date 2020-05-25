open Ley.List;
open Ley.Option.Functor;
open Ley.Option.Alternative;
open ReactUtils;
open Webapi.Dom;

type dropdownOption('a) = {
  label: string,
  value: 'a,
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
      ~onChange,
      ~disabled,
      ~onChange,
      ~active,
      ~placeholder=?,
    ) => {
  let (isOpen, setIsOpen) = React.useState(() => false);
  let (position, setPosition) = React.useState(() => Bottom);
  let containerRef = React.useRef(Js.Nullable.null);

  let handleSwitch =
    React.useCallback2(
      _ => {
        let maybeRef: option(Element.t) =
          containerRef.current |> Js.Nullable.toOption;

        switch (maybeRef) {
        | Some(ref) when !isOpen =>
          let height =
            Js.Int.toFloat(
              Ley.Int.min(166, Foldable.length(options) * 33 + 1),
            );

          let rect = Element.getBoundingClientRect(ref);

          setPosition(_ =>
            Js.Int.toFloat(Window.innerHeight(window))
            -. 32.0
            -. DomRect.top(rect) < height
              ? Top : Bottom
          );
        | _ => ()
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
              |> Element.contains(
                   event
                   |> Event.target
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
        window,
      );
      Webapi.Dom.Window.addEventListener(
        "ontouchstart",
        handleOutsideClick,
        window,
      );

      Some(
        () => {
          Webapi.Dom.Window.removeEventListener(
            "mousedown",
            handleOutsideClick,
            window,
          );
          Webapi.Dom.Window.removeEventListener(
            "ontouchstart",
            handleOutsideClick,
            window,
          );
        },
      );
    },
    [|handleOutsideClick|],
  );

  let active = Foldable.find(option => option.value == active, options);

  let activetext =
    active <&> (x => x.label) <|> placeholder |> Ley.Option.fromOption("");

  <div
    className={ClassNames.fold([
      Some("dropdown"),
      ClassNames.cond("disabled", disabled),
    ])}>
    <Label name labelText=label />
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
