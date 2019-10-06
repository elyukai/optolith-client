import * as React from "react";
import { intercalate, List, map, notNull } from "../../../../Data/List";
import { OrderedMap } from "../../../../Data/OrderedMap";
import { Record, RecordIBase } from "../../../../Data/Record";
import { Advantage } from "../../../Models/Wiki/Advantage";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { Application } from "../../../Models/Wiki/sub/Application";
import { sortStrings } from "../../../Utilities/sortBy";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  uses: (r: Record<A>) => List<Record<Application>>
}

export interface WikiUsesProps<A extends RecordIBase<any>> {
  advantages: OrderedMap<string, Record<Advantage>>
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
  specialAbilities: OrderedMap<string, Record<SpecialAbility>>
}

const AA = Application.A

export function WikiUses <A extends RecordIBase<any>> (props: WikiUsesProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  const uses = acc.uses (x)

  if (notNull (uses)) {
    const sorted_uses = sortStrings (l10n) (map (AA.name) (uses))

    return (
      <WikiProperty l10n={l10n} title="uses">
        {intercalate (", ") (sorted_uses)}
      </WikiProperty>
    )
  }

  return null
}
