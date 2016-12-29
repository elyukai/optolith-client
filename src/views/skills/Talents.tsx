import { Component } from 'react';
import { CultureInstance } from '../../utils/data/Culture';
import { filterAndSort } from '../../utils/ListUtils';
import { TalentInstance } from '../../utils/data/Talent';
import * as React from 'react';
import Checkbox from '../../components/Checkbox';
import CultureStore from '../../stores/CultureStore';
import PhaseStore from '../../stores/PhaseStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Scroll from '../../components/Scroll';
import SkillListItem from './SkillListItem';
import TalentsActions from '../../actions/TalentsActions';
import TalentsStore from '../../stores/TalentsStore';
import TextField from '../../components/TextField';

interface State {
	currentCulture: CultureInstance;
	filterText: string;
	phase: number;
	sortOrder: string;
	talentRating: boolean;
	talents: TalentInstance[];
}

export default class Talents extends Component<any, State> {
	
	state = { 
		talents: TalentsStore.getAll(),
		filterText: TalentsStore.getFilter(),
		sortOrder: TalentsStore.getSortOrder(),
		talentRating: TalentsStore.getTalentRating(),
		currentCulture: CultureStore.getCurrent(),
		phase: PhaseStore.get()
	};
	
	_updateTalentsStore = () => this.setState({
		talents: TalentsStore.getAll(),
		filterText: TalentsStore.getFilter(),
		sortOrder: TalentsStore.getSortOrder(),
		talentRating: TalentsStore.getTalentRating()
	} as State);

	filter = event => TalentsActions.filter(event.target.value);
	sort = option => TalentsActions.sort(option);
	changeTalentRating = () => TalentsActions.changeTalentRating();
	addPoint = id => TalentsActions.addPoint(id);
	removePoint = id => TalentsActions.removePoint(id);
	
	componentDidMount() {
		TalentsStore.addChangeListener(this._updateTalentsStore );
	}
	
	componentWillUnmount() {
		TalentsStore.removeChangeListener(this._updateTalentsStore );
	}

	render() {

		const GROUPS = ['Körper', 'Gesellschaft', 'Natur', 'Wissen', 'Handwerk'];

		const { filterText, phase, sortOrder, talentRating, talents } = this.state;

		const list = filterAndSort(talents, filterText, sortOrder);

		return (
			<div className="page" id="talents">
				<div className="options">
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup active={sortOrder} onClick={this.sort} array={[
						{ name: 'Alphabetisch', value: 'name' },
						{ name: 'Nach Gruppe', value: 'group' },
						{ name: 'Nach Steigerungsfaktor', value: 'ic' }
					]} />
					<Checkbox checked={talentRating} onClick={this.changeTalentRating}>Wertung durch Kultur anzeigen</Checkbox>
				</div>
				<Scroll className="list">
					<table className="list">
						<thead>
							<tr>
								<td className="type">Gruppe</td>
								<td className="name">Talent</td>
								<td className="fw">Fw</td>
								<td className="check">Probe</td>
								<td className="skt">Sf.</td>
								<td className="inc"></td>
							</tr>
						</thead>
						<tbody>
							{
								list.map(obj => (
									<SkillListItem
										key={obj.id}
										typ={talentRating && obj.isTyp}
										untyp={talentRating && obj.isUntyp}
										group={GROUPS[obj.gr - 1]}
										name={obj.name}
										sr={obj.value}
										check={obj.check}
										ic={obj.ic}
										addPoint={this.addPoint.bind(null, obj.id)}
										addDisabled={!obj.isIncreasable}
										removePoint={phase < 3 ? this.removePoint.bind(null, obj.id) : undefined}
										removeDisabled={!obj.isDecreasable} />
								))
							}
						</tbody>
					</table>
				</Scroll>
			</div>
		);
	}
}
