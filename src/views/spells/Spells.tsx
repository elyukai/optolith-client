import * as R from 'ramda';
import * as React from 'react';
import { AttributeCombined, CantripCombined, SpellIsActive, SpellWithRequirements } from '../../App/Models/View/viewTypeHelpers';
import { Cantrip, SpecialAbility, Spell } from '../../App/Models/Wiki/wikiTypeHelpers';
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
import { SecondaryAttribute } from '../../types/data';
import { Just, List, Maybe, Nothing, OrderedMap, Record, Tuple } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { isOwnTradition } from '../../utils/SpellUtils';
import { SkillListItem } from '../skills/SkillListItem';

export interface SpellsOwnProps {
  locale: UIMessagesObject;
}

export interface SpellsStateProps {
  activeList: Maybe<List<Record<SpellWithRequirements> | Record<CantripCombined>>>;
  addSpellsDisabled: boolean;
  attributes: List<Record<AttributeCombined>>;
  derivedCharacteristics: OrderedMap<DCIds, Record<SecondaryAttribute>>;
  enableActiveItemHints: boolean;
  filterText: string;
  inactiveFilterText: string;
  inactiveList: Maybe<List<Record<SpellIsActive> | Record<CantripCombined>>>;
  isRemovingEnabled: boolean;
  sortOrder: string;
  traditions: Maybe<List<Record<SpecialAbility>>>;
}

export interface SpellsDispatchProps {
  setSortOrder (sortOrder: string): void;
  switchActiveItemHints (): void;
  addPoint (id: string): void;
  addToList (id: string): void;
  addCantripToList (id: string): void;
  removePoint (id: string): void;
  removeFromList (id: string): void;
  removeCantripFromList (id: string): void;
  setFilterText (filterText: string): void;
  setInactiveFilterText (filterText: string): void;
}

export type SpellsProps = SpellsStateProps & SpellsDispatchProps & SpellsOwnProps;

export interface SpellsState {
  showAddSlidein: boolean;
  currentId: Maybe<string>;
  currentSlideinId: Maybe<string>;
}

const isCantrip = (
  entry: Record<SpellWithRequirements> | Record<SpellIsActive> | Record<CantripCombined>
): entry is Record<CantripCombined> =>
  (entry .get ('category') as Categories.CANTRIPS | Categories.SPELLS) === Categories.CANTRIPS;

export class Spells extends React.Component<SpellsProps, SpellsState> {
  state: SpellsState = {
    showAddSlidein: false,
    currentId: Nothing (),
    currentSlideinId: Nothing (),
  };

  showAddSlidein = () => this.setState ({ showAddSlidein: true });

  hideAddSlidein = () => {
    this.props.setInactiveFilterText ('');
    this.setState ({ showAddSlidein: false, currentSlideinId: Nothing () });
  };

  showInfo = (id: string) => this.setState ({ currentId: Just (id) });
  showSlideinInfo = (id: string) => this.setState ({ currentSlideinId: Just (id) });

