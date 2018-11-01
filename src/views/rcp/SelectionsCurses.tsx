import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { Spell } from '../../types/wiki';
import { Just, List, Maybe, Nothing, OrderedMap, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';

interface SelectionsCursesProps {
  active: OrderedMap<string, number>;
  apLeft: number;
  apTotal: number;
  change (id: string): (maybeOption: Maybe<'add' | 'remove'>) => void;
  list: List<Record<Spell>>;
  locale: UIMessagesObject;
}

export function SelectionsCurses (props: SelectionsCursesProps) {
  const { active, apTotal, apLeft, change, list, locale } = props;

  return (
    <div className="curses list">
      <h4>{translate (locale, 'rcpselections.labels.curses', apTotal, apLeft)}</h4>
      {
        list
          .map (obj => {
            const id = obj .get ('id');
            const name = obj .get ('name');

            const maybeValue = active .lookup (id);

            return (
              <div key={id}>
                <Checkbox
                  checked={Maybe.isJust (maybeValue)}
                  disabled={Maybe.isNothing (maybeValue) && apLeft <= 0}
                  onClick={() => change (id) (Nothing ())}
                  >
                  {name}
                </Checkbox>
                {Maybe.maybeToReactNode (
                  maybeValue .fmap (value => (<span>{value}</span>))
                )}
                <BorderButton
                  label="+"
                  disabled={Maybe.isNothing (maybeValue) || apLeft <= 0}
                  onClick={() => change (id) (Just<'add'> ('add'))}
                  />
                <BorderButton
                  label="-"
                  disabled={!Maybe.isJust (maybeValue) || Maybe.fromJust (maybeValue) <= 0}
                  onClick={() => change (id) (Just<'remove'> ('remove'))}
                  />
              </div>
            );
          })
          .toArray ()
      }
    </div>
  );
}
