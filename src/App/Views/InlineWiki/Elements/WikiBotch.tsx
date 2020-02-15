import * as React from "react"
import { Record, RecordIBase } from "../../../../Data/Record"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { Markdown } from "../../Universal/Markdown"

interface Accessors<A extends RecordIBase<any>> {
  botch: (r: Record<A>) => string
}

export interface WikiBotchProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiBotchProps<A>) => ReturnType<React.FC>

export const WikiBotch: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  return (
    <Markdown source={`**${translate (staticData) ("inlinewiki.botch")}:** ${acc.botch (x)}`} />
  )
}
