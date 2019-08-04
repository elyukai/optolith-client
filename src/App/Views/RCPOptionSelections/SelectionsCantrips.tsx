import * as React from "react";
import { List, map, subscript, toArray } from "../../../Data/List";
import { member, notMember, OrderedSet, size } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate, translateP } from "../../Utilities/I18n";
import { pipe_ } from "../../Utilities/pipe";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { Checkbox } from "../Universal/Checkbox";

export interface SelectionsCantripsProps {
  active: OrderedSet<string>
  list: List<Record<Cantrip>>
  l10n: L10nRecord
  num: number
  change (id: string): void
}

export function SelectionsCantrips (props: SelectionsCantripsProps) {
  const { active, change, list, l10n, num } = props

  const nums = translate (l10n) ("cantripcounter")

  return (
    <div className="cantrips list">
      <h4>
        {translateP (l10n) ("cantripsfromlist") (List (renderMaybe (subscript (nums) (num - 1))))}
      </h4>
      {pipe_ (
        list,
        map (e => {
          const id = Cantrip.A.id (e)
          const name = Cantrip.A.name (e)

          return (
            <Checkbox
              key={id}
              checked={member (id) (active)}
              disabled={notMember (id) (active) && size (active) >= num}
              label={name}
              onClick={() => change (id)} />
          )
        }),
        toArray
      )}
    </div>
  )
}
