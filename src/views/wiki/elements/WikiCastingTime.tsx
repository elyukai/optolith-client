import * as React from 'react';
import { UIMessages } from '../../../App/Utils/I18n';
import { Categories, CategoryWithGroups } from '../../../constants/Categories';
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

  if (category === Categories.SPELLS && gr === 2) {
    key = 'info.ritualtime';
  }
  else if (category === Categories.SPELLS && (gr === 5 || gr === 6)) {
    key = 'info.lengthoftime';
  }
  else if (category === Categories.LITURGIES && gr === 1) {
    key = 'info.liturgicaltime';
  }
  else if (category === Categories.LITURGIES && gr === 2) {
    key = 'info.ceremonialtime';
  }

  return (
    <WikiProperty locale={locale} title={key}>
      {castingTime}
    </WikiProperty>
  );
}
