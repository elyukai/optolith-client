import AvatarWrapper from '../../components/AvatarWrapper';
import APStore from '../../stores/APStore';
import BorderButton from '../../components/BorderButton';
import CultureStore from '../../stores/CultureStore';
import DisAdvStore from '../../stores/DisAdvStore';
import ELStore from '../../stores/ELStore';
import IconButton from '../../components/IconButton';
import OverviewConstSkills from './OverviewConstSkills';
import OverviewNameChange from './OverviewNameChange';
import OverviewPersonalData from './OverviewPersonalData';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import RaceStore from '../../stores/RaceStore';
import PhaseStore from '../../stores/PhaseStore';
import ProfileActions from '../../actions/ProfileActions';
import ProfileStore from '../../stores/ProfileStore';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import VerticalList from '../../components/VerticalList';
import calcEL from '../../utils/calcEL';

export default class Overview extends Component {
	
	state = {
		ap: APStore.getTotal(),
		advActive: DisAdvStore.getActiveForView(true),
		disadvActive: DisAdvStore.getActiveForView(false),
		...(ProfileStore.getAll()),
		phase: PhaseStore.get(),
		editName: false
	};
	
	_updateAPStore = () => this.setState({ ap: APStore.getTotal() });
	_updateProfileStore = () => this.setState(ProfileStore.getAll());
	_updatePhaseStore = () => this.setState({
		phase: PhaseStore.get()
	});
	
	componentDidMount() {
		APStore.addChangeListener(this._updateAPStore );
		PhaseStore.addChangeListener(this._updatePhaseStore );
		ProfileStore.addChangeListener(this._updateProfileStore );
	}
	
	componentWillUnmount() {
		APStore.removeChangeListener(this._updateAPStore );
		PhaseStore.removeChangeListener(this._updatePhaseStore );
		ProfileStore.removeChangeListener(this._updateProfileStore );
	}

	showImageUpload = () => ProfileActions.showImageUpload();
	changeName = name => {
		ProfileActions.changeName(name);
		this.setState({ editName: false });
	};
	editName = () => this.setState({ editName: true });
	editNameCancel = () => this.setState({ editName: false });

	endCharacterCreation = () => ProfileActions.endCharacterCreation();
	deleteHero = () => ProfileActions.deleteHero();
	addAP = () => ProfileActions.showAddAP();

	render() {

		const { ap, avatar, editName, name, phase, ...personal } = this.state;

		const sex = this.state.sex === 'm' ? 'Männlich' : 'Weiblich';

		const isProfessionUndefined = ProfessionStore.getCurrentID() === null;

		const currentEL = calcEL(ap);

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
				<Scroll className="text">
					<div className="title-wrapper">
						<AvatarWrapper src={avatar} onClick={this.showImageUpload} />
						<div className="text-wrapper">
							{nameElement}
							{
								isProfessionUndefined ? null : (
									<VerticalList className="rcp">
										<span>{sex}</span>
										<span className="race">
											{(() => {
												const { name } = RaceStore.getCurrent();
												return name;
											})()}
										</span>
										<span className="culture">
											{(() => {
												const { name } = CultureStore.getCurrent();
												return name;
											})()}
										</span>
										<span className="profession">
											{(() => {
												let { name, subname } = ProfessionStore.getCurrent();
												
												if (typeof name === 'object') {
													name = name[this.state.sex];
												}
												if (typeof subname === 'object') {
													subname = subname[this.state.sex];
												}

												let { name: vname } = ProfessionVariantStore.getCurrent() || {};

												if (typeof vname === 'object') {
													vname = vname[this.state.sex];
												}

												return name + (subname ? ` (${subname})` : vname ? ` (${vname})` : '');
											})()}
										</span>
									</VerticalList>
								)
							}
							<VerticalList className="el">
								<span>
									{(() => {
										const { name } = ELStore.get(currentEL);
										return name;
									})()}
								</span>
								<span>
									{ap} AP
								</span>
							</VerticalList>
						</div>
					</div>
					{
						phase === 3 ? (
							<BorderButton
								className="add-ap"
								label="AP hinzufügen"
								onClick={this.addAP}
								/>
						) : null
					}
					{
						isProfessionUndefined ? null : (
							<h3>Persönliche Daten</h3>
						)
					}
					{
						isProfessionUndefined ? null : (
							<OverviewPersonalData
								{...personal}
								race={RaceStore.getCurrent()}
								culture={CultureStore.getCurrent()}
								haircolorTags={ProfileStore.getHaircolorTags()}
								eyecolorTags={ProfileStore.getEyecolorTags()}
								socialstatusTags={ProfileStore.getSocialstatusTags()}
								/>
						)
					}
					{
						phase === 2 ? (
							<div>
								<BorderButton
									className="end-char-creation"
									label="Heldenerstellung beenden"
									onClick={this.endCharacterCreation}
									primary
									/>
							</div>
						) : null
					}
					{
						phase === 3 ? (
							<div>
								<h3>Vorteile</h3>
								<OverviewConstSkills list={this.state.advActive} />
								<h3>Nachteile</h3>
								<OverviewConstSkills list={this.state.disadvActive} />
								<BorderButton
									className="delete-char"
									label="Held löschen"
									onClick={this.deleteHero}
									disabled
									/>
							</div>
						) : null
					}
				</Scroll>
			</div>
		);
	}
}
