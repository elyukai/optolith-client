import * as React from 'react';
import { Markdown } from '../../../components/Markdown';
import { _translate, UIMessages } from '../../../utils/I18n';

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
    <Markdown source={`**${_translate(locale, 'info.failedcheck')}:** ${failed}`} />
  );
}
