import * as React from 'react';
import { SecondaryAttribute } from '../../../types/data';
import { UIMessages } from '../../../utils/I18n';
import { Attribute } from '../../../utils/wikiData/wikiTypeHelpers';
import { WikiProperty } from '../WikiProperty';

export interface WikiSkillCheckProps {
  attributes: Map<string, Attribute>;
  currentObject: {
    check: string[];
    checkmod?: 'SPI' | 'TOU';
  };
  derivedCharacteristics?: Map<string, SecondaryAttribute>;
  locale: UIMessages;
}

export function WikiSkillCheck(props: WikiSkillCheckProps) {
  const {
    attributes,
    currentObject: {
      check,
      checkmod
    },
    derivedCharacteristics,
    locale
  } = props;

  const checkString = check.map(e => attributes.get(e)!.short).join('/');

  let mod;

  if (typeof checkmod === 'string' && derivedCharacteristics) {
    mod = ` (+${derivedCharacteristics.get(checkmod)!.short})`;
  }
  else if (checkmod) {
    console.warn('Map of derived characteristics missing.');
  }

  return (
    <WikiProperty locale={locale} title="info.check">
      {checkString}
      {mod}
    </WikiProperty>
  );
}
