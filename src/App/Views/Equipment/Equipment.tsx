import * as React from "react"
import { notP } from "../../../Data/Bool"
import { equals } from "../../../Data/Eq"
import { fmap } from "../../../Data/Functor"
import { any, cons, filter, List, map, notNull, toArray } from "../../../Data/List"
import { bindF, elem, ensure, fromJust, fromMaybe, isJust, Just, mapMaybe, Maybe, Nothing } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { MeleeCombatTechniqueId, RangedCombatTechniqueId } from "../../Constants/Ids"
import { ItemEditorContainer } from "../../Containers/ItemEditorContainer"
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { fromItemTemplate, Item } from "../../Models/Hero/Item"
import { Purse } from "../../Models/Hero/Purse"
import { CombatTechniqueWithRequirements, CombatTechniqueWithRequirementsA_ } from "../../Models/View/CombatTechniqueWithRequirements"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { Aside } from "../Universal/Aside"
import { BorderButton } from "../Universal/BorderButton"
import { Dropdown } from "../Universal/Dropdown"
import { ListView } from "../Universal/List"
import { ListHeader } from "../Universal/ListHeader"
import { ListHeaderTag } from "../Universal/ListHeaderTag"
import { ListPlaceholder } from "../Universal/ListPlaceholder"
import { MainContent } from "../Universal/MainContent"
import { Options } from "../Universal/Options"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"
import { SearchField } from "../Universal/SearchField"
import { Slidein } from "../Universal/Slidein"
import { SortNames, SortOptions } from "../Universal/SortOptions"
import { EquipmentListItem } from "./EquipmentListItem"
import { PurseAndTotals } from "./PurseAndTotals"
import { PurseAddRemoveMoney } from "./PurseAddRemoveMoney"

export interface EquipmentOwnProps {
  staticData: StaticDataRecord
  hero: HeroModelRecord
}

export interface EquipmentStateProps {
  combatTechniques: Maybe<List<Record<CombatTechniqueWithRequirements>>>
  carryingCapacity: number
  initialStartingWealth: number
  items: Maybe<List<Record<Item>>>
  hasNoAddedAP: boolean
  purse: Maybe<Record<Purse>>
  sortOrder: SortNames
  templates: List<Record<ItemTemplate>>
  totalPrice: Maybe<number>
  totalWeight: Maybe<number>
  meleeItemTemplateCombatTechniqueFilter: Maybe<MeleeCombatTechniqueId>
  rangedItemTemplateCombatTechniqueFilter: Maybe<RangedCombatTechniqueId>
  filterText: string
  templatesFilterText: string
  filteredEquipmentGroups: List<Record<DropdownOption<number>>>
  isAddRemoveMoneyOpen: boolean
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
  setMeleeItemTemplatesCombatTechniqueFilter (filterOption: Maybe<MeleeCombatTechniqueId>): void
  setRangedItemTemplatesCombatTechniqueFilter (filterOption: Maybe<RangedCombatTechniqueId>): void
  setFilterText (filterText: string): void
  setTemplatesFilterText (filterText: string): void
  setMoney (d: number, w: number, h: number, k: number): void
  openAddRemoveMoney (): void
  closeAddRemoveMoney (): void
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
                                        }))
                           ))),
      fromMaybe (List ())
    )

