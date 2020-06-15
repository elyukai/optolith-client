import * as React from "react"
import { ensure, maybe, Maybe, orN } from "../../../Data/Maybe"
import { gt } from "../../../Data/Num"
import { lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Item } from "../../Models/Hero/Item"
import { NumIdName } from "../../Models/NumIdName"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { pipe } from "../../Utilities/pipe"
import { IconButton } from "../Universal/IconButton"
import { ListItem } from "../Universal/ListItem"
import { ListItemButtons } from "../Universal/ListItemButtons"
import { ListItemGroup } from "../Universal/ListItemGroup"
import { ListItemName } from "../Universal/ListItemName"
import { ListItemSeparator } from "../Universal/ListItemSeparator"
import { ListItemWeight } from "../Universal/ListItemWeight"

export interface EquipmentListItemProps {
  add?: boolean
  data: Record<Item>
  staticData: StaticDataRecord
  selectedForInfo: Maybe<string>
  addTemplateToList (id: string): void
  deleteItem (id: string): void
  editItem (id: string): void
  selectForInfo (id: string): void
}

const IA = Item.A

export const EquipmentListItem: React.FC<EquipmentListItemProps> = props => {
  const {
    add,
    addTemplateToList,
    data,
    deleteItem,
    editItem,
    staticData,
    selectForInfo,
    selectedForInfo,
  } = props

  const id = IA.id (data)

  const handleAddTemplate = React.useCallback (
    () => addTemplateToList (id),
    [ addTemplateToList, id ]
  )

  const handleEdit = React.useCallback (
    () => editItem (id),
    [ editItem, id ]
  )

  const handleDelete = React.useCallback (
    () => deleteItem (id),
    [ deleteItem, id ]
  )

  const handleShowInfo = React.useCallback (
    () => selectForInfo (id),
    [ selectForInfo, id ]
  )

  const numberValue = ensure<number> (gt (1)) (IA.amount (data))

  return orN (add) ? (
    <ListItem active={Maybe.elem (id) (selectedForInfo)}>
      <ListItemName name={IA.name (data)} />
      <ListItemSeparator />
      <ListItemButtons>
        <IconButton
          icon="&#xE916;"
          onClick={handleAddTemplate}
          flat
          />
        <IconButton
          icon="&#xE912;"
          onClick={handleShowInfo}
          flat
          />
      </ListItemButtons>
    </ListItem>
  ) : (
    <ListItem active={Maybe.elem (id) (selectedForInfo)}>
      <ListItemName
        name={
          `${maybe ("") ((value: number) => `${value}x `) (numberValue)}${IA.name (data)}`
        }
        />
      <ListItemSeparator />
      <ListItemGroup
        group={IA.gr (data)}
        getGroupName={pipe (
          lookupF (StaticData.A.equipmentGroups (staticData)),
          maybe ("") (NumIdName.A.name)
        )}
        />
      <ListItemWeight
        weight={IA.weight (data)}
        staticData={staticData}
        />
      <ListItemButtons>
        <IconButton
          icon="&#xE90c;"
          onClick={handleEdit}
          flat
          />
        <IconButton
          icon="&#xE90b;"
          onClick={handleDelete}
          flat
          />
        <IconButton
          icon="&#xE912;"
          onClick={handleShowInfo}
          flat
          />
      </ListItemButtons>
    </ListItem>
  )
}
