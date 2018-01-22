import * as React from 'react';
import { Category, LITURGIES } from '../../../constants/Categories';
import { UIMessages } from '../../../utils/I18n';
import { WikiProperty } from '../WikiProperty';

export interface WikiCostProps {
	currentObject: {
    cost: string;
    category: Category;
	};
	locale: UIMessages;
}

export function WikiCost(props: WikiCostProps) {
  const {
    currentObject: {
      cost,
      category
    },
    locale
  } = props;

  let key: keyof UIMessages = 'info.aecost';

  if (category === LITURGIES) {
    key = 'info.kpcost';
  }

  return (
    <WikiProperty locale={locale} title={key}>
      {cost}
    </WikiProperty>
  );
}
