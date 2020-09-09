import * as React from "react"
import { DerivedCharacteristicId } from "../../../../app/Database/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { fmap } from "../../../Data/Functor"
import { fromJust, isJust, isNothing, Maybe } from "../../../Data/Maybe"
import { lookup, lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { AttrId } from "../../Constants/Ids"
import { EditPet } from "../../Models/Hero/EditPet"
import { Attribute } from "../../Models/Wiki/Attribute"
import { DerivedCharacteristic } from "../../Models/Wiki/DerivedCharacteristic"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe } from "../../Utilities/pipe"
import { renderMaybe } from "../../Utilities/ReactUtils"
import { AvatarChange } from "../Universal/AvatarChange"
import { AvatarWrapper } from "../Universal/AvatarWrapper"
import { BorderButton } from "../Universal/BorderButton"
import { Slidein } from "../Universal/Slidein"
import { TextField } from "../Universal/TextField"

const SDA = StaticData.A
const EPA = EditPet.A

const getAttrShort =
  (attrs: StaticData["attributes"]) =>
    pipe (lookupF (attrs), fmap (Attribute.A.short), renderMaybe)

const getDCShort =
  (id: DerivedCharacteristicId) =>
    pipe (
      SDA.derivedCharacteristics,
      lookup (id),
      fmap (DerivedCharacteristic.A.short),
      renderMaybe
    )

export interface PetEditorProps {
  attributes: StaticData["attributes"]
  petInEditor: Maybe<Record<EditPet>>
  staticData: StaticDataRecord
  isEditPetAvatarOpen: boolean
  isInCreation: Maybe<boolean>

  closePetEditor (): void
  addPet (): void
  savePet (): void
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

export function PetEditor (props: PetEditorProps) {
  const {
    attributes,
    petInEditor: mpet_in_editor,
    staticData,
    isEditPetAvatarOpen,
    isInCreation,

    closePetEditor,
    addPet,
    savePet,
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

  if (isJust (mpet_in_editor)) {
    const pet = fromJust (mpet_in_editor)

    return (
      <Slidein isOpen close={closePetEditor}>
        <div className="pet-edit">
          <div className="left">
            <AvatarWrapper src={EPA.avatar (pet)} onClick={openEditPetAvatar} />
            <BorderButton
              className="delete-avatar"
              label={translate (staticData) ("pets.dialogs.addedit.deleteavatarbtn")}
              onClick={deleteAvatar}
              disabled={isNothing (EPA.avatar (pet))}
              />
          </div>
          <div className="right">
            <div className="row">
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.name")}
                value={EPA.name (pet)}
                onChange={setName}
                />
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.sizecategory")}
                value={EPA.size (pet)}
                onChange={setSize}
                />
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.type")}
                value={EPA.type (pet)}
                onChange={setType}
                />
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.apspent")}
                value={EPA.spentAp (pet)}
                onChange={setSpentAp}
                />
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.totalap")}
                value={EPA.totalAp (pet)}
                onChange={setTotalAp}
                />
            </div>
            <div className="row">
              <TextField
                label={getAttrShort (attributes) (AttrId.Courage)}
                value={EPA.cou (pet)}
                onChange={setCourage}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Sagacity)}
                value={EPA.sgc (pet)}
                onChange={setSagacity}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Intuition)}
                value={EPA.int (pet)}
                onChange={setIntuition}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Charisma)}
                value={EPA.cha (pet)}
                onChange={setCharisma}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Dexterity)}
                value={EPA.dex (pet)}
                onChange={setDexterity}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Agility)}
                value={EPA.agi (pet)}
                onChange={setAgility}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Constitution)}
                value={EPA.con (pet)}
                onChange={setConstitution}
                />
              <TextField
                label={getAttrShort (attributes) (AttrId.Strength)}
                value={EPA.str (pet)}
                onChange={setStrength}
                />
            </div>
            <div className="row">
              <TextField
                label={getDCShort ("LP") (staticData)}
                value={EPA.lp (pet)}
                onChange={setLp}
                />
              <TextField
                label={getDCShort ("AE") (staticData)}
                value={EPA.ae (pet)}
                onChange={setAe}
                />
              <TextField
                label={getDCShort ("SPI") (staticData)}
                value={EPA.spi (pet)}
                onChange={setSpi}
                />
              <TextField
                label={getDCShort ("TOU") (staticData)}
                value={EPA.tou (pet)}
                onChange={setTou}
                />
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.protection")}
                value={EPA.pro (pet)}
                onChange={setPro}
                />
              <TextField
                label={getDCShort ("INI") (staticData)}
                value={EPA.ini (pet)}
                onChange={setIni}
                />
              <TextField
                label={getDCShort ("MOV") (staticData)}
                value={EPA.mov (pet)}
                onChange={setMov}
                />
            </div>
            <div className="row">
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.attackname")}
                value={EPA.attack (pet)}
                onChange={setAttack}
                />
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.attack")}
                value={EPA.at (pet)}
                onChange={setAt}
                />
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.parry")}
                value={EPA.pa (pet)}
                onChange={setPa}
                />
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.damagepoints")}
                value={EPA.dp (pet)}
                onChange={setDp}
                />
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.reach")}
                value={EPA.reach (pet)}
                onChange={setReach}
                />
            </div>
            <div className="row">
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.actions")}
                value={EPA.actions (pet)}
                onChange={setActions}
                />
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.skills")}
                value={EPA.talents (pet)}
                onChange={setSkills}
                />
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.specialabilities")}
                value={EPA.skills (pet)}
                onChange={setAbilities}
                />
            </div>
            <div className="row">
              <TextField
                label={translate (staticData) ("pets.dialogs.addedit.notes")}
                value={EPA.notes (pet)}
                onChange={setNotes}
                />
            </div>
            {Maybe.elem (true) (isInCreation)
              ? (
                <BorderButton
                  label={translate (staticData) ("pets.dialogs.addedit.addbtn")}
                  onClick={addPet}
                  />
              )
              : (
                <BorderButton
                  label={translate (staticData) ("pets.dialogs.addedit.savebtn")}
                  onClick={savePet}
                  />
              )}
          </div>
        </div>
        <AvatarChange
          staticData={staticData}
          setPath={setAvatar}
          close={closeEditPetAvatar}
          isOpen={isEditPetAvatarOpen}
          />
      </Slidein>
    )
  }

  return null
}
