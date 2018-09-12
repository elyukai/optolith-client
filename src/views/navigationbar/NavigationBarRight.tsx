import * as React from 'react';

export interface NavigationBarRightProps {
  children?: React.ReactNode;
}

export function NavigationBarRight (props: NavigationBarRightProps) {
  return (
    <div className="navigationbar-right">
      {props.children}
    </div>
  );
}
