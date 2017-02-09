import { Component } from 'react';
import { filterAndSort } from '../../utils/ListUtils';
import * as React from 'react';
import * as TalentsActions from '../../actions/TalentsActions';
import Aside from '../../components/Aside';
import Checkbox from '../../components/Checkbox';
import CultureStore from '../../stores/CultureStore';
import PhaseStore from '../../stores/PhaseStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Scroll from '../../components/Scroll';
import SkillListItem from './SkillListItem';
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

export default class Talents extends Component<undefined, State> {

	state = {
		talents: TalentsStore.getAll(),
		filterText: '',
		sortOrder: TalentsStore.getSortOrder(),
		talentRating: TalentsStore.isRatingVisible(),
		currentCulture: CultureStore.getCurrent(),
		phase: PhaseStore.get()
	};

	_updateTalentsStore = () => this.setState({
		talents: TalentsStore.getAll(),
		sortOrder: TalentsStore.getSortOrder(),
		talentRating: TalentsStore.isRatingVisible()
	} as State);

	filter = (event: Event) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => TalentsActions.setSortOrder(option);
	changeTalentRating = () => TalentsActions.switchRatingVisibility();
	addPoint = (id: string) => TalentsActions.addPoint(id);
	removePoint = (id: string) => TalentsActions.removePoint(id);

	componentDidMount() {
		TalentsStore.addChangeListener(this._updateTalentsStore );
	}

	componentWillUnmount() {
		TalentsStore.removeChangeListener(this._updateTalentsStore );
	}

	render() {

		const GROUPS = ['Körper', 'Gesellschaft', 'Natur', 'Wissen', 'Handwerk'];

		const { filterText, phase, sortOrder, talentRating, talents } = this.state;

		const list = filterAndSort<TalentInstance>(talents, filterText, sortOrder);

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
					<div className="list-wrapper">
						{
							list.map(obj => (
								<SkillListItem
									key={obj.id}
									id={obj.id}
									typ={talentRating && obj.isTyp}
									untyp={talentRating && obj.isUntyp}
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
					</div>
				</Scroll>
			</div>
		);
	}
}
