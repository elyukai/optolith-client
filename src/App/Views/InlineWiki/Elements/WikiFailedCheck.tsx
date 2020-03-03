import * as React from "react"
import { Record, RecordIBase } from "../../../../Data/Record"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { Markdown } from "../../Universal/Markdown"

interface Accessors<A extends RecordIBase<any>> {
  failed: (r: Record<A>) => string
}

export interface WikiFailedCheckProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiFailedCheckProps<A>) => ReturnType<React.FC>

export const WikiFailedCheck: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  return (
    <Markdown
      source={`**${translate (staticData) ("inlinewiki.failedcheck")}:** ${acc.failed (x)}`}
      />
  )
}
