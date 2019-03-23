import * as classNames from 'classnames';
import * as React from 'react';
import { Just, List, Maybe, Nothing } from '../Utilities/dataUtils';

export interface ListItemGroupProps {
  children?: React.ReactNode;
  index?: number | Maybe<number>;
  list?: List<string>;
  small?: boolean;
  text?: string;
}

export function ListItemGroup (props: ListItemGroupProps) {
  const { children, index, list, small, text } = props;

  const normalizedIndex = Maybe.normalize (index);

  const content =
    Maybe.fromMaybe
      (children as NonNullable<React.ReactNode>)
      (Maybe.isJust (normalizedIndex) && list instanceof List
        ? list .subscript (Maybe.fromJust (normalizedIndex) - 1)
        : typeof text === 'string'
        ? Just (text)
        : Nothing ());

  return (
    <div className={classNames ('group', small && 'small-info-text')}>
      {content}
    </div>
  );
}
