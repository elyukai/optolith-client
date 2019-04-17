import * as React from "react";
import { IconButton } from "../Universal/IconButton";
import { ListItem } from "../Universal/ListItem";
import { ListItemButtons } from "../Universal/ListItemButtons";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";
import { TooltipToggle } from "../Universal/TooltipToggle";

export interface HitZoneArmorsListItemProps {
  data: Record<ArmorZonesInstance>
  locale: UIMessagesObject
  items: Maybe<List<Record<ItemInstance>>>
  templates: List<Record<ItemTemplate>>
  editItem (id: string): void
  deleteItem (id: string): void
}

export function HitZoneArmorsListItem (props: HitZoneArmorsListItemProps) {
  const { data: item, editItem, deleteItem } = props

  return (
    <TooltipToggle content={
      <div className="inventory-item">
        <h4><span>{item .get ("name")}</span></h4>
      </div>
    } margin={11}>
      <ListItem>
        <ListItemName name={item .get ("name")} />
        <ListItemSeparator />
        <ListItemButtons>
          <IconButton
            icon="&#xE90c"
            onClick={() => editItem (item .get ("id"))}
            flat
            />
          <IconButton
            icon="&#xE90b"
            onClick={() => deleteItem (item .get ("id"))}
            flat
            />
        </ListItemButtons>
      </ListItem>
    </TooltipToggle>
  )
}
