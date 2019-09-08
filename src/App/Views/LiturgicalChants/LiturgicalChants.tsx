import * as React from "react";
import { notEquals } from "../../../Data/Eq";
import { ident } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { consF, elem, elemF, intercalate, List, mapAccumL, notNull, notNullStr, subscript, toArray } from "../../../Data/List";
import { bindF, ensure, fromMaybe, fromMaybeR, guard, Just, mapMaybe, Maybe, maybe, Nothing, or, thenF } from "../../../Data/Maybe";
import { dec } from "../../../Data/Num";
import { Record } from "../../../Data/Record";
import { Pair, snd } from "../../../Data/Tuple";
import { BlessedTradition } from "../../Constants/Groups";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { AttributeCombined } from "../../Models/View/AttributeCombined";
import { BlessingCombined } from "../../Models/View/BlessingCombined";
import { LiturgicalChantWithRequirements, LiturgicalChantWithRequirementsA_ } from "../../Models/View/LiturgicalChantWithRequirements";
import { Blessing } from "../../Models/Wiki/Blessing";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { translate } from "../../Utilities/I18n";
import { getAspectsOfTradition } from "../../Utilities/Increasable/liturgicalChantUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { sortStrings } from "../../Utilities/sortBy";
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
import { Scroll } from "../Universal/Scroll";
import { Slidein } from "../Universal/Slidein";
import { SortNames, SortOptions } from "../Universal/SortOptions";
import { TextField } from "../Universal/TextField";

export interface LiturgicalChantsOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface LiturgicalChantsStateProps {
  activeList: Maybe<List<Record<BlessingCombined> | Record<LiturgicalChantWithRequirements>>>
  addChantsDisabled: boolean
  attributes: List<Record<AttributeCombined>>
  enableActiveItemHints: boolean
  filterText: string
  inactiveFilterText: string
  inactiveList: Maybe<List<Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>>>
  isRemovingEnabled: boolean
  sortOrder: SortNames
  traditionId: Maybe<number>
}

export interface LiturgicalChantsDispatchProps {
  setSortOrder (sortOrder: SortNames): void
  switchActiveItemHints (): void
  addPoint (id: string): void
  addToList (id: string): void
  addBlessingToList (id: string): void
  removePoint (id: string): void
  removeFromList (id: string): void
  removeBlessingFromList (id: string): void
  setFilterText (filterText: string): void
  setInactiveFilterText (filterText: string): void
}

export type LiturgicalChantsProps =
  LiturgicalChantsStateProps
  & LiturgicalChantsDispatchProps
  & LiturgicalChantsOwnProps

export interface LiturgicalChantsState {
  showAddSlidein: boolean
  currentId: Maybe<string>
  currentSlideinId: Maybe<string>
}

const LCWRA = LiturgicalChantWithRequirements.A
const LCWRA_ = LiturgicalChantWithRequirementsA_

type Combined = Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>

const wikiEntryCombined =
  (x: Combined): Record<LiturgicalChant> | Record<Blessing> =>
    LiturgicalChantWithRequirements.is (x)
      ? LiturgicalChantWithRequirements.A.wikiEntry (x)
      : BlessingCombined.A.wikiEntry (x)

const LCBCA = {
  active: (x: Combined): boolean =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (
          x,
          LiturgicalChantWithRequirements.A.stateEntry,
          ActivatableSkillDependent.A.active
        )
      : BlessingCombined.A.active (x),
  gr: (x: Combined): Maybe<number> =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (
          x,
          LiturgicalChantWithRequirements.A.wikiEntry,
          LiturgicalChant.A.gr,
          Just
        )
      : Nothing,
  aspects: (x: Combined): List<number> =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (
          x,
          LiturgicalChantWithRequirements.A.wikiEntry,
          LiturgicalChant.A.aspects
        )
      : List (1),
  tradition: (x: Combined): List<number> =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (
          x,
          LiturgicalChantWithRequirements.A.wikiEntry,
          LiturgicalChant.A.tradition
        )
      : List (1),
  id: pipe (wikiEntryCombined, Blessing.AL.id),
  name: pipe (wikiEntryCombined, Blessing.AL.name),
}

const isBlessing = BlessingCombined.is

