import * as classNames from 'classnames';
import * as React from 'react';
import { Text } from './Text';

export interface TabBaseProps {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  label: string | undefined;
}

export interface TabProps extends TabBaseProps {
  active: boolean;
  onClick(): void;
}

export function Tab(props: TabProps) {
  const { active, children, className, disabled, label, onClick } = props;
  return (
    <div
      className={classNames(className, {
        'active': active,
        'disabled': disabled,
        'tab': true,
      })}
      onClick={disabled ? undefined : onClick}
      >
      <Text>{label || children}</Text>
    </div>
  );
}
