import * as React from 'react';
import { CategoryWithGroups, Categories } from '../../../constants/Categories';
import { UIMessages } from '../../../utils/I18n';
import { WikiProperty } from '../WikiProperty';

export interface WikiDurationProps {
	currentObject: {
    duration: string;
    category: CategoryWithGroups;
    gr: number;
	};
	locale: UIMessages;
}

export function WikiDuration(props: WikiDurationProps) {
  const {
    currentObject: {
      duration,
      category,
      gr
    },
    locale
  } = props;

  let key: keyof UIMessages = 'info.duration';

  if (category === Categories.SPELLS && (gr === 4 || gr === 5)) {
    key = 'info.skill';
  }

  return (
    <WikiProperty locale={locale} title={key}>
      {duration}
    </WikiProperty>
  );
}
