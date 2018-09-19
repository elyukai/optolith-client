import * as React from 'react';

export interface SheetWrapperProps {
  children?: React.ReactNode;
}

export function SheetWrapper (props: SheetWrapperProps) {
  const { children } = props;

  return (
    <div className="sheet-wrapper">
      {children}
    </div>
  );
}
