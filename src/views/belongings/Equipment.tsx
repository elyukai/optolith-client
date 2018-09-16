import * as React from 'react';
import { Aside } from '../../components/Aside';
import { BorderButton } from '../../components/BorderButton';
import { Dropdown } from '../../components/Dropdown';
import { ListView } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { ListPlaceholder } from '../../components/ListPlaceholder';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { Slidein } from '../../components/Slidein';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { ItemEditorContainer } from '../../containers/ItemEditor';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { Purse } from '../../reducers/equipment';
import { AttributeInstance, InputTextEvent, ItemInstance, UIMessages } from '../../types/data';
import { CombatTechnique } from '../../types/view';
import { sortObjects } from '../../utils/FilterSortUtils';
import { localizeNumber, localizeWeight, translate } from '../../utils/I18n';
import { EquipmentListItem } from './EquipmentListItem';

export interface EquipmentOwnProps {
  locale: UIMessages;
}

export interface EquipmentStateProps {
  attributes: Map<string, AttributeInstance>;
  combatTechniques: CombatTechnique[];
  carryingCapacity: number;
  initialStartingWealth: number;
  items: ItemInstance[];
  hasNoAddedAP: boolean;
  purse: Purse;
  sortOrder: string;
  templates: ItemInstance[];
  totalPrice: number;
  totalWeight: number;
  meleeItemTemplateCombatTechniqueFilter?: string;
  rangedItemTemplateCombatTechniqueFilter?: string;
  filterText: string;
  templatesFilterText: string;
}

export interface EquipmentDispatchProps {
  setSortOrder(option: string): void;
  setDucates(value: string): void;
  setSilverthalers(value: string): void;
  setHellers(value: string): void;
  setKreutzers(value: string): void;
  addTemplateToList(id: string): void;
  createItem(): void;
  deleteItem(id: string): void;
  editItem(id: string): void;
  setMeleeItemTemplatesCombatTechniqueFilter(filterOption: string | undefined): void;
  setRangedItemTemplatesCombatTechniqueFilter(filterOption: string | undefined): void;
  setFilterText(filterText: string): void;
  setTemplatesFilterText(filterText: string): void;
}

export type EquipmentProps = EquipmentStateProps & EquipmentDispatchProps & EquipmentOwnProps;

export interface EquipmentState {
  filterGroupSlidein: number;
  showAddSlidein: boolean;
  currentId?: string;
  currentSlideinId?: string;
}

export class Equipment extends React.Component<EquipmentProps, EquipmentState> {
  state = {
    filterGroupSlidein: 1,
    showAddSlidein: false,
    currentId: undefined,
    currentSlideinId: undefined,
  };

  filter = (event: InputTextEvent) => this.props.setFilterText(event.target.value);
  filterSlidein = (event: InputTextEvent) => this.props.setTemplatesFilterText(event.target.value);
  filterGroupSlidein = (gr: number) => this.setState({ filterGroupSlidein: gr } as EquipmentState);
  sort = (option: string) => this.props.setSortOrder(option);
  setDucates = (event: InputTextEvent) => this.props.setDucates(event.target.value as string);
  setSilverthalers = (event: InputTextEvent) => this.props.setSilverthalers(event.target.value as string);
  setHellers = (event: InputTextEvent) => this.props.setHellers(event.target.value as string);
  setKreutzers = (event: InputTextEvent) => this.props.setKreutzers(event.target.value as string);
  showInfo = (id: string) => this.setState({ currentId: id } as EquipmentState);
  showSlideinInfo = (id: string) => this.setState({ currentSlideinId: id } as EquipmentState);

  showAddSlidein = () => this.setState({ showAddSlidein: true } as EquipmentState);
  hideAddSlidein = () => this.setState({ showAddSlidein: false } as EquipmentState);

