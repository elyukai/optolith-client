import * as R from 'ramda';
import * as React from 'react';
import { BlessingCombined } from '../../../App/Models/View/viewTypeHelpers';
import { TextBox } from '../../../components/TextBox';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { sortStrings } from '../../../utils/FilterSortUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';

export interface LiturgicalChantSheetBlessingsProps {
  blessings: Maybe<List<Record<BlessingCombined>>>;
  locale: UIMessagesObject;
}

export function LiturgicalChantsSheetBlessings (props: LiturgicalChantSheetBlessingsProps) {
  const { blessings, locale } = props;

  return (
    <TextBox
      label={translate (locale, 'charactersheet.chants.blessings.title')}
      className="blessings activatable-list"
      >
      <div className="list">
        {
          Maybe.maybeToReactNode (
            blessings
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