  render () {
    const {
      addSpellsDisabled,
      addPoint,
      addToList,
      addCantripToList,
      enableActiveItemHints,
      attributes,
      derivedCharacteristics,
      inactiveList,
      activeList,
      locale,
      isRemovingEnabled,
      removeFromList,
      removeCantripFromList,
      removePoint,
      setSortOrder,
      sortOrder,
      switchActiveItemHints,
      traditions: maybeTraditions,
      filterText,
      inactiveFilterText,
      setFilterText,
      setInactiveFilterText,
    } = this.props;

    const { showAddSlidein } = this.state;

    return (
      <Page id="spells">
        <Slidein isOpened={showAddSlidein} close={this.hideAddSlidein} className="adding-spells">
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
              options={List.of<SortNames> ('name', 'group', 'property', 'ic')}
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
                {translate (locale, 'name')} ({translate (locale, 'unfamiliartraditions')})
              </ListHeaderTag>
              <ListHeaderTag className="group">
                {translate (locale, 'property')}
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
                    (<ListPlaceholder locale={locale} type="inactiveSpells" noResults />)
                    (inactiveList
                      .bind (Maybe.ensure (R.complement (List.null)))
                      .fmap (R.pipe (
                        List.mapAccumL<
                          Maybe<Record<SpellIsActive> | Record<CantripCombined>>,
                          Record<SpellIsActive> | Record<CantripCombined>,
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
                                    === Categories.CANTRIPS
                                    ? (previous .get ('category') as Categories)
                                      !== Categories.CANTRIPS
                                    : !isCantrip (previous) && isCantrip (current)
                                      || isCantrip (previous) && !isCantrip (current)
                                      || !isCantrip (previous)
                                        && !isCantrip (current)
                                        && previous .get ('gr') !== current.get ('gr')
                                ));

                            const propertyName =
                              Maybe.fromMaybe
                                ('')
                                (translate (locale, 'spells.view.properties')
                                  .subscript (current .get ('property') - 1));

                            return Tuple.of<
                              Maybe<Record<SpellIsActive> | Record<CantripCombined>>,
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
                                : isCantrip (current)
                                ? (
                                  <SkillListItem
                                    key={current .get ('id')}
                                    id={current .get ('id')}
                                    name={current .get ('name')}
                                    isNotActive
                                    activate={addCantripToList .bind (null, current .get ('id'))}
                                    addFillElement
                                    insertTopMargin={insertTopMargin}
                                    attributes={attributes}
                                    derivedCharacteristics={derivedCharacteristics}
                                    selectForInfo={this.showSlideinInfo}
                                    addText={
                                      sortOrder === 'group'
                                        ? `${propertyName} / ${
                                          translate (locale, 'spells.view.cantrip')
                                        }`
                                        : propertyName
                                    }
                                    untyp={
                                      Maybe.elem
                                        (true)
                                        (maybeTraditions .fmap (
                                          traditions => isOwnTradition (
                                            traditions,
                                            current as any as Record<Cantrip>
                                          )
                                        ))
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
                                    activateDisabled={addSpellsDisabled && current .get ('gr') < 3}
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
                                      ? `${propertyName} / ${
                                        Maybe.fromMaybe
                                          ('')
                                          (translate (locale, 'spells.view.groups')
                                            .subscript (current .get ('gr') - 1))
                                      }`
                                      : propertyName
                                    }
                                    untyp={
                                      Maybe.elem
                                        (true)
                                        (maybeTraditions .fmap (
                                          traditions => isOwnTradition (
                                            traditions,
                                            current as any as Record<Spell>
                                          )
                                        ))
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
            options={List.of<SortNames> ('name', 'group', 'property', 'ic')}
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
              {translate (locale, 'name')} ({translate (locale, 'unfamiliartraditions')})
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (locale, 'property')}
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
                      type="spells"
                      noResults={filterText.length > 0}
                      />
                  )
                  (activeList
                    .bind (Maybe.ensure (R.complement (List.null)))
                    .fmap (R.pipe (
                      List.mapAccumL<
                        Maybe<Record<SpellWithRequirements> | Record<CantripCombined>>,
                        Record<SpellWithRequirements> | Record<CantripCombined>,
                        JSX.Element
                      >
                        (maybePrevious => current => {
                          const insertTopMargin = Maybe.elem
                            (true)
                            (maybePrevious
                              .bind (Maybe.ensure (() => sortOrder === 'group'))
                              .fmap (
                                previous => (current .get ('category') as Categories)
                                  === Categories.CANTRIPS
                                  ? (previous .get ('category') as Categories)
                                    !== Categories.CANTRIPS
                                  : !isCantrip (previous) && isCantrip (current)
                                    || isCantrip (previous) && !isCantrip (current)
                                    || !isCantrip (previous)
                                      && !isCantrip (current)
                                      && previous .get ('gr') !== current.get ('gr')
                              ));

                          const propertyName =
                            Maybe.fromMaybe
                              ('')
                              (translate (locale, 'spells.view.properties')
                                .subscript (current .get ('property') - 1));

                          return Tuple.of<
                            Maybe<Record<SpellWithRequirements> | Record<CantripCombined>>,
                            JSX.Element
                          >
                            (Just (current))
                            (isCantrip (current)
                              ? (
                                <SkillListItem
                                  key={current .get ('id')}
                                  id={current .get ('id')}
                                  name={current .get ('name')}
                                  removePoint={
                                    isRemovingEnabled
                                      ? removeCantripFromList.bind (null, current .get ('id'))
                                      : undefined}
                                  addFillElement
                                  noIncrease
                                  insertTopMargin={insertTopMargin}
                                  attributes={attributes}
                                  derivedCharacteristics={derivedCharacteristics}
                                  selectForInfo={this.showSlideinInfo}
                                  addText={
                                    sortOrder === 'group'
                                      ? `${propertyName} / ${
                                        translate (locale, 'spells.view.cantrip')
                                      }`
                                      : propertyName
                                  }
                                  untyp={
                                    Maybe.elem
                                      (true)
                                      (maybeTraditions .fmap (
                                        traditions => isOwnTradition (
                                          traditions,
                                          current as any as Record<Cantrip>
                                        )
                                      ))
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
                                    ? `${propertyName} / ${
                                      Maybe.fromMaybe
                                        ('')
                                        (translate (locale, 'spells.view.groups')
                                          .subscript (current .get ('gr') - 1))
                                    }`
                                    : propertyName}
                                  untyp={
                                    Maybe.elem
                                      (true)
                                      (maybeTraditions .fmap (
                                        traditions => isOwnTradition (
                                          traditions,
                                          current as any as Record<Spell>
                                        )
                                      ))
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
