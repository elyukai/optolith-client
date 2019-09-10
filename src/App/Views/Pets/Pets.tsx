import * as React from "react";
import { fmap } from "../../../Data/Functor";
import { map, toArray } from "../../../Data/List";
import { fromMaybe, Maybe } from "../../../Data/Maybe";
import { elems, OrderedMap, size } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { EditPet } from "../../Models/Hero/EditPet";
import { Pet } from "../../Models/Hero/Pet";
import { Attribute } from "../../Models/Wiki/Attribute";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { BorderButton } from "../Universal/BorderButton";
import { ListView } from "../Universal/List";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { PetEditor } from "./PetEditor";
import { PetsListItem } from "./PetsListItem";
import { ReactReturn } from "../../Utilities/ReactUtils";

export interface PetsOwnProps {
  l10n: L10nRecord
}

export interface PetsStateProps {
  attributes: OrderedMap<string, Record<Attribute>>
  pets: Maybe<OrderedMap<string, Record<Pet>>>
  petInEditor: Maybe<Record<EditPet>>
  isEditPetAvatarOpen: boolean
  isInCreation: Maybe<boolean>
}

export interface PetsDispatchProps {
  addPet (): void
  createPet (): void
  editPet (id: string): void
  closePetEditor (): void
  savePet (): void
  deletePet (id: string): void
  openEditPetAvatar (): void
  closeEditPetAvatar (): void

  setAvatar (path: string): void
  deleteAvatar (): void
  setName (name: string): void
  setSize (size: string): void
  setType (type: string): void
  setSpentAp (spentAp: string): void
  setTotalAp (totalAp: string): void
  setCourage (courage: string): void
  setSagacity (sagacity: string): void
  setIntuition (intuition: string): void
  setCharisma (charisma: string): void
  setDexterity (dexterity: string): void
  setAgility (agility: string): void
  setConstitution (constitution: string): void
  setStrength (strength: string): void
  setLp (lp: string): void
  setAe (ae: string): void
  setSpi (spi: string): void
  setTou (tou: string): void
  setPro (pro: string): void
  setIni (ini: string): void
  setMov (mov: string): void
  setAttack (attack: string): void
  setAt (at: string): void
  setPa (pa: string): void
  setDp (dp: string): void
  setReach (reach: string): void
  setActions (actions: string): void
  setSkills (skills: string): void
  setAbilities (abilities: string): void
  setNotes (notes: string): void
}

export type PetsProps = PetsStateProps & PetsDispatchProps & PetsOwnProps

export function Pets (props: PetsProps) {
  const { createPet, l10n, pets } = props

  return (
    <Page id="pets">
      <PetEditor {...props} />
      {
        Maybe.elem (0) (fmap (size) (pets))
          ? (
            <Options>
              <BorderButton
                label={translate (l10n) ("add")}
                onClick={createPet}
                />
            </Options>
          )
          : null
      }
      <Scroll>
        <ListView>
          {pipe_ (
            pets,
            fmap (pipe (
              elems,
              map (e => <PetsListItem {...props} pet={e} key={Pet.A.id (e)} />),
              toArray,
              x => <>{x}</>
            )),
            fromMaybe (null as ReactReturn)
          )}
        </ListView>
      </Scroll>
    </Page>
  )
}
