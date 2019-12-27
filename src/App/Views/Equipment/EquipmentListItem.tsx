import * as React from "react";
import { ensure, maybe, Maybe, orN } from "../../../Data/Maybe";
import { gt } from "../../../Data/Num";
import { Record } from "../../../Data/Record";
import { Item } from "../../Models/Hero/Item";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { IconButton } from "../Universal/IconButton";
import { ListItem } from "../Universal/ListItem";
import { ListItemButtons } from "../Universal/ListItemButtons";
import { ListItemGroup } from "../Universal/ListItemGroup";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";

export interface EquipmentListItemProps {
  add?: boolean
  data: Record<Item>
  l10n: L10nRecord
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
    l10n,
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
      <ListItemGroup list={translate (l10n) ("itemgroups")} index={IA.gr (data)} />
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
