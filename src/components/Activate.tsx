import * as classNames from 'classnames';
import * as React from 'react';
import { Maybe } from '../utils/dataUtils';

export interface ActivateProps {
  active: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  value: Maybe<string | number>;
  onClick (value: Maybe<string | number>): void;
}

export function Activate (props: ActivateProps) {
  const { active, className, disabled, onClick, value, ...other } = props;

  const onClickEval = disabled ? undefined : () => onClick (value);

  return (
    <div
      {...other}
      className={classNames (className, {
        'active': active,
        'disabled': disabled
      })}
      onClick={onClickEval}
      />
  );
}
