import * as React from "react";
import { List } from "../../../Data/List";
import { fromMaybeR, Just, Maybe, Nothing } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { EntryRating, SecondaryAttribute } from "../../Models/Hero/heroTypeHelpers";
import { AttributeCombined, SkillWithRequirements } from "../../Models/View/viewTypeHelpers";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Skill } from "../../Models/Wiki/wikiTypeHelpers";
import { DCIds } from "../../Selectors/derivedCharacteristicsSelectors";
import { translate } from "../../Utilities/I18n";
import { Checkbox } from "../Universal/Checkbox";
import { ListView } from "../Universal/List";
import { ListHeader } from "../Universal/ListHeader";
import { ListHeaderTag } from "../Universal/ListHeaderTag";
import { ListPlaceholder } from "../Universal/ListPlaceholder";
import { MainContent } from "../Universal/MainContent";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { RecommendedReference } from "../Universal/RecommendedReference";
import { Scroll } from "../Universal/Scroll";
import { SortNames, SortOptions } from "../Universal/SortOptions";
import { TextField } from "../Universal/TextField";
import { SkillListItem } from "./SkillListItem";

export interface SkillsOwnProps {
  l10n: L10nRecord
}

export interface SkillsStateProps {
  attributes: List<Record<AttributeCombined>>
  derivedCharacteristics: OrderedMap<DCIds, Record<SecondaryAttribute>>
  list: Maybe<List<Record<SkillWithRequirements>>>
  isRemovingEnabled: boolean
  sortOrder: string
  filterText: string
  ratingVisibility: boolean
  skillRating: OrderedMap<string, EntryRating>
}

export interface SkillsDispatchProps {
  setSortOrder (sortOrder: string): void
  setFilterText (filterText: string): void
  switchRatingVisibility (): void
  addPoint (id: string): void
  removePoint (id: string): void
}

export type SkillsProps = SkillsStateProps & SkillsDispatchProps & SkillsOwnProps

export interface SkillsState {
  infoId: Maybe<string>
}

export class Skills extends React.Component<SkillsProps, SkillsState> {
  state: SkillsState = {
    infoId: Nothing,
  }

  showInfo = (id: string) => this.setState ({ infoId: Just (id) })

  render () {
    const {
      addPoint,
      attributes,
      derivedCharacteristics,
      l10n,
      isRemovingEnabled,
      ratingVisibility,
      removePoint,
      setSortOrder,
      sortOrder,
      switchRatingVisibility,
      skillRating,
      list,
      filterText,
    } = this.props

    const { infoId } = this.state

    return (
      <Page id="talents">
        <Options>
          <TextField
            hint={translate (l10n) ("search")}
            value={filterText}
            onChangeString={this.props.setFilterText}
            fullWidth
            />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            l10n={l10n}
            options={List<SortNames> ("name", "group", "ic")}
            />
          <Checkbox
            checked={ratingVisibility}
            onClick={switchRatingVisibility}
            >
            {translate (l10n) ("commoninculture")}
          </Checkbox>
          {ratingVisibility ? <RecommendedReference l10n={l10n} /> : null}
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (l10n) ("name")}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (l10n) ("group")}
            </ListHeaderTag>
            <ListHeaderTag className="value" hint={translate (l10n) ("skillrating")}>
              {translate (l10n) ("skillrating.short")}
            </ListHeaderTag>
            <ListHeaderTag className="check">
              {translate (l10n) ("check")}
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
                                      derivedCharacteristics={derivedCharacteristics}
                                      selectForInfo={this.showSlideinInfo}
                                      addText={
                                        sortOrder === "group"
                                          ? `${aspects} / ${translate (l10n) ("blessing")}`
                                          : aspects
                                      }
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
                  <ListPlaceholder
                    l10n={l10n}
                    type="skills"
                    noResults
                    />
                )
              )}
              {
                Maybe.fromMaybe<NonNullable<React.ReactNode>>
                  (<ListPlaceholder l10n={l10n} type="skills" noResults />)
                  (list
                    .bind (Maybe.ensure (R.complement (List.null)))
                    .fmap (R.pipe (
                      List.mapAccumL<
                        Maybe<Record<SkillWithRequirements>>,
                        Record<SkillWithRequirements>,
                        JSX.Element
                      >
                        (previous => current =>
                          Tuple.of<Maybe<Record<SkillWithRequirements>>, JSX.Element>
                            (Just (current))
                            (
                              <SkillListItem
                                key={current .get ("id")}
                                id={current .get ("id")}
                                typ={
                                  ratingVisibility
                                  && isCommon (skillRating) (current as any as Record<Skill>)
                                }
                                untyp={
                                  ratingVisibility
                                  && isUncommon (skillRating) (current as any as Record<Skill>)
                                }
                                name={current .get ("name")}
                                sr={current .get ("value")}
                                check={current .get ("check")}
                                ic={current .get ("ic")}
                                addPoint={addPoint.bind (null, current .get ("id"))}
                                addDisabled={!current .get ("isIncreasable")}
                                removePoint={
                                  isRemovingEnabled
                                    ? removePoint.bind (null, current .get ("id"))
                                    : undefined
                                }
                                removeDisabled={!current .get ("isDecreasable")}
                                insertTopMargin={
                                  sortOrder === "group"
                                  && Maybe.isJust (previous)
                                  && Maybe.fromJust (previous) .get ("gr") !== current .get ("gr")
                                }
                                selectForInfo={this.showInfo}
                                attributes={attributes}
                                derivedCharacteristics={derivedCharacteristics}
                                groupIndex={current .get ("gr")}
                                groupList={translate (l10n) ("skills.view.groups")}
                                />
                            ))
                        (Nothing ()),
                      Tuple.snd,
                      List.toArray
                    )))
              }
            </ListView>
          </Scroll>
        </MainContent>
        <WikiInfoContainer {...this.props} currentId={infoId}/>
      </Page>
    )
  }
}
