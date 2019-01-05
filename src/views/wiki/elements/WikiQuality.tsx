import * as React from 'react';
import { translate, UIMessages } from '../../../App/Utils/I18n';
import { Markdown } from '../../../components/Markdown';

export interface WikiQualityProps {
  currentObject: {
    quality: string;
  };
  locale: UIMessages;
}

export function WikiQuality(props: WikiQualityProps) {
  const {
    currentObject: {
      quality
    },
    locale
  } = props;

  return (
    <Markdown source={`**${translate(locale, 'info.quality')}:** ${quality}`} />
  );
}
