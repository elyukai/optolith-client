import * as React from 'react';
import { Book, Cantrip } from '../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessages } from '../../App/Utils/I18n';
import { Markdown } from '../../components/Markdown';
import { WikiSource } from './elements/WikiSource';
import { WikiBoxTemplate } from './WikiBoxTemplate';
import { WikiProperty } from './WikiProperty';

export interface WikiCantripInfoProps {
  books: Map<string, Book>;
  currentObject: Cantrip;
  locale: UIMessages;
}

export function WikiCantripInfo(props: WikiCantripInfoProps) {
  const { currentObject, locale } = props;

  if (['nl-BE'].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="cantrip" title={currentObject.name}>
        <WikiProperty locale={locale} title="info.property">
          {translate(locale, 'spells.view.properties')[currentObject.property - 1]}
        </WikiProperty>
      </WikiBoxTemplate>
    );
  }

  return (
    <WikiBoxTemplate className="cantrip" title={currentObject.name}>
      <Markdown className="no-indent" source={currentObject.effect} />
      <WikiProperty locale={locale} title="info.range">{currentObject.range}</WikiProperty>
      <WikiProperty locale={locale} title="info.duration">{currentObject.duration}</WikiProperty>
      <WikiProperty locale={locale} title="info.targetcategory">{currentObject.target}</WikiProperty>
      <WikiProperty locale={locale} title="info.property">
        {translate(locale, 'spells.view.properties')[currentObject.property - 1]}
      </WikiProperty>
      {currentObject.note && <WikiProperty locale={locale} title="info.note">{currentObject.note}</WikiProperty>}
      <WikiSource {...props} />
    </WikiBoxTemplate>
  );
}
