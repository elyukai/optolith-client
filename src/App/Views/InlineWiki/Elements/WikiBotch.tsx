import * as React from "react"
import { Record, RecordIBase } from "../../../../Data/Record"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { translate } from "../../../Utilities/I18n"
import { Markdown } from "../../Universal/Markdown"

interface Accessors<A extends RecordIBase<any>> {
  botch: (r: Record<A>) => string
}

export interface WikiBotchProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiBotchProps<A>) => ReturnType<React.FC>

export const WikiBotch: FC = props => {
  const {
    x,
    acc,
    l10n,
  } = props

  return (
    <Markdown source={`**${translate (l10n) ("inlinewiki.botch")}:** ${acc.botch (x)}`} />
  )
}