  render() {
    const { carryingCapacity, combatTechniques, hasNoAddedAP, initialStartingWealth, items, locale, purse, sortOrder, templates, totalPrice, totalWeight, meleeItemTemplateCombatTechniqueFilter, rangedItemTemplateCombatTechniqueFilter, setMeleeItemTemplatesCombatTechniqueFilter, setRangedItemTemplatesCombatTechniqueFilter, filterText, templatesFilterText } = this.props;
    const { filterGroupSlidein, showAddSlidein } = this.state;

    const groups = translate(locale, 'equipment.view.groups');

    const groupsSelectionItems = sortObjects(groups.map((e, i) => ({ id: i + 1, name: e })), locale.id);

    const filterTemplatesByIsActiveAndInGroup = (e: ItemInstance): boolean => {
      const isGroup = e.gr === filterGroupSlidein;
      let isCombatTechnique = true;
      if (meleeItemTemplateCombatTechniqueFilter !== undefined && e.gr === 1) {
        isCombatTechnique = e.combatTechnique === meleeItemTemplateCombatTechniqueFilter;
      }
      else if (rangedItemTemplateCombatTechniqueFilter !== undefined && e.gr === 2) {
        isCombatTechnique = e.combatTechnique === rangedItemTemplateCombatTechniqueFilter;
      }
      const isNotInList = !items.find(item => item.template === e.template && item.isTemplateLocked);
      return isGroup && isCombatTechnique && isNotInList;
    };

    const filterTemplatesByIsActive = (e: ItemInstance): boolean => {
      return !items.find(item => item.template === e.template && item.isTemplateLocked);
    };

    const combatTechniquesList = sortObjects(combatTechniques, locale.id);
    const meleeCombatTechniques = combatTechniquesList.filter(e => e.gr === 1);
    const rangedCombatTechniques = combatTechniquesList.filter(e => e.gr === 2);
    const templateList = templatesFilterText.length === 0 ? templates.filter(filterTemplatesByIsActiveAndInGroup) : templates.filter(filterTemplatesByIsActive);

    return (
      <Page id="equipment">
        <Slidein isOpened={showAddSlidein} close={this.hideAddSlidein}>
          <Options>
            <TextField hint={translate(locale, 'options.filtertext')} value={templatesFilterText} onChange={this.filterSlidein} fullWidth />
            <Dropdown
              value={filterGroupSlidein}
              onChange={this.filterGroupSlidein}
              options={groupsSelectionItems}
              fullWidth
              />
            {filterGroupSlidein === 1 && <Dropdown
              value={meleeItemTemplateCombatTechniqueFilter}
              onChange={setMeleeItemTemplatesCombatTechniqueFilter}
              options={[
                { name: translate(locale, 'allcombattechniques') },
                ...meleeCombatTechniques
              ]}
              fullWidth
              />}
            {filterGroupSlidein === 2 && <Dropdown
              value={rangedItemTemplateCombatTechniqueFilter}
              onChange={setRangedItemTemplatesCombatTechniqueFilter}
              options={[
                { name: translate(locale, 'allcombattechniques') },
                ...rangedCombatTechniques
              ]}
              fullWidth
              />}
          </Options>
          <MainContent>
            <ListHeader>
              <ListHeaderTag className="name">
                {translate(locale, 'name')}
              </ListHeaderTag>
              <ListHeaderTag className="btn-placeholder" />
            </ListHeader>
            <Scroll>
              <ListView>
                {
                  templateList.length === 0 ? <ListPlaceholder locale={locale} type="itemTemplates" noResults /> : templateList.map(obj => <EquipmentListItem {...this.props} key={obj.id} data={obj} add selectForInfo={this.showSlideinInfo} />)
                }
              </ListView>
            </Scroll>
          </MainContent>
          <WikiInfoContainer {...this.props} currentId={this.state.currentSlideinId} />
        </Slidein>
        <Options>
          <TextField hint={translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
          <SortOptions
            options={[ 'name', 'groupname', 'where', 'weight' ]}
            sortOrder={sortOrder}
            sort={this.sort}
            locale={locale}
            />
          <BorderButton label={translate(locale, 'actions.addtolist')} onClick={this.showAddSlidein} />
          <BorderButton label={translate(locale, 'equipment.actions.create')} onClick={this.props.createItem} />
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate(locale, 'name')}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate(locale, 'group')}
              </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <Scroll>
            <ListView>
              {
                items.length === 0 ? <ListPlaceholder locale={locale} type="equipment" noResults={filterText.length > 0} /> : items.map(obj => <EquipmentListItem {...this.props} key={obj.id} data={obj} selectForInfo={this.showInfo} />)
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
          <WikiInfoContainer {...this.props} {...this.state} noWrapper />
        </Aside>
        <ItemEditorContainer locale={locale} />
      </Page>
    );
  }
}
