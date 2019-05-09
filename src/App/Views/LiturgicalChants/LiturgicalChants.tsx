import * as React from "react";
import { notEquals } from "../../../Data/Eq";
import { fmap } from "../../../Data/Functor";
import { elemF, intercalate, List, mapAccumL, notNull, subscript, toArray } from "../../../Data/List";
import { bindF, ensure, fromMaybe, fromMaybeR, guard, Just, mapMaybe, Maybe, Nothing, or, thenF } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Pair, snd } from "../../../Data/Pair";
import { Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { AttributeCombined } from "../../Models/View/AttributeCombined";
import { BlessingCombined } from "../../Models/View/BlessingCombined";
import { DerivedCharacteristic } from "../../Models/View/DerivedCharacteristic";
import { LiturgicalChantWithRequirements, LiturgicalChantWithRequirementsA_ } from "../../Models/View/LiturgicalChantWithRequirements";
import { Blessing } from "../../Models/Wiki/Blessing";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { DCIds } from "../../Selectors/derivedCharacteristicsSelectors";
import { translate } from "../../Utilities/I18n";
import { getAspectsOfTradition } from "../../Utilities/Increasable/liturgicalChantUtils";
import { dec } from "../../Utilities/mathUtils";
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
}

export interface LiturgicalChantsStateProps {
  activeList: Maybe<List<Record<BlessingCombined> | Record<LiturgicalChantWithRequirements>>>
  addChantsDisabled: boolean
  attributes: Maybe<List<Record<AttributeCombined>>>
  derivedCharacteristics: OrderedMap<DCIds, Record<DerivedCharacteristic>>
  enableActiveItemHints: boolean
  filterText: string
  inactiveFilterText: string
  inactiveList: Maybe<List<Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>>>
  isRemovingEnabled: boolean
  sortOrder: string
  traditionId: Maybe<number>
}

export interface LiturgicalChantsDispatchProps {
  setSortOrder (sortOrder: string): void
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
      derivedCharacteristics,
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
          isOpened={showAddSlidein}
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
                {translate (l10n) ("aspect")}
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
                                const insertTopMargin =
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

