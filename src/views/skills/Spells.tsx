import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { List } from '../../components/List';
import { ListItem } from '../../components/ListItem';
import { ListItemGroup } from '../../components/ListItemGroup';
import { ListItemName } from '../../components/ListItemName';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Scroll } from '../../components/Scroll';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import * as Categories from '../../constants/Categories';
import { CurrentHeroInstanceState } from '../../reducers/currentHero';
import { CantripInstance, InputTextEvent, Instance, SecondaryAttribute, SpellInstance } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { DCIds } from '../../utils/derivedCharacteristics';
import { filterAndSort } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { isDecreasable, isIncreasable, isOwnTradition } from '../../utils/SpellUtils';
import { SkillListItem } from './SkillListItem';

export interface SpellsOwnProps {
	locale: UIMessages;
}

export interface SpellsStateProps {
	addSpellsDisabled: boolean;
	currentHero: CurrentHeroInstanceState;
	enableActiveItemHints: boolean;
	list: (SpellInstance | CantripInstance)[];
	phase: number;
	sortOrder: string;
	get(id: string): Instance | undefined;
	getDerivedCharacteristic(id: DCIds): SecondaryAttribute;
}

export interface SpellsDispatchProps {
	setSortOrder(sortOrder: string): void;
	switchActiveItemHints(): void;
	addPoint(id: string): void;
	addToList(id: string): void;
	addCantripToList(id: string): void;
	removePoint(id: string): void;
	removeFromList(id: string): void;
	removeCantripFromList(id: string): void;
}

export type SpellsProps = SpellsStateProps & SpellsDispatchProps & SpellsOwnProps;

export interface SpellsState {
	filterText: string;
	filterTextSlidein: string;
	showAddSlidein: boolean;
}

