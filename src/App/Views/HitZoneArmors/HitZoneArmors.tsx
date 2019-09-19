import * as React from "react";
import { fmap } from "../../../Data/Functor";
import { List, map, notNull, toArray } from "../../../Data/List";
import { bindF, ensure, isJust, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { EditHitZoneArmor } from "../../Models/Hero/EditHitZoneArmor";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { HitZoneArmor } from "../../Models/Hero/HitZoneArmor";
import { Item } from "../../Models/Hero/Item";
import { Purse } from "../../Models/Hero/Purse";
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { PurseAndTotals } from "../Equipment/PurseAndTotals";
import { Aside } from "../Universal/Aside";
import { BorderButton } from "../Universal/BorderButton";
import { ListView } from "../Universal/List";
import { ListHeader } from "../Universal/ListHeader";
import { ListHeaderTag } from "../Universal/ListHeaderTag";
import { ListPlaceholder } from "../Universal/ListPlaceholder";
import { MainContent } from "../Universal/MainContent";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { TextField } from "../Universal/TextField";
import { HitZoneArmorEditor } from "./HitZoneArmorEditor";
import { HitZoneArmorsListItem } from "./HitZoneArmorsListItem";

export interface HitZoneArmorsOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface HitZoneArmorsStateProps {
  armorZones: Maybe<List<Record<HitZoneArmor>>>
  carryingCapacity: Maybe<number>
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
}

export type HitZoneArmorsProps =
  HitZoneArmorsStateProps
  & HitZoneArmorsDispatchProps
  & HitZoneArmorsOwnProps

const HZAA = HitZoneArmor.A

export function HitZoneArmors (props: HitZoneArmorsProps) {
  const {
    armorZonesEditor,
    armorZones,
    isInHitZoneArmorCreation,
    l10n,
    filterText,
  } = props

  return (
    <Page id="armor-zones">
      <Options>
        <TextField
          hint={translate (l10n) ("search")}
          value={filterText}
          onChange={props.setFilterText}
          fullWidth
          />
        <BorderButton
          label={translate (l10n) ("create")}
          onClick={props.createItem}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (l10n) ("name")}
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
                    l10n={l10n}
                    type="zoneArmor"
                    noResults={filterText.length > 0}
                    />
                )
                (pipe_ (
                  armorZones,
                  bindF (ensure (notNull)),
                  fmap (pipe (
                    map (x => <HitZoneArmorsListItem {...props} key={HZAA.id (x)} data={x} />),
                    toArray
                  ))
                ))
            }
          </ListView>
        </Scroll>
      </MainContent>
      <Aside>
        <PurseAndTotals {...props} />
      </Aside>
      {
        isJust (armorZonesEditor)
          ? (
            <HitZoneArmorEditor
              {...props}
              armorZonesEditor={Maybe.fromJust (armorZonesEditor)}
              isInHitZoneArmorCreation={isInHitZoneArmorCreation}
              />
          )
          : null
      }
    </Page>
  )
}
