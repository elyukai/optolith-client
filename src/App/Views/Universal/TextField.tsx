// import { TextareaAutosize } from 'react-textarea-autosize';
import * as classNames from 'classnames';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { Just, Maybe, Nothing } from '../Utilities/dataUtils';
import { Label } from './Label';

export interface TextFieldProps {
  autoFocus?: boolean | Maybe<boolean>;
  className?: string;
  countCurrent?: number;
  countMax?: number;
  disabled?: boolean;
  fullWidth?: boolean;
  hint?: Maybe<string> | string;
  label?: string;
  multiLine?: boolean;
  onChange? (event: React.FormEvent<HTMLInputElement>): void;
  onChangeString? (updatedText: string): void;
  onKeyDown? (event: React.KeyboardEvent<HTMLInputElement>): void;
  type?: string;
  value?: string | number | Maybe<string | number>;
  valid?: boolean;
}

export class TextField extends React.Component<TextFieldProps, {}> {
  inputRef: HTMLInputElement | null = null;

  componentDidMount () {
    if (Maybe.elem (true) (Maybe.normalize (this.props.autoFocus)) && this.inputRef !== null) {
      (findDOMNode (this.inputRef) as HTMLInputElement).focus ();
    }
  }

  render () {
    const {
      className,
      countCurrent,
      countMax,
      disabled,
      fullWidth,
      hint: maybeHint = Nothing (),
      label,
      onChange,
      onChangeString,
      onKeyDown,
      type = 'text',
      valid,
      value = '',
    } = this.props;

    const trueValue =
      value instanceof Maybe
        ? Maybe.fromMaybe<string | number> ('') (value)
        : value;

    const trueHint =
      maybeHint instanceof Maybe
        ? maybeHint
        : Just (maybeHint);

    const hintElement = trueHint .fmap (
      hint => (
        <div className={classNames ('textfield-hint', trueValue && 'hide')}>{hint}</div>
      )
    );

    // const inputElement = this.props.multiLine ? (
    // 	<TextareaAutosize
    // 		defaultValue={trueValue}
    // 		onChange={onChange}
    // 		onKeyPress={onKeyDown}
    // 	/>
    // ) : (
    const inputElement = (
      <input
        type={type}
        value={trueValue}
        onChange={
          disabled
            ? undefined
            : (onChange && onChangeString)
            ? event => {
              onChange (event);
              onChangeString (event.target.value);
            }
            : onChangeString
            ? event => onChangeString (event.target.value)
            : onChange
        }
        onKeyPress={disabled ? undefined : onKeyDown}
        readOnly={disabled}
        ref={node => this.inputRef = node}
      />
    );

    const counterTextElement = countMax && (
      <div>{countCurrent} / {countMax}</div>
    );

    return (
      <div className={classNames (className, {
        textfield: true,
        fullWidth,
        disabled,
        invalid: valid === false,
      })}>
        {label && <Label text={label} />}
        {inputElement}
        {Maybe.fromMaybe (<></>) (hintElement)}
        {counterTextElement}
      </div>
    );
  }
}
