import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { Cantrip } from '../../types/wiki';
import { List, Maybe, OrderedSet, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';

export interface SelectionsCantripsProps {
  active: OrderedSet<string>;
  list: List<Record<Cantrip>>;
  locale: UIMessagesObject;
  num: number;
  change (id: string): void;
}

export function SelectionsCantrips (props: SelectionsCantripsProps) {
  const { active, change, list, locale, num } = props;

  const nums = List.of (
    translate (locale, 'rcpselections.labels.onecantrip'),
    translate (locale, 'rcpselections.labels.twocantrips')
  );

  return (
    <div className="cantrips list">
      <h4>
        {Maybe.fromMaybe ('') (nums .subscript (num - 1))}
        {''}
        {translate (locale, 'rcpselections.labels.fromthefollowinglist')}
      </h4>
      {
        list.map (obj => {
          const id = obj .get ('id');
          const name = obj .get ('name');

          return (
            <Checkbox
              key={id}
              checked={active .member (id)}
              disabled={active .notMember (id) && active .size () >= num}
              label={name}
              onClick={() => change (id)} />
          );
        })
      }
    </div>
  );
}
