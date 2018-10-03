import * as R from 'ramda';
import * as React from 'react';
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
import { AttributeCombined, SpellWithRequirements } from '../../types/view';
import { Cantrip, SpecialAbility, Spell } from '../../types/wiki';
import { Just, List, Maybe, Nothing, OrderedMap, Record, Tuple } from '../../utils/dataUtils';
import { sortStrings } from '../../utils/FilterSortUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { isOwnTradition } from '../../utils/SpellUtils';
import { SkillListItem } from '../skills/SkillListItem';

export interface SpellsOwnProps {
  locale: UIMessagesObject;
}

export interface SpellsStateProps {
  activeList: Maybe<List<Record<SpellWithRequirements | Cantrip>>>;
  addSpellsDisabled: boolean;
  attributes: List<Record<AttributeCombined>>;
  derivedCharacteristics: OrderedMap<DCIds, Record<SecondaryAttribute>>;
  enableActiveItemHints: boolean;
  filterText: string;
  inactiveFilterText: string;
  inactiveList: Maybe<List<Record<Spell | Cantrip>>>;
  isRemovingEnabled: boolean;
  sortOrder: string;
  traditions: List<Record<SpecialAbility>>;
}

export interface SpellsDispatchProps {
  setSortOrder (sortOrder: Maybe<string>): void;
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
  currentId?: string;
  currentSlideinId?: string;
}

export class Spells extends React.Component<SpellsProps, SpellsState> {
  state: SpellsState = {
    showAddSlidein: false,
  };

  showAddSlidein = () => this.setState ({ showAddSlidein: true });

  hideAddSlidein = () => {
    this.props.setInactiveFilterText ('');
    this.setState ({ showAddSlidein: false, currentSlideinId: undefined });
  };

