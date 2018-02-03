import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { List } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { ListItem } from '../../components/ListItem';
import { ListItemName } from '../../components/ListItemName';
import { ListPlaceholder } from '../../components/ListPlaceholder';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { Slidein } from '../../components/Slidein';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import * as Categories from '../../constants/Categories';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { DCIds } from '../../selectors/derivedCharacteristicsSelectors';
import { AttributeInstance, BlessingInstance, InputTextEvent, LiturgyInstance, SecondaryAttribute } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { LiturgicalChantWithRequirements } from '../../types/view';
import { _translate } from '../../utils/I18n';
import { getAspectsOfTradition } from '../../utils/LiturgyUtils';
import { SkillListItem } from './SkillListItem';

export interface LiturgiesOwnProps {
	locale: UIMessages;
}

export interface LiturgiesStateProps {
	addChantsDisabled: boolean;
	attributes: Map<string, AttributeInstance>;
	derivedCharacteristics: Map<DCIds, SecondaryAttribute>;
	enableActiveItemHints: boolean;
	activeList: (BlessingInstance | LiturgicalChantWithRequirements)[];
	inactiveList: (BlessingInstance | LiturgyInstance)[];
	isRemovingEnabled: boolean;
	sortOrder: string;
	traditionId: number;
	filterText: string;
	inactiveFilterText: string;
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
	setFilterText(filterText: string): void;
	setInactiveFilterText(filterText: string): void;
}

export type LiturgiesProps = LiturgiesStateProps & LiturgiesDispatchProps & LiturgiesOwnProps;

export interface LiturgiesState {
	filterText: string;
	filterTextSlidein: string;
	showAddSlidein: boolean;
	currentId?: string;
	currentSlideinId?: string;
}

export class Liturgies extends React.Component<LiturgiesProps, LiturgiesState> {
	state = {
		filterText: '',
		filterTextSlidein: '',
		showAddSlidein: false,
		currentId: undefined,
		currentSlideinId: undefined
	};

