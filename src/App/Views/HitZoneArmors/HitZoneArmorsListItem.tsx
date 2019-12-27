import * as React from "react";
import { List } from "../../../Data/List";
import { Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { HitZoneArmor } from "../../Models/Hero/HitZoneArmor";
import { Item } from "../../Models/Hero/Item";
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate";
import { IconButton } from "../Universal/IconButton";
import { ListItem } from "../Universal/ListItem";
import { ListItemButtons } from "../Universal/ListItemButtons";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";
import { TooltipToggle } from "../Universal/TooltipToggle";

export interface HitZoneArmorsListItemProps {
  data: Record<HitZoneArmor>
  items: Maybe<List<Record<Item>>>
  templates: List<Record<ItemTemplate>>
  editItem (id: string): void
  deleteItem (id: string): void
}

const HZAA = HitZoneArmor.A

export const HitZoneArmorsListItem: React.FC<HitZoneArmorsListItemProps> = props => {
  const { data: item, editItem, deleteItem } = props

  const handleEdit =
    React.useCallback (
      () => editItem (HZAA.id (item)),
      [ editItem, item ]
    )

  const handleDelete =
    React.useCallback (
      () => deleteItem (HZAA.id (item)),
      [ deleteItem, item ]
    )

  return (
    <TooltipToggle
      content={
        <div className="inventory-item">
          <h4><span>{HZAA.name (item)}</span></h4>
        </div>
      }
      margin={11}
      target={
        <ListItem>
          <ListItemName name={HZAA.name (item)} />
          <ListItemSeparator />
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
          </ListItemButtons>
        </ListItem>
      }
      />
  )
}
