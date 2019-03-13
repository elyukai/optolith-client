import * as classNames from 'classnames';
import * as React from 'react';
import { Maybe, Nothing } from '../utils/dataUtils';
import { Box } from './Box';

export interface LabelBoxProps {
  children?: React.ReactNode;
  className?: string;
  label: string;
  value?: Maybe<string | number>;
}

export function LabelBox (props: LabelBoxProps) {
  const { className, children, label, value = Nothing () } = props;

  return (
    <div className={classNames ('labelbox', className)}>
      <Box>{Maybe.isJust (value) ? Maybe.fromJust (value) : children}</Box>
      <label>{label}</label>
    </div>
  );
}
