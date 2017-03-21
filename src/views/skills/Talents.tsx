import * as React from 'react';
import * as TalentsActions from '../../actions/TalentsActions';
import Checkbox from '../../components/Checkbox';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';
import CultureStore from '../../stores/CultureStore';
import PhaseStore from '../../stores/PhaseStore';
import TalentsStore from '../../stores/TalentsStore';
import { filterAndSort } from '../../utils/ListUtils';
import { isDecreasable, isIncreasable, isTyp, isUntyp } from '../../utils/TalentUtils';
import SkillListItem from './SkillListItem';

interface State {
	currentCulture: CultureInstance;
	filterText: string;
	phase: number;
	sortOrder: string;
	talentRating: boolean;
	talents: TalentInstance[];
}

export default class Talents extends React.Component<undefined, State> {
	state = {
		currentCulture: CultureStore.getCurrent()!,
		filterText: '',
		phase: PhaseStore.get(),
		sortOrder: TalentsStore.getSortOrder(),
		talentRating: TalentsStore.isRatingVisible(),
		talents: TalentsStore.getAll(),
	};

	_updateTalentsStore = () => this.setState({
		sortOrder: TalentsStore.getSortOrder(),
		talentRating: TalentsStore.isRatingVisible(),
		talents: TalentsStore.getAll(),
	} as State);

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
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

		const list = filterAndSort(talents, filterText, sortOrder);

		return (
			<div className="page" id="talents">
				<div className="options">
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={[
							{ name: 'Alphabetisch', value: 'name' },
							{ name: 'Nach Gruppe', value: 'group' },
							{ name: 'Nach Steigerungsfaktor', value: 'ic' },
						]}
						/>
					<Checkbox checked={talentRating} onClick={this.changeTalentRating}>Wertung durch Kultur anzeigen</Checkbox>
				</div>
				<Scroll className="list">
					<div className="list-wrapper">
						{
							list.map(obj => (
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
									>
									<div className="group">{GROUPS[obj.gr - 1]}</div>
								</SkillListItem>
							))
						}
					</div>
				</Scroll>
			</div>
		);
	}
}
