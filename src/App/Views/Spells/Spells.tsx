import * as React from "react"
import { notEquals } from "../../../Data/Eq"
import { fmap } from "../../../Data/Functor"
import { List, mapAccumL, notNull, notNullStr, toArray } from "../../../Data/List"
import { bindF, ensure, fromMaybe, Just, Maybe, maybe, Nothing, or } from "../../../Data/Maybe"
import { lookup, lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Pair, snd } from "../../../Data/Tuple"
import { Property } from "../../Constants/Groups"
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer"
import { SpellsSortOptions } from "../../Models/Config"
import { HeroModelRecord } from "../../Models/Hero/Hero"
import { NumIdName } from "../../Models/NumIdName"
import { AttributeCombined } from "../../Models/View/AttributeCombined"
import { CantripCombined, CantripCombinedA_ } from "../../Models/View/CantripCombined"
import { SpellWithRequirements, SpellWithRequirementsA_ } from "../../Models/View/SpellWithRequirements"
import { Cantrip } from "../../Models/Wiki/Cantrip"
import { Spell } from "../../Models/Wiki/Spell"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { SkillListItem } from "../Skills/SkillListItem"
import { BorderButton } from "../Universal/BorderButton"
import { Checkbox } from "../Universal/Checkbox"
import { ListView } from "../Universal/List"
import { ListHeader } from "../Universal/ListHeader"
import { ListHeaderTag } from "../Universal/ListHeaderTag"
import { ListItem } from "../Universal/ListItem"
import { ListItemName } from "../Universal/ListItemName"
import { ListPlaceholder } from "../Universal/ListPlaceholder"
import { MainContent } from "../Universal/MainContent"
import { Options } from "../Universal/Options"
import { Page } from "../Universal/Page"
import { RecommendedReference } from "../Universal/RecommendedReference"
import { Scroll } from "../Universal/Scroll"
import { SearchField } from "../Universal/SearchField"
import { Slidein } from "../Universal/Slidein"
import { SortNames, SortOptions } from "../Universal/SortOptions"

const SWRA = SpellWithRequirements.A
const SWRAL = SpellWithRequirements.AL
const SWRA_ = SpellWithRequirementsA_

type Combined = Record<SpellWithRequirements> | Record<CantripCombined>

const wikiEntryCombined =
  (x: Combined): Record<Spell> | Record<Cantrip> =>
  SpellWithRequirements.is (x)
      ? SpellWithRequirements.A.wikiEntry (x)
      : CantripCombined.A.wikiEntry (x)

const SCCA = {
  active: (x: Combined): boolean =>
    SpellWithRequirements.is (x)
      ? pipe_ (
          x,
          SpellWithRequirements.A.stateEntry,
          ActivatableSkillDependent.A.active
        )
      : CantripCombined.A.active (x),
  gr: (x: Combined): Maybe<number> =>
    SpellWithRequirements.is (x)
      ? pipe_ (
          x,
          SpellWithRequirements.A.wikiEntry,
          Spell.A.gr,
          Just
        )
      : Nothing,
  property: (x: Combined): Property =>
    SpellWithRequirements.is (x)
      ? pipe_ (
          x,
          SpellWithRequirements.A.wikiEntry,
          Spell.A.property
        )
      : CantripCombinedA_.property (x),
  id: pipe (wikiEntryCombined, Cantrip.AL.id),
  name: pipe (wikiEntryCombined, Cantrip.AL.name),
}

const isCantrip = CantripCombined.is

const isTopMarginNeeded =
  (sortOrder: string) =>
  (curr: Combined) =>
  (mprev: Maybe<Combined>) =>
    pipe_ (
      mprev,
      bindF (ensure (
        () => sortOrder === "group" && SCCA.active (curr)
      )),
      fmap (prev =>
             (!isCantrip (prev) && isCantrip (curr))
             || (isCantrip (prev) && !isCantrip (curr))
             || (!isCantrip (prev)
                 && !isCantrip (curr)
                 && notEquals (SCCA.gr (prev)) (SCCA.gr (curr)))),
      or
    )

