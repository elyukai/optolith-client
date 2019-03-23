import * as React from 'react';
import { List, Maybe, Record } from '../Utilities/dataUtils';
import { RadioButton } from './RadioButton';

export type OptionValue = string | number;

export interface Option<T extends OptionValue = OptionValue> {
  className?: string;
  disabled?: boolean;
  name: string;
  value?: T;
}

export interface RadioButtonGroupProps<T extends OptionValue = OptionValue> {
  active: Maybe<T> | T;
  array: List<Record<Option<T>>>;
  disabled?: boolean;
  onClick? (option: Maybe<T>): void;
  onClickJust? (option: T): void;
}

export function RadioButtonGroup (props: RadioButtonGroupProps<OptionValue>) {
  const { active, array, disabled } = props;

  const normalizedActive = Maybe.normalize (active);

  const onClickCombined = (optionValue: Maybe<OptionValue>) => () => {
    if (props.onClick) {
      props.onClick (optionValue);
    }

    if (props.onClickJust && Maybe.isJust (optionValue)) {
      props.onClickJust (Maybe.fromJust (optionValue));
    }
  };

  return (
    <div className="radiobutton-group">
      {
        array
          .map (option => (
            <RadioButton
              key={Maybe.fromMaybe<React.Key> ('__default__') (option .lookup ('value'))}
              value={option .lookup ('value')}
              active={normalizedActive .equals (option .lookup ('value'))}
              onClick={onClickCombined (option .lookup ('value'))}
              disabled={Maybe.elem (true) (option .lookup ('disabled')) || disabled}
            >
              {option .get ('name')}
            </RadioButton>
          ))
          .toArray ()
      }
    </div>
  );
}
