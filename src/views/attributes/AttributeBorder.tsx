import * as classNames from 'classnames';
import * as React from 'react';
import { TooltipToggle } from '../../components/TooltipToggle';

export interface AttributeBorderProps {
  children?: React.ReactNode;
  className?: string;
  label?: string;
  tooltip?: JSX.Element;
  tooltipMargin?: number;
  value: number | string;
}

export function AttributeBorder(props: AttributeBorderProps) {
  const { children, className, label, tooltip, tooltipMargin, value } = props;

  const valueElement = tooltip ? (
    <TooltipToggle content={tooltip} margin={tooltipMargin}>
      <div className="value"><div className="value-inner"><div>{value}</div></div></div>
    </TooltipToggle>
  ) : (
    <div className="value"><div className="value-inner"><div>{value}</div></div></div>
  );

  return (
    <div className={classNames('attr', className)}>
      <div className="short">{label}</div>
      {valueElement}
      {children}
    </div>
  );
}
