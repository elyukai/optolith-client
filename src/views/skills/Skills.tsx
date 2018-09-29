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
import { SortNames, SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfoContainer';
import { DCIds } from '../../selectors/derivedCharacteristicsSelectors';
import { AttributeDependent, EntryRating, Hero, SecondaryAttribute } from '../../types/data';
import { SkillCombined } from '../../types/view';
import { Skill } from '../../types/wiki';
import { Just, List, Maybe, Nothing, OrderedMap, Record, Tuple } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { isCommon, isDecreasable, isIncreasable, isUncommon } from '../../utils/skillUtils';
import { SkillListItem } from './SkillListItem';

export interface SkillsOwnProps {
  locale: UIMessagesObject;
}

export interface SkillsStateProps {
  attributes: Maybe<OrderedMap<string, Record<AttributeDependent>>>;
  currentHero: Maybe<Hero>;
  derivedCharacteristics: OrderedMap<DCIds, Record<SecondaryAttribute>>;
  list: List<Record<SkillCombined>>;
  isRemovingEnabled: boolean;
  sortOrder: string;
  filterText: string;
  ratingVisibility: boolean;
  skillRating: OrderedMap<string, EntryRating>;
}

export interface SkillsDispatchProps {
  setSortOrder (sortOrder: Maybe<string>): void;
  setFilterText (filterText: string): void;
  switchRatingVisibility (): void;
  addPoint (id: string): void;
  removePoint (id: string): void;
}

export type SkillsProps = SkillsStateProps & SkillsDispatchProps & SkillsOwnProps;

export interface SkillsState {
  infoId?: string;
}

export class Skills extends React.Component<SkillsProps, SkillsState> {
  state: SkillsState = {};

  showInfo = (id: string) => this.setState ({ infoId: id });

  render () {
    const {
      addPoint,
      currentHero,
      attributes,
      derivedCharacteristics,
      locale,
      isRemovingEnabled,
      ratingVisibility,
      removePoint,
      setSortOrder,
      sortOrder,
      switchRatingVisibility,
      skillRating,
      list,
      filterText,
    } = this.props;

    const { infoId } = this.state;

    return (
      <Page id="talents">
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
            locale={locale}
            options={List.of<SortNames> ('name', 'group', 'ic')}
            />
          <Checkbox
            checked={ratingVisibility}
            onClick={switchRatingVisibility}
            >
            {translate (locale, 'skills.options.commoninculture')}
          </Checkbox>
          {ratingVisibility && <RecommendedReference locale={locale} />}
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (locale, 'name')}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (locale, 'group')}
            </ListHeaderTag>
            <ListHeaderTag className="value" hint={translate (locale, 'sr.long')}>
              {translate (locale, 'sr.short')}
            </ListHeaderTag>
            <ListHeaderTag className="check">
              {translate (locale, 'check')}
            </ListHeaderTag>
            <ListHeaderTag className="ic" hint={translate (locale, 'ic.long')}>
              {translate (locale, 'ic.short')}
            </ListHeaderTag>
            {isRemovingEnabled && <ListHeaderTag className="btn-placeholder" />}
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <Scroll>
            <ListView>
              {
                list .null ()
                  ? <ListPlaceholder locale={locale} type="skills" noResults />
                  : Tuple.snd (
                    List.mapAccumL<Maybe<Record<SkillCombined>>, Record<SkillCombined>, JSX.Element>
                      (previous => current =>
                        Tuple.of<Maybe<Record<SkillCombined>>, JSX.Element>
                          (Just (current))
                          (
                            <SkillListItem
                              key={current .get ('id')}
                              id={current .get ('id')}
                              typ={
                                ratingVisibility
                                && isCommon (skillRating) (current as any as Record<Skill>)
                              }
                              untyp={
                                ratingVisibility
                                && isUncommon (skillRating) (current as any as Record<Skill>)
                              }
                              name={current .get ('name')}
                              sr={current .get ('value')}
                              check={current .get ('check')}
                              ic={current .get ('ic')}
                              addPoint={addPoint.bind (null, obj.id)}
                              addDisabled={!isIncreasable (currentHero, obj)}
                              removePoint={isRemovingEnabled ? removePoint.bind (null, obj.id) : undefined}
                              removeDisabled={!isDecreasable (currentHero, obj)}
                              insertTopMargin={
                                sortOrder === 'group'
                                && Maybe.notElem
                                  (current .get ('gr'))
                                  (previous .fmap (Record.get<SkillCombined, 'gr'> ('gr')))
                              }
                              selectForInfo={this.showInfo}
                              attributes={attributes}
                              derivedCharacteristics={derivedCharacteristics}
                              groupIndex={obj.gr}
                              groupList={translate (locale, 'skills.view.groups')}
                              />
                          ))
                      (Nothing ())
                      (list)
                  )
                    .toArray ()
              }
            </ListView>
          </Scroll>
        </MainContent>
        <WikiInfoContainer {...this.props} currentId={infoId}/>
      </Page>
    );
  }
}
