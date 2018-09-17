import * as classNames from 'classnames';
import * as React from 'react';
import { List, Maybe } from '../../utils/dataUtils';

export interface MainSheetAttributesItemProps {
  add: Maybe<number>;
  calc: string;
  empty: Maybe<boolean>;
  label: string;
  base: number;
  max: Maybe<number>;
  purchased: Maybe<number>;
  subArray: Maybe<List<number>>;
  subLabel: Maybe<string>;
}

export const MainSheetAttributesItem = (props: MainSheetAttributesItemProps) => {
  const {
    add,
    base,
    calc,
    empty,
    label,
    purchased,
    max,
    subArray: maybeSubList,
    subLabel,
  } = props;

  return (
    <div>
      <div className="label">
        <h3>{label}</h3>
        <span className="calc">{calc}</span>
        {
          Maybe.isJust (subLabel)
            ? (
              <span className="sub">{Maybe.fromJust (subLabel)}:</span>
            )
            : null
        }
      </div>
      <div className="values">
        <div className="base">{Maybe.elem (true) (empty) ? '-' : base}</div>
        <div className="add">{Maybe.elem (true) (empty) ? '-' : Maybe.fromMaybe (0) (add)}</div>
        <div
          className={classNames ({
            'blocked': purchased === undefined,
            'purchased': true,
          })}
          >
          { purchased === undefined ? '\uE14B' : Maybe.elem (true) (empty) ? '-' : purchased}
        </div>
        <div className="max">{Maybe.elem (true) (empty) ? '-' : Maybe.fromMaybe (0) (max)}</div>
        {
          Maybe.fromMaybe<NonNullable<React.ReactNode>>
            (<></>)
            (maybeSubList.fmap (
              subList => subList
                .imap (
                  index => value => (
                    <div key={label + index} className="sub">{empty ? '-' : value}</div>
                  )
                )
                .toArray ()
            ))
        }
      </div>
    </div>
  );
};
