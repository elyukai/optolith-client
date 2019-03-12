import * as React from 'react';
import { WikiInfoContainer } from '../../App/Containers/WikiInfoContainer';
import { ActivatableDependent, ActivateArgs, ActiveViewObject, DeactivateArgs, DeactiveViewObject, EntryRating, InputTextEvent } from '../../App/Models/Hero/heroTypeHelpers';
import { Disadvantage } from '../../App/Models/Wiki/wikiTypeHelpers';
import { AdventurePointsObject } from '../../App/Selectors/adventurePointsSelectors';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RecommendedReference } from '../../components/RecommendedReference';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import { Just, List, Maybe, Nothing, OrderedMap, Record } from '../../utils/dataUtils';
import { ActiveList } from './ActiveList';
import { AdvantagesDisadvantagesAdventurePoints } from './AdvantagesDisadvantagesAdventurePoints';
import { InactiveList } from './DeactiveList';

export interface DisadvantagesOwnProps {
  locale: UIMessagesObject;
}

export interface DisadvantagesStateProps {
  activeList: Maybe<List<Record<ActiveViewObject<Disadvantage>>>>;
  ap: Record<AdventurePointsObject>;
  deactiveList: Maybe<List<
    Record<ActiveViewObject<Disadvantage>>
    | Record<DeactiveViewObject<Disadvantage>>
  >>;
  enableActiveItemHints: boolean;
  stateEntries: Maybe<OrderedMap<string, Record<ActivatableDependent>>>;
  wikiEntries: OrderedMap<string, Record<Disadvantage>>;
  magicalMax: Maybe<number>;
  rating: Maybe<OrderedMap<string, EntryRating>>;
  showRating: boolean;
  isRemovingEnabled: boolean;
  filterText: string;
  inactiveFilterText: string;
}

export interface DisadvantagesDispatchProps {
  switchActiveItemHints (): void;
  switchRatingVisibility (): void;
  addToList (args: ActivateArgs): void;
  removeFromList (args: DeactivateArgs): void;
  setLevel (id: string, index: number, level: number): void;
  setFilterText (filterText: string): void;
  setInactiveFilterText (filterText: string): void;
}

export type DisadvantagesProps =
  DisadvantagesStateProps
  & DisadvantagesDispatchProps
  & DisadvantagesOwnProps;

export interface DisadvantagesState {
  showAddSlidein: boolean;
  currentId: Maybe<string>;
  currentSlideinId: Maybe<string>;
}

export class Disadvantages extends React.Component<DisadvantagesProps, DisadvantagesState> {
  state = {
    showAddSlidein: false,
    currentId: Nothing (),
    currentSlideinId: Nothing (),
  };

  filter = (event: InputTextEvent) => this.props.setFilterText (event.target.value);
  filterSlidein = (event: InputTextEvent) => this.props.setInactiveFilterText (event.target.value);
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
      ap,
      deactiveList,
      enableActiveItemHints,
      magicalMax,
      locale,
      rating,
      showRating,
      switchActiveItemHints,
      switchRatingVisibility,
      filterText,
      inactiveFilterText,
    } = this.props;

    return (
      <Page id="advantages">
        <Slidein isOpened={this.state.showAddSlidein} close={this.hideAddSlidein}>
          <Options>
            <TextField
              hint={translate (locale, 'options.filtertext')}
              value={inactiveFilterText}
              onChange={this.filterSlidein}
              fullWidth
              />
            <Checkbox
              checked={showRating}
              onClick={switchRatingVisibility}
              >
              {translate (locale, 'disadvantages.options.common')}
            </Checkbox>
            <Checkbox
              checked={enableActiveItemHints}
              onClick={switchActiveItemHints}
              >
              {translate (locale, 'options.showactivated')}
            </Checkbox>
            <AdvantagesDisadvantagesAdventurePoints
              total={ap .get ('spentOnAdvantages')}
              blessed={ap .get ('spentOnBlessedAdvantages')}
              magical={ap .get ('spentOnMagicalAdvantages')}
              magicalMax={magicalMax}
              locale={locale}
              />
            {showRating && <RecommendedReference locale={locale} />}
          </Options>
          <MainContent>
            <ListHeader>
              <ListHeaderTag className="name">
                {translate (locale, 'name')}
              </ListHeaderTag>
              <ListHeaderTag className="cost" hint={translate (locale, 'aptext')}>
                {translate (locale, 'apshort')}
              </ListHeaderTag>
              <ListHeaderTag className="btn-placeholder" />
              <ListHeaderTag className="btn-placeholder" />
            </ListHeader>
            <InactiveList
              inactiveList={
                deactiveList as
                  Maybe<List<Record<ActiveViewObject> | Record<DeactiveViewObject>>>
              }
              locale={locale}
              rating={rating}
              showRating={showRating}
              addToList={addToList}
              selectForInfo={this.showSlideinInfo}
              />
          </MainContent>
          <WikiInfoContainer {...this.props} currentId={this.state.currentSlideinId} />
        </Slidein>
        <Options>
          <TextField
            hint={translate (locale, 'options.filtertext')}
            value={filterText}
            onChange={this.filter}
            fullWidth
            />
          <Checkbox
            checked={showRating}
            onClick={switchRatingVisibility}
            >
            {translate (locale, 'disadvantages.options.common')}
          </Checkbox>
          <BorderButton
            label={translate (locale, 'actions.addtolist')}
            onClick={this.showAddSlidein}
            />
          {showRating && <RecommendedReference locale={locale} />}
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (locale, 'name')}
            </ListHeaderTag>
            <ListHeaderTag className="cost" hint={translate (locale, 'aptext')}>
              {translate (locale, 'apshort')}
            </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <ActiveList
            {...this.props}
            filterText={filterText}
            list={activeList as Maybe<List<Record<ActiveViewObject>>>}
            selectForInfo={this.showInfo}
            />
        </MainContent>
        <WikiInfoContainer {...this.props} {...this.state} />
      </Page>
    );
  }
}
