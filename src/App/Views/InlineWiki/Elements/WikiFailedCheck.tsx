import * as React from "react";
import { translate, UIMessages } from "../../../Utilities/I18n";
import { Markdown } from "../../Universal/Markdown";

export interface WikiFailedCheckProps {
  currentObject: {
    failed: string;
  }
  locale: UIMessages
}

export function WikiFailedCheck(props: WikiFailedCheckProps) {
  const {
    currentObject: {
      failed
    },
    locale
  } = props

  return (
    <Markdown source={`**${translate(locale, "info.failedcheck")}:** ${failed}`} />
  )
}
