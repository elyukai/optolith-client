import * as React from 'react';
import { SecondaryAttribute } from '../../../types/data';
import { Attribute } from '../../../types/wiki';
import { UIMessages } from '../../../utils/I18n';
import { WikiProperty } from '../WikiProperty';

export interface WikiSkillCheckProps {
	attributes: Map<string, Attribute>;
	currentObject: {
		check: string[];
		checkmod?: 'SPI' | 'TOU';
	};
  derivedCharacteristics: Map<string, SecondaryAttribute>;
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

  return (
    <WikiProperty locale={locale} title="info.check">
      {check.map(e => attributes.get(e)!.short).join('/')}
      {checkmod && ` (+${derivedCharacteristics.get(checkmod)!.short})`}
    </WikiProperty>
  );
}
