import * as React from 'react';
import { translate, UIMessages } from '../../../App/Utils/I18n';
import { getAspectsOfTradition, getTraditionOfAspect } from '../../../App/Utils/Increasable/liturgicalChantUtils';
import { sortStrings } from '../../../utils/FilterSortUtils';
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
    if (tradition <= translate(locale, 'liturgies.view.traditions').length) {
      traditionsMap.set(tradition, [...(traditionsMap.get(tradition) || []), aspectId]);
    }
  }

  if (tradition.includes(14)) {
    traditionsMap.set(14, []);
  }

  const traditionsStrings = translate(locale, 'liturgies.view.traditions');
  const aspectsStrings = translate(locale, 'liturgies.view.aspects');

  const traditions = sortStrings([...traditionsMap].map(e => {
    const mainTradition = traditionsStrings[e[0] - 1];
    if (getAspectsOfTradition(e[0]).length < 2) {
      return mainTradition;
    }
    const mappedAspects = e[1].map(a => aspectsStrings[a - 1]);
    const completeAspects = sortStrings(mappedAspects, locale.id).intercalate(', ');
    return `${mainTradition} (${completeAspects})`;
  }), locale.id).intercalate(', ');

  return (
    <WikiProperty locale={locale} title="info.traditions">
      {traditions}
    </WikiProperty>
  );
}
