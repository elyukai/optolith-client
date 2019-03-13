import * as React from 'react';

export interface NavigationBarLeftProps {
  children?: React.ReactNode;
}

export function NavigationBarLeft (props: NavigationBarLeftProps) {
  return (
    <div className="navigationbar-left">
      {props.children}
    </div>
  );
}
