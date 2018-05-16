import * as React from 'react';
import { Markdown } from '../../../components/Markdown';
import { translate, UIMessages } from '../../../utils/I18n';

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
