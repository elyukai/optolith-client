import * as classNames from 'classnames';
import * as React from 'react';
import { Textfit } from 'react-textfit';
import { Maybe } from '../utils/dataUtils';

export interface PlainProps {
  className: string;
  label: string;
  value: Maybe<string | number>;
  multi?: boolean;
}

export const Plain = (props: PlainProps) => {
  const { className, label, value, multi } = props;

  return (
    <div className={classNames ('plain', className)}>
      <div className="label">{label}</div>
      <Textfit max={13} min={8} mode={multi ? 'multi' : 'single'} className="value">
        {Maybe.fromMaybe<string | number> ('') (value)}
      </Textfit>
    </div>
  );
};
