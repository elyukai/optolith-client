import * as React from "react";
import { notEquals } from "../../../Data/Eq";
import { fmap } from "../../../Data/Functor";
import { List, mapAccumL, notNull, notNullStr, subscript, toArray } from "../../../Data/List";
import { bindF, ensure, fromMaybe, guard, Just, Maybe, maybe, Nothing, or, thenF } from "../../../Data/Maybe";
import { dec } from "../../../Data/Num";
import { Record } from "../../../Data/Record";
import { Pair, snd } from "../../../Data/Tuple";
import { Property } from "../../Constants/Groups";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { AttributeCombined } from "../../Models/View/AttributeCombined";
import { CantripCombined, CantripCombinedA_ } from "../../Models/View/CantripCombined";
import { SpellWithRequirements, SpellWithRequirementsA_ } from "../../Models/View/SpellWithRequirements";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Spell } from "../../Models/Wiki/Spell";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { SkillListItem } from "../Skills/SkillListItem";
import { BorderButton } from "../Universal/BorderButton";
import { Checkbox } from "../Universal/Checkbox";
import { ListView } from "../Universal/List";
import { ListHeader } from "../Universal/ListHeader";
import { ListHeaderTag } from "../Universal/ListHeaderTag";
import { ListItem } from "../Universal/ListItem";
import { ListItemName } from "../Universal/ListItemName";
import { ListPlaceholder } from "../Universal/ListPlaceholder";
import { MainContent } from "../Universal/MainContent";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { RecommendedReference } from "../Universal/RecommendedReference";
import { Scroll } from "../Universal/Scroll";
import { Slidein } from "../Universal/Slidein";
import { SortNames, SortOptions } from "../Universal/SortOptions";
import { TextField } from "../Universal/TextField";

export interface SpellsOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface SpellsStateProps {
  activeList: Maybe<List<Record<SpellWithRequirements> | Record<CantripCombined>>>
  addSpellsDisabled: Maybe<boolean>
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

export type SpellsProps = SpellsStateProps & SpellsDispatchProps & SpellsOwnProps

export interface SpellsState {
  showAddSlidein: boolean
  currentId: Maybe<string>
  currentSlideinId: Maybe<string>
}

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

export class Spells extends React.Component<SpellsProps, SpellsState> {
  state: SpellsState = {
    showAddSlidein: false,
    currentId: Nothing,
    currentSlideinId: Nothing,
  }

  showAddSlidein = () => this.setState ({ showAddSlidein: true })

  hideAddSlidein = () => {
    this.props.setInactiveFilterText ("")
    this.setState ({ showAddSlidein: false, currentSlideinId: Nothing })
  }

  showInfo = (id: string) => this.setState ({ currentId: Just (id) })
  showSlideinInfo = (id: string) => this.setState ({ currentSlideinId: Just (id) })

