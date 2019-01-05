import * as React from 'react';
import { SpecialAbility } from '../../App/Models/Wiki/wikiTypeHelpers';
import { ActivatableAddList } from '../../components/ActivatableAddList';
import { ActivatableRemoveList } from '../../components/ActivatableRemoveList';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Slidein } from '../../components/Slidein';
import { SortNames, SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfoContainer';
import { ActivatableDependent, ActivateArgs, ActiveViewObject, DeactivateArgs, DeactiveViewObject } from '../../types/data';
import { Just, List, Maybe, Nothing, OrderedMap, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';

export interface SpecialAbilitiesOwnProps {
  locale: UIMessagesObject;
}

export interface SpecialAbilitiesStateProps {
  activeList: Maybe<List<Record<ActiveViewObject<SpecialAbility>>>>;
  deactiveList: Maybe<List<
    Record<ActiveViewObject<SpecialAbility>>
    | Record<DeactiveViewObject<SpecialAbility>>
  >>;
  stateEntries: Maybe<OrderedMap<string, Record<ActivatableDependent>>>;
  wikiEntries: OrderedMap<string, Record<SpecialAbility>>;
  enableActiveItemHints: boolean;
  isRemovingEnabled: boolean;
  sortOrder: string;
  filterText: string;
  inactiveFilterText: string;
}

export interface SpecialAbilitiesDispatchProps {
  setSortOrder (sortOrder: string): void;
  switchActiveItemHints (): void;
  addToList (args: ActivateArgs): void;
  removeFromList (args: DeactivateArgs): void;
  setLevel (id: string, index: number, level: number): void;
  setFilterText (filterText: string): void;
  setInactiveFilterText (filterText: string): void;
}

export type SpecialAbilitiesProps =
  SpecialAbilitiesStateProps
  & SpecialAbilitiesDispatchProps
  & SpecialAbilitiesOwnProps;

export interface SpecialAbilitiesState {
  showAddSlidein: boolean;
  currentId: Maybe<string>;
  currentSlideinId: Maybe<string>;
}

export class SpecialAbilities
  extends React.Component<SpecialAbilitiesProps, SpecialAbilitiesState> {
  state: SpecialAbilitiesState = {
    showAddSlidein: false,
    currentId: Nothing (),
    currentSlideinId: Nothing (),
  };

  showAddSlidein = () => this.setState ({ showAddSlidein: true });

  hideAddSlidein = () => {
    this.props.setInactiveFilterText ('');
    this.setState ({ showAddSlidein: false });
  };

  showInfo = (id: string) => this.setState ({ currentId: Just (id) });
  showSlideinInfo = (id: string) => this.setState ({ currentSlideinId: Just (id) });

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
    } = this.props;

    const { showAddSlidein } = this.state;

    return (
      <Page id="specialabilities">
        <Slidein isOpened={showAddSlidein} close={this.hideAddSlidein}>
          <Options>
            <TextField
              hint={translate (locale, 'options.filtertext')}
              value={inactiveFilterText}
              onChangeString={this.props.setInactiveFilterText}
              fullWidth />
            <SortOptions
              sortOrder={sortOrder}
              sort={setSortOrder}
              options={List.of<SortNames> ('name', 'groupname')}
              locale={locale}
              />
            <Checkbox
              checked={enableActiveItemHints}
              onClick={switchActiveItemHints}
              >
              {translate (locale, 'options.showactivated')}
            </Checkbox>
          </Options>
          <MainContent>
            <ListHeader>
              <ListHeaderTag className="name">
                {translate (locale, 'name')}
              </ListHeaderTag>
              <ListHeaderTag className="group">
                {translate (locale, 'group')}
                </ListHeaderTag>
              <ListHeaderTag className="cost" hint={translate (locale, 'aptext')}>
                {translate (locale, 'apshort')}
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
            hint={translate (locale, 'options.filtertext')}
            value={filterText}
            onChangeString={this.props.setFilterText}
            fullWidth
            />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            options={List.of<SortNames> ('name', 'groupname')}
            locale={locale}
            />
          <BorderButton
            label={translate (locale, 'actions.addtolist')}
            onClick={this.showAddSlidein}
            />
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (locale, 'name')}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (locale, 'group')}
              </ListHeaderTag>
            <ListHeaderTag className="cost" hint={translate (locale, 'aptext')}>
              {translate (locale, 'apshort')}
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
    );
  }
}
