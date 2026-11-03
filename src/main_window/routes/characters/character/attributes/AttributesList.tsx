import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import "./AttributesList.scss"
import { AttributeListItem } from "./AttributesListItem.tsx"

/**
 * Returns a list of attribute values.
 */
export const AttributeList: FC = observer(() => (
  <div className="main">
    {useCharacterState().attributes.map(attribute => (
      <AttributeListItem key={attribute.id} attribute={attribute} />
    ))}
  </div>
))
