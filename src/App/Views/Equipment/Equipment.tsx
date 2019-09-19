import * as React from "react";
import { notP } from "../../../Data/Bool";
import { equals } from "../../../Data/Eq";
import { fmap } from "../../../Data/Functor";
import { any, cons, filter, List, map, notNull, toArray } from "../../../Data/List";
import { bindF, elem, ensure, fromJust, fromMaybe, isJust, Just, mapMaybe, Maybe, Nothing } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { ItemEditorContainer } from "../../Containers/ItemEditorContainer";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { fromItemTemplate, Item } from "../../Models/Hero/Item";
import { Purse } from "../../Models/Hero/Purse";
import { CombatTechniqueWithRequirements, CombatTechniqueWithRequirementsA_ } from "../../Models/View/CombatTechniqueWithRequirements";
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { Aside } from "../Universal/Aside";
import { BorderButton } from "../Universal/BorderButton";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { ListView } from "../Universal/List";
import { ListHeader } from "../Universal/ListHeader";
import { ListHeaderTag } from "../Universal/ListHeaderTag";
import { ListPlaceholder } from "../Universal/ListPlaceholder";
import { MainContent } from "../Universal/MainContent";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { Slidein } from "../Universal/Slidein";
import { SortNames, SortOptions } from "../Universal/SortOptions";
import { TextField } from "../Universal/TextField";
import { EquipmentListItem } from "./EquipmentListItem";
import { PurseAndTotals } from "./PurseAndTotals";

export interface EquipmentOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface EquipmentStateProps {
  combatTechniques: Maybe<List<Record<CombatTechniqueWithRequirements>>>
  carryingCapacity: Maybe<number>
  initialStartingWealth: number
  items: Maybe<List<Record<Item>>>
  hasNoAddedAP: boolean
  purse: Maybe<Record<Purse>>
  sortOrder: SortNames
  templates: List<Record<ItemTemplate>>
  totalPrice: Maybe<number>
  totalWeight: Maybe<number>
  meleeItemTemplateCombatTechniqueFilter: Maybe<string>
  rangedItemTemplateCombatTechniqueFilter: Maybe<string>
  filterText: string
  templatesFilterText: string
  filteredEquipmentGroups: List<Record<DropdownOption>>
}

export interface EquipmentDispatchProps {
  setSortOrder (option: SortNames): void
  setDucates (value: string): void
  setSilverthalers (value: string): void
  setHellers (value: string): void
  setKreutzers (value: string): void
  addTemplateToList (id: string): void
  createItem (): void
  deleteItem (id: string): void
  editItem (id: string): void
  setMeleeItemTemplatesCombatTechniqueFilter (filterOption: Maybe<string>): void
  setRangedItemTemplatesCombatTechniqueFilter (filterOption: Maybe<string>): void
  setFilterText (filterText: string): void
  setTemplatesFilterText (filterText: string): void
}

export type EquipmentProps = EquipmentStateProps & EquipmentDispatchProps & EquipmentOwnProps

export interface EquipmentState {
  filterGroupSlidein: number
  showAddSlidein: boolean
  currentId: Maybe<string>
  currentSlideinId: Maybe<string>
}

const CTWRA_ = CombatTechniqueWithRequirementsA_
const ITA = ItemTemplate.A
const IA = Item.A

const prepareCombatTechniquesForSelection =
  (gr: number) =>
  (mxs: Maybe<List<Record<CombatTechniqueWithRequirements>>>) =>
    pipe_ (
      mxs,
      fmap (mapMaybe (pipe (
                            ensure (pipe (CTWRA_.gr, equals (gr))),
                            fmap (x => DropdownOption ({
                                          id: Just (CTWRA_.id (x)),
                                          name: CTWRA_.name (x),
                                        }))))),
      fromMaybe (List ())
    )

export class Equipment extends React.Component<EquipmentProps, EquipmentState> {
  state = {
    filterGroupSlidein: 1,
    showAddSlidein: false,
    currentId: Nothing,
    currentSlideinId: Nothing,
  }

  filterGroupSlidein = (gr: Maybe<number>) => {
    if (isJust (gr)) {
      this.setState ({ filterGroupSlidein: fromJust (gr) })
    }
  }
  showInfo = (id: string) => this.setState ({ currentId: Just (id) })
  showSlideinInfo = (id: string) => this.setState ({ currentSlideinId: Just (id) })

  showAddSlidein = () => this.setState ({ showAddSlidein: true })
  hideAddSlidein = () => this.setState ({ showAddSlidein: false })

