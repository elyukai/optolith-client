import * as React from 'react';
import { Markdown } from '../../../components/Markdown';
import { _translate, UIMessages } from '../../../utils/I18n';

export interface WikiEffectProps {
	currentObject: {
		effect: string;
	};
	locale: UIMessages;
}

export function WikiEffect(props: WikiEffectProps) {
  const {
    currentObject: {
      effect
    },
    locale
  } = props;

  return (
    <Markdown source={`**${_translate(locale, 'info.effect')}:** ${effect}`} />
  );
}
