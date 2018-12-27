import * as R from 'ramda';
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
import { SortNames, SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfoContainer';
import { List, Maybe, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { RaceCombined } from '../../utils/viewData/viewTypeHelpers';
import { RacesListItem } from './RacesListItem';
import { RaceVariants } from './RaceVariants';

export interface RacesOwnProps {
  locale: UIMessagesObject;
}

export interface RacesStateProps {
  currentId: Maybe<string>;
  currentVariantId: Maybe<string>;
  races: Maybe<List<Record<RaceCombined>>>;
  sortOrder: string;
  filterText: string;
}

export interface RacesDispatchProps {
  selectRace (id: string): (variantId: Maybe<string>) => void;
  selectRaceVariant (id: string): void;
  setSortOrder (sortOrder: string): void;
  switchValueVisibilityFilter (): void;
  setFilterText (filterText: string): void;
  switchToCultures (): void;
}

export type RacesProps = RacesStateProps & RacesDispatchProps & RacesOwnProps;

export function Races (props: RacesProps) {
  const { filterText, locale, races: list, sortOrder } = props;

  return (
    <Page id="races">
      <Options>
        <TextField
          hint={translate (locale, 'options.filtertext')}
          value={filterText}
          onChangeString={props.setFilterText}
          fullWidth
          />
        <SortOptions
          sortOrder={sortOrder}
          sort={props.setSortOrder}
          options={List.of<SortNames> ('name', 'cost')}
          locale={locale}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (locale, 'name')}
          </ListHeaderTag>
          <ListHeaderTag className="cost" hint={translate (locale, 'aptext')}>
            {translate (locale, 'apshort')}
          </ListHeaderTag>
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder has-border" />
        </ListHeader>
        <Scroll>
          <ListView>
            {
              Maybe.fromMaybe<NonNullable<React.ReactNode>>
                (
                  <ListPlaceholder
                    locale={locale}
                    type="races"
                    noResults={filterText.length > 0}
                    />
                )
                (list
                  .bind (Maybe.ensure (R.pipe (List.null, R.not)))
                  .fmap (R.pipe (
                    List.map (
                      race => (<RacesListItem {...props} key={race .get ('id')} race={race} />)
                    ),
                    List.toArray
                  )))
            }
          </ListView>
        </Scroll>
      </MainContent>
      <Aside>
        <RaceVariants {...props} />
        <WikiInfoContainer {...props} noWrapper />
      </Aside>
    </Page>
  );
}
