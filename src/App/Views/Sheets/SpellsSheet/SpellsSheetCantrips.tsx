import * as R from 'ramda';
import * as React from 'react';
import { CantripCombined } from '../../../App/Models/View/viewTypeHelpers';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { TextBox } from '../../../components/TextBox';
import { List, Maybe, Record } from '../../../Utilities/dataUtils';
import { sortStrings } from '../../../Utilities/FilterSortUtils';

export interface SpellsSheetCantripsProps {
  cantrips: Maybe<List<Record<CantripCombined>>>;
  locale: UIMessagesObject;
}

export function SpellsSheetCantrips (props: SpellsSheetCantripsProps) {
  const { cantrips, locale } = props;

  return (
    <TextBox
      label={translate (locale, 'charactersheet.spells.cantrips.title')}
      className="cantrips activatable-list"
      >
      <div className="list">
        {
          Maybe.maybeToReactNode (
            cantrips
              .fmap (
                R.pipe (
                  List.map (e => e .get ('name')),
                  sortStrings (locale .get ('id')),
                  List.intercalate (', ')
                )
              )
          )
        }
      </div>
    </TextBox>
  );
}
