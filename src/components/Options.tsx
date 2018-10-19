import * as React from 'react';

export interface OptionsProps {
  children?: React.ReactNode;
}

export function Options (props: OptionsProps) {
  const { children } = props;

  return (
    <div className="options">
      {children}
    </div>
  );
}
