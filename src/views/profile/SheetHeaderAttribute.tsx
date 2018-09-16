import * as classNames from 'classnames';
import * as React from 'react';

export interface SheetHeaderAttributeProps {
  id: string;
  label: string;
  value?: number | string;
}

export function SheetHeaderAttribute(props: SheetHeaderAttributeProps) {
  return (
    <div className={classNames('sheet-attribute', props.id)}>
      <span className="label">{props.label}</span>
      <span className="value">{props.value}</span>
    </div>
  );
}
