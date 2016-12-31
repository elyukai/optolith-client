import { CultureInstance } from '../../utils/data/Culture';
import { ProfessionInstance } from '../../utils/data/Profession';
import { ProfessionVariantInstance } from '../../utils/data/ProfessionVariant';
import { RaceInstance } from '../../utils/data/Race';
import * as React from 'react';
import Avatar from '../../components/Avatar';
import LabelBox from '../../components/LabelBox';
import Plain from '../../components/Plain';

export interface MainSheetPersonalDataProps {
	ap: {
		spent: number;
		total: number;
	};
	culture: CultureInstance;
	el: string;
	eyecolorTags: string[];
	haircolorTags: string[];
	profession: ProfessionInstance;
	professionVariant?: ProfessionVariantInstance;
	profile: {
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
	};
	race: RaceInstance;
	socialstatusTags: string[];
}

export default (props: MainSheetPersonalDataProps) => {
	const { ap, culture, el, eyecolorTags, haircolorTags, profession, professionVariant, profile: { name, family, placeofbirth, dateofbirth, age, sex, size, weight, haircolor, eyecolor, title, socialstatus, characteristics, otherinfo, avatar }, race, socialstatusTags } = props;

	const raceName = race.name;
	const cultureName = culture.name;
	const professionName = (() => {
		let { name, subname } = profession || { name: 'Loading...', subname: null };
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
