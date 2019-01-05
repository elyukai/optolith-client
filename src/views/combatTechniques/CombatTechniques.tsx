import * as R from 'ramda';
import * as React from 'react';
import { AttributeCombined, CombatTechniqueWithRequirements } from '../../App/Models/View/viewTypeHelpers';
import { ListView } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { ListPlaceholder } from '../../components/ListPlaceholder';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { SortNames, SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfoContainer';
import { DCIds } from '../../selectors/derivedCharacteristicsSelectors';
import { SecondaryAttribute } from '../../types/data';
import { Just, List, Maybe, Nothing, OrderedMap, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { SkillListItem } from '../skills/SkillListItem';

export interface CombatTechniquesOwnProps {
  locale: UIMessagesObject;
}

export interface CombatTechniquesStateProps {
  attributes: List<Record<AttributeCombined>>;
  derivedCharacteristics: OrderedMap<DCIds, Record<SecondaryAttribute>>;
  list: Maybe<List<Record<CombatTechniqueWithRequirements>>>;
  isRemovingEnabled: boolean;
  sortOrder: string;
  filterText: string;
}

export interface CombatTechniquesDispatchProps {
  setSortOrder (sortOrder: string): void;
  addPoint (id: string): void;
  removePoint (id: string): void;
  setFilterText (filterText: string): void;
}

export type CombatTechniquesProps =
  CombatTechniquesStateProps
  & CombatTechniquesDispatchProps
  & CombatTechniquesOwnProps;

export interface CombatTechniquesState {
  infoId: Maybe<string>;
}

export class CombatTechniques
  extends React.Component<CombatTechniquesProps, CombatTechniquesState> {
  state: CombatTechniquesState = {
    infoId: Nothing (),
  };

  showInfo = (id: string) => this.setState ({ infoId: Just (id) });

  render () {
    const {
      addPoint,
      attributes,
      derivedCharacteristics,
      list,
      locale,
      isRemovingEnabled,
      removePoint,
      setSortOrder,
      sortOrder,
      filterText,
      setFilterText,
    } = this.props;

    const { infoId } = this.state;

    return (
      <Page id="combattechniques">
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
            locale={locale}
            options={List.of<SortNames> ('name', 'group', 'ic')}
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
            <ListHeaderTag className="value" hint={translate (locale, 'sr.long')}>
              {translate (locale, 'sr.short')}
            </ListHeaderTag>
            <ListHeaderTag className="ic" hint={translate (locale, 'ic.long')}>
              {translate (locale, 'ic.short')}
            </ListHeaderTag>
            <ListHeaderTag className="primary" hint={translate (locale, 'primaryattribute.long')}>
              {translate (locale, 'primaryattribute.short')}
            </ListHeaderTag>
            <ListHeaderTag className="at" hint={translate (locale, 'at.long')}>
              {translate (locale, 'at.short')}
            </ListHeaderTag>
            <ListHeaderTag className="pa" hint={translate (locale, 'pa.long')}>
              {translate (locale, 'pa.short')}
            </ListHeaderTag>
            {isRemovingEnabled && <ListHeaderTag className="btn-placeholder" />}
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <Scroll>
            <ListView>
              {
                Maybe.fromMaybe<NonNullable<React.ReactNode>>
                  (<ListPlaceholder locale={locale} type="combatTechniques" noResults />)
                  (list
                    .bind (Maybe.ensure (R.pipe (List.null, R.not)))
                    .fmap (R.pipe (
                      List.map (
                        (current: Record<CombatTechniqueWithRequirements>) => {
                          const primary = Maybe.mapMaybe
                            ((id: string) => attributes
                              .find (attr => attr .get ('id') === id)
                              .fmap (Record.get<AttributeCombined, 'short'> ('short')))
                            (current .get ('primary'))
                            .intercalate ('/');

                          const customClassName = current .get ('primary') .length () > 1
                            ? 'ATTR_6_8'
                            : Maybe.fromMaybe ('') (Maybe.listToMaybe (current .get ('primary')));

                          const primaryClassName = `primary ${customClassName}`;

                          return (
                            <SkillListItem
                              key={current .get ('id')}
                              id={current .get ('id')}
                              name={current .get ('name')}
                              sr={current .get ('value')}
                              ic={current .get ('ic')}
                              checkDisabled
                              addPoint={addPoint.bind (null, current .get ('id'))}
                              addDisabled={current .get ('value') >= current .get ('max')}
                              removePoint={
                                isRemovingEnabled
                                  ? removePoint.bind (null, current .get ('id'))
                                  : undefined
                              }
                              removeDisabled={current .get ('value') <= current .get ('min')}
                              addValues={List.of (
                                { className: primaryClassName, value: primary },
                                { className: 'at', value: current .get ('at') },
                                { className: 'atpa' },
                                {
                                  className: 'pa',
                                  value: Maybe.fromMaybe<string | number> ('--')
                                                                          (current .lookup ('pa')),
                                }
                              )}
                              attributes={attributes}
                              derivedCharacteristics={derivedCharacteristics}
                              selectForInfo={this.showInfo}
                              groupIndex={current .get ('gr')}
                              groupList={translate (locale, 'combattechniques.view.groups')}
                              />
                          );
                        }
                      ),
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