  render () {
    const {
      combatTechniques: maybeCombatTechniques,
      items: mitems,
      l10n,
      sortOrder,
      templates,
      meleeItemTemplateCombatTechniqueFilter,
      rangedItemTemplateCombatTechniqueFilter,
      setMeleeItemTemplatesCombatTechniqueFilter,
      setRangedItemTemplatesCombatTechniqueFilter,
      filterText,
      templatesFilterText,
      filteredEquipmentGroups,
    } = this.props

    const { filterGroupSlidein, showAddSlidein } = this.state

    const getHasValidCombatTechnique = (e: Record<ItemTemplate>) =>
      isJust (meleeItemTemplateCombatTechniqueFilter) && ITA.gr (e) === 1
        ? elem (fromJust (meleeItemTemplateCombatTechniqueFilter))
               (ITA.combatTechnique (e))
        : isJust (rangedItemTemplateCombatTechniqueFilter) && ITA.gr (e) === 2
        ? elem (fromJust (rangedItemTemplateCombatTechniqueFilter))
               (ITA.combatTechnique (e))
        : true

    const filterTemplatesByIsActive = (e: Record<ItemTemplate>): boolean =>
        Maybe.any (notP (any (
               (item: Record<Item>) => elem (ITA.template (e)) (IA.template (item))
                                       && IA.isTemplateLocked (item)
             )))
             (mitems)

    const filterTemplatesByIsActiveAndInGroup = (e: Record<ItemTemplate>): boolean => {
      const isGroup = ITA.gr (e) === filterGroupSlidein
      const hasValidCombatTechnique = getHasValidCombatTechnique (e)
      const isNotInList = filterTemplatesByIsActive (e)

      return isGroup && hasValidCombatTechnique && isNotInList
    }

    const meleeCombatTechniques = prepareCombatTechniquesForSelection (1) (maybeCombatTechniques)
    const rangedCombatTechniques = prepareCombatTechniquesForSelection (2) (maybeCombatTechniques)

    const templateList =
      templatesFilterText.length === 0
        ? filter (filterTemplatesByIsActiveAndInGroup) (templates)
        : filter (filterTemplatesByIsActive) (templates)

    return (
      <Page id="equipment">
        <Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
          <Options>
            <TextField
              hint={translate (l10n) ("search")}
              value={templatesFilterText}
              onChange={this.props.setTemplatesFilterText}
              fullWidth
              />
            <Dropdown
              value={Just (filterGroupSlidein)}
              onChange={this.filterGroupSlidein}
              options={filteredEquipmentGroups}
              fullWidth
              />
            {filterGroupSlidein === 1
              ? <Dropdown
                  value={meleeItemTemplateCombatTechniqueFilter}
                  onChange={setMeleeItemTemplatesCombatTechniqueFilter}
                  options={
                    cons (meleeCombatTechniques)
                         (DropdownOption ({
                           name: translate (l10n) ("allcombattechniques"),
                         }))
                  }
                  fullWidth
                  />
              : null}
            {filterGroupSlidein === 2
              ? <Dropdown
                  value={rangedItemTemplateCombatTechniqueFilter}
                  onChange={setRangedItemTemplatesCombatTechniqueFilter}
                  options={
                    cons (rangedCombatTechniques)
                         (DropdownOption ({
                           name: translate (l10n) ("allcombattechniques"),
                         }))
                  }
                  fullWidth
                  />
              : null}
          </Options>
          <MainContent>
            <ListHeader>
              <ListHeaderTag className="name">
                {translate (l10n) ("name")}
              </ListHeaderTag>
              <ListHeaderTag className="btn-placeholder" />
            </ListHeader>
            <Scroll>
              <ListView>
                {pipe_ (
                  templateList,
                  ensure (notNull),
                  fmap (pipe (
                    map (
                      obj => (
                        <EquipmentListItem
                          {...this.props}
                          key={ITA.id (obj)}
                          data={fromItemTemplate (ITA.id (obj)) (obj)}
                          selectForInfo={this.showSlideinInfo}
                          selectedForInfo={this.state.currentSlideinId}
                          add
                          />
                      )
                    ),
                    toArray,
                    arr => <>{arr}</>
                  )),
                  fromMaybe (<ListPlaceholder l10n={l10n} type="itemTemplates" noResults />)
                )}
              </ListView>
            </Scroll>
          </MainContent>
          <WikiInfoContainer {...this.props} currentId={this.state.currentSlideinId} />
        </Slidein>
        <Options>
          <TextField
            hint={translate (l10n) ("search")}
            value={filterText}
            onChange={this.props.setFilterText}
            fullWidth
            />
          <SortOptions
            options={List<SortNames> ("name", "groupname", "where", "weight")}
            sortOrder={sortOrder}
            sort={this.props.setSortOrder}
            l10n={l10n}
            />
          <BorderButton
            label={translate (l10n) ("add")}
            onClick={this.showAddSlidein}
            />
          <BorderButton
            label={translate (l10n) ("create")}
            onClick={this.props.createItem}
            />
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (l10n) ("name")}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (l10n) ("group")}
              </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <Scroll>
            <ListView>
              {pipe_ (
                mitems,
                bindF (ensure (notNull)),
                fmap (pipe (
                  map (
                    obj => (
                      <EquipmentListItem
                        {...this.props}
                        key={IA.id (obj)}
                        data={obj}
                        selectForInfo={this.showInfo}
                        selectedForInfo={this.state.currentId}
                        />
                    )
                  ),
                  toArray,
                  arr => <>{arr}</>
                )),
                fromMaybe (<ListPlaceholder
                              l10n={l10n}
                              type="equipment"
                              noResults={filterText.length > 0}
                              />)
              )}
            </ListView>
          </Scroll>
        </MainContent>
        <Aside>
          <PurseAndTotals {...this.props} />
          <WikiInfoContainer {...this.props} {...this.state} noWrapper />
        </Aside>
        <ItemEditorContainer l10n={l10n} />
      </Page>
    )
  }
}
