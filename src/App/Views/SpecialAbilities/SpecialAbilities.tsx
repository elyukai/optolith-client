import * as React from "react";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { ActivatableDependent, ActivateArgs, ActiveViewObject, DeactivateArgs, DeactiveViewObject } from "../../Models/Hero/heroTypeHelpers";
import { SpecialAbility } from "../../Models/Wiki/wikiTypeHelpers";
import { translate, UIMessagesObject } from "../../Utilities/I18n";
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
  locale: UIMessagesObject
}

export interface SpecialAbilitiesStateProps {
  activeList: Maybe<List<Record<ActiveViewObject<SpecialAbility>>>>
  deactiveList: Maybe<List<
    Record<ActiveViewObject<SpecialAbility>>
    | Record<DeactiveViewObject<SpecialAbility>>
  >>
  stateEntries: Maybe<OrderedMap<string, Record<ActivatableDependent>>>
  wikiEntries: OrderedMap<string, Record<SpecialAbility>>
  enableActiveItemHints: boolean
  isRemovingEnabled: boolean
  sortOrder: string
  filterText: string
  inactiveFilterText: string
}

export interface SpecialAbilitiesDispatchProps {
  setSortOrder (sortOrder: string): void
  switchActiveItemHints (): void
  addToList (args: ActivateArgs): void
  removeFromList (args: DeactivateArgs): void
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
    currentId: Nothing (),
    currentSlideinId: Nothing (),
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
      locale,
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
        <Slidein isOpened={showAddSlidein} close={this.hideAddSlidein}>
          <Options>
            <TextField
              hint={translate (locale, "options.filtertext")}
              value={inactiveFilterText}
              onChangeString={this.props.setInactiveFilterText}
              fullWidth />
            <SortOptions
              sortOrder={sortOrder}
              sort={setSortOrder}
              options={List.of<SortNames> ("name", "groupname")}
              locale={locale}
              />
            <Checkbox
              checked={enableActiveItemHints}
              onClick={switchActiveItemHints}
              >
              {translate (locale, "options.showactivated")}
            </Checkbox>
          </Options>
          <MainContent>
            <ListHeader>
              <ListHeaderTag className="name">
                {translate (locale, "name")}
              </ListHeaderTag>
              <ListHeaderTag className="group">
                {translate (locale, "group")}
                </ListHeaderTag>
              <ListHeaderTag className="cost" hint={translate (locale, "aptext")}>
                {translate (locale, "apshort")}
              </ListHeaderTag>
              <ListHeaderTag className="btn-placeholder" />
              <ListHeaderTag className="btn-placeholder" />
            </ListHeader>
            <ActivatableAddList
              addToList={addToList}
              inactiveList={
                deactiveList as
                  Maybe<List<Record<ActiveViewObject> | Record<DeactiveViewObject>>>
              }
              locale={locale}
              selectForInfo={this.showSlideinInfo}
              />
          </MainContent>
          <WikiInfoContainer {...this.props} currentId={this.state.currentSlideinId}/>
        </Slidein>
        <Options>
          <TextField
            hint={translate (locale, "options.filtertext")}
            value={filterText}
            onChangeString={this.props.setFilterText}
            fullWidth
            />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            options={List.of<SortNames> ("name", "groupname")}
            locale={locale}
            />
          <BorderButton
            label={translate (locale, "actions.addtolist")}
            onClick={this.showAddSlidein}
            />
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (locale, "name")}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (locale, "group")}
              </ListHeaderTag>
            <ListHeaderTag className="cost" hint={translate (locale, "aptext")}>
              {translate (locale, "apshort")}
            </ListHeaderTag>
            {isRemovingEnabled && <ListHeaderTag className="btn-placeholder" />}
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <ActivatableRemoveList
            filterText={filterText}
            list={activeList as Maybe<List<Record<ActiveViewObject>>>}
            locale={locale}
            isRemovingEnabled={isRemovingEnabled}
            removeFromList={removeFromList}
            setLevel={setLevel}
            selectForInfo={this.showInfo}
            />
        </MainContent>
        <WikiInfoContainer {...this.props} {...this.state} />
      </Page>
    )
  }
}
