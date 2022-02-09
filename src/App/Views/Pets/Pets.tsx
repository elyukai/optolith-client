import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { map, toArray } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { elems, OrderedMap, size } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { EditPet } from "../../Models/Hero/EditPet"
import { Pet } from "../../Models/Hero/Pet"
import { Attribute } from "../../Models/Wiki/Attribute"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { toNewMaybe } from "../../Utilities/Maybe"
import { pipe } from "../../Utilities/pipe"
import { BorderButton } from "../Universal/BorderButton"
import { ListView } from "../Universal/List"
import { Options } from "../Universal/Options"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"
import { PetEditor } from "./PetEditor"
import { PetsListItem } from "./PetsListItem"

export interface PetsOwnProps {
  staticData: StaticDataRecord
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
  const {
    staticData,

    attributes,
    pets,
    petInEditor,
    isEditPetAvatarOpen,
    isInCreation,

    addPet,
    createPet,
    editPet,
    closePetEditor,
    savePet,
    deletePet,
    openEditPetAvatar,
    closeEditPetAvatar,

    setAvatar,
    deleteAvatar,
    setName,
    setSize,
    setType,
    setSpentAp,
    setTotalAp,
    setCourage,
    setSagacity,
    setIntuition,
    setCharisma,
    setDexterity,
    setAgility,
    setConstitution,
    setStrength,
    setLp,
    setAe,
    setSpi,
    setTou,
    setPro,
    setIni,
    setMov,
    setAttack,
    setAt,
    setPa,
    setDp,
    setReach,
    setActions,
    setSkills,
    setAbilities,
    setNotes,
  } = props

  return (
    <Page id="pets">
      <PetEditor
        attributes={attributes}
        petInEditor={petInEditor}
        staticData={staticData}
        isEditPetAvatarOpen={isEditPetAvatarOpen}
        isInCreation={isInCreation}
        closePetEditor={closePetEditor}
        addPet={addPet}
        savePet={savePet}
        openEditPetAvatar={openEditPetAvatar}
        closeEditPetAvatar={closeEditPetAvatar}
        setAvatar={setAvatar}
        deleteAvatar={deleteAvatar}
        setName={setName}
        setSize={setSize}
        setType={setType}
        setSpentAp={setSpentAp}
        setTotalAp={setTotalAp}
        setCourage={setCourage}
        setSagacity={setSagacity}
        setIntuition={setIntuition}
        setCharisma={setCharisma}
        setDexterity={setDexterity}
        setAgility={setAgility}
        setConstitution={setConstitution}
        setStrength={setStrength}
        setLp={setLp}
        setAe={setAe}
        setSpi={setSpi}
        setTou={setTou}
        setPro={setPro}
        setIni={setIni}
        setMov={setMov}
        setAttack={setAttack}
        setAt={setAt}
        setPa={setPa}
        setDp={setDp}
        setReach={setReach}
        setActions={setActions}
        setSkills={setSkills}
        setAbilities={setAbilities}
        setNotes={setNotes}
        />
      {
        Maybe.elem (0) (fmap (size) (pets))
          ? (
            <Options>
              <BorderButton
                label={translate (staticData) ("general.dialogs.addbtn")}
                onClick={createPet}
                />
            </Options>
          )
          : null
      }
      <Scroll>
        <ListView>
          {toNewMaybe (pets)
            .maybe<React.ReactNode> (null, pipe (
              elems,
              map ((e: Record<Pet>) => (
                <PetsListItem
                  key={Pet.A.id (e)}
                  pet={e}
                  editPet={editPet}
                  deletePet={deletePet}
                  />
              )),
              toArray,
              x => <>{x}</>
            ))}
        </ListView>
      </Scroll>
    </Page>
  )
}
