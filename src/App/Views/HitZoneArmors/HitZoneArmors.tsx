import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { List, map, notNull, toArray } from "../../../Data/List"
import { bindF, ensure, isJust, Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { EditHitZoneArmor } from "../../Models/Hero/EditHitZoneArmor"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { HitZoneArmor } from "../../Models/Hero/HitZoneArmor"
import { Item } from "../../Models/Hero/Item"
import { Purse } from "../../Models/Hero/Purse"
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { PurseAndTotals } from "../Equipment/PurseAndTotals"
import { Aside } from "../Universal/Aside"
import { BorderButton } from "../Universal/BorderButton"
import { ListView } from "../Universal/List"
import { ListHeader } from "../Universal/ListHeader"
import { ListHeaderTag } from "../Universal/ListHeaderTag"
import { ListPlaceholder } from "../Universal/ListPlaceholder"
import { MainContent } from "../Universal/MainContent"
import { Options } from "../Universal/Options"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"
import { SearchField } from "../Universal/SearchField"
import { HitZoneArmorEditor } from "./HitZoneArmorEditor"
import { HitZoneArmorsListItem } from "./HitZoneArmorsListItem"
import { PurseAddRemoveMoney } from "../Equipment/PurseAddRemoveMoney"

export interface HitZoneArmorsOwnProps {
  staticData: StaticDataRecord
  hero: HeroModelRecord
}

export interface HitZoneArmorsStateProps {
  armorZones: Maybe<List<Record<HitZoneArmor>>>
  carryingCapacity: number
  initialStartingWealth: number
  items: Maybe<List<Record<Item>>>
  isInHitZoneArmorCreation: Maybe<boolean>
  armorZonesEditor: Maybe<Record<EditHitZoneArmor>>
  hasNoAddedAP: boolean
  purse: Maybe<Record<Purse>>
  templates: List<Record<ItemTemplate>>
  totalPrice: Maybe<number>
  totalWeight: Maybe<number>
  filterText: string
  isAddRemoveMoneyOpen: boolean
}

export interface HitZoneArmorsDispatchProps {
  addToList (): void
  createItem (): void
  editItem (id: string): void
  deleteItem (id: string): void
  closeEditor (): void
  saveItem (): void
  setDucates (value: string): void
  setSilverthalers (value: string): void
  setHellers (value: string): void
  setKreutzers (value: string): void
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
  setFilterText (filterText: string): void
  setMoney (d: number, s: number, h: number, k: number): void
  openAddRemoveMoney (): void
  closeAddRemoveMoney (): void
}

export type HitZoneArmorsProps =
  HitZoneArmorsStateProps
  & HitZoneArmorsDispatchProps
  & HitZoneArmorsOwnProps

const HZAA = HitZoneArmor.A

export const HitZoneArmors: React.FC<HitZoneArmorsProps> = props => {
  const {
    staticData,
    armorZones,
    carryingCapacity,
    initialStartingWealth,
    items,
    isAddRemoveMoneyOpen,
    isInHitZoneArmorCreation,
    armorZonesEditor,
    hasNoAddedAP,
    purse,
    templates,
    totalPrice,
    totalWeight,
    filterText,
    addToList,
    createItem,
    editItem,
    deleteItem,
    closeEditor,
    saveItem,
    setDucates,
    setSilverthalers,
    setHellers,
    setKreutzers,
    openAddRemoveMoney,
    closeAddRemoveMoney,
    setMoney,
    setName,
    setHead,
    setHeadLoss,
    setLeftArm,
    setLeftArmLoss,
    setLeftLeg,
    setLeftLegLoss,
    setTorso,
    setTorsoLoss,
    setRightArm,
    setRightArmLoss,
    setRightLeg,
    setRightLegLoss,
    setFilterText,
  } = props

  return (
    <Page id="armor-zones">
      <Options>
        <SearchField
          staticData={staticData}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <BorderButton
          label={translate (staticData) ("hitzonearmors.createbtn")}
          onClick={createItem}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (staticData) ("hitzonearmors.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll>
          <ListView>
            {
              Maybe.fromMaybe<NonNullable<React.ReactNode>>
                (
                  <ListPlaceholder
                    staticData={staticData}
                    type="zoneArmor"
                    noResults={filterText.length > 0}
                    />
                )
                (pipe_ (
                  armorZones,
                  bindF (ensure (notNull)),
                  fmap (pipe (
                    map (x => (
                      <HitZoneArmorsListItem
                        key={HZAA.id (x)}
                        data={x}
                        items={items}
                        templates={templates}
                        editItem={editItem}
                        deleteItem={deleteItem}
                        />
                    )),
                    toArray
                  ))
                ))
            }
          </ListView>
        </Scroll>
      </MainContent>
      <Aside>
        <PurseAndTotals
          carryingCapacity={carryingCapacity}
          hasNoAddedAP={hasNoAddedAP}
          initialStartingWealth={initialStartingWealth}
          staticData={staticData}
          purse={purse}
          totalPrice={totalPrice}
          totalWeight={totalWeight}
          setDucates={setDucates}
          setSilverthalers={setSilverthalers}
          setHellers={setHellers}
          setKreutzers={setKreutzers}
          openAddRemoveMoney={openAddRemoveMoney}
          />
      </Aside>
      <PurseAddRemoveMoney
        close={closeAddRemoveMoney}
        isOpen={isAddRemoveMoneyOpen}
        purse={purse}
        setMoney={setMoney}
        staticData={staticData}
        />
      {
        isJust (armorZonesEditor)
          ? (
            <HitZoneArmorEditor
              armorZonesEditor={Maybe.fromJust (armorZonesEditor)}
              isInHitZoneArmorCreation={isInHitZoneArmorCreation}
              staticData={staticData}
              items={items}
              templates={templates}
              addToList={addToList}
              closeEditor={closeEditor}
              saveItem={saveItem}
              setName={setName}
              setHead={setHead}
              setHeadLoss={setHeadLoss}
              setLeftArm={setLeftArm}
              setLeftArmLoss={setLeftArmLoss}
              setLeftLeg={setLeftLeg}
              setLeftLegLoss={setLeftLegLoss}
              setTorso={setTorso}
              setTorsoLoss={setTorsoLoss}
              setRightArm={setRightArm}
              setRightArmLoss={setRightArmLoss}
              setRightLeg={setRightLeg}
              setRightLegLoss={setRightLegLoss}
              />
          )
          : null
      }
    </Page>
  )
}
