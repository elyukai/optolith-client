import * as React from 'react';
import { Button, ButtonProps } from './Button';
import { Icon } from './Icon';

export interface IconButtonProps extends ButtonProps {
  icon: string;
}

export function IconButton(props: IconButtonProps) {
  const { icon, ...other } = props;

  return (
    <Button {...other} round>
      <Icon>{icon}</Icon>
    </Button>
  );
}
