import * as React from "react";
import { Record, RecordBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { Markdown } from "../../Universal/Markdown";

interface Accessors<A extends RecordBase> {
  critical: (r: Record<A>) => string
}

export interface WikiCriticalSuccessProps<A extends RecordBase> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiCriticalSuccess<A extends RecordBase> (props: WikiCriticalSuccessProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  return (
    <Markdown source={`**${translate (l10n) ("criticalsuccess")}:** ${acc.critical (x)}`} />
  )
}
