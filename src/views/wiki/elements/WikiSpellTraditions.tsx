import * as React from 'react';
import { sortStrings } from '../../../utils/FilterSortUtils';
import { translate, UIMessages } from '../../../utils/I18n';
import { WikiProperty } from '../WikiProperty';

export interface WikiSpellTraditionsProps {
  currentObject: {
    subtradition: number[];
    tradition: number[];
  };
  locale: UIMessages;
}

export function WikiSpellTraditions(props: WikiSpellTraditionsProps) {
  const {
    currentObject: {
      subtradition,
      tradition
    },
    locale
  } = props;

  if (subtradition.length > 0) {
    return (
      <WikiProperty locale={locale} title="info.musictradition">
        {sortStrings(subtradition.map(e => {
          return translate(locale, 'musictraditions')[e - 1];
        }), locale.id).intercalate(', ')}
      </WikiProperty>
    );
  }

  return (
    <WikiProperty locale={locale} title="info.traditions">
      {sortStrings(tradition.filter(e => {
        return e <= translate(locale, 'spells.view.traditions').length;
      }).map(e => {
        return translate(locale, 'spells.view.traditions')[e - 1];
      }), locale.id).intercalate(', ')}
    </WikiProperty>
  );
}
