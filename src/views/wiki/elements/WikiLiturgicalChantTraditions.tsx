import * as React from 'react';
import { sortStrings } from '../../../utils/FilterSortUtils';
import { _translate, UIMessages } from '../../../utils/I18n';
import { getAspectsOfTradition, getTraditionOfAspect } from '../../../utils/LiturgyUtils';
import { WikiProperty } from '../WikiProperty';

export interface WikiLiturgicalChantTraditionsProps {
  currentObject: {
    aspects: number[];
    tradition: number[];
  };
  locale: UIMessages;
}

export function WikiLiturgicalChantTraditions(props: WikiLiturgicalChantTraditionsProps) {
  const {
    currentObject: {
      aspects,
      tradition
    },
    locale
  } = props;

  const traditionsMap = new Map<number, number[]>();

  for (const aspectId of aspects) {
    const tradition = getTraditionOfAspect(aspectId);
    if (tradition <= _translate(locale, 'liturgies.view.traditions').length) {
      traditionsMap.set(tradition, [...(traditionsMap.get(tradition) || []), aspectId]);
    }
  }

  if (tradition.includes(14)) {
    traditionsMap.set(14, []);
  }

  const traditionsStrings = _translate(locale, 'liturgies.view.traditions');
  const aspectsStrings = _translate(locale, 'liturgies.view.aspects');

  const traditions = sortStrings([...traditionsMap].map(e => {
    const mainTradition = traditionsStrings[e[0] - 1];
    if (getAspectsOfTradition(e[0]).length < 2) {
      return mainTradition;
    }
    const mappedAspects = e[1].map(a => aspectsStrings[a - 1]);
    const completeAspects = sortStrings(mappedAspects, locale.id).join(', ');
    return `${mainTradition} (${completeAspects})`;
  }), locale.id).join(', ');

  return (
    <WikiProperty locale={locale} title="info.traditions">
      {traditions}
    </WikiProperty>
  );
}
