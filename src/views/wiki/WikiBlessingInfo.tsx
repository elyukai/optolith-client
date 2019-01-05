import * as React from 'react';
import { Blessing, Book } from '../../App/Models/Wiki/wikiTypeHelpers';
import { Markdown } from '../../components/Markdown';
import { sortStrings } from '../../utils/FilterSortUtils';
import { translate, UIMessages } from '../../utils/I18n';
import { getAspectsOfTradition, getTraditionOfAspect } from '../../utils/liturgicalChantUtils';
import { WikiSource } from './elements/WikiSource';
import { WikiBoxTemplate } from './WikiBoxTemplate';
import { WikiProperty } from './WikiProperty';

export interface WikiBlessingInfoProps {
  books: Map<string, Book>;
  currentObject: Blessing;
  locale: UIMessages;
}

export function WikiBlessingInfo(props: WikiBlessingInfoProps) {
  const { currentObject, locale } = props;

  const traditionsMap = new Map<number, number[]>();

  for (const aspectId of currentObject.aspects) {
    const tradition = getTraditionOfAspect(aspectId);
    traditionsMap.set(tradition, [...(traditionsMap.get(tradition) || []), aspectId]);
  }

  const traditions = sortStrings([...traditionsMap].map(e => {
    if (getAspectsOfTradition(e[0]).length < 2) {
      return translate(locale, 'liturgies.view.traditions')[e[0] - 1];
    }
    return `${translate(locale, 'liturgies.view.traditions')[e[0] - 1]} (${sortStrings(e[1].map(a => translate(locale, 'liturgies.view.aspects')[a - 1]), locale.id).intercalate(', ')})`;
  }), locale.id).intercalate(', ');

  if (['nl-BE'].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="blessing" title={currentObject.name}>
        <WikiProperty locale={locale} title="info.aspect">{traditions}</WikiProperty>
      </WikiBoxTemplate>
    );
  }

  return (
    <WikiBoxTemplate className="blessing" title={currentObject.name}>
      <Markdown className="no-indent" source={currentObject.effect} />
      <WikiProperty locale={locale} title="info.range">{currentObject.range}</WikiProperty>
      <WikiProperty locale={locale} title="info.duration">{currentObject.duration}</WikiProperty>
      <WikiProperty locale={locale} title="info.targetcategory">{currentObject.target}</WikiProperty>
      <WikiProperty locale={locale} title="info.aspect">{traditions}</WikiProperty>
      <WikiSource {...props} />
    </WikiBoxTemplate>
  );
}
