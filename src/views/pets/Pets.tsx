import * as R from 'ramda';
import * as React from 'react';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { BorderButton } from '../../components/BorderButton';
import { ListView } from '../../components/List';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { PetEditorInstance, PetInstance } from '../../types/data';
import { List, Maybe, OrderedMap, Record } from '../../utils/dataUtils';
import { PetEditor } from './PetEditor';
import { PetsListItem } from './PetsListItem';

export interface PetsOwnProps {
  locale: UIMessagesObject;
}

export interface PetsStateProps {
  pets: Maybe<OrderedMap<string, Record<PetInstance>>>;
  petInEditor: Maybe<Record<PetEditorInstance>>;
  isEditPetAvatarOpen: boolean;
  isInCreation: Maybe<boolean>;
}

export interface PetsDispatchProps {
  addPet (): void;
  createPet (): void;
  editPet (id: string): void;
  closePetEditor (): void;
  savePet (): void;
  deletePet (id: string): void;
  openEditPetAvatar (): void;
  closeEditPetAvatar (): void;

  setAvatar (path: string): void;
  setName (name: string): void;
  setSize (size: string): void;
  setType (type: string): void;
  setSpentAp (spentAp: string): void;
  setTotalAp (totalAp: string): void;
  setCourage (courage: string): void;
  setSagacity (sagacity: string): void;
  setIntuition (intuition: string): void;
  setCharisma (charisma: string): void;
  setDexterity (dexterity: string): void;
  setAgility (agility: string): void;
  setConstitution (constitution: string): void;
  setStrength (strength: string): void;
  setLp (lp: string): void;
  setAe (ae: string): void;
  setSpi (spi: string): void;
  setTou (tou: string): void;
  setPro (pro: string): void;
  setIni (ini: string): void;
  setMov (mov: string): void;
  setAttack (attack: string): void;
  setAt (at: string): void;
  setPa (pa: string): void;
  setDp (dp: string): void;
  setReach (reach: string): void;
  setActions (actions: string): void;
  setSkills (skills: string): void;
  setAbilities (abilities: string): void;
  setNotes (notes: string): void;
}

export type PetsProps = PetsStateProps & PetsDispatchProps & PetsOwnProps;

export function Pets (props: PetsProps) {
  const { createPet, locale, pets } = props;

  return (
    <Page id="pets">
      <PetEditor {...props} />
      {
        Maybe.elem (0) (pets .fmap (OrderedMap.size))
        && (
          <Options>
            <BorderButton
              label={translate (locale, 'actions.addtolist')}
              onClick={createPet}
              />
          </Options>
        )
      }
      <Scroll>
        <ListView>
          {
            Maybe.fromMaybe<NonNullable<React.ReactNode>>
              (<></>)
              (pets .fmap (R.pipe (
                OrderedMap.elems,
                List.map (e => (
                  <PetsListItem {...props} pet={e} key={e .get ('id')} />
                ))
              )))
          }
        </ListView>
      </Scroll>
    </Page>
  );
}
