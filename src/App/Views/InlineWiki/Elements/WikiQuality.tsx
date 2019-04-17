import * as React from "react";
import { translate, UIMessages } from "../../../Utilities/I18n";
import { Markdown } from "../../Universal/Markdown";

export interface WikiQualityProps {
  currentObject: {
    quality: string;
  }
  locale: UIMessages
}

export function WikiQuality(props: WikiQualityProps) {
  const {
    currentObject: {
      quality
    },
    locale
  } = props

  return (
    <Markdown source={`**${translate(locale, "info.quality")}:** ${quality}`} />
  )
}
