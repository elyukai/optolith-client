import * as classNames from 'classnames';
import * as React from 'react';
import { Box } from './Box';

export interface LabelBoxProps {
  children?: React.ReactNode;
  className?: string;
  label: string;
  value?: string | number;
}

export function LabelBox(props: LabelBoxProps) {
  const { className, children, label, value } = props;
  return (
    <div className={classNames('labelbox', className)}>
      <Box>{value ? value : children}</Box>
      <label>{label}</label>
    </div>
  );
}
