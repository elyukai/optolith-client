import * as React from 'react';
import { translate, UIMessages } from '../../../App/Utils/I18n';
import { Markdown } from '../../../components/Markdown';

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
    <Markdown source={`**${translate(locale, 'info.botch')}:** ${botch}`} />
  );
}
