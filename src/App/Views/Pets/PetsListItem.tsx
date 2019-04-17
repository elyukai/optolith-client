import * as React from "react";
import { AvatarWrapper } from "../Universal/AvatarWrapper";
import { IconButton } from "../Universal/IconButton";
import { ListItem } from "../Universal/ListItem";
import { ListItemButtons } from "../Universal/ListItemButtons";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";
import { VerticalList } from "../Universal/VerticalList";

export interface PetsListItemProps {
  pet: Record<PetInstance>
  editPet (id: string): void
  deletePet (id: string): void
}

export function PetsListItem (props: PetsListItemProps) {
  const { deletePet, editPet, pet } = props

  return (
    <ListItem>
      <AvatarWrapper src={pet .lookup ("avatar")} />
      <ListItemName name={pet .get ("name")} large>
        <VerticalList>
          <span>{pet .lookupWithDefault<"type"> ("") ("type")}</span>
        </VerticalList>
      </ListItemName>
      <ListItemSeparator/>
      <ListItemButtons>
        <IconButton icon="&#xE90b" onClick={() => deletePet (pet .get ("id"))} />
        <IconButton icon="&#xE90c" onClick={() => editPet (pet .get ("id"))} />
      </ListItemButtons>
    </ListItem>
  )
}