  showInfo = (id: string) => this.setState ({ currentId: id });
  showSlideinInfo = (id: string) => this.setState ({ currentSlideinId: id });

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
      traditions,
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
                          Maybe<Record<SpellWithRequirements | Cantrip>>,
                          Record<SpellWithRequirements | Cantrip>,
                          JSX.Element
                        >
                          (previous => current => {
                            const unfamiliarTraditions: Maybe<string> =
                              isOwnTradition (traditions, current as any as Record<Spell>)
                                ? Nothing ()
                                : Just (
                                  R.pipe (
                                    List.filter<number> (
                                      e => e <= translate (locale, 'spells.view.traditions')
                                        .length ()
                                    ),
                                    Maybe.mapMaybe (
                                      e => translate (locale, 'spells.view.traditions')
                                        .subscript (e - 1)
                                    ),
                                    sortStrings (locale .get ('id')),
                                    List.intercalate (', ')
                                  ) (current .get ('tradition'))
                                );

                            const extendName =
                              Maybe.fromMaybe ('')
                                              (unfamiliarTraditions
                                                .fmap (string => ` (${string})`));

                            const insertTopMargin = sortOrder === 'group' && Maybe.isJust (previous)
                              ? current .get ('category') === Categories.CANTRIPS
                                ? Maybe.fromJust (previous) .get ('category')
                                    !== Categories.CANTRIPS
                                : (
                                  Maybe.fromJust (previous) .get ('category')
                                    === Categories.CANTRIPS
                                  || Maybe.fromJust (previous) .get ('gr') !== current.get ('gr')
                                )
                              : false;

                            return Tuple.of<Maybe<Record<SpellWithRequirements>>, JSX.Element>
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
                                    && Maybe.notElem
                                      (current .get ('gr'))
                                      (previous .fmap (
                                        Record.get<SkillWithRequirements, 'gr'> ('gr')
                                      ))
                                  }
                                  selectForInfo={this.showInfo}
                                  attributes={attributes}
                                  derivedCharacteristics={derivedCharacteristics}
                                  groupIndex={current .get ('gr')}
                                  groupList={translate (locale, 'skills.view.groups')}
                                  />
                              );
                          })
                          (Nothing ()),
                        Tuple.snd,
                        List.toArray
                      )))
                }
                {
                  inactiveList.length === 0 ? <ListPlaceholder locale={locale} type="inactiveSpells" noResults /> : inactiveList.map ((obj, index, array) => {
                    const prevObj = array[index - 1];

                    let extendName = '';
                    if (!isOwnTradition (traditions, obj)) {
                      extendName += ` (${obj.tradition.filter (e => e <= translate (locale, 'spells.view.traditions').length).map (e => translate (locale, 'spells.view.traditions')[e - 1]).sort ().join (', ')})`;
                    }

                    if (obj.active === true) {
                      const { id, name } = obj;
                      const extendedName = name + extendName;
                      let insertTopMargin = false;

                      if (sortOrder === 'group' && prevObj) {
                        if (obj.category === Categories.CANTRIPS) {
                          insertTopMargin = prevObj.category !== Categories.CANTRIPS;
                        }
                        else {
                          insertTopMargin = (prevObj.category === Categories.CANTRIPS || prevObj.gr !== obj.gr);
                        }
                      }

                      return (
                        <ListItem
                          key={id}
                          disabled
                          insertTopMargin={insertTopMargin}
                          >
                          <ListItemName name={extendedName} />
                        </ListItem>
                      );
                    }

                    const name = obj.name + extendName;

                    if (obj.category === Categories.CANTRIPS) {
                      return (
                        <SkillListItem
                          key={obj.id}
                          id={obj.id}
                          name={name}
                          isNotActive
                          activate={addCantripToList.bind (null, obj.id)}
                          addFillElement
                          insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.CANTRIPS}
                          attributes={attributes}
                          derivedCharacteristics={derivedCharacteristics}
                          selectForInfo={this.showSlideinInfo}
                          addText={sortOrder === 'group' ? `${translate (locale, 'spells.view.properties')[obj.property - 1]} / ${translate (locale, 'spells.view.cantrip')}` : translate (locale, 'spells.view.properties')[obj.property - 1]}
                          />
                      );
                    }

                    const { check, checkmod, ic } = obj;

                    return (
                      <SkillListItem
                        key={obj.id}
                        id={obj.id}
                        name={name}
                        isNotActive
                        activate={addToList.bind (null, obj.id)}
                        activateDisabled={addSpellsDisabled && obj.gr < 3}
                        addFillElement
                        check={check}
                        checkmod={checkmod}
                        ic={ic}
                        insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.CANTRIPS || prevObj.gr !== obj.gr)}
                        attributes={attributes}
                        derivedCharacteristics={derivedCharacteristics}
                        selectForInfo={this.showSlideinInfo}
                        addText={sortOrder === 'group' ? `${translate (locale, 'spells.view.properties')[obj.property - 1]} / ${translate (locale, 'spells.view.groups')[obj.gr - 1]}` : translate (locale, 'spells.view.properties')[obj.property - 1]}
                        />
                    );
                  })
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
                                  && Maybe.notElem
                                    (current .get ('gr'))
                                    (previous .fmap (
                                      Record.get<SkillWithRequirements, 'gr'> ('gr')
                                    ))
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
              {
                activeList.length === 0 ? <ListPlaceholder locale={locale} type="spells" noResults={filterText.length > 0} /> : activeList.map ((obj, index, array) => {
                  const prevObj = array[index - 1];

                  let name = obj.name;
                  if (!isOwnTradition (traditions, obj)) {
                    name += ` (${obj.tradition.filter (e => e <= translate (locale, 'spells.view.traditions').length).map (e => translate (locale, 'spells.view.traditions')[e - 1]).sort ().join (', ')})`;
                  }

                  if (obj.category === Categories.CANTRIPS) {
                    return (
                      <SkillListItem
                        key={obj.id}
                        id={obj.id}
                        name={name}
                        removePoint={isRemovingEnabled ? removeCantripFromList.bind (null, obj.id) : undefined}
                        addFillElement
                        noIncrease
                        insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.CANTRIPS}
                        attributes={attributes}
                        derivedCharacteristics={derivedCharacteristics}
                        selectForInfo={this.showInfo}
                        addText={sortOrder === 'group' ? `${translate (locale, 'spells.view.properties')[obj.property - 1]} / ${translate (locale, 'spells.view.cantrip')}` : translate (locale, 'spells.view.properties')[obj.property - 1]}
                        />
                    );
                  }

                  const { check, checkmod, ic, value, isIncreasable, isDecreasable } = obj;

                  const other = {
                    addDisabled: !isIncreasable,
                    addPoint: addPoint.bind (null, obj.id),
                    check,
                    checkmod,
                    ic,
                    sr: value,
                  };

                  return (
                    <SkillListItem
                      {...other}
                      key={obj.id}
                      id={obj.id}
                      name={name}
                      removePoint={isRemovingEnabled ? obj.value === 0 ? removeFromList.bind (null, obj.id) : removePoint.bind (null, obj.id) : undefined}
                      removeDisabled={!isDecreasable}
                      addFillElement
                      insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.CANTRIPS || prevObj.gr !== obj.gr)}
                      attributes={attributes}
                      derivedCharacteristics={derivedCharacteristics}
                      selectForInfo={this.showInfo}
                      addText={sortOrder === 'group' ? `${translate (locale, 'spells.view.properties')[obj.property - 1]} / ${translate (locale, 'spells.view.groups')[obj.gr - 1]}` : translate (locale, 'spells.view.properties')[obj.property - 1]}
                      />
                  );
                })
              }
            </ListView>
          </Scroll>
        </MainContent>
        <WikiInfoContainer {...this.props} {...this.state} />
      </Page>
    );
  }
}
