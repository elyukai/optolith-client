import * as React from "react";
import { List } from "../../../Data/List";
import { Just, Maybe, Nothing } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions";
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ActiveActivatable } from "../../Models/View/ActiveActivatable";
import { InactiveActivatable } from "../../Models/View/InactiveActivatable";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { translate } from "../../Utilities/I18n";
import { ActivatableAddList } from "../Activatable/ActivatableAddList";
import { ActivatableRemoveList } from "../Activatable/ActivatableRemoveList";
import { BorderButton } from "../Universal/BorderButton";
import { Checkbox } from "../Universal/Checkbox";
import { ListHeader } from "../Universal/ListHeader";
import { ListHeaderTag } from "../Universal/ListHeaderTag";
import { MainContent } from "../Universal/MainContent";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Slidein } from "../Universal/Slidein";
import { SortNames, SortOptions } from "../Universal/SortOptions";
import { TextField } from "../Universal/TextField";

export interface SpecialAbilitiesOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface SpecialAbilitiesStateProps {
  activeList: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  deactiveList: Maybe<List<
    Record<ActiveActivatable<SpecialAbility>>
    | Record<InactiveActivatable<SpecialAbility>>
  >>
  wikiEntries: OrderedMap<string, Record<SpecialAbility>>
  enableActiveItemHints: boolean
  isRemovingEnabled: boolean
  sortOrder: SortNames
  filterText: string
  inactiveFilterText: string
}

export interface SpecialAbilitiesDispatchProps {
  setSortOrder (sortOrder: SortNames): void
  switchActiveItemHints (): void
  addToList (args: Record<ActivatableActivationOptions>): void
  removeFromList (args: Record<ActivatableDeactivationOptions>): void
  setLevel (id: string, index: number, level: number): void
  setFilterText (filterText: string): void
  setInactiveFilterText (filterText: string): void
}

export type SpecialAbilitiesProps =
  SpecialAbilitiesStateProps
  & SpecialAbilitiesDispatchProps
  & SpecialAbilitiesOwnProps

export interface SpecialAbilitiesState {
  showAddSlidein: boolean
  currentId: Maybe<string>
  currentSlideinId: Maybe<string>
}

export class SpecialAbilities
  extends React.Component<SpecialAbilitiesProps, SpecialAbilitiesState> {
  state: SpecialAbilitiesState = {
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
      deactiveList,
      enableActiveItemHints,
      l10n,
      isRemovingEnabled,
      removeFromList,
      setSortOrder,
      setLevel,
      sortOrder,
      switchActiveItemHints,
      filterText,
      inactiveFilterText,
    } = this.props

    const { showAddSlidein } = this.state

    return (
      <Page id="specialabilities">
        <Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
          <Options>
            <TextField
              hint={translate (l10n) ("search")}
              value={inactiveFilterText}
              onChange={this.props.setInactiveFilterText}
              fullWidth />
            <SortOptions
              sortOrder={sortOrder}
              sort={setSortOrder}
              options={List<SortNames> ("name", "groupname")}
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
                {translate (l10n) ("group")}
                </ListHeaderTag>
              <ListHeaderTag className="cost" hint={translate (l10n) ("adventurepoints")}>
                {translate (l10n) ("adventurepoints.short")}
              </ListHeaderTag>
              <ListHeaderTag className="btn-placeholder" />
              <ListHeaderTag className="btn-placeholder" />
            </ListHeader>
            <ActivatableAddList
              addToList={addToList}
              inactiveList={deactiveList}
              l10n={l10n}
              selectForInfo={this.showSlideinInfo}
              selectedForInfo={this.state.currentSlideinId}
              />
          </MainContent>
          <WikiInfoContainer {...this.props} currentId={this.state.currentSlideinId}/>
        </Slidein>
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
            options={List<SortNames> ("name", "groupname")}
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
              {translate (l10n) ("group")}
              </ListHeaderTag>
            <ListHeaderTag className="cost" hint={translate (l10n) ("adventurepoints")}>
              {translate (l10n) ("adventurepoints.short")}
            </ListHeaderTag>
            {isRemovingEnabled ? <ListHeaderTag className="btn-placeholder" /> : null}
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <ActivatableRemoveList
            filterText={filterText}
            list={activeList}
            l10n={l10n}
            isRemovingEnabled={isRemovingEnabled}
            removeFromList={removeFromList}
            setLevel={setLevel}
            selectForInfo={this.showInfo}
            selectedForInfo={this.state.currentId}
            />
        </MainContent>
        <WikiInfoContainer {...this.props} {...this.state} />
      </Page>
    )
  }
}
