import * as React from 'react';
import { Aside } from '../../components/Aside';
import { Checkbox } from '../../components/Checkbox';
import { Dropdown } from '../../components/Dropdown';
import { List } from '../../components/List';
import { Options } from '../../components/Options';
import { Scroll } from '../../components/Scroll';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { SelectionsContainer } from '../../containers/RCPSelections';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { CantripInstance, InputTextEvent, LiturgyInstance, SMap, SpellInstance } from '../../types/data.d';
import { Profession, UIMessages } from '../../types/view.d';
import { filterAndSortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { ProfessionsListItem } from './ProfessionsListItem';
import { ProfessionVariants } from './ProfessionVariants';

export interface ProfessionsOwnProps {
	locale: UIMessages;
}

export interface ProfessionsStateProps {
	cantrips: SMap<CantripInstance>;
	liturgicalChants: SMap<LiturgyInstance>;
	spells: SMap<SpellInstance>;
	currentProfessionId?: string;
	currentProfessionVariantId?: string;
	extensionVisibilityFilter: boolean;
	groupVisibilityFilter: number;
	professions: Profession[];
	sortOrder: string;
	sex: 'm' | 'f';
	visibilityFilter: string;
}

export interface ProfessionsDispatchProps {
	selectProfession(id: string): void;
	selectProfessionVariant(id: string): void;
	setGroupVisibilityFilter(): void;
	setSortOrder(sortOrder: string): void;
	setVisibilityFilter(): void;
	switchExpansionVisibilityFilter(): void;
}

export type ProfessionsProps = ProfessionsStateProps & ProfessionsDispatchProps & ProfessionsOwnProps;

export interface ProfessionsState {
	filterText: string;
	showAddSlidein: boolean;
}

export class Professions extends React.Component<ProfessionsProps, ProfessionsState> {
	state = {
		filterText: '',
		showAddSlidein: false
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as ProfessionsState);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as ProfessionsState);
	hideAddSlidein = () => this.setState({ showAddSlidein: false } as ProfessionsState);

	render() {
		const { currentProfessionId, extensionVisibilityFilter, groupVisibilityFilter, locale, professions, setGroupVisibilityFilter, setSortOrder, setVisibilityFilter, sex, sortOrder, switchExpansionVisibilityFilter, visibilityFilter } = this.props;
		const { filterText, showAddSlidein } = this.state;

		const list = filterAndSortObjects(professions, locale.id, filterText, sortOrder === 'cost' ? ['ap', { key: 'name', keyOfProperty: sex }, { key: 'subname', keyOfProperty: sex }] : [{ key: 'name', keyOfProperty: sex }, { key: 'subname', keyOfProperty: sex }], { addProperty: 'subname', keyOfName: sex });

		return (
			<div className="page" id="professions">
				{
					showAddSlidein && <SelectionsContainer close={this.hideAddSlidein} locale={locale} />
				}
				<Options>
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<Dropdown
						value={visibilityFilter}
						onChange={setVisibilityFilter}
						options={[{id: 'all', name: _translate(locale, 'professions.options.allprofessions')}, {id: 'common', name: _translate(locale, 'professions.options.commonprofessions')}]}
						fullWidth
						/>
					<Dropdown
						value={groupVisibilityFilter}
						onChange={setGroupVisibilityFilter}
						options={[{id: 0, name: _translate(locale, 'professions.options.allprofessiongroups')}, {id: 1, name: _translate(locale, 'professions.options.mundaneprofessions')}, {id: 2, name: _translate(locale, 'professions.options.magicalprofessions')}, {id: 3, name: _translate(locale, 'professions.options.blessedprofessions')}]}
						fullWidth
						/>
					<SortOptions
						sortOrder={sortOrder}
						sort={setSortOrder}
						options={['name', 'cost']}
						locale={locale}
						/>
					<Checkbox checked={extensionVisibilityFilter} onClick={switchExpansionVisibilityFilter}>
						{_translate(locale, 'professions.options.alwaysshowprofessionsfromextensions')}
					</Checkbox>
				</Options>
				<Scroll>
					<List>
						{
							list.map(profession =>
							<ProfessionsListItem
								{...this.props}
								key={profession.id}
								showAddSlidein={this.showAddSlidein}
								profession={profession}
								/>
							)
						}
					</List>
				</Scroll>
				<Aside>
					<ProfessionVariants {...this.props} />
					<WikiInfoContainer {...this.props} list={professions} currentId={currentProfessionId} noWrapper />
				</Aside>
			</div>
		);
	}
}
