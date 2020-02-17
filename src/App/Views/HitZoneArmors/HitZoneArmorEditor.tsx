import * as React from "react"
import { equals } from "../../../Data/Eq"
import { ident } from "../../../Data/Function"
import { fmap } from "../../../Data/Functor"
import { append, consF, List } from "../../../Data/List"
import { ensure, mapMaybe, Maybe, maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { EditHitZoneArmor } from "../../Models/Hero/EditHitZoneArmor"
import { Item, itemToDropdown } from "../../Models/Hero/Item"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { ItemTemplate, itemTemplateToDropdown } from "../../Models/Wiki/ItemTemplate"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { getLossLevelElements } from "../../Utilities/ItemUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { sortRecordsByName } from "../../Utilities/sortBy"
import { Dialog } from "../Universal/Dialog"
import { TextField } from "../Universal/TextField"
import { HitZoneArmorEditorRow } from "./HitZoneArmorEditorRow"

export interface HitZoneArmorEditorProps {
  armorZonesEditor: Record<EditHitZoneArmor>
  isInHitZoneArmorCreation: Maybe<boolean>
  staticData: StaticDataRecord
  items: Maybe<List<Record<Item>>>
  templates: List<Record<ItemTemplate>>
  addToList (): void
  closeEditor (): void
  saveItem (): void
  setName (value: string): void
  setHead (id: Maybe<string>): void
  setHeadLoss (id: Maybe<number>): void
  setLeftArm (id: Maybe<string>): void
  setLeftArmLoss (id: Maybe<number>): void
  setLeftLeg (id: Maybe<string>): void
  setLeftLegLoss (id: Maybe<number>): void
  setTorso (id: Maybe<string>): void
  setTorsoLoss (id: Maybe<number>): void
  setRightArm (id: Maybe<string>): void
  setRightArmLoss (id: Maybe<number>): void
  setRightLeg (id: Maybe<string>): void
  setRightLegLoss (id: Maybe<number>): void
}

const IA = Item.A
const ITA = ItemTemplate.A
const EHZAA = EditHitZoneArmor.A

export const HitZoneArmorEditor: React.FC<HitZoneArmorEditorProps> = props => {
  const {
    armorZonesEditor,
    closeEditor,
    isInHitZoneArmorCreation,
    items: mitems,
    staticData,
    templates,
    addToList,
    saveItem,
    setHead,
    setHeadLoss,
    setLeftArm,
    setLeftArmLoss,
    setLeftLeg,
    setLeftLegLoss,
    setName,
    setRightArm,
    setRightArmLoss,
    setRightLeg,
    setRightLegLoss,
    setTorso,
    setTorsoLoss,
  } = props

  const armorList =
    pipe_ (
      templates,
      mapMaybe (pipe (ensure (pipe (ITA.gr, equals (4))), fmap (itemTemplateToDropdown))),
      maybe (ident as ident<List<Record<DropdownOption<string>>>>)
            (pipe (
              mapMaybe (pipe (
                ensure ((e: Record<Item>) => IA.gr (e) === 4 && !IA.isTemplateLocked (e)),
                fmap (itemToDropdown)
              )),
              append
            ))
            (mitems),
      sortRecordsByName (staticData),
      consF (DropdownOption ({ name: translate (staticData) ("general.none") }))
    )

  const lossLevels = getLossLevelElements ()

  return (
    <Dialog
      id="armor-zones-editor"
      title={
        Maybe.elem (true) (isInHitZoneArmorCreation)
          ? translate (staticData) ("hitzonearmors.dialogs.addedit.createhitzonearmor")
          : translate (staticData) ("hitzonearmors.dialogs.addedit.edithitzonearmor")
      }
      isOpen
      close={closeEditor}
      buttons={[
        {
          autoWidth: true,
          disabled: EHZAA.name (armorZonesEditor) === "",
          label: translate (staticData) ("general.dialogs.savebtn"),
          onClick: Maybe.elem (true) (isInHitZoneArmorCreation) ? addToList : saveItem,
        },
      ]}
      >
      <div className="main">
        <div className="row">
          <TextField
            className="name"
            label={translate (staticData) ("hitzonearmors.dialogs.addedit.name")}
            value={EHZAA.name (armorZonesEditor)}
            onChange={setName}
            autoFocus={Maybe.elem (true) (isInHitZoneArmorCreation)}
            />
        </div>
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={EHZAA.head (armorZonesEditor)}
          componentLoss={EHZAA.headLoss (armorZonesEditor)}
          staticData={staticData}
          lossLevels={lossLevels}
          name="hitzonearmors.dialogs.addedit.head"
          setComponent={setHead}
          setComponentLoss={setHeadLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={EHZAA.torso (armorZonesEditor)}
          componentLoss={EHZAA.torsoLoss (armorZonesEditor)}
          staticData={staticData}
          lossLevels={lossLevels}
          name="hitzonearmors.dialogs.addedit.torso"
          setComponent={setTorso}
          setComponentLoss={setTorsoLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={EHZAA.leftArm (armorZonesEditor)}
          componentLoss={EHZAA.leftArmLoss (armorZonesEditor)}
          staticData={staticData}
          lossLevels={lossLevels}
          name="hitzonearmors.dialogs.addedit.leftarm"
          setComponent={setLeftArm}
          setComponentLoss={setLeftArmLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={EHZAA.rightArm (armorZonesEditor)}
          componentLoss={EHZAA.rightArmLoss (armorZonesEditor)}
          staticData={staticData}
          lossLevels={lossLevels}
          name="hitzonearmors.dialogs.addedit.rightarm"
          setComponent={setRightArm}
          setComponentLoss={setRightArmLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={EHZAA.leftLeg (armorZonesEditor)}
          componentLoss={EHZAA.leftLegLoss (armorZonesEditor)}
          staticData={staticData}
          lossLevels={lossLevels}
          name="hitzonearmors.dialogs.addedit.leftleg"
          setComponent={setLeftLeg}
          setComponentLoss={setLeftLegLoss}
          />
        <HitZoneArmorEditorRow
          armorList={armorList}
          component={EHZAA.rightLeg (armorZonesEditor)}
          componentLoss={EHZAA.rightLegLoss (armorZonesEditor)}
          staticData={staticData}
          lossLevels={lossLevels}
          name="hitzonearmors.dialogs.addedit.rightleg"
          setComponent={setRightLeg}
          setComponentLoss={setRightLegLoss}
          />
      </div>
    </Dialog>
  )
}
