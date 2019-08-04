import * as React from "react";
import { Record, RecordBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { getICName } from "../../../Utilities/AdventurePoints/improvementCostUtils";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordBase> {
  ic: (r: Record<A>) => number
}

export interface WikiImprovementCostProps<A extends RecordBase> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiImprovementCost<A extends RecordBase> (props: WikiImprovementCostProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  return (
    <WikiProperty l10n={l10n} title="improvementcost">
      {getICName (acc.ic (x))}
    </WikiProperty>
  )
}
