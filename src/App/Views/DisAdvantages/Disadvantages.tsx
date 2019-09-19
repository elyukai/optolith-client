import * as React from "react";
import { fmapF } from "../../../Data/Functor";
import { List } from "../../../Data/List";
import { fromMaybe, Just, Maybe, Nothing } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions";
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { EntryRating } from "../../Models/Hero/heroTypeHelpers";
import { ActiveActivatable } from "../../Models/View/ActiveActivatable";
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories";
import { InactiveActivatable } from "../../Models/View/InactiveActivatable";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { BorderButton } from "../Universal/BorderButton";
import { Checkbox } from "../Universal/Checkbox";
import { ListHeader } from "../Universal/ListHeader";
import { ListHeaderTag } from "../Universal/ListHeaderTag";
import { MainContent } from "../Universal/MainContent";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { RecommendedReference } from "../Universal/RecommendedReference";
import { Slidein } from "../Universal/Slidein";
import { TextField } from "../Universal/TextField";
import { ActiveList } from "./ActiveList";
import { AdvantagesDisadvantagesAdventurePoints } from "./AdvantagesDisadvantagesAdventurePoints";
import { InactiveList } from "./DeactiveList";

export interface DisadvantagesOwnProps {
  hero: HeroModelRecord
  l10n: L10nRecord
}

export interface DisadvantagesStateProps {
  activeList: Maybe<List<Record<ActiveActivatable<Disadvantage>>>>
  ap: Maybe<Record<AdventurePointsCategories>>
  deactiveList: Maybe<List<
    Record<ActiveActivatable<Disadvantage>>
    | Record<InactiveActivatable<Disadvantage>>
  >>
  enableActiveItemHints: boolean
  stateEntries: Maybe<OrderedMap<string, Record<ActivatableDependent>>>
  wikiEntries: OrderedMap<string, Record<Disadvantage>>
  magicalMax: Maybe<number>
  rating: Maybe<OrderedMap<string, EntryRating>>
  showRating: boolean
  isRemovingEnabled: boolean
  filterText: string
  inactiveFilterText: string
}

export interface DisadvantagesDispatchProps {
  switchActiveItemHints (): void
  switchRatingVisibility (): void
  addToList (args: Record<ActivatableActivationOptions>): void
  removeFromList (args: Record<ActivatableDeactivationOptions>): void
  setLevel (id: string, index: number, level: number): void
  setFilterText (filterText: string): void
  setInactiveFilterText (filterText: string): void
}

export type DisadvantagesProps =
  DisadvantagesStateProps
  & DisadvantagesDispatchProps
  & DisadvantagesOwnProps

export interface DisadvantagesState {
  showAddSlidein: boolean
  currentId: Maybe<string>
  currentSlideinId: Maybe<string>
}

export class Disadvantages extends React.Component<DisadvantagesProps, DisadvantagesState> {
  state = {
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
      activeList,
      addToList,
      ap: m_ap,
      deactiveList,
      enableActiveItemHints,
      magicalMax,
      l10n,
      rating,
      showRating,
      switchActiveItemHints,
      switchRatingVisibility,
      filterText,
      inactiveFilterText,
      setFilterText,
      setInactiveFilterText,
    } = this.props

    return (
      <Page id="advantages">
        <Slidein isOpen={this.state.showAddSlidein} close={this.hideAddSlidein}>
          <Options>
            <TextField
              hint={translate (l10n) ("search")}
              value={inactiveFilterText}
              onChange={setInactiveFilterText}
              fullWidth
              />
            <Checkbox
              checked={showRating}
              onClick={switchRatingVisibility}
              >
              {translate (l10n) ("commondisadvantages")}
            </Checkbox>
            <Checkbox
              checked={enableActiveItemHints}
              onClick={switchActiveItemHints}
              >
              {translate (l10n) ("showactivated")}
            </Checkbox>
            {fromMaybe (null as React.ReactNode)
                       (fmapF (m_ap)
                              (ap => (
                                <AdvantagesDisadvantagesAdventurePoints
                                  ap={ap}
                                  magicalMax={magicalMax}
                                  l10n={l10n}
                                  />
                              )))}
            {showRating ? <RecommendedReference l10n={l10n} strongly /> : null}
          </Options>
          <MainContent>
            <ListHeader>
              <ListHeaderTag className="name">
                {translate (l10n) ("name")}
              </ListHeaderTag>
              <ListHeaderTag className="cost" hint={translate (l10n) ("adventurepoints")}>
                {translate (l10n) ("adventurepoints.short")}
              </ListHeaderTag>
              <ListHeaderTag className="btn-placeholder" />
              <ListHeaderTag className="btn-placeholder" />
            </ListHeader>
            <InactiveList
              inactiveList={deactiveList}
              l10n={l10n}
              rating={rating}
              showRating={showRating}
              addToList={addToList}
              selectForInfo={this.showSlideinInfo}
              selectedForInfo={this.state.currentSlideinId}
              />
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
          <Checkbox
            checked={showRating}
            onClick={switchRatingVisibility}
            >
            {translate (l10n) ("commondisadvantages")}
          </Checkbox>
          <BorderButton
            label={translate (l10n) ("add")}
            onClick={this.showAddSlidein}
            />
          {showRating ? <RecommendedReference l10n={l10n} strongly /> : null}
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (l10n) ("name")}
            </ListHeaderTag>
            <ListHeaderTag className="cost" hint={translate (l10n) ("adventurepoints")}>
              {translate (l10n) ("adventurepoints.short")}
            </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <ActiveList
            {...this.props}
            filterText={filterText}
            list={activeList}
            selectForInfo={this.showInfo}
            selectedForInfo={this.state.currentId}
            />
        </MainContent>
        <WikiInfoContainer {...this.props} {...this.state} />
      </Page>
    )
  }
}
