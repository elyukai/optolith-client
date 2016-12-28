import Avatar from '../../components/Avatar';
import LabelBox from '../../components/LabelBox';
import Plain from '../../components/Plain';
import React, { Component, PropTypes } from 'react';

export default class MainSheetPersonalData extends Component {

	static propTypes = {
		ap: PropTypes.object.isRequired,
		culture: PropTypes.object.isRequired,
		el: PropTypes.string.isRequired,
		eyecolorTags: PropTypes.array.isRequired,
		haircolorTags: PropTypes.array.isRequired,
		profession: PropTypes.object.isRequired,
		professionVariant: PropTypes.object,
		profile: PropTypes.object.isRequired,
		race: PropTypes.object.isRequired,
		socialstatusTags: PropTypes.array.isRequired
	};

	render() {
		const { ap, culture, el, eyecolorTags, haircolorTags, profession, professionVariant, profile: { name, family, placeofbirth, dateofbirth, age, sex, size, weight, haircolor, eyecolor, title, socialstatus, characteristics, otherinfo, avatar }, race, socialstatusTags } = this.props;

		const raceName = race.name;
		const cultureName = culture.name;
		const professionName = (() => {
			let { name, subname } = profession || { name: 'Loading...' };
			if (typeof name === 'object') {
				name = name[sex];
			}
			if (typeof subname === 'object') {
				subname = subname[sex];
			}
			let { name: vname } = professionVariant || { name: 'Loading...' };
			if (typeof vname === 'object') {
				vname = vname[sex];
			}
			return name + (subname ? ` (${subname})` : professionVariant ? ` (${vname})` : '');
		})();
		
		const haircolorName = haircolorTags[haircolor - 1];
		const eyecolorName = eyecolorTags[eyecolor - 1];
		const socialstatusName = socialstatusTags[socialstatus - 1];

		return (
			<div className="upper">
				<div className="info">
					<Plain className="name" label="Name" value={name} />
					<Plain className="family" label="Familie" value={family} />
					<Plain className="placeofbirth" label="Geburtsort" value={placeofbirth} />
					<Plain className="dateofbirth" label="Geburtsdatum" value={dateofbirth} />
					<Plain className="age" label="Alter" value={age} />
					<Plain className="sex" label="Geschlecht" value={sex} />
					<Plain className="race" label="Spezies" value={raceName} />
					<Plain className="size" label="Größe" value={size} />
					<Plain className="weight" label="Gewicht" value={weight} />
					<Plain className="haircolor" label="Haarfarbe" value={haircolorName} />
					<Plain className="eyecolor" label="Augenfarbe" value={eyecolorName} />
					<Plain className="culture" label="Kultur" value={cultureName} />
					<Plain className="socialstatus" label="Sozialstatus" value={socialstatusName} />
					<Plain className="profession" label="Profession" value={professionName} />
					<Plain className="title" label="Titel" value={title} />
					<Plain className="characteristics" label="Charakteristika" value={characteristics} />
					<Plain className="otherinfo" label="Sonstiges" value={otherinfo} />
				</div>
				<div className="ap-portrait">
					<LabelBox className="el" label="Erfahrungsgrad" value={el} />
					<LabelBox className="ap-total" label="AP gesamt" value={ap.total} />
					<LabelBox className="portrait" label="Porträt/Wappen"><Avatar src={avatar} img /></LabelBox>
					<LabelBox className="ap-available" label="AP verfügbar" value={ap.total - ap.spent} />
					<LabelBox className="ap-used" label="AP ausgegeben" value={ap.spent} />
				</div>
			</div>
		);
	}
}
