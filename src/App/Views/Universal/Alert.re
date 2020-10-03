open Ley_List;
open ReactUtils;

type alertButtonStyle =
  | Default
  | Destructive;

type alertButton('a) = {
  label: string,
  value: 'a,
  style: alertButtonStyle,
};

module Button = {
  [@react.component]
  let make = (~label, ~value, ~primary, ~onClick) => {
    let handleClick =
      React.useCallback2(_ => onClick(value), (value, onClick));

    <button
      type_="button"
      className={ClassNames.fold([ClassNames.cond("primary", primary)])}
      onClick=handleClick>
      {s(label)}
    </button>;
  };
};

module StringInput = {
  /**
   * Alerts provide information about the current state of the app, which
   * (often) requires feedback from the user. An string input alert consists of
   * a title, an optional message, one or more buttons and a string input. It is
   * often used to inform the user about an (unexpected) error or unusual
   * conditions.
   *
   * This is a variant of the default alert component, which includes a string
   * input and a strict set of buttons: A submit button and a cancel button. The
   * alert can only be submitted if the input is not empty. There are no further
   * checks.
   *
   * Component props:
   *
   * - `title`: The alert title.
   * - `message`: An optional message text.
   * - `actionLabel`: Submit button label.
   * - `cancelLabel`: Cancel button label.
   * - `isOpen`: Displays or hides the alert.
   * - `onClick`: Called on a button click and returns the value from the input.
   * - `onClose`: Called when the user clicks outside the alert.
   * - `name`: The name attribute of the input element.
   * - `placeholder`: The placeholder for an empty input element.
   */
  [@react.component]
  let make =
      (
        ~title,
        ~message,
        ~actionLabel,
        ~cancelLabel,
        ~isOpen,
        ~onClick,
        ~onClose,
        ~name,
        ~placeholder,
      ) => {
    let (input, setInput) = React.useState(() => "");

    let handleSubmit =
      React.useCallback2(
        _ => Js.String.length(input) > 0 ? onClick(input) : (),
        (input, onClick),
      );

    let handleClick =
      React.useCallback2(
        _ => Js.String.length(input) > 0 ? onClick(input) : (),
        (input, onClick),
      );

    let handleInput =
      React.useCallback1(input => setInput(_ => input), [|setInput|]);

    <Overlay baseClassName="alert" isOpen onBackdrop=onClose>
      <header>
        <h2> {s(title)} </h2>
        {optionR(str => <p> {s(str)} </p>, message)}
      </header>
      <form onSubmit=handleSubmit>
        <TextField.String name onChange=handleInput value=input placeholder />
      </form>
      <div className="buttons">
        <button type_="button" className="primary" onClick=handleClick>
          {s(actionLabel)}
        </button>
        <button type_="button" className="primary" onClick=onClose>
          {s(cancelLabel)}
        </button>
      </div>
    </Overlay>;
  };
};

/**
 * Alerts provide information about the current state of the app, which (often)
 * requires feedback from the user. An alert consists of a title, an optional
 * message and one or more buttons. It is often used to inform the user about an
 * (unexpected) error or unusual conditions.
 *
 * If your alert has more than two buttons, consider using an action sheet
 * instead.
 *
 * Component props:
 *
 * - `title`: The alert title.
 * - `message`: An optional message text.
 * - `primaryButton`: The primary button of the alert.
 * - `secondaryButtons`: The secondary buttons. The first item will always be
 * next to the primary button, so the list must be sorted appropiately. Define
 * destructive actions using the `Destructive` style.
 * - `isOpen`: Displays or hides the alert.
 * - `onClick`: Called on a button click and returns the value from that
 * button.
 * - `onClose`: Called when the user clicks outside the alert.
 */
[@react.component]
let make =
    (
      ~title,
      ~message,
      ~primaryButton,
      ~secondaryButtons=[],
      ~isOpen,
      ~onClick,
      ~onClose,
    ) => {
  <Overlay
    baseClassName="alert"
    className={ClassNames.fold([
      ClassNames.cond("alert-long", Ley_List.length(secondaryButtons) > 2),
    ])}
    isOpen
    onBackdrop=onClose>
    <header>
      <h2> {s(title)} </h2>
      {optionR(str => <p> {s(str)} </p>, message)}
    </header>
    <div className="buttons">
      <Button
        label={primaryButton.label}
        value={primaryButton.value}
        primary=true
        onClick
      />
      {secondaryButtons
       |> map(button =>
            <Button
              label={button.label}
              value={button.value}
              primary=false
              onClick
            />
          )
       |> listToArray
       |> React.array}
    </div>
  </Overlay>;
};
