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
import { BlessingInstance, InputTextEvent, Instance, LiturgyInstance, SecondaryAttribute } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { DCIds } from '../../utils/derivedCharacteristics';
import { filterAndSort } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getAspectsOfTradition, isDecreasable, isIncreasable, isOwnTradition } from '../../utils/LiturgyUtils';
import { SkillListItem } from './SkillListItem';

export interface LiturgiesOwnProps {
	locale: UIMessages;
}

export interface LiturgiesStateProps {
	addChantsDisabled: boolean;
	currentHero: CurrentHeroInstanceState;
	enableActiveItemHints: boolean;
	list: (BlessingInstance | LiturgyInstance)[];
	phase: number;
	sortOrder: string;
	traditionId: number;
	get(id: string): Instance | undefined;
	getDerivedCharacteristic(id: DCIds): SecondaryAttribute;
}

export interface LiturgiesDispatchProps {
	setSortOrder(sortOrder: string): void;
	switchActiveItemHints(): void;
	addPoint(id: string): void;
	addToList(id: string): void;
	addBlessingToList(id: string): void;
	removePoint(id: string): void;
	removeFromList(id: string): void;
	removeBlessingFromList(id: string): void;
}

export type LiturgiesProps = LiturgiesStateProps & LiturgiesDispatchProps & LiturgiesOwnProps;

export interface LiturgiesState {
	filterText: string;
	filterTextSlidein: string;
	showAddSlidein: boolean;
}

export class Liturgies extends React.Component<LiturgiesProps, LiturgiesState> {
	state = {
		filterText: '',
		filterTextSlidein: '',
		showAddSlidein: false
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as LiturgiesState);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as LiturgiesState);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as LiturgiesState);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as LiturgiesState);

	render() {
		const { addChantsDisabled, addPoint, addToList, addBlessingToList, currentHero, enableActiveItemHints, get, getDerivedCharacteristic, list, locale, phase, removeFromList, removeBlessingFromList, removePoint, setSortOrder, sortOrder, switchActiveItemHints, traditionId } = this.props;
		const { filterText, filterTextSlidein, showAddSlidein } = this.state;

		const sortArray = [
			{ name: _translate(locale, 'options.sortorder.alphabetically'), value: 'name' },
			{ name: _translate(locale, 'options.sortorder.group'), value: 'group' },
			{ name: _translate(locale, 'options.sortorder.improvementcost'), value: 'ic' }
		];

		const listActive: (BlessingInstance | LiturgyInstance)[] = [];
		const listDeactive: (BlessingInstance | LiturgyInstance)[] = [];

		list.forEach(e => {
			if (e.active) {
				listActive.push(e);
				if (enableActiveItemHints === true) {
					listDeactive.push(e);
				}
			}
			else {
				if (isOwnTradition(currentHero.dependent, e)) {
					listDeactive.push(e);
				}
			}
		});

		const sortedActiveList = filterAndSort(listActive, filterText, sortOrder);
		const sortedDeactiveList = filterAndSort(listDeactive, filterTextSlidein, sortOrder);

		return (
			<Page id="liturgies">
				<Slidein isOpened={showAddSlidein} close={this.hideAddSlidein}>
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

									if (obj.active === true) {
										const { id, name } = obj;
										return (
											<ListItem key={id} disabled>
												<ListItemName name={name} />
											</ListItem>
										);
									}

									const { name } = obj;

									const aspc = obj.aspects.filter(e => getAspectsOfTradition(traditionId as number + 1).includes(e)).map(e => _translate(locale, 'liturgies.view.aspects')[e - 1]).sort().join(', ');

									if (obj.category === Categories.BLESSINGS) {
										return (
											<SkillListItem
												key={obj.id}
												id={obj.id}
												name={name}
												isNotActive
												activate={addBlessingToList.bind(null, obj.id)}
												addFillElement
												insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.BLESSINGS}
												get={get}
												getDerivedCharacteristic={getDerivedCharacteristic}
												>
												<ListItemGroup>
													{aspc}
													{sortOrder === 'group' && ` / ${_translate(locale, 'liturgies.view.blessing')}`}
												</ListItemGroup>
											</SkillListItem>
										);
									}

									const { check, checkmod, ic } = obj;
									const add = { check, checkmod, ic };

									return (
										<SkillListItem
											key={obj.id}
											id={obj.id}
											name={name}
											isNotActive
											activate={addToList.bind(null, obj.id)}
											activateDisabled={addChantsDisabled && obj.gr < 3}
											addFillElement
											insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.BLESSINGS || prevObj.gr !== obj.gr)}
											get={get}
											getDerivedCharacteristic={getDerivedCharacteristic}
											{...add}
											>
											<ListItemGroup>
												{aspc}
												{sortOrder === 'group' && ` / ${_translate(locale, 'liturgies.view.groups')[obj.gr - 1]}`}
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

								const name = obj.name;

								const aspc = obj.aspects.filter(e => getAspectsOfTradition(traditionId as number + 1).includes(e)).map(e => _translate(locale, 'liturgies.view.aspects')[e - 1]).sort().join(', ');

								if (obj.category === Categories.BLESSINGS) {
									return (
										<SkillListItem
											key={obj.id}
											id={obj.id}
											name={name}
											removePoint={phase < 3 ? removeBlessingFromList.bind(null, obj.id) : undefined}
											addFillElement
											noIncrease
											insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.BLESSINGS}
											get={get}
											getDerivedCharacteristic={getDerivedCharacteristic}
											>
											<ListItemGroup>
												{aspc}
												{sortOrder === 'group' && ` / ${_translate(locale, 'liturgies.view.blessing')}`}
											</ListItemGroup>
										</SkillListItem>
									);
								}

								const { check, checkmod, ic, value } = obj;

								const add = {
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
										insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.BLESSINGS || prevObj.gr !== obj.gr)}
										get={get}
										getDerivedCharacteristic={getDerivedCharacteristic}
										{...add}
										>
										<ListItemGroup>
											{aspc}
											{sortOrder === 'group' && ` / ${_translate(locale, 'liturgies.view.groups')[obj.gr - 1]}`}
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