export class LiturgicalChants
  extends React.Component<LiturgicalChantsProps, LiturgicalChantsState> {
  state: LiturgicalChantsState = {
    showAddSlidein: false,
    currentId: Nothing,
    currentSlideinId: Nothing,
  }

  showAddSlidein = () => this.setState ({ showAddSlidein: true })

  hideAddSlidein = () => {
    this.props.setInactiveFilterText ("")
    this.setState ({ showAddSlidein: false })
  }

  showInfo = (id: string) => this.setState ({ currentId: Just (id) })
  showSlideinInfo = (id: string) => this.setState ({ currentSlideinId: Just (id) })

  render () {
    const {
      addChantsDisabled,
      addPoint,
      addToList,
      addBlessingToList,
      enableActiveItemHints,
      attributes,
      activeList,
      inactiveList,
      l10n,
      isRemovingEnabled,
      removeFromList,
      removeBlessingFromList,
      removePoint,
      setSortOrder,
      sortOrder,
      switchActiveItemHints,
      traditionId: mtradition_id,
      filterText,
      inactiveFilterText,
      setFilterText,
      setInactiveFilterText,
    } = this.props

    const { showAddSlidein } = this.state

    return (
      <Page id="liturgies">
        <Slidein
          isOpen={showAddSlidein}
          close={this.hideAddSlidein}
          className="adding-liturgical-chants"
          >
          <Options>
            <TextField
              hint={translate (l10n) ("search")}
              value={inactiveFilterText}
              onChangeString={setInactiveFilterText}
              fullWidth
              />
            <SortOptions
              sortOrder={sortOrder}
              sort={setSortOrder}
              options={List<SortNames> ("name", "group", "ic")}
              l10n={l10n}
              />
            <Checkbox
              checked={enableActiveItemHints}
              onClick={switchActiveItemHints}
              >
              {translate (l10n) ("showactivated")}
            </Checkbox>
          </Options>
          <MainContent>
            <ListHeader>
              <ListHeaderTag className="name">
                {translate (l10n) ("name")}
              </ListHeaderTag>
              <ListHeaderTag className="group">
                {translate (l10n) ("traditions")}
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

                                const aspects = getAspectsStr (l10n) (curr) (mtradition_id)

                                if (LCBCA.active (curr)) {
                                  return Pair<Maybe<Combined>, JSX.Element> (
                                    Just (curr),
                                    (
                                      <ListItem
                                        key={LCBCA.id (curr)}
                                        disabled
                                        insertTopMargin={insertTopMargin}
                                        >
                                        <ListItemName name={LCBCA.name (curr)} />
                                      </ListItem>
                                    )
                                  )
                                }
                                else if (isBlessing (curr)) {
                                  return Pair<Maybe<Combined>, JSX.Element> (
                                    Just (curr),
                                    (
                                      <SkillListItem
                                        key={LCBCA.id (curr)}
                                        id={LCBCA.id (curr)}
                                        name={LCBCA.name (curr)}
                                        isNotActive
                                        activate={
                                          addBlessingToList .bind (null, LCBCA.id (curr))
                                        }
                                        addFillElement
                                        insertTopMargin={insertTopMargin}
                                        attributes={attributes}
                                        l10n={l10n}
                                        selectForInfo={this.showSlideinInfo}
                                        addText={
                                          sortOrder === "group"
                                            ? `${aspects} / ${translate (l10n) ("blessing")}`
                                            : aspects
                                        }
                                        selectedForInfo={this.state.currentSlideinId}
                                        />
                                    )
                                  )
                                }
                                else {
                                  const add_text = getLCAddText (l10n) (sortOrder) (aspects) (curr)

                                  return Pair<Maybe<Combined>, JSX.Element> (
                                    Just (curr),
                                    (
                                      <SkillListItem
                                        key={LCBCA.id (curr)}
                                        id={LCBCA.id (curr)}
                                        name={LCBCA.name (curr)}
                                        isNotActive
                                        activate={addToList .bind (null, LCBCA.id (curr))}
                                        activateDisabled={addChantsDisabled}
                                        addFillElement
                                        check={LCWRA_.check (curr)}
                                        checkmod={LCWRA_.checkmod (curr)}
                                        ic={LCWRA_.ic (curr)}
                                        insertTopMargin={insertTopMargin}
                                        attributes={attributes}
                                        l10n={l10n}
                                        selectForInfo={this.showSlideinInfo}
                                        addText={add_text}
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
                  fromMaybeR (
                    <ListPlaceholder l10n={l10n} type="inactiveLiturgicalChants" noResults />
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
            onChangeString={setFilterText}
            fullWidth
            />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            options={List<SortNames> ("name", "group", "ic")}
            l10n={l10n}
            />
          <BorderButton
            label={translate (l10n) ("add")}
            onClick={this.showAddSlidein}
            />
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (l10n) ("name")}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (l10n) ("traditions")}
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

                              const aspects = getAspectsStr (l10n) (curr) (mtradition_id)

                              if (isBlessing (curr)) {
                                return Pair<Maybe<Combined>, JSX.Element> (
                                  Just (curr),
                                  (
                                    <SkillListItem
                                      key={LCBCA.id (curr)}
                                      id={LCBCA.id (curr)}
                                      name={LCBCA.name (curr)}
                                      removePoint={
                                        isRemovingEnabled
                                          ? removeBlessingFromList.bind (null, LCBCA.id (curr))
                                          : undefined}
                                      addFillElement
                                      noIncrease
                                      insertTopMargin={insertTopMargin}
                                      attributes={attributes}
                                      l10n={l10n}
                                      selectForInfo={this.showInfo}
                                      addText={
                                        sortOrder === "group"
                                          ? `${aspects} / ${translate (l10n) ("blessing")}`
                                          : aspects
                                      }
                                      selectedForInfo={this.state.currentId}
                                      />
                                  )
                                )
                              }
                              else {
                                const add_text = getLCAddText (l10n) (sortOrder) (aspects) (curr)

                                return Pair<Maybe<Combined>, JSX.Element> (
                                  Just (curr),
                                  (
                                    <SkillListItem
                                      key={LCBCA.id (curr)}
                                      id={LCBCA.id (curr)}
                                      name={LCBCA.name (curr)}
                                      addDisabled={!LCWRA.isIncreasable (curr)}
                                      addPoint={addPoint.bind (null, LCBCA.id (curr))}
                                      removeDisabled={!LCWRA.isDecreasable (curr)}
                                      removePoint={
                                        isRemovingEnabled
                                          ? LCWRA_.value (curr) === 0
                                            ? removeFromList.bind (null, LCBCA.id (curr))
                                            : removePoint.bind (null, LCBCA.id (curr))
                                          : undefined
                                      }
                                      addFillElement
                                      check={LCWRA_.check (curr)}
                                      checkmod={LCWRA_.checkmod (curr)}
                                      ic={LCWRA_.ic (curr)}
                                      sr={LCWRA_.value (curr)}
                                      insertTopMargin={insertTopMargin}
                                      attributes={attributes}
                                      l10n={l10n}
                                      selectForInfo={this.showInfo}
                                      addText={add_text}
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
                fromMaybeR (
                  <ListPlaceholder
                    l10n={l10n}
                    type="liturgicalChants"
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
        () => sortOrder === "group" && LCBCA.active (curr)
      )),
      fmap (prev =>
             !isBlessing (prev) && isBlessing (curr)
             || isBlessing (prev) && !isBlessing (curr)
             || !isBlessing (prev)
               && !isBlessing (curr)
               && notEquals (LCBCA.gr (prev)) (LCBCA.gr (curr))),
      or
    )

const getAspectsStr =
  (l10n: L10nRecord) =>
  (curr: Combined) =>
  (mtradition_id: Maybe<BlessedTradition>) =>
    pipe_ (
      mtradition_id,
      fmap (pipe (
        tradition_id =>
          mapMaybe (pipe (
                     ensure (elemF (getAspectsOfTradition (tradition_id))),
                     bindF (pipe (
                       dec,
                       subscript (translate (l10n) ("aspectlist"))
                     ))
                   ))
                   (LCBCA.aspects (curr)),
        elem (14) (LCBCA.tradition (curr))
          ? maybe (ident as ident<List<string>>) <string> (consF)
                  (subscript (translate (l10n) ("blessedtraditions")) (13))
          : ident,
        sortStrings (l10n),
        intercalate (", ")
      )),
      fromMaybe ("")
    )

const getLCAddText =
  (l10n: L10nRecord) =>
  (sortOrder: string) =>
  (aspects_str: string) =>
  (curr: Record<LiturgicalChantWithRequirements>) =>
    pipe_ (
      guard (sortOrder === "group"),
      thenF (subscript (translate (l10n) ("liturgicalchantgroups")) (LCWRA_.gr (curr) - 1)),
      maybe (aspects_str) (gr_str => `${aspects_str} / ${gr_str}`)
    )
