import * as R from 'ramda';
import * as React from 'react';
import { WikiInfoContainer } from '../../App/Containers/WikiInfoContainer';
import { EntryRating, SecondaryAttribute } from '../../App/Models/Hero/heroTypeHelpers';
import { AttributeCombined, SkillWithRequirements } from '../../App/Models/View/viewTypeHelpers';
import { Skill } from '../../App/Models/Wiki/wikiTypeHelpers';
import { DCIds } from '../../App/Selectors/derivedCharacteristicsSelectors';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
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
import { Just, List, Maybe, Nothing, OrderedMap, Record, Tuple } from '../../utils/dataUtils';
import { isCommon, isUncommon } from '../../utils/skillUtils';
import { SkillListItem } from './SkillListItem';

export interface SkillsOwnProps {
  locale: UIMessagesObject;
}

export interface SkillsStateProps {
  attributes: List<Record<AttributeCombined>>;
  derivedCharacteristics: OrderedMap<DCIds, Record<SecondaryAttribute>>;
  list: Maybe<List<Record<SkillWithRequirements>>>;
  isRemovingEnabled: boolean;
  sortOrder: string;
  filterText: string;
  ratingVisibility: boolean;
  skillRating: OrderedMap<string, EntryRating>;
}

export interface SkillsDispatchProps {
  setSortOrder (sortOrder: string): void;
  setFilterText (filterText: string): void;
  switchRatingVisibility (): void;
  addPoint (id: string): void;
  removePoint (id: string): void;
}

export type SkillsProps = SkillsStateProps & SkillsDispatchProps & SkillsOwnProps;

export interface SkillsState {
  infoId: Maybe<string>;
}

export class Skills extends React.Component<SkillsProps, SkillsState> {
  state: SkillsState = {
    infoId: Nothing (),
  };

  showInfo = (id: string) => this.setState ({ infoId: Just (id) });

  render () {
    const {
      addPoint,
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
                Maybe.fromMaybe<NonNullable<React.ReactNode>>
                  (<ListPlaceholder locale={locale} type="skills" noResults />)
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
                                addPoint={addPoint.bind (null, current .get ('id'))}
                                addDisabled={!current .get ('isIncreasable')}
                                removePoint={
                                  isRemovingEnabled
                                    ? removePoint.bind (null, current .get ('id'))
                                    : undefined
                                }
                                removeDisabled={!current .get ('isDecreasable')}
                                insertTopMargin={
                                  sortOrder === 'group'
                                  && Maybe.isJust (previous)
                                  && Maybe.fromJust (previous) .get ('gr') !== current .get ('gr')
                                }
                                selectForInfo={this.showInfo}
                                attributes={attributes}
                                derivedCharacteristics={derivedCharacteristics}
                                groupIndex={current .get ('gr')}
                                groupList={translate (locale, 'skills.view.groups')}
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
    );
  }
}
