import * as React from "react";
import { List, map, subscript, toArray } from "../../../Data/List";
import { Maybe, maybe } from "../../../Data/Maybe";
import { member, notMember, OrderedSet, size } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate, translateP } from "../../Utilities/I18n";
import { pipe_ } from "../../Utilities/pipe";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { Checkbox } from "../Universal/Checkbox";

export interface SelectionsCombatTechniquesProps {
  active: OrderedSet<string>
  disabled?: OrderedSet<string>
  amount: number
  list: List<Record<CombatTechnique>>
  l10n: L10nRecord
  value: number
  second?: boolean
  change (id: string): void
}

export function SelectionsCombatTechniques (props: SelectionsCombatTechniquesProps) {
  const { active, amount, change, disabled, list, l10n, value } = props

  const mdisabled = Maybe (disabled)

  const amountTags = translate (l10n) ("combattechniquecounter")

  const text =
    translateP (l10n)
               ("combattechniquesselection")
               (List<string | number> (
                 renderMaybe (subscript (amountTags) (amount - 1)),
                 value + 6
               ))

  return (
    <div className="ct list">
      <h4>{text}</h4>
      {pipe_ (
        list,
        map (e => {
          const id = CombatTechnique.A.id (e)
          const name = CombatTechnique.A.name (e)

          return (
            <Checkbox
              key={id}
              checked={member (id) (active)}
              disabled={
                notMember (id) (active) && size (active) >= amount
                || maybe (false) (member (id)) (mdisabled)}
              label={name}
              onClick={() => change (id)} />
          )
        }),
        toArray
      )}
    </div>
  )
}
