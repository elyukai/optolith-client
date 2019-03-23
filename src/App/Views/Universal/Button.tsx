import * as classNames from 'classnames';
import * as React from 'react';
import { Maybe } from '../utils/dataUtils';

export interface ButtonProps {
  active?: boolean;
  autoWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean | Maybe<boolean>;
  flat?: boolean;
  fullWidth?: boolean;
  primary?: boolean;
  round?: boolean;
  onClick? (): void;
  [id: string]: any;
}

export const Button = (props: ButtonProps) => {
  const {
    active,
    autoWidth,
    primary,
    flat,
    fullWidth,
    disabled,
    round,
    children,
    onClick,
    ...other
  } = props;

  let { className } = props;

  className = classNames (className, {
    'btn': true,
    'btn-round': round,
    'btn-text': !round,
    'btn-primary': primary,
    'btn-flat': flat,
    'autoWidth': autoWidth,
    'fullWidth': fullWidth,
    'disabled': disabled instanceof Maybe ? Maybe.elem (true) (disabled) : disabled,
    'active': active,
  });

  return (
    <div {...other} className={className} onClick={disabled ? undefined : onClick}>
      {children}
    </div>
  );
};