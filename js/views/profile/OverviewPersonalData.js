import Dropdown from '../../components/Dropdown';
import IconButton from '../../components/IconButton';
import InputButtonGroup from '../../components/InputButtonGroup';
import ProfileActions from '../../actions/ProfileActions';
import React, { Component, PropTypes } from 'react';
import TextField from '../../components/TextField';

export default class OverviewPersonalData extends Component {
	
	static propTypes = {
		age: PropTypes.string.isRequired,
		characteristics: PropTypes.string.isRequired,
		culture: PropTypes.object.isRequired,
		dateofbirth: PropTypes.string.isRequired,
		eyecolor: PropTypes.number.isRequired,
		eyecolorTags: PropTypes.array.isRequired,
		family: PropTypes.string.isRequired,
		haircolor: PropTypes.number.isRequired,
		haircolorTags: PropTypes.array.isRequired,
		otherinfo: PropTypes.string.isRequired,
		placeofbirth: PropTypes.string.isRequired,
		race: PropTypes.object.isRequired,
		size: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]).isRequired,
		socialstatus: PropTypes.number.isRequired,
		socialstatusTags: PropTypes.array.isRequired,
		title: PropTypes.string.isRequired,
		weight: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]).isRequired
	};

	changeFamily = e => ProfileActions.changeFamily(e.target.value);
	changePlaceOfBirth = e => ProfileActions.changePlaceOfBirth(e.target.value);
	changeDateOfBirth = e => ProfileActions.changeDateOfBirth(e.target.value);
	changeAge = e => ProfileActions.changeAge(e.target.value);
	changeHaircolor = result => ProfileActions.changeHaircolor(result);
	changeEyecolor = result => ProfileActions.changeEyecolor(result);
	changeSize = e => ProfileActions.changeSize(e.target.value);
	changeWeight = e => ProfileActions.changeWeight(e.target.value);
	changeTitle = e => ProfileActions.changeTitle(e.target.value);
	changeSocialStatus = result => ProfileActions.changeSocialStatus(result);
	changeCharacteristics = e => ProfileActions.changeCharacteristics(e.target.value);
	changeOtherInfo = e => ProfileActions.changeOtherInfo(e.target.value);

	rerollHair = () => ProfileActions.rerollHair();
	rerollEyes = () => ProfileActions.rerollEyes();
	rerollSize = () => ProfileActions.rerollSize();
	rerollWeight = () => ProfileActions.rerollWeight();

	render() {

		const { age, characteristics, culture, eyecolor, eyecolorTags, dateofbirth, family, haircolor, haircolorTags, otherinfo, placeofbirth, race, size, socialstatus, socialstatusTags, title, weight } = this.props;

		const hairArr = race ? haircolorTags.map((e,i) => [ e, i + 1 ]).filter(e => race.haircolors.includes(e[1])) : [];
		const eyesArr = race ? eyecolorTags.map((e,i) => [ e, i + 1 ]).filter(e => race.eyecolors.includes(e[1])) : [];
		const socialArr = culture ? socialstatusTags.map((e,i) => [ e, i + 1 ]).filter(e => culture.social.includes(e[1])) : [];

		return (
			<div className="personal-data">
				<div>
					<TextField
						labelText="Familie"
						value={family}
						onChange={this.changeFamily}
						/>
				</div>
				<div>
					<TextField
						labelText="Geburtsort"
						value={placeofbirth}
						onChange={this.changePlaceOfBirth}
						/>
				</div>
				<div>
					<TextField
						labelText="Geburtsdatum"
						value={dateofbirth}
						onChange={this.changeDateOfBirth}
						/>
				</div>
				<div>
					<TextField
						labelText="Alter"
						value={age}
						onChange={this.changeAge}
						/>
				</div>
				<InputButtonGroup className="reroll">
					<Dropdown
						label="Haarfarbe"
						value={haircolor}
						onChange={this.changeHaircolor}
						options={hairArr}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollHair} />
				</InputButtonGroup>
				<InputButtonGroup className="reroll">
					<Dropdown
						label="Augenfarbe"
						value={eyecolor}
						onChange={this.changeEyecolor}
						options={eyesArr}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollEyes} />
				</InputButtonGroup>
				<InputButtonGroup className="reroll">
					<TextField
						labelText="Körpergröße"
						value={size}
						onChange={this.changeSize}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollSize} />
				</InputButtonGroup>
				<InputButtonGroup className="reroll">
					<TextField
						labelText="Gewicht"
						value={weight}
						onChange={this.changeWeight}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollWeight} />
				</InputButtonGroup>
				<div>
					<TextField
						labelText="Titel"
						value={title}
						onChange={this.changeTitle}
						/>
				</div>
				<div>
					<Dropdown
						label="Sozialstatus"
						value={socialstatus}
						onChange={this.changeSocialStatus}
						options={socialArr}
						/>
				</div>
				<div>
					<TextField
						labelText="Charakteristika"
						value={characteristics}
						onChange={this.changeCharacteristics}
						/>
				</div>
				<div>
					<TextField
						labelText="Sonstiges"
						value={otherinfo}
						onChange={this.changeOtherInfo}
						/>
				</div>
			</div>
		);
	}
}
