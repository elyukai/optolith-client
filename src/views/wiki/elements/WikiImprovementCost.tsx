import * as React from 'react';
import { UIMessages } from '../../../utils/I18n';
import { getICName } from '../../../utils/improvementCostUtils';
import { WikiProperty } from '../WikiProperty';

export interface WikiImprovementCostProps {
  currentObject: {
    ic: number;
  };
  locale: UIMessages;
}

export function WikiImprovementCost(props: WikiImprovementCostProps) {
  const {
    currentObject: {
      ic
    },
    locale
  } = props;

  return (
    <WikiProperty locale={locale} title="info.improvementcost">
      {getICName(ic)}
    </WikiProperty>
  );
}
