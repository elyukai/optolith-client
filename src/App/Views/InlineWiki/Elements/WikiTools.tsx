import * as React from "react";
import { translate, UIMessages } from "../../../Utilities/I18n";
import { Markdown } from "../../Universal/Markdown";

export interface WikiToolsProps {
  currentObject: {
    tools?: string;
  }
  locale: UIMessages
}

export function WikiTools(props: WikiToolsProps) {
  const {
    currentObject: {
      tools
    },
    locale
  } = props

  if (typeof tools === "string") {
    return (
      <Markdown source={`**${translate(locale, "info.tools")}:** ${tools}`} />
    )
  }

  return null
}
