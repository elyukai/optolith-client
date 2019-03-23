import * as React from 'react';
import { UIMessages } from '../../../App/Utils/I18n';
import { WikiProperty } from '../WikiProperty';

export interface WikiTargetCategoryProps {
  currentObject: {
    target: string;
  };
  locale: UIMessages;
}

export function WikiTargetCategory(props: WikiTargetCategoryProps) {
  const {
    currentObject: {
      target
    },
    locale
  } = props;

  return (
    <WikiProperty locale={locale} title="info.targetcategory">
      {target}
    </WikiProperty>
  );
}