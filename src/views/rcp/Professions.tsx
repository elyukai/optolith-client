import * as React from 'react';
import { Aside } from '../../components/Aside';
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
import { SelectionsContainer } from '../../containers/RCPSelections';
import { WikiInfoContainer } from '../../containers/WikiInfoContainer';
import { InputTextEvent, Sex } from '../../types/data';
import { ProfessionCombined } from '../../types/view';
import { WikiAll } from '../../types/wiki';
import { Just, List, Maybe, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { ProfessionsListItem } from './ProfessionsListItem';
import { ProfessionVariants } from './ProfessionVariants';

export interface ProfessionsOwnProps {
  locale: UIMessagesObject;
}

export interface ProfessionsStateProps {
  wiki: Record<WikiAll>;
  currentProfessionId: Maybe<string>;
  currentProfessionVariantId: Maybe<string>;
  groupVisibilityFilter: number;
  professions: List<Record<ProfessionCombined>>;
  sortOrder: string;
  sex: Maybe<Sex>;
  visibilityFilter: string;
  filterText: string;
}

export interface ProfessionsDispatchProps {
  selectProfession (id: string): void;
  selectProfessionVariant (id: Maybe<string>): void;
  setGroupVisibilityFilter (filter: number): void;
  setSortOrder (sortOrder: string): void;
  setVisibilityFilter (filter: string): void;
  switchExpansionVisibilityFilter (): void;
  setFilterText (filterText: string): void;
}

export type ProfessionsProps =
  ProfessionsStateProps
  & ProfessionsDispatchProps
  & ProfessionsOwnProps;

export interface ProfessionsState {
  showAddSlidein: boolean;
}

export class Professions extends React.Component<ProfessionsProps, ProfessionsState> {
  state = {
    showAddSlidein: false,
  };

  filter = (event: InputTextEvent) => this.props.setFilterText (event.target.value);
  showAddSlidein = () => this.setState ({ showAddSlidein: true });
  hideAddSlidein = () => this.setState ({ showAddSlidein: false });

  render () {
    const {
      currentProfessionId,
      groupVisibilityFilter,
      locale,
      professions,
      setGroupVisibilityFilter,
      setSortOrder,
      setVisibilityFilter,
      sortOrder,
      visibilityFilter,
      filterText,
    } = this.props;

    const { showAddSlidein } = this.state;

    return (
      <Page id="professions">
        {
          showAddSlidein && <SelectionsContainer close={this.hideAddSlidein} locale={locale} />
        }
        <Options>
          <TextField
            hint={translate (locale, 'options.filtertext')}
            value={filterText}
            onChangeString={this.props.setFilterText}
            fullWidth
            />
          <Dropdown
            value={Just (visibilityFilter)}
            onChangeJust={setVisibilityFilter}
            options={List.of (
              Record.of<DropdownOption> ({
                id: 'all',
                name: translate (locale, 'professions.options.allprofessions'),
              }),
              Record.of<DropdownOption> ({
                id: 'common',
                name: translate (locale, 'professions.options.commonprofessions'),
              })
            )}
            fullWidth
            />
          <Dropdown
            value={Just (groupVisibilityFilter)}
            onChangeJust={setGroupVisibilityFilter}
            options={List.of (
              Record.of<DropdownOption> ({
                id: 0,
                name: translate (locale, 'professions.options.allprofessiongroups'),
              }),
              Record.of<DropdownOption> ({
                id: 1,
                name: translate (locale, 'professions.options.mundaneprofessions'),
              }),
              Record.of<DropdownOption> ({
                id: 2,
                name: translate (locale, 'professions.options.magicalprofessions'),
              }),
              Record.of<DropdownOption> ({
                id: 3,
                name: translate (locale, 'professions.options.blessedprofessions'),
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
            <ListHeaderTag className="cost" hint={translate (locale, 'aptext')}>
              {translate (locale, 'apshort')}
            </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder has-border" />
          </ListHeader>
          <Scroll>
            <ListView>
              {
                List.null (professions)
                  ? (<ListPlaceholder locale={locale} type="professions" noResults />)
                  : professions
                    .map (
                      profession => (
                        <ProfessionsListItem
                          {...this.props}
                          key={profession .get ('id')}
                          showAddSlidein={this.showAddSlidein}
                          profession={profession}
                          />
                      )
                    )
                    .toArray ()
              }
            </ListView>
          </Scroll>
        </MainContent>
        <Aside>
          <ProfessionVariants {...this.props} />
          <WikiInfoContainer {...this.props} currentId={currentProfessionId} noWrapper />
        </Aside>
      </Page>
    );
  }
}
