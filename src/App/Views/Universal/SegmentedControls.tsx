import * as React from 'react';
import { List, Maybe, Record } from '../utils/dataUtils';
import { Button } from './Button';
import { Label } from './Label';
import { Option, OptionValue } from './RadioButtonGroup';
import { Text } from './Text';

export { Option };

export interface SegmentedControlsProps<T extends OptionValue> {
  active: T | Maybe<T>;
  disabled?: boolean;
  label?: string;
  options: List<Record<Option<T>>>;
  onClick (option: Maybe<T>): void;
  onClickJust? (option: T): void;
}

export function SegmentedControls<T extends OptionValue> (props: SegmentedControlsProps<T>) {
  const { active, disabled, label, onClick, onClickJust, options } = props;

  const normalizedActive = Maybe.normalize (active);

  return (
    <div className="segmented-controls">
      {label && <Label text={label} />}
      <div className="segmented-controls-list">
        {
          options
            .map (option => (
              <Button
                key={
                  Maybe.fromMaybe<React.Key> ('__default__')
                                             (option .lookup ('value') as Maybe<T>)
                }
                active={normalizedActive .equals (option .lookup ('value') as Maybe<T>)}
                onClick={() => {
                  const value = option .lookup ('value') as Maybe<T>;

                  onClick (value);

                  if (onClickJust && Maybe.isJust (value)) {
                    onClickJust (Maybe.fromJust (value));
                  }
                }}
                disabled={Maybe.elem (true) (option .lookup ('disabled')) || disabled}
                autoWidth
              >
                <Text>{option .get ('name')}</Text>
              </Button>
            ))
            .toArray ()
        }
      </div>
    </div>
  );
}
