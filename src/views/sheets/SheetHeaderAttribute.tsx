import * as classNames from 'classnames';
import * as React from 'react';
import { Maybe } from '../../utils/dataUtils';

export interface SheetHeaderAttributeProps {
  id: string;
  label: string;
  value: Maybe<number | string>;
}

export function SheetHeaderAttribute (props: SheetHeaderAttributeProps) {
  return (
    <div className={classNames ('sheet-attribute', props.id)}>
      <span className="label">{props.label}</span>
      <span className="value">{Maybe.fromMaybe<string | number> ('') (props.value)}</span>
    </div>
  );
}