export class Spells extends React.Component<SpellsProps, SpellsState> {
	state = {
		filterText: '',
		filterTextSlidein: '',
		showAddSlidein: false
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as SpellsState);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as SpellsState);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as SpellsState);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as SpellsState);

	render() {
		const { addSpellsDisabled, addPoint, addToList, addCantripToList, currentHero, enableActiveItemHints, get, getDerivedCharacteristic, list, locale, phase, removeFromList, removeCantripFromList, removePoint, setSortOrder, sortOrder, switchActiveItemHints } = this.props;
		const { filterText, filterTextSlidein, showAddSlidein } = this.state;

		const sortArray = [
			{ name: _translate(locale, 'options.sortorder.alphabetically'), value: 'name' },
			{ name: _translate(locale, 'options.sortorder.group'), value: 'group' },
			{ name: _translate(locale, 'options.sortorder.property'), value: 'property' },
			{ name: _translate(locale, 'options.sortorder.improvementcost'), value: 'ic' }
		];

		const listActive: (SpellInstance | CantripInstance)[] = [];
		const listDeactive: (SpellInstance | CantripInstance)[] = [];

		list.forEach(e => {
			if (e.active) {
				listActive.push(e);
				if (enableActiveItemHints === true) {
					listDeactive.push(e);
				}
			}
			else {
				listDeactive.push(e);
			}
		});

		const sortedActiveList = filterAndSort(listActive, filterText, sortOrder);
		const sortedDeactiveList = filterAndSort(listDeactive, filterTextSlidein, sortOrder);

		return (
			<Page id="spells">
				<Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
					<Options>
						<TextField hint={_translate(locale, 'options.filtertext')} value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
						<RadioButtonGroup
							active={sortOrder}
							onClick={setSortOrder}
							array={sortArray}
							/>
						<Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>{_translate(locale, 'options.showactivated')}</Checkbox>
					</Options>
					<Scroll>
						<List>
							{
								sortedDeactiveList.map((obj, index, array) => {
									const prevObj = array[index - 1];

									let extendName = '';
									if (!isOwnTradition(currentHero.dependent, obj)) {
										extendName += ` (${obj.tradition.map(e => _translate(locale, 'spells.view.traditions')[e - 1]).sort().join(', ')})`;
									}

									if (obj.active === true) {
										const { id, name } = obj;
										const extendedName = name + extendName;
										return (
											<ListItem key={id} disabled>
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
												activate={addCantripToList.bind(null, obj.id)}
												addFillElement
												insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.CANTRIPS}
												get={get}
												getDerivedCharacteristic={getDerivedCharacteristic}
												>
												<ListItemGroup>
													{_translate(locale, 'spells.view.properties')[obj.property - 1]}
													{sortOrder === 'group' ? ` / ${_translate(locale, 'spells.view.cantrip')}` : null}
												</ListItemGroup>
											</SkillListItem>
										);
									}

									const { check, checkmod, ic } = obj;

									return (
										<SkillListItem
											key={obj.id}
											id={obj.id}
											name={name}
											isNotActive
											activate={addToList.bind(null, obj.id)}
											activateDisabled={addSpellsDisabled && obj.gr < 3}
											addFillElement
											check={check}
											checkmod={checkmod}
											ic={ic}
											insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.CANTRIPS || prevObj.gr !== obj.gr)}
											get={get}
											getDerivedCharacteristic={getDerivedCharacteristic}
											>
											<ListItemGroup>
												{_translate(locale, 'spells.view.properties')[obj.property - 1]}
												{sortOrder === 'group' ? ` / ${_translate(locale, 'spells.view.groups')[obj.gr - 1]}` : null}
											</ListItemGroup>
										</SkillListItem>
									);
								})
							}
						</List>
					</Scroll>
				</Slidein>
				<Options>
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={setSortOrder}
						array={sortArray}
						/>
					<BorderButton
						label={_translate(locale, 'actions.addtolist')}
						onClick={this.showAddSlidein}
						/>
				</Options>
				<Scroll>
					<List>
						{
							sortedActiveList.map((obj, index, array) => {
								const prevObj = array[index - 1];

								let name = obj.name;
								if (!isOwnTradition(currentHero.dependent, obj)) {
									name += ` (${obj.tradition.map(e => _translate(locale, 'spells.view.traditions')[e - 1]).sort().join(', ')})`;
								}

								if (obj.category === Categories.CANTRIPS) {
									return (
										<SkillListItem
											key={obj.id}
											id={obj.id}
											name={name}
											removePoint={phase < 3 ? removeCantripFromList.bind(null, obj.id) : undefined}
											addFillElement
											noIncrease
											insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.CANTRIPS}
											get={get}
											getDerivedCharacteristic={getDerivedCharacteristic}
											>
											<ListItemGroup>
												{_translate(locale, 'spells.view.properties')[obj.property - 1]}
												{sortOrder === 'group' ? ` / ${_translate(locale, 'spells.view.cantrip')}` : null}
											</ListItemGroup>
										</SkillListItem>
									);
								}

								const { check, checkmod, ic, value } = obj;

								const other = {
									addDisabled: !isIncreasable(currentHero, obj),
									addPoint: addPoint.bind(null, obj.id),
									check,
									checkmod,
									ic,
									sr: value,
								};

								return (
									<SkillListItem
										key={obj.id}
										id={obj.id}
										name={name}
										removePoint={phase < 3 ? obj.value === 0 ? removeFromList.bind(null, obj.id) : removePoint.bind(null, obj.id) : undefined}
										removeDisabled={!isDecreasable(currentHero, obj)}
										addFillElement
										insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.CANTRIPS || prevObj.gr !== obj.gr)}
										get={get}
										getDerivedCharacteristic={getDerivedCharacteristic}
										{...other} >
										<ListItemGroup>
											{_translate(locale, 'spells.view.properties')[obj.property - 1]}
											{sortOrder === 'group' ? ` / ${_translate(locale, 'spells.view.groups')[obj.gr - 1]}` : null}
										</ListItemGroup>
									</SkillListItem>
								);
							})
						}
					</List>
				</Scroll>
			</Page>
		);
	}
}