  render () {
    const {
      addSpellsDisabled,
      addPoint,
      addToList,
      addCantripToList,
      enableActiveItemHints,
      attributes,
      inactiveList,
      activeList,
      l10n,
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
    } = this.props

    const { showAddSlidein } = this.state

    return (
      <Page id="spells">
        <Slidein isOpen={showAddSlidein} close={this.hideAddSlidein} className="adding-spells">
          <Options>
            <TextField
              hint={translate (l10n) ("search")}
              value={inactiveFilterText}
              onChange={setInactiveFilterText}
              fullWidth
              />
            <SortOptions
              sortOrder={sortOrder}
              sort={setSortOrder}
              options={List<SortNames> ("name", "group", "property", "ic")}
              l10n={l10n}
              />
            <Checkbox
              checked={enableActiveItemHints}
              onClick={switchActiveItemHints}
              >
              {translate (l10n) ("showactivated")}
            </Checkbox>
            <RecommendedReference l10n={l10n} unfamiliarSpells />
          </Options>
          <MainContent>
            <ListHeader>
              <ListHeaderTag className="name">
                {translate (l10n) ("name")} ({translate (l10n) ("unfamiliartraditions")})
              </ListHeaderTag>
              <ListHeaderTag className="group">
                {translate (l10n) ("property")}
                {sortOrder === "group" ? ` / ${translate (l10n) ("group")}` : null}
              </ListHeaderTag>
              <ListHeaderTag className="check">
                {translate (l10n) ("check")}
              </ListHeaderTag>
              <ListHeaderTag className="mod" hint={translate (l10n) ("checkmodifier")}>
                {translate (l10n) ("checkmodifier.short")}
              </ListHeaderTag>
              <ListHeaderTag className="ic" hint={translate (l10n) ("improvementcost")}>
                {translate (l10n) ("improvementcost.short")}
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

                                const propertyName = getPropertyStr (l10n) (curr)

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
                                        activate={
                                          addCantripToList .bind (null, SCCA.id (curr))
                                        }
                                        addFillElement
                                        insertTopMargin={insertTopMargin}
                                        attributes={attributes}
                                        l10n={l10n}
                                        selectForInfo={this.showSlideinInfo}
                                        addText={
                                          sortOrder === "group"
                                            ? `${propertyName} / ${translate (l10n) ("cantrip")}`
                                            : propertyName
                                        }
                                        untyp={SWRAL.isUnfamiliar (curr)}
                                        selectedForInfo={this.state.currentSlideinId}
                                        />
                                    )
                                  )
                                }
                                else {
                                  const add_text = getSpellAddText (l10n)
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
                                        activate={addToList .bind (null, SCCA.id (curr))}
                                        activateDisabled={
                                          or (addSpellsDisabled)
                                          && SWRA_.gr (curr) < 3
                                        }
                                        addFillElement
                                        check={SWRA_.check (curr)}
                                        checkmod={SWRA_.checkmod (curr)}
                                        ic={SWRA_.ic (curr)}
                                        insertTopMargin={insertTopMargin}
                                        attributes={attributes}
                                        l10n={l10n}
                                        selectForInfo={this.showSlideinInfo}
                                        addText={add_text}
                                        untyp={SWRAL.isUnfamiliar (curr)}
                                        selectedForInfo={this.state.currentSlideinId}
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
                    <ListPlaceholder l10n={l10n} type="inactiveSpells" noResults />
                  )
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
            onChange={setFilterText}
            fullWidth
            />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            options={List<SortNames> ("name", "group", "property", "ic")}
            l10n={l10n}
            />
          <BorderButton
            label={translate (l10n) ("add")}
            onClick={this.showAddSlidein}
            />
          <RecommendedReference l10n={l10n} unfamiliarSpells />
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (l10n) ("name")} ({translate (l10n) ("unfamiliartraditions")})
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (l10n) ("property")}
              {sortOrder === "group" ? ` / ${translate (l10n) ("group")}` : null}
            </ListHeaderTag>
            <ListHeaderTag className="value" hint={translate (l10n) ("skillrating")}>
              {translate (l10n) ("skillrating.short")}
            </ListHeaderTag>
            <ListHeaderTag className="check">
              {translate (l10n) ("check")}
            </ListHeaderTag>
            <ListHeaderTag className="mod" hint={translate (l10n) ("checkmodifier")}>
              {translate (l10n) ("checkmodifier.short")}
            </ListHeaderTag>
            <ListHeaderTag className="ic" hint={translate (l10n) ("improvementcost")}>
              {translate (l10n) ("improvementcost.short")}
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

                              const propertyName = getPropertyStr (l10n) (curr)

                              if (isCantrip (curr)) {
                                return Pair<Maybe<Combined>, JSX.Element> (
                                  Just (curr),
                                  (
                                    <SkillListItem
                                      key={SCCA.id (curr)}
                                      id={SCCA.id (curr)}
                                      name={SCCA.name (curr)}
                                      removePoint={
                                        isRemovingEnabled
                                          ? removeCantripFromList.bind (null, SCCA.id (curr))
                                          : undefined}
                                      addFillElement
                                      noIncrease
                                      insertTopMargin={insertTopMargin}
                                      attributes={attributes}
                                      l10n={l10n}
                                      selectForInfo={this.showInfo}
                                      addText={
                                        sortOrder === "group"
                                          ? `${propertyName} / ${translate (l10n) ("cantrip")}`
                                          : propertyName
                                      }
                                      untyp={SWRAL.isUnfamiliar (curr)}
                                      selectedForInfo={this.state.currentId}
                                      />
                                  )
                                )
                              }
                              else {
                                const add_text = getSpellAddText (l10n)
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
                                      addPoint={addPoint.bind (null, SWRA_.id (curr))}
                                      removeDisabled={!SWRA.isDecreasable (curr)}
                                      removePoint={
                                        isRemovingEnabled
                                          ? SWRA_.value (curr) === 0
                                            ? removeFromList.bind (null, SWRA_.id (curr))
                                            : removePoint.bind (null, SWRA_.id (curr))
                                          : undefined
                                      }
                                      addFillElement
                                      check={SWRA_.check (curr)}
                                      checkmod={SWRA_.checkmod (curr)}
                                      ic={SWRA_.ic (curr)}
                                      sr={SWRA_.value (curr)}
                                      insertTopMargin={insertTopMargin}
                                      attributes={attributes}
                                      l10n={l10n}
                                      selectForInfo={this.showInfo}
                                      addText={add_text}
                                      untyp={SWRAL.isUnfamiliar (curr)}
                                      selectedForInfo={this.state.currentId}
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
                    l10n={l10n}
                    type="spells"
                    noResults={notNullStr (filterText)}
                    />
                )
              )}
            </ListView>
          </Scroll>
        </MainContent>
        <WikiInfoContainer {...this.props} {...this.state} />
      </Page>
    )
  }
}

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
             !isCantrip (prev) && isCantrip (curr)
             || isCantrip (prev) && !isCantrip (curr)
             || !isCantrip (prev)
               && !isCantrip (curr)
               && notEquals (SCCA.gr (prev)) (SCCA.gr (curr))),
      or
    )

const getPropertyStr =
  (l10n: L10nRecord) =>
  (curr: Combined) =>
    pipe_ (
      curr,
      SCCA.property,
      dec,
      subscript (translate (l10n) ("propertylist")),
      renderMaybe
    )

const getSpellAddText =
  (l10n: L10nRecord) =>
  (sortOrder: string) =>
  (property_str: string) =>
  (curr: Record<SpellWithRequirements>) =>
    pipe_ (
      guard (sortOrder === "group"),
      thenF (subscript (translate (l10n) ("spellgroups")) (SWRA_.gr (curr) - 1)),
      maybe (property_str) (gr_str => `${property_str} / ${gr_str}`)
    )
