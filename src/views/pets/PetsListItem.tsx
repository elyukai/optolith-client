import * as React from 'react';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { VerticalList } from '../../components/VerticalList';
import { PetInstance } from '../../types/data';
import { Record } from '../../utils/dataUtils';

export interface PetsListItemProps {
  pet: Record<PetInstance>;
  editPet (id: string): void;
  deletePet (id: string): void;
}

export function PetsListItem (props: PetsListItemProps) {
  const { deletePet, editPet, pet } = props;

  return (
    <ListItem>
      <AvatarWrapper src={pet .lookup ('avatar')} />
      <ListItemName name={pet .get ('name')} large>
        <VerticalList>
          <span>{pet .lookupWithDefault<'type'> ('') ('type')}</span>
        </VerticalList>
      </ListItemName>
      <ListItemSeparator/>
      <ListItemButtons>
        <IconButton icon="&#xE90b;" onClick={() => deletePet (pet .get ('id'))} />
        <IconButton icon="&#xE90c;" onClick={() => editPet (pet .get ('id'))} />
      </ListItemButtons>
    </ListItem>
  );
}
