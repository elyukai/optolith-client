import * as React from "react"
import { fromMaybe, Maybe } from "../../../../Data/Maybe"
import { Record, RecordIBase } from "../../../../Data/Record"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { WikiProperty } from "../WikiProperty"

interface Accessors<A extends RecordIBase<any>> {
  encumbrance: (r: Record<A>) => string
  encumbranceDescription: (r: Record<A>) => Maybe<string>
}

export interface WikiEncumbranceProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiEncumbranceProps<A>) => ReturnType<React.FC>

export const WikiEncumbrance: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  let string = fromMaybe (translate (staticData) ("inlinewiki.encumbrance.maybe"))
                         (acc.encumbranceDescription (x))

  const encumbrance = acc.encumbrance (x)

  if (encumbrance === "true") {
    string = translate (staticData) ("inlinewiki.encumbrance.yes")
  }
  else if (encumbrance === "false") {
    string = translate (staticData) ("inlinewiki.encumbrance.no")
  }

  return (
    <WikiProperty staticData={staticData} title="inlinewiki.encumbrance">
      {string}
    </WikiProperty>
  )
}
