import * as React from 'react';
import { translate, UIMessages } from '../../../App/Utils/I18n';
import { WikiProperty } from '../WikiProperty';

export interface WikiSpellPropertyProps {
  currentObject: {
    property: number;
  };
  locale: UIMessages;
}

export function WikiSpellProperty(props: WikiSpellPropertyProps) {
  const {
    currentObject: {
      property
    },
    locale
  } = props;

  return (
    <WikiProperty locale={locale} title="info.property">
      {translate(locale, 'spells.view.properties')[property - 1]}
    </WikiProperty>
  );
}
