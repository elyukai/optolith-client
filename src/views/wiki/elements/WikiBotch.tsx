import * as React from 'react';
import { Markdown } from '../../../components/Markdown';
import { _translate, UIMessages } from '../../../utils/I18n';

export interface WikiBotchProps {
	currentObject: {
		botch: string;
	};
	locale: UIMessages;
}

export function WikiBotch(props: WikiBotchProps) {
  const {
    currentObject: {
      botch
    },
    locale
  } = props;

  return (
    <Markdown source={`**${_translate(locale, 'info.botch')}:** ${botch}`} />
  );
}
