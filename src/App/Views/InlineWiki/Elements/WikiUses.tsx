import * as React from "react"
import { intercalate, List, map, notNull } from "../../../../Data/List"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Advantage } from "../../../Models/Wiki/Advantage"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { Use } from "../../../Models/Wiki/sub/Use"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { sortStrings } from "../../../Utilities/sortBy"
import { WikiProperty } from "../WikiProperty"

interface Accessors<A extends RecordIBase<any>> {
  uses: (r: Record<A>) => List<Record<Use>>
}

export interface WikiUsesProps<A extends RecordIBase<any>> {
  advantages: StrMap<Record<Advantage>>
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
  specialAbilities: StrMap<Record<SpecialAbility>>
}

const UA = Use.A

type FC = <A extends RecordIBase<any>> (props: WikiUsesProps<A>) => ReturnType<React.FC>

export const WikiUses: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  const uses = acc.uses (x)

  if (notNull (uses)) {
    const sorted_uses = sortStrings (staticData) (map (UA.name) (uses))

    return (
      <WikiProperty staticData={staticData} title="inlinewiki.uses">
        {intercalate (", ") (sorted_uses)}
      </WikiProperty>
    )
  }

  return null
}
