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
import { AttributeCombined, LiturgicalChantWithRequirements } from '../../types/view';
import { Blessing, LiturgicalChant } from '../../types/wiki';
import { Just, List, Maybe, Nothing, OrderedMap, Record, Tuple } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { getAspectsOfTradition } from '../../utils/liturgicalChantUtils';
import { SkillListItem } from '../skills/SkillListItem';

export interface LiturgicalChantsOwnProps {
  locale: UIMessagesObject;
}

export interface LiturgicalChantsStateProps {
  activeList: Maybe<List<Record<Blessing | LiturgicalChantWithRequirements>>>;
  addChantsDisabled: boolean;
  attributes: List<Record<AttributeCombined>>;
  derivedCharacteristics: OrderedMap<DCIds, Record<SecondaryAttribute>>;
  enableActiveItemHints: boolean;
  filterText: string;
  inactiveFilterText: string;
  inactiveList: Maybe<List<Record<LiturgicalChant | Blessing>>>;
  isRemovingEnabled: boolean;
  sortOrder: string;
  traditionId: Maybe<number>;
}

export interface LiturgicalChantsDispatchProps {
  setSortOrder (sortOrder: Maybe<string>): void;
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
  currentId?: string;
  currentSlideinId?: string;
}

export class LiturgicalChants
  extends React.Component<LiturgicalChantsProps, LiturgicalChantsState> {
  state: LiturgicalChantsState = {
    showAddSlidein: false,
  };

  showAddSlidein = () => this.setState ({ showAddSlidein: true });

  hideAddSlidein = () => {
    this.props.setInactiveFilterText ('');
    this.setState ({ showAddSlidein: false });
  }

  showInfo = (id: string) => this.setState ({ currentId: id });
  showSlideinInfo = (id: string) => this.setState ({ currentSlideinId: id });

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
      traditionId,
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
                  inactiveList.length === 0 ? <ListPlaceholder locale={locale} type="inactiveLiturgicalChants" noResults /> : inactiveList.map ((obj, index, array) => {
                    const prevObj = array[index - 1];

                    if (obj.active === true) {
                      const { id, name } = obj;
                      let insertTopMargin = false;

                      if (sortOrder === 'group' && prevObj) {
                        if (obj.category === Categories.BLESSINGS) {
                          insertTopMargin = prevObj.category !== Categories.BLESSINGS;
                        }
                        else {
                          insertTopMargin = prevObj.category === Categories.BLESSINGS || prevObj.gr !== obj.gr;
                        }
                      }

                      return (
                        <ListItem
                          key={id}
                          disabled
                          insertTopMargin={insertTopMargin}
                          >
                          <ListItemName name={name} />
                        </ListItem>
                      );
                    }

                    const { name } = obj;

                    const aspc = obj.aspects.filter (e => getAspectsOfTradition (traditionId as number + 1).includes (e)).map (e => translate (locale, 'liturgies.view.aspects')[e - 1]).sort ().join (', ');

                    if (obj.category === Categories.BLESSINGS) {
                      return (
                        <SkillListItem
                          key={obj.id}
                          id={obj.id}
                          name={name}
                          isNotActive
                          activate={addBlessingToList.bind (null, obj.id)}
                          addFillElement
                          insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.BLESSINGS}
                          attributes={attributes}
                          derivedCharacteristics={derivedCharacteristics}
                          selectForInfo={this.showSlideinInfo}
                          addText={sortOrder === 'group' ? `${aspc} / ${translate (locale, 'liturgies.view.blessing')}` : aspc}
                          />
                      );
                    }

                    const { check, checkmod, ic } = obj;
                    const add = { check, checkmod, ic };

                    return (
                      <SkillListItem
                        {...add}
                        key={obj.id}
                        id={obj.id}
                        name={name}
                        isNotActive
                        activate={addToList.bind (null, obj.id)}
                        activateDisabled={addChantsDisabled && obj.gr < 3}
                        addFillElement
                        insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.BLESSINGS || prevObj.gr !== obj.gr)}
                        attributes={attributes}
                        derivedCharacteristics={derivedCharacteristics}
                        selectForInfo={this.showSlideinInfo}
                        addText={sortOrder === 'group' ? aspc.length === 0 ? translate (locale, 'liturgies.view.groups')[obj.gr - 1] : `${aspc} / ${translate (locale, 'liturgies.view.groups')[obj.gr - 1]}` : aspc}
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
                activeList.length === 0 ? <ListPlaceholder locale={locale} type="liturgicalChants" noResults={filterText.length > 0} /> : activeList.map ((obj, index, array) => {
                  const prevObj = array[index - 1];

                  const name = obj.name;

                  const aspc = obj.aspects.filter (e => getAspectsOfTradition (traditionId as number + 1).includes (e)).map (e => translate (locale, 'liturgies.view.aspects')[e - 1]).sort ().join (', ');

                  if (obj.category === Categories.BLESSINGS) {
                    return (
                      <SkillListItem
                        key={obj.id}
                        id={obj.id}
                        name={name}
                        removePoint={isRemovingEnabled ? removeBlessingFromList.bind (null, obj.id) : undefined}
                        addFillElement
                        noIncrease
                        insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.BLESSINGS}
                        attributes={attributes}
                        derivedCharacteristics={derivedCharacteristics}
                        selectForInfo={this.showInfo}
                        addText={sortOrder === 'group' ? `${aspc} / ${translate (locale, 'liturgies.view.blessing')}` : aspc}
                        />
                    );
                  }

                  const { check, checkmod, ic, value, isDecreasable, isIncreasable } = obj;

                  const add = {
                    addDisabled: !isIncreasable,
                    addPoint: addPoint.bind (null, obj.id),
                    check,
                    checkmod,
                    ic,
                    sr: value,
                  };

                  return (
                    <SkillListItem
                      {...add}
                      key={obj.id}
                      id={obj.id}
                      name={name}
                      removePoint={isRemovingEnabled ? obj.value === 0 ? removeFromList.bind (null, obj.id) : removePoint.bind (null, obj.id) : undefined}
                      removeDisabled={!isDecreasable}
                      addFillElement
                      insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.BLESSINGS || prevObj.gr !== obj.gr)}
                      attributes={attributes}
                      derivedCharacteristics={derivedCharacteristics}
                      selectForInfo={this.showInfo}
                      addText={sortOrder === 'group' ? aspc.length === 0 ? translate (locale, 'liturgies.view.groups')[obj.gr - 1] : `${aspc} / ${translate (locale, 'liturgies.view.groups')[obj.gr - 1]}` : aspc}
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
