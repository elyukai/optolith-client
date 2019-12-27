import * as React from "react";
import { Record, RecordIBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { Markdown } from "../../Universal/Markdown";

interface Accessors<A extends RecordIBase<any>> {
  failed: (r: Record<A>) => string
}

export interface WikiFailedCheckProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiFailedCheckProps<A>) => ReturnType<React.FC>

export const WikiFailedCheck: FC = props => {
  const {
    x,
    acc,
    l10n,
  } = props

  return (
    <Markdown source={`**${translate (l10n) ("failedcheck")}:** ${acc.failed (x)}`} />
  )
}
