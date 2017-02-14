import * as React from 'react';
import Dropdown from '../../components/Dropdown';
import IconButton from '../../components/IconButton';
import InputButtonGroup from '../../components/InputButtonGroup';
import ProfileActions from '../../actions/ProfileActions';
import TextField from '../../components/TextField';

interface Props {
	age: string;
	characteristics: string;
	culture: CultureInstance;
	dateofbirth: string;
	eyecolor: number;
	eyecolorTags: string[];
	family: string;
	haircolor: number;
	haircolorTags: string[];
	otherinfo: string;
	placeofbirth: string;
	race: RaceInstance;
	size: number | string;
	socialstatus: number;
	socialstatusTags: string[];
	title: string;
	weight: number | string;
};

export default class OverviewPersonalData extends React.Component<Props, undefined> {
	changeFamily = (e: Event) => ProfileActions.changeFamily(e.target.value);
	changePlaceOfBirth = (e: Event) => ProfileActions.changePlaceOfBirth(e.target.value);
	changeDateOfBirth = (e: Event) => ProfileActions.changeDateOfBirth(e.target.value);
	changeAge = (e: Event) => ProfileActions.changeAge(e.target.value);
	changeHaircolor = (result: number) => ProfileActions.changeHaircolor(result);
	changeEyecolor = (result: number) => ProfileActions.changeEyecolor(result);
	changeSize = (e: Event) => ProfileActions.changeSize(e.target.value);
	changeWeight = (e: Event) => ProfileActions.changeWeight(e.target.value);
	changeTitle = (e: Event) => ProfileActions.changeTitle(e.target.value);
	changeSocialStatus = (result: number) => ProfileActions.changeSocialStatus(result);
	changeCharacteristics = (e: Event) => ProfileActions.changeCharacteristics(e.target.value);
	changeOtherInfo = (e: Event) => ProfileActions.changeOtherInfo(e.target.value);

	rerollHair = () => ProfileActions.rerollHair();
	rerollEyes = () => ProfileActions.rerollEyes();
	rerollSize = () => ProfileActions.rerollSize();
	rerollWeight = () => ProfileActions.rerollWeight();

	render() {
		const { age, characteristics, culture, eyecolor, eyecolorTags, dateofbirth, family, haircolor, haircolorTags, otherinfo, placeofbirth, race, size, socialstatus, socialstatusTags, title, weight } = this.props;

		const hairArr = race ? haircolorTags.map((name, i) => ({ id: i + 1, name })).filter(e => race.hairColors.includes(e.id)) : [];
		const eyesArr = race ? eyecolorTags.map((name, i) => ({ id: i + 1, name })).filter(e => race.eyeColors.includes(e.id)) : [];
		const socialArr = culture ? socialstatusTags.map((name, i) => ({ id: i + 1, name })).filter(e => culture.socialTiers.includes(e.id)) : [];

		return (
			<div className="personal-data">
				<div>
					<TextField
						label="Familie"
						value={family}
						onChange={this.changeFamily}
						/>
				</div>
				<div>
					<TextField
						label="Geburtsort"
						value={placeofbirth}
						onChange={this.changePlaceOfBirth}
						/>
				</div>
				<div>
					<TextField
						label="Geburtsdatum"
						value={dateofbirth}
						onChange={this.changeDateOfBirth}
						/>
				</div>
				<div>
					<TextField
						label="Alter"
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
						label="Körpergröße"
						value={size}
						onChange={this.changeSize}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollSize} />
				</InputButtonGroup>
				<InputButtonGroup className="reroll">
					<TextField
						label="Gewicht"
						value={weight}
						onChange={this.changeWeight}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollWeight} />
				</InputButtonGroup>
				<div>
					<TextField
						label="Titel"
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
						label="Charakteristika"
						value={characteristics}
						onChange={this.changeCharacteristics}
						/>
				</div>
				<div>
					<TextField
						label="Sonstiges"
						value={otherinfo}
						onChange={this.changeOtherInfo}
						/>
				</div>
			</div>
		);
	}
}
