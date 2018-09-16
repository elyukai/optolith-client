import * as React from 'react';

export interface ListItemValuesProps {
  children?: React.ReactNode;
}

export function ListItemValues(props: ListItemValuesProps) {
  const { children } = props;
  return (
    <div className="values">
      {children}
    </div>
  );
}
