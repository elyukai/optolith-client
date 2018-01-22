import * as React from 'react';
import { UIMessages } from '../../../utils/I18n';
import { WikiProperty } from '../WikiProperty';

export interface WikiRangeProps {
	currentObject: {
		range: string;
	};
	locale: UIMessages;
}

export function WikiRange(props: WikiRangeProps) {
  const {
    currentObject: {
      range
    },
    locale
  } = props;

  return (
    <WikiProperty locale={locale} title="info.range">
      {range}
    </WikiProperty>
  );
}
