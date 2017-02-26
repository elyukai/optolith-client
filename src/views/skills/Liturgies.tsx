import { filterAndSort } from '../../utils/ListUtils';
import BorderButton from '../../components/BorderButton';
import * as LiturgiesActions from '../../actions/LiturgiesActions';
import LiturgiesStore from '../../stores/LiturgiesStore';
import PhaseStore from '../../stores/PhaseStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import * as React from 'react';
import Scroll from '../../components/Scroll';
import SkillListItem from './SkillListItem';
import Slidein from '../../components/Slidein';
import TextField from '../../components/TextField';

interface State {
	liturgies: LiturgyInstance[];
	addChantsDisabled: boolean;
	filterText: string;
	sortOrder: string;
	phase: number;
	showAddSlidein: boolean;
}

export default class Liturgies extends React.Component<undefined, State> {

	state = {
		liturgies: LiturgiesStore.getAll(),
		addChantsDisabled: LiturgiesStore.isActivationDisabled(),
		filterText: '',
		sortOrder: LiturgiesStore.getSortOrder(),
		phase: PhaseStore.get(),
		showAddSlidein: false
	};

	_updateLiturgiesStore = () => this.setState({
		liturgies: LiturgiesStore.getAll(),
		addChantsDisabled: LiturgiesStore.isActivationDisabled(),
		sortOrder: LiturgiesStore.getSortOrder()
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
			{ name: 'Nach Steigerungsfaktor', value: 'ic' }
		];

		const list = filterAndSort(liturgies, filterText, sortOrder);

		const listActive: LiturgyInstance[] = [];
		const listDeactive: LiturgyInstance[] = [];

		list.forEach(e => {
			if (e.active) {
				listActive.push(e);
			}
			else {
				if (e.isOwnTradition) {
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
								listDeactive.map(liturgy => {
									const [ a, b, c, checkmod ] = liturgy.check;
									const check = [ a, b, c ];

									const name = liturgy.name;

									const aspc = liturgy.aspect.map(e => ASPECTS[e - 1]).sort().join(', ');

									const obj = liturgy.gr === 3 ? {} : {
										check,
										checkmod,
										ic: liturgy.ic
									};

									return (
										<SkillListItem
											key={liturgy.id}
											id={liturgy.id}
											name={name}
											isNotActive
											activate={this.addToList.bind(null, liturgy.id)}
											activateDisabled={addChantsDisabled && liturgy.gr < 3}
											addFillElement
											{...obj}
											>
											<div className="aspect">{aspc}</div>
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

								const aspc = obj.aspect.map(e => ASPECTS[e - 1]).sort().join(', ');

								const other = obj.gr === 3 ? {} : {
									sr: obj.value,
									check,
									checkmod,
									ic: obj.ic,
									addPoint: this.addPoint.bind(null, obj.id),
									addDisabled: !obj.isIncreasable
								};

								return (
									<SkillListItem
										key={obj.id}
										id={obj.id}
										name={name}
										removePoint={phase < 3 ? obj.gr === 3 || obj.value === 0 ? this.removeFromList.bind(null, obj.id) : this.removePoint.bind(null, obj.id) : undefined}
										removeDisabled={!obj.isDecreasable}
										addFillElement
										noIncrease={obj.gr === 3}
										{...other} >
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
