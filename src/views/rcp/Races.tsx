import * as React from 'react';
import { Aside } from '../../components/Aside';
import { ListView } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { ListPlaceholder } from '../../components/ListPlaceholder';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfoContainer';
import { InputTextEvent } from '../../types/data';
import { Race, UIMessages } from '../../types/view';
import { translate } from '../../utils/I18n';
import { RacesListItem } from './RacesListItem';
import { RaceVariants } from './RaceVariants';

export interface RacesOwnProps {
  locale: UIMessages;
  switchToCultures(): void;
}

export interface RacesStateProps {
  currentId?: string;
  currentVariantId?: string;
  races: Race[];
  sortOrder: string;
  filterText: string;
}

export interface RacesDispatchProps {
  selectRace(id: string): void;
  selectRaceVariant(id: string, variantId?: string): void;
  setSortOrder(sortOrder: string): void;
  setFilterText(filterText: string): void;
}

export type RacesProps = RacesStateProps & RacesDispatchProps & RacesOwnProps;

export class Races extends React.Component<RacesProps> {
  filter = (event: InputTextEvent) => this.props.setFilterText(event.target.value);
  sort = (option: string) => this.props.setSortOrder(option);

  render() {
    const { filterText, locale, races: list, setSortOrder, sortOrder } = this.props;

    return (
      <Page id="races">
        <Options>
          <TextField hint={translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            options={['name', 'cost']}
            locale={locale}
            />
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
            <ListHeaderTag className="btn-placeholder has-border" />
          </ListHeader>
          <Scroll>
            <ListView>
              {
                list.length === 0 ? <ListPlaceholder locale={locale} type="races" noResults /> : list.map(race =>
                  <RacesListItem {...this.props} key={race.id} race={race} />
                )
              }
            </ListView>
          </Scroll>
        </MainContent>
        <Aside>
          <RaceVariants {...this.props} />
          <WikiInfoContainer {...this.props} noWrapper />
        </Aside>
      </Page>
    );
  }
}
