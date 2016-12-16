import Avatar from '../../components/Avatar';
import LabelBox from '../../components/LabelBox';
import Plain from '../../components/Plain';
import React, { Component, PropTypes } from 'react';

export default class MainSheetPersonalData extends Component {

	static propTypes = {
		ap: PropTypes.object.isRequired,
		culture: PropTypes.string.isRequired,
		el: PropTypes.string.isRequired,
		eyecolorTags: PropTypes.array.isRequired,
		haircolorTags: PropTypes.array.isRequired,
		profession: PropTypes.string.isRequired,
		profile: PropTypes.object.isRequired,
		race: PropTypes.string.isRequired,
		socialstatusTags: PropTypes.array.isRequired
	};

	render() {
		const { ap, culture, el, eyecolorTags, haircolorTags, profession, profile: { name, family, placeofbirth, dateofbirth, age, sex, size, weight, haircolor, eyecolor, title, socialstatus, characteristics, otherinfo, avatar }, race, socialstatusTags } = this.props;

		return (
			<div className="upper">
				<div className="info">
					<Plain className="name" label="Name" value={name} />
					<Plain className="family" label="Familie" value={family} />
					<Plain className="placeofbirth" label="Geburtsort" value={placeofbirth} />
					<Plain className="dateofbirth" label="Geburtsdatum" value={dateofbirth} />
					<Plain className="age" label="Alter" value={age} />
					<Plain className="sex" label="Geschlecht" value={sex} />
					<Plain className="race" label="Spezies" value={race} />
					<Plain className="size" label="Größe" value={size} />
					<Plain className="weight" label="Gewicht" value={weight} />
					<Plain className="haircolor" label="Haarfarbe" value={haircolorTags[haircolor - 1]} />
					<Plain className="eyecolor" label="Augenfarbe" value={eyecolorTags[eyecolor - 1]} />
					<Plain className="culture" label="Kultur" value={culture} />
					<Plain className="profession" label="Profession" value={profession} />
					<Plain className="title" label="Titel" value={title} />
					<Plain className="socialstatus" label="Sozialstatus" value={socialstatusTags[socialstatus - 1]} />
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
