import Avatar from '../../layout/Avatar';
import APStore from '../../../stores/APStore';
import CultureStore from '../../../stores/rcp/CultureStore';
import DisAdvStore from '../../../stores/DisAdvStore';
import ELStore from '../../../stores/ELStore';
import IconButton from '../../layout/IconButton';
import OverviewDisAdv from './OverviewDisAdv';
import OverviewNameChange from './OverviewNameChange';
import ProfessionStore from '../../../stores/rcp/ProfessionStore';
import ProfessionVariantStore from '../../../stores/rcp/ProfessionVariantStore';
import RaceStore from '../../../stores/rcp/RaceStore';
import ProfileActions from '../../../actions/ProfileActions';
import ProfileStore from '../../../stores/ProfileStore';
import React, { Component } from 'react';
import Scroll from '../../layout/Scroll';

class Overview extends Component {
	
	state = { 
		advActive: DisAdvStore.getActiveForView(true),
		disadvActive: DisAdvStore.getActiveForView(false),
		name: ProfileStore.getName(),
		gender: ProfileStore.getGender(),
		portrait: ProfileStore.getPortrait(),
		editName: false
	};

	constructor(props) {
		super(props);
	}
	
	_updateProfileStore = () => this.setState({
		name: ProfileStore.getName(),
		gender: ProfileStore.getGender(),
		portrait: ProfileStore.getPortrait()
	});

	changeName = name => {
		ProfileActions.changeName(name);
		this.setState({ editName: false });
	};
	editName = () => this.setState({ editName: true });
	editNameCancel = () => this.setState({ editName: false });
	
	componentDidMount() {
		ProfileStore.addChangeListener(this._updateProfileStore );
	}
	
	componentWillUnmount() {
		ProfileStore.removeChangeListener(this._updateProfileStore );
	}

	render() {

		const { editName, name, portrait } = this.state;

		const gender = this.state.gender === 'm' ? 'Männlich' : 'Weiblich';

		const elAp = [ 900, 1000, 1100, 1200, 1400, 1700, 2100 ], ap = APStore.get();

		var currentEL = 'EL_7';

		for (let i = 0; i < elAp.length; i++) {
			if (elAp[i] >= ap) {
				currentEL = `EL_${i + 1}`;
				break;
			}
		}

		const nameElement = editName ? (
			<OverviewNameChange
				cancel={this.editNameCancel}
				change={this.changeName}
				name={name} />
		) : (
			<h1>
				{name}
				<IconButton icon="&#xE254;" onClick={this.editName} />
			</h1>
		);

		return (
			<div className="page" id="overview">
				<Scroll>
					<div className="title-wrapper">
						<div className="avatar-wrapper">
							<Avatar src={portrait} />
						</div>
						<div className="text-wrapper">
							{nameElement}
							<div className="rcp">
								{ gender } &middot; {
									RaceStore.getCurrent() !== undefined ? RaceStore.getCurrent().name : null
								} &middot; {
									CultureStore.getCurrent() !== undefined ? CultureStore.getCurrent().name : null
								} &middot; {
									ProfessionStore.getCurrentID() === 'P_0' ? 'Eigene Profession' : ProfessionStore.getCurrent() !== undefined ? (ProfessionVariantStore.getCurrentID() !== null ? `${ProfessionStore.getCurrent().name} (${ProfessionVariantStore.getCurrent().name})`: ProfessionStore.getCurrent().name) : null
								}
							</div>
							<div className="el">
								{ELStore.get(currentEL).name} &middot; {ap} AP
							</div>
						</div>
					</div>
					<h3>Vorteile</h3>
					<OverviewDisAdv list={this.state.advActive} />
					<h3>Nachteile</h3>
					<OverviewDisAdv list={this.state.disadvActive} />
				</Scroll>
			</div>
		);
	}
}

export default Overview;
