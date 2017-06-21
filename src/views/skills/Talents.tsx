import * as React from 'react';
import * as TalentsActions from '../../actions/TalentsActions';
import { Aside } from '../../components/Aside';
import { Checkbox } from '../../components/Checkbox';
import { List } from '../../components/List';
import { ListItemGroup } from '../../components/ListItemGroup';
import { Markdown } from '../../components/Markdown';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { RecommendedReference } from '../../components/RecommendedReference';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { CultureStore } from '../../stores/CultureStore';
import { get } from '../../stores/ListStore';
import { PhaseStore } from '../../stores/PhaseStore';
import { TalentsStore } from '../../stores/TalentsStore';
import { AttributeInstance, CultureInstance, InputTextEvent, TalentInstance } from '../../types/data.d';
import { translate } from '../../utils/I18n';
import { filterAndSort } from '../../utils/FilterSortUtils';
import { isDecreasable, isIncreasable, isTyp, isUntyp } from '../../utils/TalentUtils';
import { SkillListItem } from './SkillListItem';

export interface TalentsState {
	currentCulture: CultureInstance;
	filterText: string;
	infoId?: string;
	phase: number;
	sortOrder: string;
	talentRating: boolean;
	talents: TalentInstance[];
}

export class Talents extends React.Component<{}, TalentsState> {
	state: TalentsState = {
		currentCulture: CultureStore.getCurrent()!,
		filterText: '',
		phase: PhaseStore.get(),
		sortOrder: TalentsStore.getSortOrder(),
		talentRating: TalentsStore.isRatingVisible(),
		talents: TalentsStore.getAll(),
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as TalentsState);
	sort = (option: string) => TalentsActions.setSortOrder(option);
	changeTalentRating = () => TalentsActions.switchRatingVisibility();
	addPoint = (id: string) => TalentsActions.addPoint(id);
	removePoint = (id: string) => TalentsActions.removePoint(id);
	showInfo = (id: string) => this.setState({ infoId: id } as TalentsState);

	componentDidMount() {
		TalentsStore.addChangeListener(this.updateTalentsStore);
	}

	componentWillUnmount() {
		TalentsStore.removeChangeListener(this.updateTalentsStore);
	}

	render() {
		const { filterText, infoId, phase, sortOrder, talentRating, talents } = this.state;

		const info = infoId && get(infoId) as TalentInstance;

		const list = filterAndSort(talents, filterText, sortOrder);

		return (
			<Page id="talents">
				<Options>
					<TextField hint={translate('options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={[
							{ name: translate('options.sortorder.alphabetically'), value: 'name' },
							{ name: translate('options.sortorder.group'), value: 'group' },
							{ name: translate('options.sortorder.improvementcost'), value: 'ic' }
						]}
						/>
					<Checkbox checked={talentRating} onClick={this.changeTalentRating}>{translate('skills.options.commoninculture')}</Checkbox>
					{talentRating && <RecommendedReference/>}
				</Options>
				<Scroll>
					<List>
						{
							list.map((obj, index, array) => {
								const prevObj = array[index - 1];
								return (
									<SkillListItem
										key={obj.id}
										id={obj.id}
										typ={talentRating && isTyp(obj)}
										untyp={talentRating && isUntyp(obj)}
										name={obj.name}
										sr={obj.value}
										check={obj.check}
										ic={obj.ic}
										addPoint={this.addPoint.bind(null, obj.id)}
										addDisabled={!isIncreasable(obj)}
										removePoint={phase < 3 ? this.removePoint.bind(null, obj.id) : undefined}
										removeDisabled={!isDecreasable(obj)}
										insertTopMargin={sortOrder === 'group' && prevObj && prevObj.gr !== obj.gr}
										selectForInfo={this.showInfo}
										>
										<ListItemGroup list={translate('skills.view.groups')} index={obj.gr} />
									</SkillListItem>
								);
							})
						}
					</List>
				</Scroll>
				<Aside>
					{info ? (() => {
						const attrPoints = info.check.map(id => (get(id) as AttributeInstance).value);
						const lessAttrPoints = attrPoints.map(e => e < 13 ? 13 - e : 0).reduce((a, b) => a + b, 0);
						const flatRoutineLevel = Math.floor((info.value - 1) / 3);
						const checkMod = flatRoutineLevel * -1 + 3;
						const dependentCheckMod = checkMod + lessAttrPoints;
						const routine = info.value > 0 ? dependentCheckMod < 4 ? [ dependentCheckMod, lessAttrPoints > 0 ] : false : false;
						const routineSign = routine && routine[0] > 0 ? '+' : '';
						const routineOptional = routine && routine[1] ? '!' : '';

						return (
							<Scroll>
								<div className="info skill-info">
									<div className="skill-header info-header">
										<p className="title">{info.name}</p>
										<p className="sr">{info.value}</p>
									</div>
									<div className="test">
										<div className={info.check[0]}>{(get(info.check[0]) as AttributeInstance).short}</div>
										<div className={info.check[1]}>{(get(info.check[1]) as AttributeInstance).short}</div>
										<div className={info.check[2]}>{(get(info.check[2]) as AttributeInstance).short}</div>
										<div className="hr"></div>
										<div className="routine">{routineSign}{Array.isArray(routine) ? routine[0] : '-'}{routineOptional}</div>
									</div>
									<p className="rule">
										<span>{translate('info.applications')}</span>
										<span>{info.applications && info.applications.map(e => e.name).sort().join(', ')}{info
											.applications && info.applicationsInput && ', '}{info.applicationsInput}</span>
									</p>
									<p className="enc">
										<span>{translate('info.encumbrance')}</span>
										<span>{info.encumbrance === 'true' ? translate('charactersheet.gamestats.skills.enc.yes') : info.encumbrance === 'false' ? translate('charactersheet.gamestats.skills.enc.no') : translate('charactersheet.gamestats.skills.enc.maybe')}</span>
									</p>
									{info.tools && <Markdown source={`**${translate('info.tools')}:** ${info.tools}`} className="note" />}
									{info.quality && <Markdown source={`**${translate('info.quality')}:** ${info.quality}`} className="note" />}
									{info.failed && <Markdown source={`**${translate('info.failedcheck')}:** ${info.failed}`} className="note" />}
									{info.critical && <Markdown source={`**${translate('info.criticalsuccess')}:** ${info.critical}`} className="note" />}
									{info.botch && <Markdown source={`**${translate('info.botch')}:** ${info.botch}`} className="note" />}
									<p className="ic">
										<span>{translate('info.improvementcost')}</span>
										<span>{['A', 'B', 'C', 'D'][info.ic - 1]}</span>
									</p>
								</div>
							</Scroll>
						);
					})() : (
						<div className="info-placeholder">
							&#xE88F;
						</div>
					)}
				</Aside>
			</Page>
		);
	}

	private updateTalentsStore = () => {
		this.setState({
			sortOrder: TalentsStore.getSortOrder(),
			talentRating: TalentsStore.isRatingVisible(),
			talents: TalentsStore.getAll(),
		} as TalentsState);
	}
}
