import * as React from 'react';
import { Hero, InputTextEvent, User } from '../../App/Models/Hero/heroTypeHelpers';
import { Book, ExperienceLevel, WikiAll } from '../../App/Models/Wiki/wikiTypeHelpers';
import { translate } from '../../App/Utils/I18n';
import { BorderButton } from '../../components/BorderButton';
import { Dropdown, DropdownOption } from '../../components/Dropdown';
import { ListView } from '../../components/List';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { SortNames, SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { AdventurePointsObject } from '../../selectors/adventurePointsSelectors';
import { UIMessagesObject } from '../../types/ui';
import { Just, List, Maybe, OrderedMap, OrderedSet, Record } from '../../utils/dataUtils';
import { HeroCreation } from './HeroCreation';
import { HerolistItem } from './HerolistItem';

export interface HerolistOwnProps {
  locale: UIMessagesObject;
}

export interface HerolistStateProps {
  currentHero: Maybe<Hero>;
  currentHeroAdventurePoints: Record<AdventurePointsObject>;
  experienceLevels: OrderedMap<string, Record<ExperienceLevel>>;
  filterText: string;
  list: List<Hero>;
  users: OrderedMap<string, User>;
  unsavedHeroesById: OrderedSet<string>;
  visibilityFilter: string;
  sortOrder: string;
  isCharacterCreatorOpen: boolean;
  sortedBooks: List<Record<Book>>;
  wiki: Record<WikiAll>;
}

export interface HerolistDispatchProps {
  loadHero (id: string): void;
  showHero (): void;
  saveHero (id: string): void;
  saveHeroAsJSON (id: string): void;
  deleteHero (id: string): void;
  duplicateHero (id: string): void;
  createHero (
    name: string,
    sex: 'm' | 'f',
    el: string,
    enableAllRuleBooks: boolean,
    enabledRuleBooks: OrderedSet<string>
  ): void;
  importHero (): void;
  setFilterText (event: InputTextEvent): void;
  setSortOrder (id: string): void;
  setVisibilityFilter (id: Maybe<string>): void;
  openCharacterCreator (): void;
  closeCharacterCreator (): void;
}

export type HerolistProps = HerolistStateProps & HerolistDispatchProps & HerolistOwnProps;

export interface HerolistState {
  showHeroCreation: boolean;
}

export class Herolist extends React.Component<HerolistProps, HerolistState> {
  state = { showHeroCreation: false };

  render () {
    const {
      currentHero,
      currentHeroAdventurePoints,
      importHero,
      list: rawList,
      locale,
      setFilterText,
      setSortOrder,
      setVisibilityFilter,
      sortOrder,
      users,
      visibilityFilter,
      isCharacterCreatorOpen,
      openCharacterCreator,
      closeCharacterCreator,
      filterText,
      ...other
    } = this.props;

    const list = rawList.map (hero => (
      <HerolistItem
        {...other}
        key={hero.get ('id')}
        hero={hero}
        users={users}
        locale={locale}
        />
    ));

    return (
      <Page id="herolist">
        <Options>
          <TextField
            hint={translate (locale, 'options.filtertext')}
            value={filterText}
            onChange={setFilterText}
            fullWidth
            />
          <Dropdown
            value={Just (visibilityFilter)}
            onChange={setVisibilityFilter}
            options={List.of (
              Record.of<DropdownOption> ({
                id: 'all',
                name: translate (locale, 'heroes.options.filter.all'),
              }),
              Record.of<DropdownOption> ({
                id: 'own',
                name: translate (locale, 'heroes.options.filter.own'),
              }),
              Record.of<DropdownOption> ({
                id: 'shared',
                name: translate (locale, 'heroes.options.filter.shared'),
              })
            )}
            fullWidth
            disabled
            />
          <SortOptions
            locale={locale}
            options={List.of<SortNames> ('name', 'dateModified')}
            sort={setSortOrder}
            sortOrder={sortOrder}
            />
          <BorderButton
            label={translate (locale, 'heroes.actions.create')}
            onClick={openCharacterCreator}
            primary
            />
          <BorderButton
            label={translate (locale, 'heroes.actions.import')}
            onClick={importHero}
            />
        </Options>
        <Scroll>
          <ListView>
            {list}
          </ListView>
        </Scroll>
        <HeroCreation
          {...this.props}
          close={closeCharacterCreator}
          isOpened={isCharacterCreatorOpen}
          />
      </Page>
    );
  }
}
