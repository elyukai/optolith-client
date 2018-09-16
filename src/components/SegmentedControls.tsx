import * as React from 'react';
import { List, Maybe } from '../utils/dataUtils';
import { Button } from './Button';
import { Label } from './Label';
import { Option, OptionValue } from './RadioButtonGroup';
import { Text } from './Text';

export interface SegmentedControlsProps<T extends OptionValue> {
  active: T;
  disabled?: boolean;
  label?: string;
  options: List<Option<T>>;
  onClick (option: string | number): void;
}

export function SegmentedControls<T extends OptionValue> (props: SegmentedControlsProps<T>) {
  const { active, disabled, label, onClick, options } = props;

  return (
    <div className="segmented-controls">
      {label && <Label text={label} />}
      <div className="segmented-controls-list">
        {
          options
            .map (option => (
              <Button
                key={Maybe.fromMaybe<React.Key> ('__default__') (option.value)}
                active={active.equals (option.value)}
                onClick={onClick.bind (undefined, option.value)}
                disabled={option.disabled || disabled}
                autoWidth
              >
                <Text>{option.name}</Text>
              </Button>
            ))
            .toArray ()
        }
      </div>
    </div>
  );
}
