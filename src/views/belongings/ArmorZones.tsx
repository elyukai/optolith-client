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
import { Purse } from '../../reducers/equipmentReducer';
import { ArmorZonesEditorInstance, ArmorZonesInstance, InputTextEvent, ItemInstance, UIMessages } from '../../types/data';
import { localizeNumber, localizeWeight, translate } from '../../utils/I18n';
import { ArmorZonesEditor } from './ArmorZonesEditor';
import { ArmorZonesListItem } from './ArmorZonesListItem';

export interface ArmorZonesOwnProps {
  locale: UIMessages;
}

export interface ArmorZonesStateProps {
  armorZones: ArmorZonesInstance[];
  carryingCapacity: number;
  initialStartingWealth: number;
  items: ItemInstance[];
  create: boolean | undefined;
  armorZonesEditor: ArmorZonesEditorInstance | undefined;
  hasNoAddedAP: boolean;
  purse: Purse;
  templates: ItemInstance[];
  totalPrice: number;
  totalWeight: number;
  filterText: string;
}

export interface ArmorZonesDispatchProps {
  addToList(): void;
  createItem(): void;
  editItem(id: string): void;
  deleteItem(id: string): void;
  closeEditor(): void;
  saveItem(): void;
  setDucates(value: string): void;
  setSilverthalers(value: string): void;
  setHellers(value: string): void;
  setKreutzers(value: string): void;
  setName(value: string): void;
  setHead(id: string | undefined): void;
  setHeadLoss(id: number | undefined): void;
  setLeftArm(id: string | undefined): void;
  setLeftArmLoss(id: number | undefined): void;
  setLeftLeg(id: string | undefined): void;
  setLeftLegLoss(id: number | undefined): void;
  setTorso(id: string | undefined): void;
  setTorsoLoss(id: number | undefined): void;
  setRightArm(id: string | undefined): void;
  setRightArmLoss(id: number | undefined): void;
  setRightLeg(id: string | undefined): void;
  setRightLegLoss(id: number | undefined): void;
  setFilterText(filterText: string): void;
}

export type ArmorZonesProps = ArmorZonesStateProps & ArmorZonesDispatchProps & ArmorZonesOwnProps;

export class ArmorZones extends React.Component<ArmorZonesProps> {
  filter = (event: InputTextEvent) => this.props.setFilterText(event.target.value);
  setDucates = (event: InputTextEvent) => this.props.setDucates(event.target.value as string);
  setSilverthalers = (event: InputTextEvent) => this.props.setSilverthalers(event.target.value as string);
  setHellers = (event: InputTextEvent) => this.props.setHellers(event.target.value as string);
  setKreutzers = (event: InputTextEvent) => this.props.setKreutzers(event.target.value as string);

  render() {
    const { armorZonesEditor, carryingCapacity, create, initialStartingWealth, armorZones, hasNoAddedAP, locale, purse, totalPrice, totalWeight, filterText } = this.props;

    return (
      <Page id="armor-zones">
        <Options>
          <TextField hint={translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
          <BorderButton label={translate(locale, 'zonearmor.actions.create')} onClick={this.props.createItem} />
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate(locale, 'name')}
            </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <Scroll>
            <ListView>
              {
                armorZones.length === 0 ? <ListPlaceholder locale={locale} type="zoneArmor" noResults={filterText.length > 0} /> : armorZones.map(obj => <ArmorZonesListItem {...this.props} key={obj.id} data={obj} />)
              }
            </ListView>
          </Scroll>
        </MainContent>
        <Aside>
          <div className="purse">
            <h4>{translate(locale, 'equipment.view.purse')}</h4>
            <div className="fields">
              <TextField label={translate(locale, 'equipment.view.ducates')} value={purse.d} onChange={this.setDucates} />
              <TextField label={translate(locale, 'equipment.view.silverthalers')} value={purse.s} onChange={this.setSilverthalers} />
              <TextField label={translate(locale, 'equipment.view.hellers')} value={purse.h} onChange={this.setHellers} />
              <TextField label={translate(locale, 'equipment.view.kreutzers')} value={purse.k} onChange={this.setKreutzers} />
            </div>
          </div>
          <div className="total-points">
            <h4>{hasNoAddedAP && `${translate(locale, 'equipment.view.initialstartingwealth')} & `}{translate(locale, 'equipment.view.carringandliftingcapactity')}</h4>
            <div className="fields">
              {hasNoAddedAP && <div>{localizeNumber(totalPrice, locale.id)} / {localizeNumber(initialStartingWealth, locale.id)} {translate(locale, 'equipment.view.price')}</div>}
              <div>{localizeNumber(localizeWeight(totalWeight, locale.id), locale.id)} / {localizeNumber(localizeWeight(carryingCapacity, locale.id), locale.id)} {translate(locale, 'equipment.view.weight')}</div>
            </div>
          </div>
        </Aside>
        {armorZonesEditor && <ArmorZonesEditor
          {...this.props}
          armorZonesEditor={armorZonesEditor}
          create={create}
          isOpened
          />}
      </Page>
    );
  }
}
