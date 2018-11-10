import * as R from 'ramda';
import * as React from 'react';
import { Aside } from '../../components/Aside';
import { BorderButton } from '../../components/BorderButton';
import { ListView } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { ListPlaceholder } from '../../components/ListPlaceholder';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { ArmorZonesEditorInstance, ArmorZonesInstance, ItemInstance, Purse } from '../../types/data';
import { ItemTemplate } from '../../types/wiki';
import { List, Maybe, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { PurseAndTotals } from '../equipment/PurseAndTotals';
import { HitZoneArmorEditor } from './HitZoneArmorEditor';
import { HitZoneArmorsListItem } from './HitZoneArmorsListItem';

export interface HitZoneArmorsOwnProps {
  locale: UIMessagesObject;
}

export interface HitZoneArmorsStateProps {
  armorZones: Maybe<List<Record<ArmorZonesInstance>>>;
  carryingCapacity: Maybe<number>;
  initialStartingWealth: number;
  items: Maybe<List<Record<ItemInstance>>>;
  isInHitZoneArmorCreation: Maybe<boolean>;
  armorZonesEditor: Maybe<Record<ArmorZonesEditorInstance>>;
  hasNoAddedAP: boolean;
  purse: Maybe<Record<Purse>>;
  templates: List<Record<ItemTemplate>>;
  totalPrice: Maybe<number>;
  totalWeight: Maybe<number>;
  filterText: string;
}

export interface HitZoneArmorsDispatchProps {
  addToList (): void;
  createItem (): void;
  editItem (id: string): void;
  deleteItem (id: string): void;
  closeEditor (): void;
  saveItem (): void;
  setDucates (value: string): void;
  setSilverthalers (value: string): void;
  setHellers (value: string): void;
  setKreutzers (value: string): void;
  setName (value: string): void;
  setHead (id: Maybe<string>): void;
  setHeadLoss (id: Maybe<number>): void;
  setLeftArm (id: Maybe<string>): void;
  setLeftArmLoss (id: Maybe<number>): void;
  setLeftLeg (id: Maybe<string>): void;
  setLeftLegLoss (id: Maybe<number>): void;
  setTorso (id: Maybe<string>): void;
  setTorsoLoss (id: Maybe<number>): void;
  setRightArm (id: Maybe<string>): void;
  setRightArmLoss (id: Maybe<number>): void;
  setRightLeg (id: Maybe<string>): void;
  setRightLegLoss (id: Maybe<number>): void;
  setFilterText (filterText: string): void;
}

export type HitZoneArmorsProps =
  HitZoneArmorsStateProps
  & HitZoneArmorsDispatchProps
  & HitZoneArmorsOwnProps;

export function HitZoneArmors (props: HitZoneArmorsProps) {
  const {
    armorZonesEditor,
    armorZones,
    isInHitZoneArmorCreation,
    locale,
    filterText,
  } = props;

  return (
    <Page id="armor-zones">
      <Options>
        <TextField
          hint={translate (locale, 'options.filtertext')}
          value={filterText}
          onChangeString={props.setFilterText}
          fullWidth
          />
        <BorderButton
          label={translate (locale, 'zonearmor.actions.create')}
          onClick={props.createItem}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (locale, 'name')}
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
                    locale={locale}
                    type="zoneArmor"
                    noResults={filterText.length > 0}
                    />
                )
                (armorZones
                  .bind (Maybe.ensure<List<Record<ArmorZonesInstance>>> (R.pipe (List.null, R.not)))
                  .fmap (R.pipe (
                    List.map (
                      obj => (<HitZoneArmorsListItem {...props} key={obj .get ('id')} data={obj} />)
                    ),
                    List.toArray
                  )))
            }
          </ListView>
        </Scroll>
      </MainContent>
      <Aside>
        <PurseAndTotals {...props} />
      </Aside>
      {
        Maybe.isJust (armorZonesEditor)
        && (
          <HitZoneArmorEditor
            {...props}
            armorZonesEditor={Maybe.fromJust (armorZonesEditor)}
            isInHitZoneArmorCreation={isInHitZoneArmorCreation}
            />
        )
      }
    </Page>
  );
}
