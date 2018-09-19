import * as React from 'react';
import { TextBox } from '../../../components/TextBox';
import { Cantrip } from '../../../types/wiki';
import { List, Record } from '../../../utils/dataUtils';
import { sortStrings } from '../../../utils/FilterSortUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';

export interface SpellsSheetCantripsProps {
  cantrips: List<Record<Cantrip>>;
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
        {sortStrings (cantrips.map (e => e .get ('name')), locale .get ('id')).intercalate (', ')}
      </div>
    </TextBox>
  );
}
