import BorderButton from '../../components/BorderButton';
import Checkbox from '../../components/Checkbox';
import Dropdown from '../../components/Dropdown';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component, PropTypes } from 'react';
import ProfessionActions from '../../actions/ProfessionActions';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantActions from '../../actions/ProfessionVariantActions';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import Scroll from '../../components/Scroll';
import Selections from './Selections';
import TalentsStore from '../../stores/TalentsStore';
import TextField from '../../components/TextField';
import classNames from 'classnames';

class Professions extends Component {

	static propTypes = {
		changeTab: PropTypes.func
	};

	state = {
		professions: ProfessionStore.getAllForView(),
		currentID: ProfessionStore.getCurrentID(),
		filter: ProfessionStore.getFilter(),
		sortOrder: ProfessionStore.getSortOrder(),
		showAllProfessions: ProfessionStore.areAllVisible(),
		currentVID: ProfessionVariantStore.getCurrentID(),
		showAddSlidein: false
	};
	
	_updateProfessionStore = () => this.setState({
		professions: ProfessionStore.getAllForView(),
		currentID: ProfessionStore.getCurrentID(),
		filter: ProfessionStore.getFilter(),
		sortOrder: ProfessionStore.getSortOrder(),
		showAllProfessions: ProfessionStore.areAllVisible()
	});
	_updateProfessionVariantStore = () => this.setState({
		currentVID: ProfessionVariantStore.getCurrentID()
	});

	selectProfession = id => ProfessionActions.selectProfession(id);
	filter = event => ProfessionActions.filter(event.target.value);
	sort = option => ProfessionActions.sort(option);
	changeView = view => ProfessionActions.changeView(view);
	showAddSlidein = () => this.setState({ showAddSlidein: true });
	hideAddSlidein = () => this.setState({ showAddSlidein: false });

	selectProfessionVariant = id => ProfessionVariantActions.selectProfessionVariant(id);
	
	componentDidMount() {
		ProfessionStore.addChangeListener(this._updateProfessionStore);
		ProfessionVariantStore.addChangeListener(this._updateProfessionVariantStore);
	}
	
	componentWillUnmount() {
		ProfessionStore.removeChangeListener(this._updateProfessionStore);
		ProfessionVariantStore.removeChangeListener(this._updateProfessionVariantStore);
	}

	render() {
		return (
			<div className="page" id="professions">
				{
					this.state.showAddSlidein ? <Selections close={this.hideAddSlidein} /> : null
				}
				<div className="options">
					<TextField hint="Suchen" value={this.state.filter} onChange={this.filter} fullWidth />
					<Dropdown
						value={this.state.showAllProfessions}
						onChange={this.changeView}
						options={[['Alle Professionen', true], ['Übliche Professionen', false]]}
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
				</div>
				<Scroll className="list professions">
					<ul>
						{
							this.state.professions.map(profession => {
								const className = classNames(profession.id === this.state.currentID && 'active');

								var vars;

								if (profession.id === this.state.currentID && profession.vars.length > 0) {
									var varList = ProfessionVariantStore.getAllForView();
									if (varList.length > 1) {
										vars = (
											<RadioButtonGroup active={this.state.currentVID} onClick={this.selectProfessionVariant} array={varList} />
										);
									}
								}

								return (
									<li key={profession.id} className={className}>
										<div className="left">
											<h2>{profession.name} ({profession.ap} AP)</h2>
											{profession.subname !== '' ? (
												<h3>{profession.subname}</h3>
											) : null}
											{vars}
										</div>
										<div className="right">
											{
												profession.id === this.state.currentID ? (
													<BorderButton label="Weiter" onClick={this.showAddSlidein} primary />
												) : (
													<BorderButton label="Auswählen" onClick={this.selectProfession.bind(null, profession.id)} />
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

export default Professions;
