import { FC } from "react"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { selectVisibleAttributes } from "../../../../selectors/attributeSelectors.ts"
import "./AttributesList.scss"
import { AttributeListItem } from "./AttributesListItem.tsx"

type Props = {
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
}

export const AttributeList: FC<Props> = props => {
  const attributes = useAppSelector(selectVisibleAttributes)

  const {
    isInCharacterCreation,
    isRemovingEnabled,
  } = props

  return (
    <div className="main">
      {attributes.map(attribute => (
        <AttributeListItem
          key={attribute.static.id}
          attribute={attribute}
          isInCharacterCreation={isInCharacterCreation}
          isRemovingEnabled={isRemovingEnabled}
          />
      ))}
    </div>
  )
}
