import * as React from "react";
import { notEquals } from "../../../Data/Eq";
import { fmap } from "../../../Data/Functor";
import { List, mapAccumL, notNull, toArray } from "../../../Data/List";
import { bindF, ensure, fromMaybe, Just, Maybe, maybe, Nothing } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Pair, snd } from "../../../Data/Tuple";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { EntryRating } from "../../Models/Hero/heroTypeHelpers";
import { AttributeCombined } from "../../Models/View/AttributeCombined";
import { SkillWithRequirements, SkillWithRequirementsA_ } from "../../Models/View/SkillWithRequirements";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { isCommon, isUncommon } from "../../Utilities/Increasable/skillUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
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
  hero: HeroModelRecord
}

export interface SkillsStateProps {
  attributes: List<Record<AttributeCombined>>
  list: Maybe<List<Record<SkillWithRequirements>>>
  isRemovingEnabled: boolean
  sortOrder: SortNames
  filterText: string
  ratingVisibility: boolean
  skillRating: OrderedMap<string, EntryRating>
}

export interface SkillsDispatchProps {
  setSortOrder (sortOrder: SortNames): void
  setFilterText (filterText: string): void
  switchRatingVisibility (): void
  addPoint (id: string): void
  removePoint (id: string): void
}

export type SkillsProps = SkillsStateProps & SkillsDispatchProps & SkillsOwnProps

export interface SkillsState {
  infoId: Maybe<string>
}

type Element = Record<SkillWithRequirements>
const SWRA = SkillWithRequirements.A
const SWRA_ = SkillWithRequirementsA_

export class Skills extends React.Component<SkillsProps, SkillsState> {
  state: SkillsState = {
    infoId: Nothing,
  }

  showInfo = (id: string) => this.setState ({ infoId: Just (id) })

  render () {
    const {
      addPoint,
      attributes,
      l10n,
      isRemovingEnabled,
      ratingVisibility: is_rating_visible,
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
            onChange={this.props.setFilterText}
            fullWidth
            />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            l10n={l10n}
            options={List<SortNames> ("name", "group", "ic")}
            />
          <Checkbox
            checked={is_rating_visible}
            onClick={switchRatingVisibility}
            >
            {translate (l10n) ("commonskills")}
          </Checkbox>
          {is_rating_visible ? <RecommendedReference l10n={l10n} /> : null}
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
                list,
                bindF (ensure (notNull)),
                fmap (pipe (
                  mapAccumL ((mprev: Maybe<Element>) => (curr: Element) =>
                              Pair<Maybe<Element>, JSX.Element> (
                                Just (curr),
                                (
                                  <SkillListItem
                                    key={SWRA_.id (curr)}
                                    id={SWRA_.id (curr)}
                                    typ={
                                      is_rating_visible
                                      && isCommon (skillRating) (SWRA.wikiEntry (curr))
                                    }
                                    untyp={
                                      is_rating_visible
                                      && isUncommon (skillRating) (SWRA.wikiEntry (curr))
                                    }
                                    name={SWRA_.name (curr)}
                                    sr={SWRA_.value (curr)}
                                    check={SWRA_.check (curr)}
                                    ic={SWRA_.ic (curr)}
                                    addDisabled={!SWRA.isIncreasable (curr)}
                                    addPoint={addPoint.bind (null, SWRA_.id (curr))}
                                    removeDisabled={!SWRA.isDecreasable (curr)}
                                    removePoint={
                                      isRemovingEnabled
                                        ? removePoint.bind (null, SWRA_.id (curr))
                                        : undefined
                                    }
                                    addFillElement
                                    insertTopMargin={isTopMarginNeeded (sortOrder) (curr) (mprev)}
                                    attributes={attributes}
                                    l10n={l10n}
                                    selectForInfo={this.showInfo}
                                    groupIndex={SWRA_.gr (curr)}
                                    groupList={translate (l10n) ("skillgroups")}
                                    selectedForInfo={infoId}
                                    />
                                )
                              ))
                            (Nothing),
                  snd,
                  toArray,
                  arr => <>{arr}</>
                )),
                fromMaybe (<ListPlaceholder l10n={l10n} type="skills" noResults />)
              )}
            </ListView>
          </Scroll>
        </MainContent>
        <WikiInfoContainer {...this.props} currentId={infoId}/>
      </Page>
    )
  }
}

const isTopMarginNeeded =
  (sortOrder: string) =>
  (curr: Element) =>
  (mprev: Maybe<Element>) =>
    sortOrder === "group"
    && maybe (false) (pipe (SWRA_.gr, notEquals (SWRA_.gr (curr)))) (mprev)
