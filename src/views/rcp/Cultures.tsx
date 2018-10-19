import * as R from 'ramda';
import * as React from 'react';
import { Dropdown, DropdownOption } from '../../components/Dropdown';
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
import { CultureCombined } from '../../types/view';
import { Just, List, Maybe, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { CulturesListItem } from './CulturesListItem';

export interface CulturesOwnProps {
  locale: UIMessagesObject;
}

export interface CulturesStateProps {
  cultures: Maybe<List<Record<CultureCombined>>>;
  currentId: Maybe<string>;
  sortOrder: string;
  visibilityFilter: string;
  filterText: string;
}

export interface CulturesDispatchProps {
  selectCulture (id: string): void;
  setSortOrder (sortOrder: string): void;
  setVisibilityFilter (option: string): void;
  switchValueVisibilityFilter (): void;
  setFilterText (filterText: string): void;
  switchToProfessions (): void;
}

export type CulturesProps = CulturesStateProps & CulturesDispatchProps & CulturesOwnProps;

export function Cultures (props: CulturesProps) {
  const {
    cultures,
    locale,
    setSortOrder,
    setVisibilityFilter,
    sortOrder,
    visibilityFilter,
    filterText,
  } = props;

  return (
    <Page id="cultures">
      <Options>
        <TextField
          hint={translate (locale, 'options.filtertext')}
          value={filterText}
          onChangeString={props.setFilterText}
          fullWidth
          />
        <Dropdown
          value={Just (visibilityFilter)}
          onChangeJust={setVisibilityFilter}
          options={List.of (
            Record.of<DropdownOption> ({
              id: 'all',
              name: translate (locale, 'cultures.options.allcultures'),
            }),
            Record.of<DropdownOption> ({
              id: 'common',
              name: translate (locale, 'cultures.options.commoncultures'),
            })
          )}
          fullWidth
          />
        <SortOptions
          sortOrder={sortOrder}
          sort={setSortOrder}
          options={List.of<SortNames> ('name', 'cost')}
          locale={locale}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (locale, 'name')}
          </ListHeaderTag>
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll>
          <ListView>
            {
              Maybe.fromMaybe<NonNullable<React.ReactNode>>
                (<ListPlaceholder locale={locale} type="cultures" noResults />)
                (cultures
                  .bind (Maybe.ensure (R.pipe (List.null, R.not)))
                  .fmap (R.pipe (
                    List.map (
                      culture => (
                        <CulturesListItem
                          {...props}
                          key={culture.id}
                          culture={culture}
                          />
                      )
                    ),
                    List.toArray
                  )))
            }
          </ListView>
        </Scroll>
      </MainContent>
      <WikiInfoContainer {...props} />
    </Page>
  );
}
