import * as React from 'react';
import * as LiturgiesActions from '../../actions/LiturgiesActions';
import BorderButton from '../../components/BorderButton';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Scroll from '../../components/Scroll';
import Slidein from '../../components/Slidein';
import TextField from '../../components/TextField';
import LiturgiesStore from '../../stores/LiturgiesStore';
import PhaseStore from '../../stores/PhaseStore';
import { filterAndSort } from '../../utils/ListUtils';
import { isDecreasable, isIncreasable, isOwnTradition } from '../../utils/LiturgyUtils';
import SkillListItem from './SkillListItem';

interface State {
	addChantsDisabled: boolean;
	filterText: string;
	liturgies: LiturgyInstance[];
	phase: number;
	showAddSlidein: boolean;
	sortOrder: string;
}

export default class Liturgies extends React.Component<undefined, State> {

	state = {
		addChantsDisabled: LiturgiesStore.isActivationDisabled(),
		filterText: '',
		liturgies: LiturgiesStore.getAll(),
		phase: PhaseStore.get(),
		showAddSlidein: false,
		sortOrder: LiturgiesStore.getSortOrder(),
	};

	_updateLiturgiesStore = () => this.setState({
		addChantsDisabled: LiturgiesStore.isActivationDisabled(),
		liturgies: LiturgiesStore.getAll(),
		sortOrder: LiturgiesStore.getSortOrder(),
	} as State);

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => LiturgiesActions.setSortOrder(option);
	addToList = (id: string) => LiturgiesActions.addToList(id);
	addPoint = (id: string) => LiturgiesActions.addPoint(id);
	removeFromList = (id: string) => LiturgiesActions.removeFromList(id);
	removePoint = (id: string) => LiturgiesActions.removePoint(id);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false } as State);

	componentDidMount() {
		LiturgiesStore.addChangeListener(this._updateLiturgiesStore );
	}

	componentWillUnmount() {
		LiturgiesStore.removeChangeListener(this._updateLiturgiesStore );
	}

	render() {
		const GROUPS = LiturgiesStore.getGroupNames();
		const ASPECTS = LiturgiesStore.getAspectNames();

		const { addChantsDisabled, filterText, phase, showAddSlidein, sortOrder, liturgies } = this.state;

		const sortArray = [
			{ name: 'Alphabetisch', value: 'name' },
			{ name: 'Nach Aspekt', value: 'aspect' },
			{ name: 'Nach Gruppe', value: 'group' },
			{ name: 'Nach Steigerungsfaktor', value: 'ic' },
		];

		const list = filterAndSort(liturgies, filterText, sortOrder);

		const listActive: LiturgyInstance[] = [];
		const listDeactive: LiturgyInstance[] = [];

		list.forEach(e => {
			if (e.active) {
				listActive.push(e);
			}
			else {
				if (isOwnTradition(e)) {
					listDeactive.push(e);
				}
			}
		});

		return (
			<div className="page" id="liturgies">
				<Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
					<div className="options">
						<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
						<RadioButtonGroup
							active={sortOrder}
							onClick={this.sort}
							array={sortArray}
							/>
					</div>
					<Scroll className="list">
						<div className="list-wrapper">
							{
								listDeactive.map(obj => {
									const [ a, b, c, checkmod ] = obj.check;
									const check = [ a, b, c ];

									const name = obj.name;

									const aspc = obj.aspects.map(e => ASPECTS[e - 1]).sort().join(', ');

									const add = obj.gr === 3 ? {} : {
										check,
										checkmod,
										ic: obj.ic,
									};

									return (
										<SkillListItem
											key={obj.id}
											id={obj.id}
											name={name}
											isNotActive
											activate={this.addToList.bind(null, obj.id)}
											activateDisabled={addChantsDisabled && obj.gr < 3}
											addFillElement
											{...add}
											>
											<div className="aspect">
												{aspc}
												{sortOrder === 'group' ? ` / ${GROUPS[obj.gr - 1]}` : null}
											</div>
										</SkillListItem>
									);
								})
							}
						</div>
					</Scroll>
				</Slidein>
				<div className="options">
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={sortArray}
						/>
					<BorderButton
						label="Hinzufügen"
						onClick={this.showAddSlidein}
						/>
				</div>
				<Scroll className="list">
					<div className="list-wrapper">
						{
							listActive.map(obj => {
								const [ a1, a2, a3, checkmod ] = obj.check;
								const check = [ a1, a2, a3 ];

								const name = obj.name;

								const aspc = obj.aspects.map(e => ASPECTS[e - 1]).sort().join(', ');

								const add = obj.gr === 3 ? {} : {
									addDisabled: !isIncreasable(obj),
									addPoint: this.addPoint.bind(null, obj.id),
									check,
									checkmod,
									ic: obj.ic,
									sr: obj.value,
								};

								return (
									<SkillListItem
										key={obj.id}
										id={obj.id}
										name={name}
										removePoint={phase < 3 ? obj.gr === 3 || obj.value === 0 ? this.removeFromList.bind(null, obj.id) : this.removePoint.bind(null, obj.id) : undefined}
										removeDisabled={!isDecreasable(obj)}
										addFillElement
										noIncrease={obj.gr === 3}
										{...add}
										>
										<div className="aspect">{aspc}</div>
									</SkillListItem>
								);
							})
						}
					</div>
				</Scroll>
			</div>
		);
	}
}