const getPropertyStr =
  (staticData: StaticDataRecord) =>
  (curr: Combined) =>
    pipe_ (
      curr,
      SCCA.property,
      lookupF (StaticData.A.properties (staticData)),
      maybe ("") (NumIdName.A.name)
    )

const getSpellAddText =
  (staticData: StaticDataRecord) =>
  (sortOrder: string) =>
  (property_str: string) =>
  (curr: Record<SpellWithRequirements>) =>
    sortOrder === "group"
    ? pipe_ (
        staticData,
        StaticData.A.spellGroups,
        lookup (SWRA_.gr (curr)),
        maybe (property_str)
              (pipe (NumIdName.A.name, gr_str => `${property_str} / ${gr_str}`))
      )
    : property_str

export interface SpellsOwnProps {
  staticData: StaticDataRecord
  hero: HeroModelRecord
}

export interface SpellsStateProps {
  activeList: Maybe<List<Record<SpellWithRequirements> | Record<CantripCombined>>>
  addSpellsDisabled: boolean
  attributes: List<Record<AttributeCombined>>
  enableActiveItemHints: boolean
  filterText: string
  inactiveFilterText: string
  inactiveList: Maybe<List<Record<SpellWithRequirements> | Record<CantripCombined>>>
  isRemovingEnabled: boolean
  sortOrder: SortNames
}

export interface SpellsDispatchProps {
  setSortOrder (sortOrder: SortNames): void
  switchActiveItemHints (): void
  addPoint (id: string): void
  addToList (id: string): void
  addCantripToList (id: string): void
  removePoint (id: string): void
  removeFromList (id: string): void
  removeCantripFromList (id: string): void
  setFilterText (filterText: string): void
  setInactiveFilterText (filterText: string): void
}

type Props = SpellsStateProps & SpellsDispatchProps & SpellsOwnProps

