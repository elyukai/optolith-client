import * as React from "react";
import { Record, RecordBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { Markdown } from "../../Universal/Markdown";

interface Accessors<A extends RecordBase> {
  botch: (r: Record<A>) => string
}

export interface WikiBotchProps<A extends RecordBase> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiBotch<A extends RecordBase> (props: WikiBotchProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  return (
    <Markdown source={`**${translate (l10n) ("botch")}:** ${acc.botch (x)}`} />
  )
}
