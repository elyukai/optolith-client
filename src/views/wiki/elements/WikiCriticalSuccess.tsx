import * as React from 'react';
import { Markdown } from '../../../components/Markdown';
import { _translate, UIMessages } from '../../../utils/I18n';

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
    <Markdown source={`**${_translate(locale, 'info.criticalsuccess')}:** ${critical}`} />
  );
}
