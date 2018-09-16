import * as classNames from 'classnames';
import * as React from 'react';

export interface ListProps {
  children?: React.ReactNode;
  className?: string;
}

export function ListView(props: ListProps) {
  const { children, className } = props;
  return (
    <ul className={classNames('list-wrapper', className)}>
      {children}
    </ul>
  );
}
