import * as React from 'react';

export interface NumberBoxProps {
  current?: number;
  max: number;
}

export function NumberBox(props: NumberBoxProps) {
  const { current, max } = props;
  return (
    <div className="number-box">
      { typeof current === 'number' ? <span className="current">{current}</span> : null }
      { typeof max === 'number' ? <span className="max">{max}</span> : null }
    </div>
  );
}
