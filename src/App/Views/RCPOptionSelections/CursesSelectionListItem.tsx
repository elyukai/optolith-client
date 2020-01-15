import * as React from "react";
import { isJust, isNothing, Just, Maybe, maybe, maybeRNullF, Nothing } from "../../../Data/Maybe";
import { lte } from "../../../Data/Num";
import { lookup, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Spell } from "../../Models/Wiki/Spell";
import { minus } from "../../Utilities/Chars";
import { BorderButton } from "../Universal/BorderButton";
import { Checkbox } from "../Universal/Checkbox";

const SA = Spell.A

interface Props {
  apLeft: number
  curse: Record<Spell>
  active: OrderedMap<string, number>
  adjustCurseValue: (id: string) => (method: Maybe<"add" | "remove">) => void
}

export const CursesSelectionListItem: React.FC<Props> = props => {
  const { active, apLeft, curse, adjustCurseValue } = props

  const id = SA.id (curse)
  const name = SA.name (curse)
  const ic = SA.ic (curse)

  const mvalue = lookup (id) (active)

  const handleToggle = React.useCallback (
    () => adjustCurseValue (id) (Nothing),
    [ id, adjustCurseValue ]
  )

  const handleAddPoint = React.useCallback (
    () => adjustCurseValue (id) (Just ("add")),
    [ id, adjustCurseValue ]
  )

  const handleRemovePoint = React.useCallback (
    () => adjustCurseValue (id) (Just ("remove")),
    [ id, adjustCurseValue ]
  )

  return (
    <li>
      <Checkbox
        checked={isJust (mvalue)}
        disabled={isNothing (mvalue) && apLeft <= 0}
        onClick={handleToggle}
        >
        {name}
      </Checkbox>
      {maybeRNullF (mvalue) (value => (<span>{value}</span>))}
      <BorderButton
        label="+"
        disabled={isNothing (mvalue) || apLeft <= 0 || apLeft - ic < 0}
        onClick={handleAddPoint}
        />
      <BorderButton
        label={minus}
        disabled={maybe (true) (lte (0)) (mvalue)}
        onClick={handleRemovePoint}
        />
    </li>
  )
}
