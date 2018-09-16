import * as classNames from 'classnames';
import * as React from 'react';

export interface MainSheetAttributesItemProps {
  add?: number;
  calc: string;
  empty?: boolean;
  label: string;
  base: number;
  max: number | undefined;
  purchased?: number;
  subArray?: number[];
  subLabel?: string;
}

export function MainSheetAttributesItem(props: MainSheetAttributesItemProps) {
  const { add = 0, base, calc, empty, label, purchased, max, subArray, subLabel } = props;

  return (
    <div>
      <div className="label">
        <h3>{label}</h3>
        <span className="calc">{calc}</span>
        {
          subLabel ? (
            <span className="sub">{subLabel}:</span>
          ) : null
        }
      </div>
      <div className="values">
        <div className="base">{empty ? '-' : base}</div>
        <div className="add">{empty ? '-' : add}</div>
        <div
          className={classNames({
            'blocked': purchased === undefined,
            'purchased': true,
          })}
          >
          { purchased === undefined ? '\uE14B' : empty ? '-' : purchased}
        </div>
        <div className="max">{empty ? '-' : max}</div>
        {
          subArray && subArray.map(
            (value, index) => <div key={label + index} className="sub">{empty ? '-' : value}</div>,
          )
        }
      </div>
    </div>
  );
}
