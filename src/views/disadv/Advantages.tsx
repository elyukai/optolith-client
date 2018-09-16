import * as React from 'react';
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
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { AdventurePointsObject } from '../../selectors/adventurePointsSelectors';
import { ActivateArgs, ActiveViewObject, AdvantageInstance, DeactivateArgs, DeactiveViewObject, InputTextEvent, Instance, ToListById } from '../../types/data';
import { UIMessages } from '../../types/ui';
import { translate } from '../../utils/I18n';
import { ActiveList } from './ActiveList';
import { AdvantagesDisadvantagesAdventurePoints } from './AdvantagesDisadvantagesAdventurePoints';
import { DeactiveList } from './DeactiveList';

export interface AdvantagesOwnProps {
  locale: UIMessages;
}

export interface AdvantagesStateProps {
  activeList: ActiveViewObject[];
  ap: AdventurePointsObject;
  deactiveList: DeactiveViewObject[];
  enableActiveItemHints: boolean;
  list: AdvantageInstance[];
  magicalMax: number;
  rating: ToListById<string>;
  showRating: boolean;
  isRemovingEnabled: boolean;
  filterText: string;
  inactiveFilterText: string;
  get(id: string): Instance | undefined;
}

export interface AdvantagesDispatchProps {
  switchActiveItemHints(): void;
  switchRatingVisibility(): void;
  addToList(args: ActivateArgs): void;
  removeFromList(args: DeactivateArgs): void;
  setTier(id: string, index: number, tier: number): void;
  setFilterText(filterText: string): void;
  setInactiveFilterText(filterText: string): void;
}

export type AdvantagesProps = AdvantagesStateProps & AdvantagesDispatchProps & AdvantagesOwnProps;

export interface AdvantagesState {
  showAddSlidein: boolean;
  currentId?: string;
  currentSlideinId?: string;
}

export class Advantages extends React.Component<AdvantagesProps, AdvantagesState> {
  state = {
    showAddSlidein: false,
    currentId: undefined,
    currentSlideinId: undefined
  };

  filter = (event: InputTextEvent) => this.props.setFilterText(event.target.value);
  filterSlidein = (event: InputTextEvent) => this.props.setInactiveFilterText(event.target.value);
  showAddSlidein = () => this.setState({ showAddSlidein: true } as AdvantagesState);
  hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as AdvantagesState);
  showInfo = (id: string) => this.setState({ currentId: id } as AdvantagesState);
  showSlideinInfo = (id: string) => this.setState({ currentSlideinId: id } as AdvantagesState);

  render() {
    const { activeList, addToList, ap, deactiveList, enableActiveItemHints, get, magicalMax, locale, rating, showRating, switchActiveItemHints, switchRatingVisibility, filterText, inactiveFilterText } = this.props;

    return (
      <Page id="advantages">
        <Slidein isOpened={this.state.showAddSlidein} close={this.hideAddSlidein}>
          <Options>
            <TextField hint={translate(locale, 'options.filtertext')} value={inactiveFilterText} onChange={this.filterSlidein} fullWidth />
            <Checkbox checked={showRating} onClick={switchRatingVisibility}>{translate(locale, 'advantages.options.common')}</Checkbox>
            <Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>{translate(locale, 'options.showactivated')}</Checkbox>
            <AdvantagesDisadvantagesAdventurePoints
              total={ap.spentOnAdvantages}
              blessed={ap.spentOnBlessedAdvantages}
              magical={ap.spentOnMagicalAdvantages}
              magicalMax={magicalMax}
              locale={locale}
              />
            {showRating && <RecommendedReference locale={locale} />}
          </Options>
          <MainContent>
            <ListHeader>
              <ListHeaderTag className="name">
                {translate(locale, 'name')}
              </ListHeaderTag>
              <ListHeaderTag className="cost" hint={translate(locale, 'aptext')}>
                {translate(locale, 'apshort')}
              </ListHeaderTag>
              <ListHeaderTag className="btn-placeholder" />
              <ListHeaderTag className="btn-placeholder" />
            </ListHeader>
            <DeactiveList
              activeList={enableActiveItemHints ? activeList : undefined}
              list={deactiveList}
              locale={locale}
              rating={rating}
              showRating={showRating}
              get={get}
              addToList={addToList}
              selectForInfo={this.showSlideinInfo}
              />
          </MainContent>
          <WikiInfoContainer {...this.props} currentId={this.state.currentSlideinId} />
        </Slidein>
        <Options>
          <TextField hint={translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
          <Checkbox checked={showRating} onClick={switchRatingVisibility}>{translate(locale, 'advantages.options.common')}</Checkbox>
          <BorderButton label={translate(locale, 'actions.addtolist')} onClick={this.showAddSlidein} />
          {showRating && <RecommendedReference locale={locale} />}
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate(locale, 'name')}
            </ListHeaderTag>
            <ListHeaderTag className="cost" hint={translate(locale, 'aptext')}>
              {translate(locale, 'apshort')}
            </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <ActiveList
            {...this.props}
            filterText={filterText}
            list={activeList}
            selectForInfo={this.showInfo}
            />
        </MainContent>
        <WikiInfoContainer {...this.props} {...this.state} />
      </Page>
    );
  }
}
