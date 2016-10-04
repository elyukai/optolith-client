import BorderButton from '../../layout/BorderButton';
import Checkbox from '../../layout/Checkbox';
import Dropdown from '../../layout/Dropdown';
import RadioButtonGroup from '../../layout/RadioButtonGroup';
import React, { Component, PropTypes } from 'react';
import CultureActions from '../../../actions/CultureActions';
import CultureStore from '../../../stores/rcp/CultureStore';
import Scroll from '../../layout/Scroll';
import TalentsStore from '../../../stores/TalentsStore';
import TextField from '../../layout/TextField';
import classNames from 'classnames';

class Cultures extends Component {

	static propTypes = {
		changeTab: PropTypes.func
	};

	state = {
		cultures: CultureStore.getAllForView(),
		currentID: CultureStore.getCurrentID(),
		filter: CultureStore.getFilter(),
		sortOrder: CultureStore.getSortOrder(),
		showValues: CultureStore.areValuesVisible(),
		showAllCultures: CultureStore.areAllVisible()
	};

	constructor(props) {
		super(props);
	}
	
	_updateCultureStore = () => this.setState({
		cultures: CultureStore.getAllForView(),
		currentID: CultureStore.getCurrentID(),
		filter: CultureStore.getFilter(),
		sortOrder: CultureStore.getSortOrder(),
		showValues: CultureStore.areValuesVisible(),
		showAllCultures: CultureStore.areAllVisible()
	});

	selectCulture = id => CultureActions.selectCulture(id);
	filter = event => CultureActions.filter(event.target.value);
	sort = option => CultureActions.sort(option);
	changeValueVisibility = () => CultureActions.changeValueVisibility();
	changeView = view => CultureActions.changeView(view);
	
	componentDidMount() {
		CultureStore.addChangeListener(this._updateCultureStore);
	}
	
	componentWillUnmount() {
		CultureStore.removeChangeListener(this._updateCultureStore);
	}

	render() {
		return (
			<div className="page" id="cultures">
				<div className="options">
					<TextField hint="Suchen" value={this.state.filter} onChange={this.filter} fullWidth />
					<Dropdown
						value={this.state.showAllCultures}
						onChange={this.changeView}
						options={[['Alle Kulturen', true], ['Übliche Kulturen', false]]}
						fullWidth />
					<RadioButtonGroup active={this.state.sortOrder} onClick={this.sort} array={[
						{
							name: 'Alphabetisch',
							value: 'name'
						},
						{
							name: 'AP',
							value: 'ap'
						}
					]} />
					<Checkbox checked={this.state.showValues} onClick={this.changeValueVisibility}>Werte anzeigen</Checkbox>
				</div>
				<Scroll className="list">
					<ul>
						{
							this.state.cultures.map(culture => {
								const className = classNames(culture.id === this.state.currentID && 'active');

								return (
									<li key={culture.id} className={className}>
										<div className="left">
											<h2>{culture.name} ({culture.ap} AP)</h2>
											{
												this.state.showValues ? (
													<div className="talents">
														{
															culture.talents.map(talent => `${TalentsStore.getNameByID(talent[0])} +${talent[1]}`).join(', ')
														}
													</div>
												) : null
											}
										</div>
										<div className="right">
											{
												culture.id === this.state.currentID ? (
													<BorderButton label="Weiter" onClick={this.props.changeTab.bind(null, 'profession')} primary />
												) : (
													<BorderButton label="Auswählen" onClick={this.selectCulture.bind(null, culture.id)} />
												)
											}
										</div>
									</li>
								);
							})
						}
					</ul>
				</Scroll>
			</div>
		);
	}
}

export default Cultures;
