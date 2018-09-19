import * as React from 'react';
import { TextBox } from '../../../components/TextBox';
import { Blessing } from '../../../types/wiki';
import { List, Record } from '../../../utils/dataUtils';
import { sortStrings } from '../../../utils/FilterSortUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';

export interface LiturgicalChantSheetBlessingsProps {
  blessings: List<Record<Blessing>>;
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
        {sortStrings (blessings.map (e => e .get ('name')), locale .get ('id')).intercalate (', ')}
      </div>
    </TextBox>
  );
}
