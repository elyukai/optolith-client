import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { List } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { ListItem } from '../../components/ListItem';
import { ListItemGroup } from '../../components/ListItemGroup';
import { ListItemName } from '../../components/ListItemName';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Scroll } from '../../components/Scroll';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import * as Categories from '../../constants/Categories';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { CurrentHeroInstanceState } from '../../reducers/currentHero';
import { AttributeInstance, Book, CantripInstance, InputTextEvent, SecondaryAttribute, SpellInstance } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { DCIds } from '../../utils/derivedCharacteristics';
import { filterAndSortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { isDecreasable, isIncreasable, isOwnTradition } from '../../utils/SpellUtils';
import { SkillListItem } from './SkillListItem';

export interface SpellsOwnProps {
	locale: UIMessages;
}

export interface SpellsStateProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	derivedCharacteristics: Map<DCIds, SecondaryAttribute>;
	addSpellsDisabled: boolean;
	currentHero: CurrentHeroInstanceState;
	enableActiveItemHints: boolean;
	inactiveList: (SpellInstance | CantripInstance)[];
	activeList: (SpellInstance | CantripInstance)[];
	isRemovingEnabled: boolean;
	sortOrder: string;
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
	currentId?: string;
	currentSlideinId?: string;
}

export class Spells extends React.Component<SpellsProps, SpellsState> {
	state = {
		filterText: '',
		filterTextSlidein: '',
		showAddSlidein: false,
		currentId: undefined,
		currentSlideinId: undefined
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as SpellsState);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as SpellsState);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as SpellsState);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '', currentSlideinId: undefined } as SpellsState);
	showInfo = (id: string) => this.setState({ currentId: id } as SpellsState);
	showSlideinInfo = (id: string) => this.setState({ currentSlideinId: id } as SpellsState);

	render() {
		const { addSpellsDisabled, addPoint, addToList, addCantripToList, currentHero, enableActiveItemHints, attributes, derivedCharacteristics, inactiveList, activeList, locale, isRemovingEnabled, removeFromList, removeCantripFromList, removePoint, setSortOrder, sortOrder, switchActiveItemHints } = this.props;
		const { filterText, filterTextSlidein, showAddSlidein } = this.state;

		const sortArray = [
			{ name: _translate(locale, 'options.sortorder.alphabetically'), value: 'name' },
			{ name: _translate(locale, 'options.sortorder.group'), value: 'group' },
			{ name: _translate(locale, 'options.sortorder.property'), value: 'property' },
			{ name: _translate(locale, 'options.sortorder.improvementcost'), value: 'ic' }
		];

		const listActive = activeList;
		let listDeactive = inactiveList;
		const list = [...activeList, ...inactiveList];

		if (enableActiveItemHints === true) {
			listDeactive = list;
		}

		const sortedActiveList = filterAndSortObjects(listActive, locale.id, filterText, sortOrder === 'property' ? [{ key: 'property', mapToIndex: _translate(locale, 'spells.view.properties')}, 'name'] : sortOrder === 'ic' ? [{ key: instance => (instance.ic || 0) }, 'name'] : sortOrder === 'group' ? [{ key: instance => (instance.gr || 1000) }, 'name'] : ['name']);
		const sortedDeactiveList = filterAndSortObjects(listDeactive, locale.id, filterTextSlidein, sortOrder === 'property' ? [{ key: 'property', mapToIndex: _translate(locale, 'spells.view.properties')}, 'name'] : sortOrder === 'ic' ? [{ key: instance => (instance.ic || 0) }, 'name'] : sortOrder === 'group' ? [{ key: instance => (instance.gr || 1000) }, 'name'] : ['name']);

		return (
			<Page id="spells">
				<Slidein isOpened={showAddSlidein} close={this.hideAddSlidein} className="adding-spells">
					<Options>
						<TextField hint={_translate(locale, 'options.filtertext')} value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
						<RadioButtonGroup
							active={sortOrder}
							onClick={setSortOrder}
							array={sortArray}
							/>
						<Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>{_translate(locale, 'options.showactivated')}</Checkbox>
					</Options>
					<MainContent>
						<ListHeader>
							<ListHeaderTag className="name">
								{_translate(locale, 'name')} ({_translate(locale, 'unfamiliartraditions')})
							</ListHeaderTag>
							<ListHeaderTag className="group">
								{_translate(locale, 'property')}
								{sortOrder === 'group' && ` / ${_translate(locale, 'group')}`}
							</ListHeaderTag>
							<ListHeaderTag className="check">
								{_translate(locale, 'check')}
							</ListHeaderTag>
							<ListHeaderTag className="mod" hint={_translate(locale, 'mod.long')}>
								{_translate(locale, 'mod.short')}
							</ListHeaderTag>
							<ListHeaderTag className="ic" hint={_translate(locale, 'ic.long')}>
								{_translate(locale, 'ic.short')}
							</ListHeaderTag>
							{isRemovingEnabled && <ListHeaderTag className="btn-placeholder" />}
							<ListHeaderTag className="btn-placeholder" />
						</ListHeader>
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
													attributes={attributes}
													derivedCharacteristics={derivedCharacteristics}
													selectForInfo={this.showSlideinInfo}
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
												attributes={attributes}
												derivedCharacteristics={derivedCharacteristics}
												selectForInfo={this.showSlideinInfo}
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
					</MainContent>
					<WikiInfoContainer {...this.props} list={list} currentId={this.state.currentSlideinId} />
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
				<MainContent>
					<ListHeader>
						<ListHeaderTag className="name">
							{_translate(locale, 'name')} ({_translate(locale, 'unfamiliartraditions')})
						</ListHeaderTag>
						<ListHeaderTag className="group">
							{_translate(locale, 'property')}
							{sortOrder === 'group' && ` / ${_translate(locale, 'group')}`}
						</ListHeaderTag>
						<ListHeaderTag className="value" hint={_translate(locale, 'sr.long')}>
							{_translate(locale, 'sr.short')}
						</ListHeaderTag>
						<ListHeaderTag className="check">
							{_translate(locale, 'check')}
						</ListHeaderTag>
						<ListHeaderTag className="mod" hint={_translate(locale, 'mod.long')}>
							{_translate(locale, 'mod.short')}
						</ListHeaderTag>
						<ListHeaderTag className="ic" hint={_translate(locale, 'ic.long')}>
							{_translate(locale, 'ic.short')}
						</ListHeaderTag>
						{isRemovingEnabled && <ListHeaderTag className="btn-placeholder" />}
						<ListHeaderTag className="btn-placeholder" />
						<ListHeaderTag className="btn-placeholder" />
					</ListHeader>
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
												removePoint={isRemovingEnabled ? removeCantripFromList.bind(null, obj.id) : undefined}
												addFillElement
												noIncrease
												insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.CANTRIPS}
												attributes={attributes}
												derivedCharacteristics={derivedCharacteristics}
												selectForInfo={this.showInfo}
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
											removePoint={isRemovingEnabled ? obj.value === 0 ? removeFromList.bind(null, obj.id) : removePoint.bind(null, obj.id) : undefined}
											removeDisabled={!isDecreasable(currentHero, obj)}
											addFillElement
											insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.CANTRIPS || prevObj.gr !== obj.gr)}
											attributes={attributes}
											derivedCharacteristics={derivedCharacteristics}
											selectForInfo={this.showInfo}
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
				</MainContent>
				<WikiInfoContainer {...this.props} {...this.state} list={list} />
			</Page>
		);
	}
}
