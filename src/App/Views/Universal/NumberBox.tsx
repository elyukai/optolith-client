import * as React from 'react';
import { Maybe } from '../Utilities/dataUtils';

export interface NumberBoxProps {
  current?: Maybe<number> | number;
  max?: Maybe<number> | number;
}

export function NumberBox (props: NumberBoxProps) {
  const { current, max } = props;

  const maybeCurrent = current instanceof Maybe ? current : Maybe.fromNullable (current);
  const maybeMax = max instanceof Maybe ? max : Maybe.fromNullable (max);

  return (
    <div className="number-box">
      {Maybe.fromMaybe
        (<></>)
        (maybeCurrent .fmap (trueCurrent => (<span className="current">{trueCurrent}</span>)))}
      {Maybe.fromMaybe
        (<></>)
        (maybeMax .fmap (trueMax => (<span className="max">{trueMax}</span>)))}
    </div>
  );
}
