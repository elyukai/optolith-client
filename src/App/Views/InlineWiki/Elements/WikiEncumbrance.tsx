import * as React from 'react';
import { translate, UIMessages } from '../../../App/Utils/I18n';
import { WikiProperty } from '../WikiProperty';

export interface WikiEncumbranceProps {
  currentObject: {
    encumbrance: string;
  };
  locale: UIMessages;
}

export function WikiEncumbrance(props: WikiEncumbranceProps) {
  const {
    currentObject: {
      encumbrance
    },
    locale
  } = props;

  let string = translate(locale, 'charactersheet.gamestats.skills.enc.maybe');

  if (encumbrance === 'true') {
    string = translate(locale, 'charactersheet.gamestats.skills.enc.yes');
  }
  else if (encumbrance === 'false') {
    string = translate(locale, 'charactersheet.gamestats.skills.enc.no');
  }

  return (
    <WikiProperty locale={locale} title="info.encumbrance">
      {string}
    </WikiProperty>
  );
}
