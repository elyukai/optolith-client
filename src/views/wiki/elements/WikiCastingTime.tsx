import * as React from 'react';
import { CategoryWithGroups, SPELLS, LITURGIES } from '../../../constants/Categories';
import { UIMessages } from '../../../utils/I18n';
import { WikiProperty } from '../WikiProperty';

export interface WikiCastingTimeProps {
	currentObject: {
    castingTime: string;
    category: CategoryWithGroups;
    gr: number;
	};
	locale: UIMessages;
}

export function WikiCastingTime(props: WikiCastingTimeProps) {
  const {
    currentObject: {
      castingTime,
      category,
      gr
    },
    locale
  } = props;

  let key: keyof UIMessages = 'info.castingtime';

  if (category === SPELLS && gr === 2) {
    key = 'info.ritualtime';
  }
  else if (category === SPELLS && (gr === 5 || gr === 6)) {
    key = 'info.lengthoftime';
  }
  else if (category === LITURGIES && gr === 1) {
    key = 'info.liturgicaltime';
  }
  else if (category === LITURGIES && gr === 2) {
    key = 'info.ceremonialtime';
  }

  return (
    <WikiProperty locale={locale} title={key}>
      {castingTime}
    </WikiProperty>
  );
}
