import * as React from 'react';
import * as TalentsActions from '../../actions/TalentsActions';
import { Checkbox } from '../../components/Checkbox';
import { List } from '../../components/List';
import { ListItemGroup } from '../../components/ListItemGroup';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { RecommendedReference } from '../../components/RecommendedReference';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { CultureStore } from '../../stores/CultureStore';
import { PhaseStore } from '../../stores/PhaseStore';
import { TalentsStore } from '../../stores/TalentsStore';
import { CultureInstance, InputTextEvent, TalentInstance } from '../../types/data.d';
import { filterAndSort } from '../../utils/ListUtils';
import { isDecreasable, isIncreasable, isTyp, isUntyp } from '../../utils/TalentUtils';
import { SkillListItem } from './SkillListItem';

export interface TalentsState {
	currentCulture: CultureInstance;
	filterText: string;
	phase: number;
	sortOrder: string;
	talentRating: boolean;
	talents: TalentInstance[];
}

export class Talents extends React.Component<undefined, TalentsState> {
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
	} as TalentsState);

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as TalentsState);
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
			<Page id="talents">
				<Options>
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
					<Checkbox checked={talentRating} onClick={this.changeTalentRating}>Empfohlen durch Kultur</Checkbox>
					{talentRating && <RecommendedReference/>}
				</Options>
				<Scroll>
					<List>
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
									enableInfo
									>
									<ListItemGroup list={GROUPS} index={obj.gr} />
								</SkillListItem>
							))
						}
					</List>
				</Scroll>
			</Page>
		);
	}
}
