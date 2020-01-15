import * as React from "react";
import { Record } from "../../../Data/Record";
import { Pet } from "../../Models/Hero/Pet";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { AvatarWrapper } from "../Universal/AvatarWrapper";
import { IconButton } from "../Universal/IconButton";
import { ListItem } from "../Universal/ListItem";
import { ListItemButtons } from "../Universal/ListItemButtons";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";
import { VerticalList } from "../Universal/VerticalList";

export interface PetsListItemProps {
  pet: Record<Pet>
  editPet (id: string): void
  deletePet (id: string): void
}

export const PetsListItem: React.FC<PetsListItemProps> = props => {
  const { deletePet, editPet, pet } = props

  const handleEditPet = React.useCallback (
    () => editPet (Pet.A.id (pet)),
    [ editPet, pet ]
  )

  const handleDeletePet = React.useCallback (
    () => deletePet (Pet.A.id (pet)),
    [ deletePet, pet ]
  )

  return (
    <ListItem>
      <AvatarWrapper src={Pet.A.avatar (pet)} />
      <ListItemName name={Pet.A.name (pet)} large>
        <VerticalList>
          <span>{renderMaybe (Pet.A.type (pet))}</span>
        </VerticalList>
      </ListItemName>
      <ListItemSeparator />
      <ListItemButtons>
        <IconButton icon="&#xE90b;" onClick={handleDeletePet} />
        <IconButton icon="&#xE90c;" onClick={handleEditPet} />
      </ListItemButtons>
    </ListItem>
  )
}
