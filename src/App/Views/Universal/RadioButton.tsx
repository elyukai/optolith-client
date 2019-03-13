import * as React from 'react';
import { Activate, ActivateProps } from './Activate';
import { Icon } from './Icon';
import { Text } from './Text';

export interface RadioButtonProps extends ActivateProps {
  label?: string;
}

export function RadioButton (props: RadioButtonProps) {
  const { children, label, onClick, ...other } = props;

  return (
    <Activate {...other} className="radio" onClick={onClick}>
      <Icon>
        <div className="border"></div>
        <div className="dot"></div>
      </Icon>
      <Text>
        {label || children}
      </Text>
    </Activate>
  );
}
