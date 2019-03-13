import * as React from 'react';
import { translate, UIMessages } from '../../../App/Utils/I18n';
import { Markdown } from '../../../components/Markdown';

export interface WikiCriticalSuccessProps {
  currentObject: {
    critical: string;
  };
  locale: UIMessages;
}

export function WikiCriticalSuccess(props: WikiCriticalSuccessProps) {
  const {
    currentObject: {
      critical
    },
    locale
  } = props;

  return (
    <Markdown source={`**${translate(locale, 'info.criticalsuccess')}:** ${critical}`} />
  );
}
