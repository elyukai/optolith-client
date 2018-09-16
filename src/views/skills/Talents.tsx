import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { ListView } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { ListPlaceholder } from '../../components/ListPlaceholder';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RecommendedReference } from '../../components/RecommendedReference';
import { Scroll } from '../../components/Scroll';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { DCIds } from '../../selectors/derivedCharacteristicsSelectors';
import { AttributeInstance, InputTextEvent, SecondaryAttribute, TalentInstance, ToListById } from '../../types/data';
import { UIMessages } from '../../types/ui';
import { translate } from '../../utils/I18n';
import { isDecreasable, isIncreasable, isTyp, isUntyp } from '../../utils/skillUtils';
import { SkillListItem } from './SkillListItem';

export interface TalentsOwnProps {
  locale: UIMessages;
}

export interface TalentsStateProps {
  attributes: Map<string, AttributeInstance>;
  currentHero: CurrentHeroInstanceState;
  derivedCharacteristics: Map<DCIds, SecondaryAttribute>;
  list: TalentInstance[];
  isRemovingEnabled: boolean;
  sortOrder: string;
  filterText: string;
  ratingVisibility: boolean;
  talentRating: ToListById<string>;
}

export interface TalentsDispatchProps {
  setSortOrder(sortOrder: string): void;
  setFilterText(filterText: string): void;
  switchRatingVisibility(): void;
  addPoint(id: string): void;
  removePoint(id: string): void;
}

export type TalentsProps = TalentsStateProps & TalentsDispatchProps & TalentsOwnProps;

export interface TalentsState {
  infoId?: string;
}

export class Talents extends React.Component<TalentsProps, TalentsState> {
  state: TalentsState = {};

  filter = (event: InputTextEvent) => this.props.setFilterText(event.target.value);
  showInfo = (id: string) => this.setState({ infoId: id } as TalentsState);

  render() {
    const { addPoint, currentHero, attributes, derivedCharacteristics, locale, isRemovingEnabled, ratingVisibility, removePoint, setSortOrder, sortOrder, switchRatingVisibility, talentRating, list, filterText } = this.props;
    const { infoId } = this.state;

    return (
      <Page id="talents">
        <Options>
          <TextField hint={translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            locale={locale}
            options={['name', 'group', 'ic']}
            />
          <Checkbox checked={ratingVisibility} onClick={switchRatingVisibility}>{translate(locale, 'skills.options.commoninculture')}</Checkbox>
          {ratingVisibility && <RecommendedReference locale={locale} />}
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate(locale, 'name')}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate(locale, 'group')}
            </ListHeaderTag>
            <ListHeaderTag className="value" hint={translate(locale, 'sr.long')}>
              {translate(locale, 'sr.short')}
            </ListHeaderTag>
            <ListHeaderTag className="check">
              {translate(locale, 'check')}
            </ListHeaderTag>
            <ListHeaderTag className="ic" hint={translate(locale, 'ic.long')}>
              {translate(locale, 'ic.short')}
            </ListHeaderTag>
            {isRemovingEnabled && <ListHeaderTag className="btn-placeholder" />}
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <Scroll>
            <ListView>
              {
                list.length === 0 ? <ListPlaceholder locale={locale} type="skills" noResults /> : list.map((obj, index, array) => {
                  const prevObj = array[index - 1];
                  return (
                    <SkillListItem
                      key={obj.id}
                      id={obj.id}
                      typ={ratingVisibility && isTyp(talentRating, obj)}
                      untyp={ratingVisibility && isUntyp(talentRating, obj)}
                      name={obj.name}
                      sr={obj.value}
                      check={obj.check}
                      ic={obj.ic}
                      addPoint={addPoint.bind(null, obj.id)}
                      addDisabled={!isIncreasable(currentHero, obj)}
                      removePoint={isRemovingEnabled ? removePoint.bind(null, obj.id) : undefined}
                      removeDisabled={!isDecreasable(currentHero, obj)}
                      insertTopMargin={sortOrder === 'group' && prevObj && prevObj.gr !== obj.gr}
                      selectForInfo={this.showInfo}
                      attributes={attributes}
                      derivedCharacteristics={derivedCharacteristics}
                      groupIndex={obj.gr}
                      groupList={translate(locale, 'skills.view.groups')}
                      />
                  );
                })
              }
            </ListView>
          </Scroll>
        </MainContent>
        <WikiInfoContainer {...this.props} currentId={infoId}/>
      </Page>
    );
  }
}
