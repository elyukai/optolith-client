import * as React from 'react';
import { Button } from './Button';
import { Text } from './Text';

export interface BorderButtonProps {
  autoWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  flat?: boolean;
  fullWidth?: boolean;
  label: string | undefined;
  primary?: boolean;
  onClick?(): void;
}

export function BorderButton(props: BorderButtonProps) {
  const { children, label, ...other } = props;

  return (
    <Button {...other}>
      <Text>{label || children}</Text>
    </Button>
  );
}
