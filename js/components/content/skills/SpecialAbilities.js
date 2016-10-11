import BorderButton from '../../layout/BorderButton';
import Dropdown from '../../layout/Dropdown';
import RadioButtonGroup from '../../layout/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../layout/Scroll';
import Slidein from '../../layout/Slidein';
import SpecialAbilitiesActions from '../../../actions/SpecialAbilitiesActions';
import SpecialAbilitiesListAddItem from './SpecialAbilitiesListAddItem';
import SpecialAbilitiesListRemoveItem from './SpecialAbilitiesListRemoveItem';
import SpecialAbilitiesStore from '../../../stores/SpecialAbilitiesStore';
import TextField from '../../layout/TextField';

class SpecialAbilities extends Component {
	
	state = { 
		saActive: SpecialAbilitiesStore.getActiveForView(),
		saDeactive: SpecialAbilitiesStore.getDeactiveForView(),
		filter: SpecialAbilitiesStore.getFilter(),
		sortOrder: SpecialAbilitiesStore.getSortOrder(),
		showAddSlidein: false
	};

	constructor(props) {
		super(props);
	}
	
	_updateSpecialAbilitiesStore = () => this.setState({ 
		saActive: SpecialAbilitiesStore.getActiveForView(),
		saDeactive: SpecialAbilitiesStore.getDeactiveForView(),
		filter: SpecialAbilitiesStore.getFilter(),
		sortOrder: SpecialAbilitiesStore.getSortOrder()
	});

	filter = event => SpecialAbilitiesActions.filter(event.target.value);
	sort = option => SpecialAbilitiesActions.sort(option);
	changeView = option => SpecialAbilitiesActions.changeView(option);
	addToList = id => SpecialAbilitiesActions.addToList(id);
	removeFromList = id => SpecialAbilitiesActions.removeFromList(id);
	showAddSlidein = () => this.setState({ showAddSlidein: true });
	hideAddSlidein = () => this.setState({ showAddSlidein: false });
	
	componentDidMount() {
		SpecialAbilitiesStore.addChangeListener(this._updateSpecialAbilitiesStore );
	}
	
	componentWillUnmount() {
		SpecialAbilitiesStore.removeChangeListener(this._updateSpecialAbilitiesStore );
	}

	render() {
		return (
			<div className="page" id="specialabilities">
				<Slidein isOpen={this.state.showAddSlidein} close={this.hideAddSlidein}>
					<div className="options">
						<TextField hint="Suchen" value={this.state.filter} onChange={this.filter} fullWidth />
						<RadioButtonGroup active={this.state.sortOrder} onClick={this.sort} array={[
							{
								name: 'Alphabetisch',
								value: 'name'
							},
							{
								name: 'Gruppen',
								value: 'groups'
							}
						]} />
					</div>
					<Scroll className="list">
						<table>
							<thead>
								<tr>
									<td className="type">Gruppe</td>
									<td className="name">Sonderfertigkeit</td>
									<td className="ap">AP</td>
									<td className="inc"></td>
								</tr>
							</thead>
							<tbody>
								{
									this.state.saDeactive.map((sa, index) => <SpecialAbilitiesListAddItem key={`SA_DEACTIVE_${index}`} item={sa} />)
								}
							</tbody>
						</table>
					</Scroll>
				</Slidein>
				<div className="options">
					<TextField hint="Suchen" value={this.state.filter} onChange={this.filter} fullWidth />
					<RadioButtonGroup active={this.state.sortOrder} onClick={this.sort} array={[
						{
							name: 'Alphabetisch',
							value: 'name'
						},
						{
							name: 'Gruppen',
							value: 'groups'
						}
					]} />
					<BorderButton label="Hinzufügen" onClick={this.showAddSlidein} />
				</div>
				<Scroll className="list">
					<table>
						<thead>
							<tr>
								<td className="type">Gruppe</td>
								<td className="name">Sonderfertigkeit</td>
								<td className="ap">AP</td>
								<td className="inc"></td>
							</tr>
						</thead>
						<tbody>
							{
								this.state.saActive.map((sa, index) => <SpecialAbilitiesListRemoveItem key={`SA_ACTIVE_${index}`} item={sa} />)
							}
						</tbody>
					</table>
				</Scroll>
			</div>
		);
	}
}

export default SpecialAbilities;