                                const aspects =
                                  pipe_ (
                                    mtradition_id,
                                    fmap (pipe (
                                      tradition_id =>
                                        mapMaybe (pipe (
                                                   ensure (elemF (
                                                     getAspectsOfTradition (tradition_id + 1)
                                                   )),
                                                   bindF (pipe (
                                                     dec,
                                                     subscript (translate (l10n) ("aspectlist"))
                                                   ))
                                                 ))
                                                 (LCBCA.aspects (curr)),
                                      sortStrings (L10n.A.id (l10n)),
                                      intercalate (", ")
                                    )),
                                    fromMaybe ("")
                                  )

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
                                        derivedCharacteristics={derivedCharacteristics}
                                        selectForInfo={this.showSlideinInfo}
                                        addText={
                                          sortOrder === "group"
                                            ? `${aspects} / ${
                                              translate (l10n) ("blessing")
                                            }`
                                            : aspects
                                        }
                                        />
                                    )
                                  )
                                }
                                else {
                                  const groups = translate (l10n) ("liturgicalchantgroups")

                                  const add_text =
                                    pipe_ (
                                      guard (sortOrder === "group"),
                                      thenF (subscript (groups) (LCWRA_.gr (curr) - 1)),
                                      fromMaybe (aspects)
                                    )

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
                                        derivedCharacteristics={derivedCharacteristics}
                                        selectForInfo={this.showSlideinInfo}
                                        addText={add_text}
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
              {translate (l10n) ("aspect")}
              {sortOrder === "group" && ` / ${translate (l10n) ("group")}`}
            </ListHeaderTag>
            <ListHeaderTag className="value" hint={translate (l10n) ("sr.long")}>
              {translate (l10n) ("sr.short")}
            </ListHeaderTag>
            <ListHeaderTag className="check">
              {translate (l10n) ("check")}
            </ListHeaderTag>
            <ListHeaderTag className="mod" hint={translate (l10n) ("mod.long")}>
              {translate (l10n) ("mod.short")}
            </ListHeaderTag>
            <ListHeaderTag className="ic" hint={translate (l10n) ("ic.long")}>
              {translate (l10n) ("ic.short")}
            </ListHeaderTag>
            {isRemovingEnabled && <ListHeaderTag className="btn-placeholder" />}
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
                      type="liturgicalChants"
                      noResults={filterText.length > 0}
                      />
                  )
                  (activeList
                    .bind (Maybe.ensure (R.complement (List.null)))
                    .fmap (R.pipe (
                      List.mapAccumL<
                        Maybe<Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>>,
                        Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>,
                        JSX.Element
                      >
                        (maybePrevious => current => {
                          const insertTopMargin = Maybe.elem
                            (true)
                            (maybePrevious
                              .bind (Maybe.ensure (() => sortOrder === "group"))
                              .fmap (
                                previous => (current .get ("category") as Categories)
                                  === Categories.BLESSINGS
                                  ? (previous .get ("category") as Categories)
                                    !== Categories.BLESSINGS
                                  : !isBlessing (previous) && isBlessing (current)
                                    || isBlessing (previous) && !isBlessing (current)
                                    || !isBlessing (previous)
                                      && !isBlessing (current)
                                      && previous .get ("gr") !== current.get ("gr")
                              ))

                          const aspects =
                            Maybe.fromMaybe
                              ("")
                              (mtradition_id .fmap (
                                R.pipe (
                                  traditionId => Maybe.mapMaybe<number, string>
                                    (R.pipe (
                                      Maybe.ensure (
                                        List.elem_ (getAspectsOfTradition (traditionId + 1))
                                      ),
                                      Maybe.bind_ (R.pipe (
                                        R.dec,
                                        List.subscript (
                                          translate (l10n) ("liturgies.view.aspects")
                                        )
                                      ))
                                    ))
                                    (current .get ("aspects")),
                                  sortStrings (l10n .get ("id")),
                                  List.intercalate (", ")
                                )
                              ))

                          return Tuple.of<
                            Maybe<
                              Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>
                            >,
                            JSX.Element
                          >
                            (Just (current))
                            (isBlessing (current)
                              ? (
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
                                  derivedCharacteristics={derivedCharacteristics}
                                  selectForInfo={this.showSlideinInfo}
                                  addText={
                                    sortOrder === "group"
                                      ? `${aspects} / ${
                                        translate (l10n) ("liturgies.view.blessing")
                                      }`
                                      : aspects
                                  }
                                  />
                              )
                              : (
                                <SkillListItem
                                  key={LCBCA.id (curr)}
                                  id={LCBCA.id (curr)}
                                  name={LCBCA.name (curr)}
                                  addDisabled={!current .get ("isIncreasable")}
                                  addPoint={addPoint.bind (null, LCBCA.id (curr))}
                                  removeDisabled={!current .get ("isDecreasable")}
                                  removePoint={
                                    isRemovingEnabled
                                      ? current .get ("value") === 0
                                        ? removeFromList.bind (null, LCBCA.id (curr))
                                        : removePoint.bind (null, LCBCA.id (curr))
                                      : undefined
                                  }
                                  addFillElement
                                  check={current .get ("check")}
                                  checkmod={current .lookup ("checkmod")}
                                  ic={current .get ("ic")}
                                  sr={current .get ("value")}
                                  insertTopMargin={insertTopMargin}
                                  attributes={attributes}
                                  derivedCharacteristics={derivedCharacteristics}
                                  selectForInfo={this.showSlideinInfo}
                                  addText={
                                    sortOrder === "group"
                                    ? `${aspects} / ${
                                      Maybe.fromMaybe
                                        ("")
                                        (translate (l10n) ("liturgies.view.groups")
                                          .subscript (current .get ("gr") - 1))
                                    }`
                                    : aspects
                                  }
                                  />
                              )
                            )
                        })
                        (Nothing),
                      snd,
                      toArray
                    )))
              }
            </ListView>
          </Scroll>
        </MainContent>
        <WikiInfoContainer {...this.props} {...this.state} />
      </Page>
    )
  }
}
