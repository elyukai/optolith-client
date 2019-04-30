import * as React from "react";
import { Maybe } from "../../../../Data/Maybe";
import { Record, RecordBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { Markdown } from "../../Universal/Markdown";

interface Accessors<A extends RecordBase> {
  tools: (r: Record<A>) => Maybe<string>
}

export interface WikiToolsProps<A extends RecordBase> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiTools<A extends RecordBase> (props: WikiToolsProps<A>) {
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
