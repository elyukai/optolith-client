import { observer } from "mobx-react"
import { FC } from "react"
import { SharedState } from "../../../../external.ts"
import "./AttributesList.scss"
import { AttributeListItem } from "./AttributesListItem.tsx"

type Props = {
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
}

/**
 * Returns a list of attribute values.
 */
export const AttributeList: FC<Props> = observer(props => {
  const { isInCharacterCreation, isRemovingEnabled } = props

  return (
    <div className="main">
      {SharedState.attributes.map(attribute => (
        <AttributeListItem
          key={attribute.id}
          attribute={attribute}
          isInCharacterCreation={isInCharacterCreation}
          isRemovingEnabled={isRemovingEnabled}
        />
      ))}
    </div>
  )
})
