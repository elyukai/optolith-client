import * as secondaryAttributes from '../../utils/secondaryAttributes';
import APStore from '../../stores/APStore';
import AttributeStore from '../../stores/AttributeStore';
import CultureStore from '../../stores/CultureStore';
import DisAdvStore from '../../stores/DisAdvStore';
import ELStore from '../../stores/ELStore';
import MainSheetCalc from './MainSheetCalc';
import MainSheetPersonalData from './MainSheetPersonalData';
import OverviewConstSkills from './OverviewConstSkills';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import ProfileStore from '../../stores/ProfileStore';
import RaceStore from '../../stores/RaceStore';
import React, { Component } from 'react';
import SheetHeader from './SheetHeader';
import SpecialAbilitiesStore from '../../stores/SpecialAbilitiesStore';
import TextBox from '../../components/TextBox';

export default class MainSheet extends Component {

	render() {

		const ap = APStore.getAll();
		const el = ELStore.getStart().name;
		const profile = ProfileStore.getAll();
		const race = RaceStore.getCurrent();
		const culture = CultureStore.getCurrent();
		const profession = ProfessionStore.getCurrent();
		const professionVariant = ProfessionVariantStore.getCurrent();
		const haircolorTags = ProfileStore.getHaircolorTags();
		const eyecolorTags = ProfileStore.getEyecolorTags();
		const socialstatusTags = ProfileStore.getSocialstatusTags();

		const advActive = DisAdvStore.getActiveForView(true);
		const disadvActive = DisAdvStore.getActiveForView(false);
		const generalsaActive = SpecialAbilitiesStore.getActiveForView(1,2);

		const attributes = secondaryAttributes.getAll();
		const baseValues = AttributeStore.getBaseValues();

		return (
			<div className="sheet" id="main-sheet">
				<SheetHeader title="Persönliche Daten" />
				<MainSheetPersonalData
					ap={ap}
					culture={culture}
					el={el}
					eyecolorTags={eyecolorTags}
					haircolorTags={haircolorTags}
					profession={profession}
					professionVariant={professionVariant}
					profile={profile}
					race={race}
					socialstatusTags={socialstatusTags}
					/>
				<div className="lower">
					<div className="lists">
						<TextBox className="advantages" label="Vorteile">
							<OverviewConstSkills list={advActive} />
						</TextBox>
						<TextBox className="disadvantages" label="Nachteile">
							<OverviewConstSkills list={disadvActive} />
						</TextBox>
						<TextBox className="general-special-abilities" label="Allgemeine Sonderfertigkeiten">
							<OverviewConstSkills list={generalsaActive} />
						</TextBox>
					</div>
					<MainSheetCalc attributes={attributes} baseValues={baseValues} />
				</div>
			</div>
		);
	}
}