export const Equipment: React.FC<EquipmentProps> = props => {
  const [ filterGroupSlidein, setFilterGroupSlidein ] = React.useState (1)
  const [ showAddSlidein, setShowAddSlidein ] = React.useState (false)
  const [ infoId, setInfoId ] = React.useState<Maybe<string>> (Nothing)
  const [ slideinInfoId, setSlideinInfoId ] = React.useState<Maybe<string>> (Nothing)

  const handleShowInfo = React.useCallback (
    (id: string) => setInfoId (Just (id)),
    [ setInfoId ]
  )

  const handleShowSlideinInfo = React.useCallback (
    (id: string) => setSlideinInfoId (Just (id)),
    [ setSlideinInfoId ]
  )

  const handleShowSlidein = React.useCallback (
    () => setShowAddSlidein (true),
    [ setShowAddSlidein ]
  )

  const handleHideSlidein = React.useCallback (
    () => setShowAddSlidein (false),
    [ setShowAddSlidein ]
  )

  const {
    staticData,
    combatTechniques: maybeCombatTechniques,
    carryingCapacity,
    initialStartingWealth,
    items: mitems,
    hasNoAddedAP,
    purse,
    sortOrder,
    templates,
    totalPrice,
    totalWeight,
    meleeItemTemplateCombatTechniqueFilter,
    rangedItemTemplateCombatTechniqueFilter,
    filterText,
    templatesFilterText,
    filteredEquipmentGroups,
    isAddRemoveMoneyOpen,
    setSortOrder,
    setDucates,
    setSilverthalers,
    setHellers,
    setKreutzers,
    openAddRemoveMoney,
    closeAddRemoveMoney,
    setMoney,
    addTemplateToList,
    createItem,
    deleteItem,
    editItem,
    setMeleeItemTemplatesCombatTechniqueFilter,
    setRangedItemTemplatesCombatTechniqueFilter,
    setFilterText,
    setTemplatesFilterText,
  } = props

  const getHasValidCombatTechnique = (e: Record<ItemTemplate>) =>
    isJust (meleeItemTemplateCombatTechniqueFilter) && ITA.gr (e) === 1
      ? elem (fromJust (meleeItemTemplateCombatTechniqueFilter))
             (ITA.combatTechnique (e) as Maybe<MeleeCombatTechniqueId>)
      : isJust (rangedItemTemplateCombatTechniqueFilter) && ITA.gr (e) === 2
      ? elem (fromJust (rangedItemTemplateCombatTechniqueFilter))
             (ITA.combatTechnique (e) as Maybe<RangedCombatTechniqueId>)
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
      <Slidein isOpen={showAddSlidein} close={handleHideSlidein}>
        <Options>
          <SearchField
            staticData={staticData}
            value={templatesFilterText}
            onChange={setTemplatesFilterText}
            fullWidth
            />
          <Dropdown<number>
            value={Just (filterGroupSlidein)}
            onChangeJust={setFilterGroupSlidein}
            options={filteredEquipmentGroups}
            fullWidth
            />
          {filterGroupSlidein === 1
            ? (
              <Dropdown
                value={meleeItemTemplateCombatTechniqueFilter}
                onChange={setMeleeItemTemplatesCombatTechniqueFilter}
                options={
                  cons (meleeCombatTechniques)
                       (DropdownOption ({
                         name: translate (staticData) ("equipment.filters.allcombattechniques"),
                       })) as List<Record<DropdownOption<MeleeCombatTechniqueId>>>
                }
                fullWidth
                />
              )
            : null}
          {filterGroupSlidein === 2
            ? (
              <Dropdown
                value={rangedItemTemplateCombatTechniqueFilter}
                onChange={setRangedItemTemplatesCombatTechniqueFilter}
                options={
                  cons (rangedCombatTechniques)
                       (DropdownOption ({
                         name: translate (staticData) ("equipment.filters.allcombattechniques"),
                       })) as List<Record<DropdownOption<RangedCombatTechniqueId>>>
                }
                fullWidth
                />
              )
            : null}
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (staticData) ("equipment.header.name")}
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
                        key={ITA.id (obj)}
                        data={fromItemTemplate (ITA.id (obj)) (obj)}
                        staticData={staticData}
                        selectedForInfo={slideinInfoId}
                        addTemplateToList={addTemplateToList}
                        deleteItem={deleteItem}
                        editItem={editItem}
                        selectForInfo={handleShowSlideinInfo}
                        add
                        />
                    )
                  ),
                  toArray,
                  arr => <>{arr}</>
                )),
                fromMaybe (
                  <ListPlaceholder staticData={staticData} type="itemTemplates" noResults />
                )
              )}
            </ListView>
          </Scroll>
        </MainContent>
        <WikiInfoContainer currentId={slideinInfoId} />
      </Slidein>
      <Options>
        <SearchField
          staticData={staticData}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <SortOptions
          options={List (SortNames.Name, SortNames.GroupName, SortNames.Where, SortNames.Weight)}
          sortOrder={sortOrder}
          sort={setSortOrder}
          staticData={staticData}
          />
        <BorderButton
          label={translate (staticData) ("equipment.addbtn")}
          onClick={handleShowSlidein}
          />
        <BorderButton
          label={translate (staticData) ("equipment.createbtn")}
          onClick={createItem}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (staticData) ("equipment.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="group">
            {translate (staticData) ("equipment.header.group")}
          </ListHeaderTag>
          <ListHeaderTag className="weight">
            {translate (staticData) ("equipment.dialogs.addedit.weight")}
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
                      key={IA.id (obj)}
                      data={obj}
                      staticData={staticData}
                      selectedForInfo={infoId}
                      addTemplateToList={addTemplateToList}
                      deleteItem={deleteItem}
                      editItem={editItem}
                      selectForInfo={handleShowInfo}
                      />
                  )
                ),
                toArray,
                arr => <>{arr}</>
              )),
              fromMaybe (
                <ListPlaceholder
                  staticData={staticData}
                  type="equipment"
                  noResults={filterText.length > 0}
                  />
              )
            )}
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
        <WikiInfoContainer currentId={infoId} noWrapper />
      </Aside>
      <ItemEditorContainer staticData={staticData} />
      <PurseAddRemoveMoney
        close={closeAddRemoveMoney}
        isOpen={isAddRemoveMoneyOpen}
        purse={purse}
        setMoney={setMoney}
        staticData={staticData}
        />
    </Page>
  )
}
