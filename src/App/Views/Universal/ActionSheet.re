open Ley.List;
open Ley.Option;

type actionSheetButtonStyle =
  | Default
  | Destructive;

type actionSheetButton('a) = {
  label: string,
  value: 'a,
  style: actionSheetButtonStyle,
  disabled: bool,
};

module Button = {
  [@react.component]
  let make = (~label, ~value, ~style, ~disabled, ~onClick) => {
    let handleClick =
      React.useCallback3(
        _ => disabled ? onClick(value) : (),
        (value, disabled, onClick),
      );

    <button
      type_="button"
      className={ClassNames.fold([
        ClassNames.cond("disabled", disabled),
        ClassNames.cond("destructive", style === Destructive),
      ])}
      onClick=handleClick>
      {React.string(label)}
    </button>;
  };
};

/**
 * An action sheet is a special type of alert that responds to a control or
 * action and displayes a set of two or more choices.
 *
 * An action sheet should be used to initiate an action or to confirm a
 * destructive action.
 *
 * An action sheet contains an optional description and one or more buttons as
 * well as a cancel button, which is included by default and does not need to be
 * defined separately.
 *
 * Component props:
 *
 * - `description` An optional description.
 * - `buttons` The action buttons. Define destructive actions using the
 * `Destructive` style.
 * - `isOpen` Displays or hides the sheet.
 * - `onClick` Called on a button click and returns the value from that
 * button.
 * - `onClose` Called when the user clicks outside the sheet or cancels the
 * sheet with the cancel button.
 * - `cancelButtonLabel` The translated cancel button text.
 */
[@react.component]
let make =
    (~description=?, ~buttons, ~isOpen, ~onClick, ~onClose, ~cancelLabel) => {
  <Overlay baseClassName="actionsheet" isOpen onBackdrop=onClose>
    <div className="buttons">
      {option(
         React.null,
         str => <p className="description"> {React.string(str)} </p>,
         description,
       )}
      {buttons
       |> map(button =>
            <Button
              label={button.label}
              style={button.style}
              disabled={button.disabled}
              value={button.value}
              onClick
            />
          )
       |> listToArray
       |> React.array}
    </div>
    <footer>
      <button type_="button" className="primary" onClick=onClose>
        {React.string(cancelLabel)}
      </button>
    </footer>
  </Overlay>;
};
