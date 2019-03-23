import * as classNames from 'classnames';
import * as React from 'react';
import { Maybe, Nothing } from '../Utilities/dataUtils';

export interface ListItemNameProps {
  addName?: Maybe<string>;
  children?: React.ReactNode;
  large?: boolean | JSX.Element;
  name: string;
}

export function ListItemName (props: ListItemNameProps) {
  const { addName: maybeAddName = Nothing (), children, large, name } = props;

  const titleElement = Maybe.maybe<string, JSX.Element> (<p className="title">{name}</p>)
                                                        (addName => (
                                                          <p className="title">
                                                            <span>{name}</span>
                                                            <span className="add">{addName}</span>
                                                          </p>
                                                        ))
                                                        (maybeAddName);

  return (
    <div className={classNames ('name', large && 'large')}>
      {titleElement}
      {children}
    </div>
  );
}
