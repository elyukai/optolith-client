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

export function HitZoneArmorsListItem (props: HitZoneArmorsListItemProps) {
  const { data: item, editItem, deleteItem } = props

  return (
    <TooltipToggle content={
      <div className="inventory-item">
        <h4><span>{HZAA.name (item)}</span></h4>
      </div>
    } margin={11}>
      <ListItem>
        <ListItemName name={HZAA.name (item)} />
        <ListItemSeparator />
        <ListItemButtons>
          <IconButton
            icon="&#xE90c;"
            onClick={() => editItem (HZAA.id (item))}
            flat
            />
          <IconButton
            icon="&#xE90b;"
            onClick={() => deleteItem (HZAA.id (item))}
            flat
            />
        </ListItemButtons>
      </ListItem>
    </TooltipToggle>
  )
}
