import * as React from "react"
import { Record, RecordIBase } from "../../../../Data/Record"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { Markdown } from "../../Universal/Markdown"

interface Accessors<A extends RecordIBase<any>> {
  effect: (r: Record<A>) => string
}

export interface WikiEffectProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiEffectProps<A>) => ReturnType<React.FC>

export const WikiEffect: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  return (
    <Markdown source={`**${translate (staticData) ("inlinewiki.effect")}:** ${acc.effect (x)}`} />
  )
}
