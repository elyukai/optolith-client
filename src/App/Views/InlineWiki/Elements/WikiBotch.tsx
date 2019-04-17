import * as React from "react";
import { translate, UIMessages } from "../../../Utilities/I18n";
import { Markdown } from "../../Universal/Markdown";

export interface WikiBotchProps {
  currentObject: {
    botch: string
  }
  locale: UIMessages
}

export function WikiBotch(props: WikiBotchProps) {
  const {
    currentObject: {
      botch
    },
    locale
  } = props

  return (
    <Markdown source={`**${translate(locale, "info.botch")}:** ${botch}`} />
  )
}
