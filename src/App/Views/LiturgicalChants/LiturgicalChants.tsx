import * as React from "react";
import { notEquals } from "../../../Data/Eq";
import { fmap } from "../../../Data/Functor";
import { List, mapAccumL, notNull, notNullStr, toArray } from "../../../Data/List";
import { bindF, ensure, fromMaybe, Just, Maybe, Nothing, or } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { Pair, snd } from "../../../Data/Tuple";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { AttributeCombined } from "../../Models/View/AttributeCombined";
import { BlessingCombined } from "../../Models/View/BlessingCombined";
import { LiturgicalChantWithRequirements } from "../../Models/View/LiturgicalChantWithRequirements";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { LCBCA } from "../../Utilities/Increasable/liturgicalChantUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { ChantsSortOptions } from "../../Utilities/Raw/JSON/Config";
import { BorderButton } from "../Universal/BorderButton";
import { Checkbox } from "../Universal/Checkbox";
import { ListView } from "../Universal/List";
import { ListHeader } from "../Universal/ListHeader";
import { ListHeaderTag } from "../Universal/ListHeaderTag";
import { ListPlaceholder } from "../Universal/ListPlaceholder";
import { MainContent } from "../Universal/MainContent";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { SearchField } from "../Universal/SearchField";
import { Slidein } from "../Universal/Slidein";
import { SortNames, SortOptions } from "../Universal/SortOptions";
import { LiturgicalChantsListItemActive } from "./LiturgicalChantsListItemActive";
import { LiturgicalChantsListItemInactive } from "./LiturgicalChantsListItemInactive";

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
  sortOrder: ChantsSortOptions
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

type Combined = Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>

export const LiturgicalChants: React.FC<LiturgicalChantsProps> = props => {
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
    <Page id="liturgies">
      <Slidein
        isOpen={showAddSlidein}
        close={handleHideSlidein}
        className="adding-liturgical-chants"
        >
        <Options>
          <SearchField
            l10n={l10n}
            value={inactiveFilterText}
            onChange={setInactiveFilterText}
            fullWidth
            />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            options={List (SortNames.Name, SortNames.Group, SortNames.IC)}
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
              {sortOrder === SortNames.Group ? ` / ${translate (l10n) ("group")}` : null}
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

                              return Pair<Maybe<Combined>, JSX.Element> (
                                Just (curr),
                                (
                                  <LiturgicalChantsListItemInactive
                                    l10n={l10n}
                                    addChantsDisabled={addChantsDisabled}
                                    attributes={attributes}
                                    currentInfoId={currentSlideinId}
                                    entry={curr}
                                    insertTopMargin={insertTopMargin}
                                    mtradition_id={mtradition_id}
                                    sortOrder={sortOrder}
                                    addToList={addToList}
                                    addBlessingToList={addBlessingToList}
                                    selectForInfo={handleShowSlideinInfo}
                                    />
                                )
                              )
                            })
                            (Nothing),
                  snd,
                  toArray,
                  arr => <>{arr}</>
                )),
                fromMaybe (
                  <ListPlaceholder l10n={l10n} type="inactiveLiturgicalChants" noResults />
                )
              )}
            </ListView>
          </Scroll>
        </MainContent>
        <WikiInfoContainer l10n={l10n} currentId={currentSlideinId} />
      </Slidein>
      <Options>
        <SearchField
          l10n={l10n}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <SortOptions
          sortOrder={sortOrder}
          sort={setSortOrder}
          options={List (SortNames.Name, SortNames.Group, SortNames.IC)}
          l10n={l10n}
          />
        <BorderButton
          label={translate (l10n) ("add")}
          onClick={handleShowSlidein}
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

                            return Pair<Maybe<Combined>, JSX.Element> (
                              Just (curr),
                              (
                                <LiturgicalChantsListItemActive
                                  l10n={l10n}
                                  attributes={attributes}
                                  currentInfoId={currentId}
                                  entry={curr}
                                  insertTopMargin={insertTopMargin}
                                  isRemovingEnabled={isRemovingEnabled}
                                  mtradition_id={mtradition_id}
                                  sortOrder={sortOrder}
                                  addPoint={addPoint}
                                  removePoint={removePoint}
                                  removeFromList={removeFromList}
                                  removeBlessingFromList={removeBlessingFromList}
                                  selectForInfo={handleShowInfo}
                                  />
                              )
                            )
                          })
                          (Nothing),
                snd,
                toArray,
                arr => <>{arr}</>
              )),
              fromMaybe (
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
      <WikiInfoContainer l10n={l10n} currentId={currentId} />
    </Page>
  )
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
             (!BlessingCombined.is (prev) && BlessingCombined.is (curr))
             || (BlessingCombined.is (prev) && !BlessingCombined.is (curr))
             || (
               !BlessingCombined.is (prev)
               && !BlessingCombined.is (curr)
               && notEquals (LCBCA.gr (prev)) (LCBCA.gr (curr))
             )),
      or
    )
