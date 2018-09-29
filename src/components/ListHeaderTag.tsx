import * as classNames from 'classnames';
import * as React from 'react';
import { TooltipHint } from './TooltipHint';

export interface ListHeaderTagProps {
  children?: React.ReactNode;
  className: string;
  hint?: string;
}

export function ListHeaderTag (props: ListHeaderTagProps) {
  const { children, className, hint } = props;

  if (typeof hint === 'string') {
    return (
      <TooltipHint hint={hint}>
        <div className={classNames (className, 'has-hint')}>
          {children}
        </div>
      </TooltipHint>
    );
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
}
