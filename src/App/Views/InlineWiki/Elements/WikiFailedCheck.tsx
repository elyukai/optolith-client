import * as React from 'react';
import { translate, UIMessages } from '../../../App/Utils/I18n';
import { Markdown } from '../../../components/Markdown';

export interface WikiFailedCheckProps {
  currentObject: {
    failed: string;
  };
  locale: UIMessages;
}

export function WikiFailedCheck(props: WikiFailedCheckProps) {
  const {
    currentObject: {
      failed
    },
    locale
  } = props;

  return (
    <Markdown source={`**${translate(locale, 'info.failedcheck')}:** ${failed}`} />
  );
}