	filter = (event: InputTextEvent) => this.props.setFilterText(event.target.value);
	filterSlidein = (event: InputTextEvent) => this.props.setInactiveFilterText(event.target.value);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as LiturgiesState);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as LiturgiesState);
	showInfo = (id: string) => this.setState({ currentId: id } as LiturgiesState);
	showSlideinInfo = (id: string) => this.setState({ currentSlideinId: id } as LiturgiesState);

	render() {
		const { addChantsDisabled, addPoint, addToList, addBlessingToList, enableActiveItemHints, attributes, derivedCharacteristics, activeList, inactiveList, locale, isRemovingEnabled, removeFromList, removeBlessingFromList, removePoint, setSortOrder, sortOrder, switchActiveItemHints, traditionId, filterText, inactiveFilterText } = this.props;
		const { showAddSlidein } = this.state;

		return (
			<Page id="liturgies">
				<Slidein isOpened={showAddSlidein} close={this.hideAddSlidein} className="adding-liturgical-chants">
					<Options>
						<TextField hint={_translate(locale, 'options.filtertext')} value={inactiveFilterText} onChange={this.filterSlidein} fullWidth />
						<SortOptions
							sortOrder={sortOrder}
							sort={setSortOrder}
							options={['name', 'group', 'ic']}
							locale={locale}
							/>
						<Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>{_translate(locale, 'options.showactivated')}</Checkbox>
					</Options>
					<MainContent>
						<ListHeader>
							<ListHeaderTag className="name">
								{_translate(locale, 'name')}
							</ListHeaderTag>
							<ListHeaderTag className="group">
								{_translate(locale, 'aspect')}
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
									inactiveList.length === 0 ? <ListPlaceholder locale={locale} type="inactiveLiturgicalChants" noResults /> : inactiveList.map((obj, index, array) => {
										const prevObj = array[index - 1];

										if (obj.active === true) {
											const { id, name } = obj;
											let insertTopMargin = false;

											if (sortOrder === 'group' && prevObj) {
												if (obj.category === Categories.BLESSINGS) {
													insertTopMargin = prevObj.category !== Categories.BLESSINGS;
												}
												else {
													insertTopMargin = (prevObj.category === Categories.BLESSINGS || prevObj.gr !== obj.gr);
												}
											}

											return (
												<ListItem
													key={id}
													disabled
													insertTopMargin={insertTopMargin}
													>
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
													attributes={attributes}
													derivedCharacteristics={derivedCharacteristics}
													selectForInfo={this.showSlideinInfo}
													addText={sortOrder === 'group' ? `${aspc} / ${_translate(locale, 'liturgies.view.blessing')}` : aspc}
													/>
											);
										}

										const { check, checkmod, ic } = obj;
										const add = { check, checkmod, ic };

										return (
											<SkillListItem
												{...add}
												key={obj.id}
												id={obj.id}
												name={name}
												isNotActive
												activate={addToList.bind(null, obj.id)}
												activateDisabled={addChantsDisabled && obj.gr < 3}
												addFillElement
												insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.BLESSINGS || prevObj.gr !== obj.gr)}
												attributes={attributes}
												derivedCharacteristics={derivedCharacteristics}
												selectForInfo={this.showSlideinInfo}
												addText={sortOrder === 'group' ? aspc.length === 0 ? _translate(locale, 'liturgies.view.groups')[obj.gr - 1] : `${aspc} / ${_translate(locale, 'liturgies.view.groups')[obj.gr - 1]}` : aspc}
												/>
										);
									})
								}
							</List>
						</Scroll>
					</MainContent>
					<WikiInfoContainer {...this.props} currentId={this.state.currentSlideinId} />
				</Slidein>
				<Options>
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<SortOptions
						sortOrder={sortOrder}
						sort={setSortOrder}
						options={['name', 'group', 'ic']}
						locale={locale}
						/>
					<BorderButton
						label={_translate(locale, 'actions.addtolist')}
						onClick={this.showAddSlidein}
						/>
				</Options>
				<MainContent>
					<ListHeader>
						<ListHeaderTag className="name">
							{_translate(locale, 'name')}
						</ListHeaderTag>
						<ListHeaderTag className="group">
							{_translate(locale, 'aspect')}
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
								activeList.length === 0 ? <ListPlaceholder locale={locale} type="liturgicalChants" noResults={filterText.length > 0} /> : activeList.map((obj, index, array) => {
									const prevObj = array[index - 1];

									const name = obj.name;

									const aspc = obj.aspects.filter(e => getAspectsOfTradition(traditionId as number + 1).includes(e)).map(e => _translate(locale, 'liturgies.view.aspects')[e - 1]).sort().join(', ');

									if (obj.category === Categories.BLESSINGS) {
										return (
											<SkillListItem
												key={obj.id}
												id={obj.id}
												name={name}
												removePoint={isRemovingEnabled ? removeBlessingFromList.bind(null, obj.id) : undefined}
												addFillElement
												noIncrease
												insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.BLESSINGS}
												attributes={attributes}
												derivedCharacteristics={derivedCharacteristics}
												selectForInfo={this.showInfo}
												addText={sortOrder === 'group' ? `${aspc} / ${_translate(locale, 'liturgies.view.blessing')}` : aspc}
												/>
										);
									}

									const { check, checkmod, ic, value, isDecreasable, isIncreasable } = obj;

									const add = {
										addDisabled: !isIncreasable,
										addPoint: addPoint.bind(null, obj.id),
										check,
										checkmod,
										ic,
										sr: value,
									};

									return (
										<SkillListItem
											{...add}
											key={obj.id}
											id={obj.id}
											name={name}
											removePoint={isRemovingEnabled ? obj.value === 0 ? removeFromList.bind(null, obj.id) : removePoint.bind(null, obj.id) : undefined}
											removeDisabled={!isDecreasable}
											addFillElement
											insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.BLESSINGS || prevObj.gr !== obj.gr)}
											attributes={attributes}
											derivedCharacteristics={derivedCharacteristics}
											selectForInfo={this.showInfo}
											addText={sortOrder === 'group' ? aspc.length === 0 ? _translate(locale, 'liturgies.view.groups')[obj.gr - 1] : `${aspc} / ${_translate(locale, 'liturgies.view.groups')[obj.gr - 1]}` : aspc}
											/>
									);
								})
							}
						</List>
					</Scroll>
				</MainContent>
				<WikiInfoContainer {...this.props} {...this.state} />
			</Page>
		);
	}
}
