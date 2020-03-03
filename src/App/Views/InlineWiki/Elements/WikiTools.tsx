import * as React from "react"
import { Maybe, maybe } from "../../../../Data/Maybe"
import { Record, RecordIBase } from "../../../../Data/Record"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { ReactReturn } from "../../../Utilities/ReactUtils"
import { Markdown } from "../../Universal/Markdown"

interface Accessors<A extends RecordIBase<any>> {
  tools: (r: Record<A>) => Maybe<string>
}

export interface WikiToolsProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiToolsProps<A>) => ReturnType<React.FC>

export const WikiTools: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  return maybe (null as ReactReturn)
               ((tools: string) => (
                 <Markdown
                   source={`**${translate (staticData) ("inlinewiki.tools")}:** ${tools}`}
                   />
               ))
               (acc.tools (x))
}
