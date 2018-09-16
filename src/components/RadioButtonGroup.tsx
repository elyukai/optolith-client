import * as React from 'react';
import { List, Maybe } from '../utils/dataUtils';
import { RadioButton } from './RadioButton';

export type OptionValue = Maybe<string | number>;

export interface Option<T extends OptionValue> {
  className?: string;
  disabled?: boolean;
  name: string;
  value: T;
}

export interface RadioButtonGroupProps<T extends OptionValue> {
  active: T;
  array: List<Option<T>>;
  disabled?: boolean;
  onClick (option: T): void;
}

export function RadioButtonGroup<T extends OptionValue> (props: RadioButtonGroupProps<T>) {
  const { active, array, disabled, onClick } = props;

  return (
    <div className="radiobutton-group">
      {
        array
          .map (option => (
            <RadioButton
              key={Maybe.fromMaybe<React.Key> ('__default__') (option.value)}
              value={option.value}
              active={active.equals (option.value)}
              onClick={onClick.bind (undefined, option.value)}
              disabled={option.disabled || disabled}
            >
              {option.name}
            </RadioButton>
          ))
          .toArray ()
      }
    </div>
  );
}
