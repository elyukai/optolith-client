import * as classNames from 'classnames';
import * as React from 'react';
import { Textfit } from 'react-textfit';

export interface PlainProps {
  className: string;
  label: string;
  value?: string | number;
  multi?: boolean;
}

export function Plain(props: PlainProps) {
  const { className, label, value, multi } = props;
  return (
    <div className={classNames('plain', className)}>
      <div className="label">{label}</div>
      <Textfit max={13} min={8} mode={multi ? 'multi' : 'single'} className="value">
        {value}
      </Textfit>
    </div>
  );
}
