import * as classNames from 'classnames';
import * as React from 'react';
import { List, Maybe } from '../../../utils/dataUtils';

export interface MainSheetAttributesItemProps {
  add: Maybe<number>;
  calc: string;
  empty: Maybe<boolean>;
  label: string;
  base: Maybe<number>;
  max: Maybe<number>;
  purchased: Maybe<number>;
  subArray: Maybe<List<number>>;
  subLabel: Maybe<string>;
}

export function MainSheetAttributesItem (props: MainSheetAttributesItemProps) {
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
        <div className="base">
          {Maybe.elem (true) (empty)
            ? '\u2013'
            : Maybe.fromMaybe<string | number> ('\u2013') (base)}
        </div>
        <div className="add">
          {Maybe.elem (true) (empty) ? '\u2013' : Maybe.fromMaybe (0) (add)}+
        </div>
        <div
          className={classNames ({
            'blocked': purchased === undefined,
            'purchased': true,
          })}
          >
          {
            Maybe.isJust (purchased)
              ? Maybe.elem (true) (empty) ? '\u2013' : Maybe.fromJust (purchased)
              : '\uE14B'
          }
        </div>
        <div className="max">
          {Maybe.elem (true) (empty) ? '\u2013' : Maybe.fromMaybe (0) (max)}
        </div>
        {
          Maybe.fromMaybe<NonNullable<React.ReactNode>>
            (<></>)
            (maybeSubList.fmap (
              subList => subList
                .imap (
                  index => value => (
                    <div key={label + index} className="sub">{empty ? '\u2013' : value}</div>
                  )
                )
                .toArray ()
            ))
        }
      </div>
    </div>
  );
}