export const Spells: React.FC<Props> = props => {
  const {
    addSpellsDisabled,
    addPoint,
    addToList,
    addCantripToList,
    enableActiveItemHints,
    attributes,
    inactiveList,
    activeList,
    staticData,
    isRemovingEnabled,
    removeFromList,
    removeCantripFromList,
    removePoint,
    setSortOrder,
    sortOrder,
    switchActiveItemHints,
    filterText,
    inactiveFilterText,
    setFilterText,
    setInactiveFilterText,
  } = props

  const [ showAddSlidein, setShowAddSlidein ] = React.useState (false)
  const [ currentId, setCurrenId ] = React.useState<Maybe<string>> (Nothing)
  const [ currentSlideinId, setCurrentSlideinId ] = React.useState<Maybe<string>> (Nothing)

  const handleShowSlidein = React.useCallback (
    () => setShowAddSlidein (true),
    [ setShowAddSlidein ]
  )

  const handleHideSlidein = React.useCallback (
    () => {
      setInactiveFilterText ("")
      setCurrentSlideinId (Nothing)
      setShowAddSlidein (false)
    },
    [ setInactiveFilterText, setCurrentSlideinId, setShowAddSlidein ]
  )

  const handleShowInfo = React.useCallback (
    (id: string) => setCurrenId (Just (id)),
    [ setCurrenId ]
  )

  const handleShowSlideinInfo = React.useCallback (
    (id: string) => setCurrentSlideinId (Just (id)),
    [ setCurrentSlideinId ]
  )

  return (
    <Page id="spells">
      <Slidein isOpen={showAddSlidein} close={handleHideSlidein} className="adding-spells">
        <Options>
          <SearchField
            staticData={staticData}
            value={inactiveFilterText}
            onChange={setInactiveFilterText}
            fullWidth
            />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            options={SpellsSortOptions}
            staticData={staticData}
            />
          <Checkbox
            checked={enableActiveItemHints}
            onClick={switchActiveItemHints}
            >
            {translate (staticData) ("general.filters.showactivatedentries")}
          </Checkbox>
          <RecommendedReference staticData={staticData} unfamiliarSpells />
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (staticData) ("spells.header.name")}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (staticData) ("spells.header.property")}
              {sortOrder === "group" ? ` / ${translate (staticData) ("spells.header.group")}` : null}
            </ListHeaderTag>
            <ListHeaderTag className="check">
              {translate (staticData) ("spells.header.check")}
            </ListHeaderTag>
            <ListHeaderTag
              className="mod"
              hint={translate (staticData) ("spells.header.checkmodifier.tooltip")}
              >
              {translate (staticData) ("spells.header.checkmodifier")}
            </ListHeaderTag>
            <ListHeaderTag
              className="ic"
              hint={translate (staticData) ("spells.header.improvementcost.tooltip")}
              >
              {translate (staticData) ("spells.header.improvementcost")}
            </ListHeaderTag>
            {isRemovingEnabled ? <ListHeaderTag className="btn-placeholder" /> : null}
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <Scroll>
            <ListView>
              {pipe_ (
                inactiveList,
                bindF (ensure (notNull)),
                fmap (pipe (
                  mapAccumL ((mprev: Maybe<Combined>) => (curr: Combined) => {
                              const insertTopMargin = isTopMarginNeeded (sortOrder) (curr) (mprev)

                              const propertyName = getPropertyStr (staticData) (curr)

                              if (SCCA.active (curr)) {
                                return Pair<Maybe<Combined>, JSX.Element> (
                                  Just (curr),
                                  (
                                    <ListItem
                                      key={SCCA.id (curr)}
                                      disabled
                                      insertTopMargin={insertTopMargin}
                                      >
                                      <ListItemName name={SCCA.name (curr)} />
                                    </ListItem>
                                  )
                                )
                              }
                              else if (isCantrip (curr)) {
                                return Pair<Maybe<Combined>, JSX.Element> (
                                  Just (curr),
                                  (
                                    <SkillListItem
                                      key={SCCA.id (curr)}
                                      id={SCCA.id (curr)}
                                      name={SCCA.name (curr)}
                                      isNotActive
                                      activate={addCantripToList}
                                      addFillElement
                                      insertTopMargin={insertTopMargin}
                                      attributes={attributes}
                                      staticData={staticData}
                                      isRemovingEnabled={isRemovingEnabled}
                                      selectForInfo={handleShowSlideinInfo}
                                      addText={
                                        sortOrder === "group"
                                          ? `${propertyName} / ${translate (staticData) ("spells.groups.cantrip")}`
                                          : propertyName
                                      }
                                      untyp={SWRAL.isUnfamiliar (curr)}
                                      selectedForInfo={currentSlideinId}
                                      />
                                  )
                                )
                              }
                              else {
                                const add_text = getSpellAddText (staticData)
                                                                 (sortOrder)
                                                                 (propertyName)
                                                                 (curr)

                                return Pair<Maybe<Combined>, JSX.Element> (
                                  Just (curr),
                                  (
                                    <SkillListItem
                                      key={SCCA.id (curr)}
                                      id={SCCA.id (curr)}
                                      name={SCCA.name (curr)}
                                      isNotActive
                                      activate={addToList}
                                      activateDisabled={addSpellsDisabled && SWRA_.gr (curr) < 3}
                                      addFillElement
                                      check={SWRA_.check (curr)}
                                      checkmod={SWRA_.checkmod (curr)}
                                      ic={SWRA_.ic (curr)}
                                      insertTopMargin={insertTopMargin}
                                      attributes={attributes}
                                      staticData={staticData}
                                      isRemovingEnabled={isRemovingEnabled}
                                      selectForInfo={handleShowSlideinInfo}
                                      addText={add_text}
                                      untyp={SWRAL.isUnfamiliar (curr)}
                                      selectedForInfo={currentSlideinId}
                                      />
                                  )
                                )
                              }
                            })
                            (Nothing),
                  snd,
                  toArray,
                  arr => <>{arr}</>
                )),
                fromMaybe (
                  <ListPlaceholder staticData={staticData} type="inactiveSpells" noResults />
                )
              )}
            </ListView>
          </Scroll>
        </MainContent>
       <WikiInfoContainer currentId={currentSlideinId} />
      </Slidein>
      <Options>
        <SearchField
          staticData={staticData}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <SortOptions
          sortOrder={sortOrder}
          sort={setSortOrder}
          options={SpellsSortOptions}
          staticData={staticData}
          />
        <BorderButton
          label={translate (staticData) ("spells.addbtn")}
          onClick={handleShowSlidein}
          />
        <RecommendedReference staticData={staticData} unfamiliarSpells />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (staticData) ("spells.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="group">
            {translate (staticData) ("spells.header.property")}
            {sortOrder === "group" ? ` / ${translate (staticData) ("spells.header.group")}` : null}
          </ListHeaderTag>
          <ListHeaderTag
            className="value"
            hint={translate (staticData) ("spells.header.skillrating.tooltip")}
            >
            {translate (staticData) ("spells.header.skillrating")}
          </ListHeaderTag>
          <ListHeaderTag className="check">
            {translate (staticData) ("spells.header.check")}
          </ListHeaderTag>
          <ListHeaderTag
            className="mod"
            hint={translate (staticData) ("spells.header.checkmodifier.tooltip")}
            >
            {translate (staticData) ("spells.header.checkmodifier")}
          </ListHeaderTag>
          <ListHeaderTag
            className="ic"
            hint={translate (staticData) ("spells.header.improvementcost.tooltip")}
            >
            {translate (staticData) ("spells.header.improvementcost")}
          </ListHeaderTag>
          {isRemovingEnabled ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll>
          <ListView>
            {pipe_ (
              activeList,
              bindF (ensure (notNull)),
              fmap (pipe (
                mapAccumL ((mprev: Maybe<Combined>) => (curr: Combined) => {
                            const insertTopMargin = isTopMarginNeeded (sortOrder) (curr) (mprev)

                            const propertyName = getPropertyStr (staticData) (curr)

                            if (isCantrip (curr)) {
                              return Pair<Maybe<Combined>, JSX.Element> (
                                Just (curr),
                                (
                                  <SkillListItem
                                    key={SCCA.id (curr)}
                                    id={SCCA.id (curr)}
                                    name={SCCA.name (curr)}
                                    removePoint={removeCantripFromList}
                                    removeDisabled={!isRemovingEnabled}
                                    addFillElement
                                    noIncrease
                                    insertTopMargin={insertTopMargin}
                                    attributes={attributes}
                                    staticData={staticData}
                                    isRemovingEnabled={isRemovingEnabled}
                                    selectForInfo={handleShowInfo}
                                    addText={
                                      sortOrder === "group"
                                        ? `${propertyName} / ${translate (staticData) ("spells.groups.cantrip")}`
                                        : propertyName
                                    }
                                    untyp={SWRAL.isUnfamiliar (curr)}
                                    selectedForInfo={currentId}
                                    />
                                )
                              )
                            }
                            else {
                              const add_text = getSpellAddText (staticData)
                                                               (sortOrder)
                                                               (propertyName)
                                                               (curr)

                              return Pair<Maybe<Combined>, JSX.Element> (
                                Just (curr),
                                (
                                  <SkillListItem
                                    key={SWRA_.id (curr)}
                                    id={SWRA_.id (curr)}
                                    name={SWRA_.name (curr)}
                                    addDisabled={!SWRA.isIncreasable (curr)}
                                    addPoint={addPoint}
                                    removeDisabled={
                                      !isRemovingEnabled || !SWRA.isDecreasable (curr)
                                    }
                                    removePoint={
                                      SWRA_.value (curr) === 0 ? removeFromList : removePoint
                                    }
                                    addFillElement
                                    check={SWRA_.check (curr)}
                                    checkmod={SWRA_.checkmod (curr)}
                                    ic={SWRA_.ic (curr)}
                                    sr={SWRA_.value (curr)}
                                    insertTopMargin={insertTopMargin}
                                    attributes={attributes}
                                    staticData={staticData}
                                    isRemovingEnabled={isRemovingEnabled}
                                    selectForInfo={handleShowInfo}
                                    addText={add_text}
                                    untyp={SWRAL.isUnfamiliar (curr)}
                                    selectedForInfo={currentId}
                                    />
                                )
                              )
                            }
                          })
                          (Nothing),
                snd,
                toArray,
                arr => <>{arr}</>
              )),
              fromMaybe (
                <ListPlaceholder
                  staticData={staticData}
                  type="spells"
                  noResults={notNullStr (filterText)}
                  />
              )
            )}
          </ListView>
        </Scroll>
      </MainContent>
      <WikiInfoContainer currentId={currentId} />
    </Page>
  )
}
