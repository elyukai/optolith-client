import { Active } from '../disadv/DisAdvRemoveListItem';
import AvatarWrapper from '../../components/AvatarWrapper';
import APStore from '../../stores/APStore';
import BorderButton from '../../components/BorderButton';
import createOverlay from '../../utils/createOverlay';
import CultureStore from '../../stores/CultureStore';
import DisAdvStore from '../../stores/DisAdvStore';
import ELStore from '../../stores/ELStore';
import IconButton from '../../components/IconButton';
import OverviewAddAP from './OverviewAddAP';
import OverviewAvatarChange from './OverviewAvatarChange';
import AbilitiesTextList from './AbilitiesTextList';
import OverviewNameChange from './OverviewNameChange';
import OverviewPersonalData from './OverviewPersonalData';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import RaceStore from '../../stores/RaceStore';
import PhaseStore from '../../stores/PhaseStore';
import ProfileActions from '../../actions/ProfileActions';
import ProfileStore from '../../stores/ProfileStore';
import * as React from 'react';
import Scroll from '../../components/Scroll';
import VerticalList from '../../components/VerticalList';
import calcEL from '../../utils/calcEL';

interface ProfileOverviewState {
	ap: number;
	advActive: Active[];
	disadvActive: Active[];
	phase: number;
	name: string;
	sex: string;
	avatar: string;
	family: string;
	placeofbirth: string;
	dateofbirth: string;
	age: string;
	haircolor: number;
	eyecolor: number;
	size: string;
	weight: string;
	title: string;
	socialstatus: number;
	characteristics: string;
	otherinfo: string;
	editName: boolean;
}

export default class ProfileOverview extends React.Component<undefined, ProfileOverviewState> {
	
	state = {
		ap: APStore.getTotal(),
		advActive: DisAdvStore.getActiveForView(true),
		disadvActive: DisAdvStore.getActiveForView(false),
		...(ProfileStore.getAll()),
		phase: PhaseStore.get(),
		editName: false
	};
	
	_updateAPStore = () => this.setState({ ap: APStore.getTotal() } as ProfileOverviewState);
	_updateProfileStore = () => this.setState(ProfileStore.getAll() as ProfileOverviewState);
	_updatePhaseStore = () => this.setState({
		phase: PhaseStore.get()
	} as ProfileOverviewState);
	
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

	showImageUpload = () => createOverlay(<OverviewAvatarChange />);
	changeName = name => {
		ProfileActions.changeName(name);
		this.setState({ editName: false } as ProfileOverviewState);
	};
	editName = () => this.setState({ editName: true } as ProfileOverviewState);
	editNameCancel = () => this.setState({ editName: false } as ProfileOverviewState);

	endCharacterCreation = () => ProfileActions.endCharacterCreation();
	deleteHero = () => ProfileActions.deleteHero();
	addAP = () => createOverlay(<OverviewAddAP />);

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
								<AbilitiesTextList list={this.state.advActive} />
								<h3>Nachteile</h3>
								<AbilitiesTextList list={this.state.disadvActive} />
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
