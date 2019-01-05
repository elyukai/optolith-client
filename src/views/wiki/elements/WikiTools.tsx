import * as React from 'react';
import { translate, UIMessages } from '../../../App/Utils/I18n';
import { Markdown } from '../../../components/Markdown';

export interface WikiToolsProps {
  currentObject: {
    tools?: string;
  };
  locale: UIMessages;
}

export function WikiTools(props: WikiToolsProps) {
  const {
    currentObject: {
      tools
    },
    locale
  } = props;

  if (typeof tools === 'string') {
    return (
      <Markdown source={`**${translate(locale, 'info.tools')}:** ${tools}`} />
    );
  }

  return null;
}
