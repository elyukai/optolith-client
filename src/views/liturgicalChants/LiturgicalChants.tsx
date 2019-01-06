import * as R from 'ramda';
import * as React from 'react';
import { SecondaryAttribute } from '../../App/Models/Hero/heroTypeHelpers';
import { AttributeCombined, BlessingCombined, LiturgicalChantIsActive, LiturgicalChantWithRequirements } from '../../App/Models/View/viewTypeHelpers';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { getAspectsOfTradition } from '../../App/Utils/Increasable/liturgicalChantUtils';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { ListView } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { ListItem } from '../../components/ListItem';
import { ListItemName } from '../../components/ListItemName';
import { ListPlaceholder } from '../../components/ListPlaceholder';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { Slidein } from '../../components/Slidein';
import { SortNames, SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { Categories } from '../../constants/Categories';
import { WikiInfoContainer } from '../../containers/WikiInfoContainer';
import { DCIds } from '../../selectors/derivedCharacteristicsSelectors';
import { Just, List, Maybe, Nothing, OrderedMap, Record, Tuple } from '../../utils/dataUtils';
import { sortStrings } from '../../utils/FilterSortUtils';
import { SkillListItem } from '../skills/SkillListItem';

export interface LiturgicalChantsOwnProps {
  locale: UIMessagesObject;
}

export interface LiturgicalChantsStateProps {
  activeList: Maybe<List<Record<BlessingCombined> | Record<LiturgicalChantWithRequirements>>>;
  addChantsDisabled: boolean;
  attributes: List<Record<AttributeCombined>>;
  derivedCharacteristics: OrderedMap<DCIds, Record<SecondaryAttribute>>;
  enableActiveItemHints: boolean;
  filterText: string;
  inactiveFilterText: string;
  inactiveList: Maybe<List<Record<LiturgicalChantIsActive> | Record<BlessingCombined>>>;
  isRemovingEnabled: boolean;
  sortOrder: string;
  traditionId: Maybe<number>;
}

export interface LiturgicalChantsDispatchProps {
  setSortOrder (sortOrder: string): void;
  switchActiveItemHints (): void;
  addPoint (id: string): void;
  addToList (id: string): void;
  addBlessingToList (id: string): void;
  removePoint (id: string): void;
  removeFromList (id: string): void;
  removeBlessingFromList (id: string): void;
  setFilterText (filterText: string): void;
  setInactiveFilterText (filterText: string): void;
}

export type LiturgicalChantsProps =
  LiturgicalChantsStateProps
  & LiturgicalChantsDispatchProps
  & LiturgicalChantsOwnProps;

export interface LiturgicalChantsState {
  showAddSlidein: boolean;
  currentId: Maybe<string>;
  currentSlideinId: Maybe<string>;
}

const isBlessing = (
  entry: Record<LiturgicalChantWithRequirements>
    | Record<LiturgicalChantIsActive>
    | Record<BlessingCombined>
): entry is Record<BlessingCombined> =>
  (entry .get ('category') as Categories.BLESSINGS | Categories.LITURGIES) === Categories.BLESSINGS;

export class LiturgicalChants
  extends React.Component<LiturgicalChantsProps, LiturgicalChantsState> {
  state: LiturgicalChantsState = {
    showAddSlidein: false,
    currentId: Nothing (),
    currentSlideinId: Nothing (),
  };

  showAddSlidein = () => this.setState ({ showAddSlidein: true });

  hideAddSlidein = () => {
    this.props.setInactiveFilterText ('');
    this.setState ({ showAddSlidein: false });
  }

  showInfo = (id: string) => this.setState ({ currentId: Just (id) });
  showSlideinInfo = (id: string) => this.setState ({ currentSlideinId: Just (id) });

  render () {
    const {
      addChantsDisabled,
      addPoint,
      addToList,
      addBlessingToList,
      enableActiveItemHints,
      attributes,
      derivedCharacteristics,
      activeList,
      inactiveList,
      locale,
      isRemovingEnabled,
      removeFromList,
      removeBlessingFromList,
      removePoint,
      setSortOrder,
      sortOrder,
      switchActiveItemHints,
      traditionId: maybeTraditionId,
      filterText,
      inactiveFilterText,
      setFilterText,
      setInactiveFilterText,
    } = this.props;

    const { showAddSlidein } = this.state;

    return (
      <Page id="liturgies">
        <Slidein
          isOpened={showAddSlidein}
          close={this.hideAddSlidein}
          className="adding-liturgical-chants"
          >
          <Options>
            <TextField
              hint={translate (locale, 'options.filtertext')}
              value={inactiveFilterText}
              onChangeString={setInactiveFilterText}
              fullWidth
              />
            <SortOptions
              sortOrder={sortOrder}
              sort={setSortOrder}
              options={List.of<SortNames> ('name', 'group', 'ic')}
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
                {translate (locale, 'aspect')}
                {sortOrder === 'group' && ` / ${translate (locale, 'group')}`}
              </ListHeaderTag>
              <ListHeaderTag className="check">
                {translate (locale, 'check')}
              </ListHeaderTag>
              <ListHeaderTag className="mod" hint={translate (locale, 'mod.long')}>
                {translate (locale, 'mod.short')}
              </ListHeaderTag>
              <ListHeaderTag className="ic" hint={translate (locale, 'ic.long')}>
                {translate (locale, 'ic.short')}
              </ListHeaderTag>
              {isRemovingEnabled && <ListHeaderTag className="btn-placeholder" />}
              <ListHeaderTag className="btn-placeholder" />
            </ListHeader>
            <Scroll>
              <ListView>
                {
                  Maybe.fromMaybe<NonNullable<React.ReactNode>>
                    (<ListPlaceholder locale={locale} type="inactiveLiturgicalChants" noResults />)
                    (inactiveList
                      .bind (Maybe.ensure (R.complement (List.null)))
                      .fmap (R.pipe (
                        List.mapAccumL<
                          Maybe<Record<LiturgicalChantIsActive> | Record<BlessingCombined>>,
                          Record<LiturgicalChantIsActive> | Record<BlessingCombined>,
                          JSX.Element
                        >
                          (maybePrevious => current => {
                            const insertTopMargin = Maybe.elem
                              (true)
                              (maybePrevious
                                .bind (
                                  Maybe.ensure (
                                    () => sortOrder === 'group' && current .get ('active')
                                  )
                                )
                                .fmap (
                                  previous => (current .get ('category') as Categories)
                                    === Categories.BLESSINGS
                                    ? (previous .get ('category') as Categories)
                                      !== Categories.BLESSINGS
                                    : !isBlessing (previous) && isBlessing (current)
                                      || isBlessing (previous) && !isBlessing (current)
                                      || !isBlessing (previous)
                                        && !isBlessing (current)
                                        && previous .get ('gr') !== current.get ('gr')
                                ));

                            const aspects =
                              Maybe.fromMaybe
                                ('')
                                (maybeTraditionId .fmap (
                                  R.pipe (
                                    traditionId => Maybe.mapMaybe<number, string>
                                      (R.pipe (
                                        Maybe.ensure (
                                          List.elem_ (getAspectsOfTradition (traditionId + 1))
                                        ),
                                        Maybe.bind_ (R.pipe (
                                          R.dec,
                                          List.subscript (
                                            translate (locale, 'liturgies.view.aspects')
                                          )
                                        ))
                                      ))
                                      (current .get ('aspects')),
                                    sortStrings (locale .get ('id')),
                                    List.intercalate (', ')
                                  )
                                ));

                            return Tuple.of<
                              Maybe<Record<LiturgicalChantIsActive> | Record<BlessingCombined>>,
                              JSX.Element
                            >
                              (Just (current))
                              (current .get ('active')
                                ? (
                                  <ListItem
                                    key={current .get ('id')}
                                    disabled
                                    insertTopMargin={insertTopMargin}
                                    >
                                    <ListItemName name={current .get ('name')} />
                                  </ListItem>
                                )
                                : isBlessing (current)
                                ? (
                                  <SkillListItem
                                    key={current .get ('id')}
                                    id={current .get ('id')}
                                    name={current .get ('name')}
                                    isNotActive
                                    activate={addBlessingToList .bind (null, current .get ('id'))}
                                    addFillElement
                                    insertTopMargin={insertTopMargin}
                                    attributes={attributes}
                                    derivedCharacteristics={derivedCharacteristics}
                                    selectForInfo={this.showSlideinInfo}
                                    addText={
                                      sortOrder === 'group'
                                        ? `${aspects} / ${
                                          translate (locale, 'liturgies.view.blessing')
                                        }`
                                        : aspects
                                    }
                                    />
                                )
                                : (
                                  <SkillListItem
                                    key={current .get ('id')}
                                    id={current .get ('id')}
                                    name={current .get ('name')}
                                    isNotActive
                                    activate={addToList .bind (null, current .get ('id'))}
                                    activateDisabled={addChantsDisabled}
                                    addFillElement
                                    check={current .get ('check')}
                                    checkmod={current .lookup ('checkmod')}
                                    ic={current .get ('ic')}
                                    insertTopMargin={insertTopMargin}
                                    attributes={attributes}
                                    derivedCharacteristics={derivedCharacteristics}
                                    selectForInfo={this.showSlideinInfo}
                                    addText={
                                      sortOrder === 'group'
                                      ? `${aspects} / ${
                                        Maybe.fromMaybe
                                          ('')
                                          (translate (locale, 'liturgies.view.groups')
                                            .subscript (current .get ('gr') - 1))
                                      }`
                                      : aspects
                                    }
                                    />
                                )
                              );
                          })
                          (Nothing ()),
                        Tuple.snd,
                        List.toArray
                      )))
                }
              </ListView>
            </Scroll>
          </MainContent>
          <WikiInfoContainer {...this.props} currentId={this.state.currentSlideinId} />
        </Slidein>
        <Options>
          <TextField
            hint={translate (locale, 'options.filtertext')}
            value={filterText}
            onChangeString={setFilterText}
            fullWidth
            />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            options={List.of<SortNames> ('name', 'group', 'ic')}
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
              {translate (locale, 'aspect')}
              {sortOrder === 'group' && ` / ${translate (locale, 'group')}`}
            </ListHeaderTag>
            <ListHeaderTag className="value" hint={translate (locale, 'sr.long')}>
              {translate (locale, 'sr.short')}
            </ListHeaderTag>
            <ListHeaderTag className="check">
              {translate (locale, 'check')}
            </ListHeaderTag>
            <ListHeaderTag className="mod" hint={translate (locale, 'mod.long')}>
              {translate (locale, 'mod.short')}
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
                  (
                    <ListPlaceholder
                      locale={locale}
                      type="liturgicalChants"
                      noResults={filterText.length > 0}
                      />
                  )
                  (activeList
                    .bind (Maybe.ensure (R.complement (List.null)))
                    .fmap (R.pipe (
                      List.mapAccumL<
                        Maybe<Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>>,
                        Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>,
                        JSX.Element
                      >
                        (maybePrevious => current => {
                          const insertTopMargin = Maybe.elem
                            (true)
                            (maybePrevious
                              .bind (Maybe.ensure (() => sortOrder === 'group'))
                              .fmap (
                                previous => (current .get ('category') as Categories)
                                  === Categories.BLESSINGS
                                  ? (previous .get ('category') as Categories)
                                    !== Categories.BLESSINGS
                                  : !isBlessing (previous) && isBlessing (current)
                                    || isBlessing (previous) && !isBlessing (current)
                                    || !isBlessing (previous)
                                      && !isBlessing (current)
                                      && previous .get ('gr') !== current.get ('gr')
                              ));

                          const aspects =
                            Maybe.fromMaybe
                              ('')
                              (maybeTraditionId .fmap (
                                R.pipe (
                                  traditionId => Maybe.mapMaybe<number, string>
                                    (R.pipe (
                                      Maybe.ensure (
                                        List.elem_ (getAspectsOfTradition (traditionId + 1))
                                      ),
                                      Maybe.bind_ (R.pipe (
                                        R.dec,
                                        List.subscript (
                                          translate (locale, 'liturgies.view.aspects')
                                        )
                                      ))
                                    ))
                                    (current .get ('aspects')),
                                  sortStrings (locale .get ('id')),
                                  List.intercalate (', ')
                                )
                              ));

                          return Tuple.of<
                            Maybe<
                              Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>
                            >,
                            JSX.Element
                          >
                            (Just (current))
                            (isBlessing (current)
                              ? (
                                <SkillListItem
                                  key={current .get ('id')}
                                  id={current .get ('id')}
                                  name={current .get ('name')}
                                  removePoint={
                                    isRemovingEnabled
                                      ? removeBlessingFromList.bind (null, current .get ('id'))
                                      : undefined}
                                  addFillElement
                                  noIncrease
                                  insertTopMargin={insertTopMargin}
                                  attributes={attributes}
                                  derivedCharacteristics={derivedCharacteristics}
                                  selectForInfo={this.showSlideinInfo}
                                  addText={
                                    sortOrder === 'group'
                                      ? `${aspects} / ${
                                        translate (locale, 'liturgies.view.blessing')
                                      }`
                                      : aspects
                                  }
                                  />
                              )
                              : (
                                <SkillListItem
                                  key={current .get ('id')}
                                  id={current .get ('id')}
                                  name={current .get ('name')}
                                  addDisabled={!current .get ('isIncreasable')}
                                  addPoint={addPoint.bind (null, current .get ('id'))}
                                  removeDisabled={!current .get ('isDecreasable')}
                                  removePoint={
                                    isRemovingEnabled
                                      ? current .get ('value') === 0
                                        ? removeFromList.bind (null, current .get ('id'))
                                        : removePoint.bind (null, current .get ('id'))
                                      : undefined
                                  }
                                  addFillElement
                                  check={current .get ('check')}
                                  checkmod={current .lookup ('checkmod')}
                                  ic={current .get ('ic')}
                                  sr={current .get ('value')}
                                  insertTopMargin={insertTopMargin}
                                  attributes={attributes}
                                  derivedCharacteristics={derivedCharacteristics}
                                  selectForInfo={this.showSlideinInfo}
                                  addText={
                                    sortOrder === 'group'
                                    ? `${aspects} / ${
                                      Maybe.fromMaybe
                                        ('')
                                        (translate (locale, 'liturgies.view.groups')
                                          .subscript (current .get ('gr') - 1))
                                    }`
                                    : aspects
                                  }
                                  />
                              )
                            );
                        })
                        (Nothing ()),
                      Tuple.snd,
                      List.toArray
                    )))
              }
            </ListView>
          </Scroll>
        </MainContent>
        <WikiInfoContainer {...this.props} {...this.state} />
      </Page>
    );
  }
}
