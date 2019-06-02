import * as React from "react";
import { ensure, maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { Item } from "../../Models/Hero/Item";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { gt } from "../../Utilities/mathUtils";
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
  addTemplateToList (id: string): void
  deleteItem (id: string): void
  editItem (id: string): void
  selectForInfo (id: string): void
}

const IA = Item.A

export function EquipmentListItem (props: EquipmentListItemProps) {
  const { add, addTemplateToList, data, deleteItem, editItem, l10n: locale, selectForInfo } = props

  const numberValue = ensure<number> (gt (1)) (IA.amount (data))

  return add === true ? (
    <ListItem>
      <ListItemName name={IA.name (data)} />
      <ListItemSeparator />
      <ListItemButtons>
        <IconButton
          icon="&#xE916;"
          onClick={() => addTemplateToList (IA.id (data))}
          flat
          />
        <IconButton
          icon="&#xE912;"
          onClick={() => selectForInfo (IA.id (data))}
          flat
          />
      </ListItemButtons>
    </ListItem>
  ) : (
    <ListItem>
      <ListItemName
        name={
          `${maybe ("") ((value: number) => `${value}x `) (numberValue)}${IA.name (data)}`
        }
        />
      <ListItemSeparator />
      <ListItemGroup list={translate (locale) ("itemgroups")} index={IA.gr (data)} />
      <ListItemButtons>
        <IconButton
          icon="&#xE90c;"
          onClick={() => editItem (IA.id (data))}
          flat
          />
        <IconButton
          icon="&#xE90b;"
          onClick={() => deleteItem (IA.id (data))}
          flat
          />
        <IconButton
          icon="&#xE912;"
          onClick={() => selectForInfo (IA.id (data))}
          flat
          />
      </ListItemButtons>
    </ListItem>
  )
}
