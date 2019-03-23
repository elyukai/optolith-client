import * as classNames from 'classnames';
import * as R from 'ramda';
import * as React from 'react';
import { Maybe } from '../Utilities/dataUtils';
import { Activate } from './Activate';
import { Icon } from './Icon';
import { Text } from './Text';

export interface CheckboxProps {
  checked: boolean | Maybe<boolean>;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  label?: string;
  onClick (): void;
}

const normalizeChecked: (checked: Maybe<boolean> | boolean) => boolean = R.pipe (
  Maybe.normalize,
  Maybe.fromMaybe (false)
);

export function Checkbox (props: CheckboxProps) {
  const { checked, children, className, label, onClick, ...other } = props;

  return (
    <Activate
      {...other}
      active={normalizeChecked (checked)}
      className={classNames ('checkbox', className)}
      onClick={onClick}
      >
      <Icon>
        <div className="border"></div>
        <div className="hook"></div>
      </Icon>
      <Text>
        {label || children}
      </Text>
    </Activate>
  );
}
