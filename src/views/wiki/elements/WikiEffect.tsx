import * as React from 'react';
import { translate, UIMessages } from '../../../App/Utils/I18n';
import { Markdown } from '../../../components/Markdown';

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
    <Markdown source={`**${translate(locale, 'info.effect')}:** ${effect}`} />
  );
}
