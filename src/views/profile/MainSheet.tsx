import * as React from 'react';
import TextBox from '../../components/TextBox';
import * as Categories from '../../constants/Categories';
import * as ActivatableStore from '../../stores/ActivatableStore';
import APStore from '../../stores/APStore';
import CultureStore from '../../stores/CultureStore';
import ELStore from '../../stores/ELStore';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import ProfileStore from '../../stores/ProfileStore';
import RaceStore from '../../stores/RaceStore';
import * as secondaryAttributes from '../../utils/secondaryAttributes';
import ActivatableTextList from './ActivatableTextList';
import MainSheetAttributes from './MainSheetAttributes';
import MainSheetPersonalData from './MainSheetPersonalData';
import SheetHeader from './SheetHeader';

export default () => {
	const ap = APStore.getAll();
	const el = ELStore.getStart().name;
	const profile = ProfileStore.getAll();
	const race = RaceStore.getCurrent()!;
	const culture = CultureStore.getCurrent()!;
	const profession = ProfessionStore.getCurrent()!;
	const professionVariant = ProfessionVariantStore.getCurrent();
	const haircolorTags = ProfileStore.getHaircolorTags();
	const eyecolorTags = ProfileStore.getEyecolorTags();
	const socialstatusTags = ProfileStore.getSocialstatusTags();

	const advActive = ActivatableStore.getActiveForView(Categories.ADVANTAGES);
	const disadvActive = ActivatableStore.getActiveForView(Categories.DISADVANTAGES);
	const generalsaActive = ActivatableStore.getActiveForView(Categories.SPECIAL_ABILITIES).filter(e => [1, 2].includes(e.gr!));

	const attributes = secondaryAttributes.getAll();

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
					<TextBox className="activatable-list" label="Vorteile">
						<ActivatableTextList list={advActive} />
					</TextBox>
					<TextBox className="activatable-list" label="Nachteile">
						<ActivatableTextList list={disadvActive} />
					</TextBox>
					<TextBox className="activatable-list" label="Allgemeine Sonderfertigkeiten">
						<ActivatableTextList list={generalsaActive} />
					</TextBox>
				</div>
				<MainSheetAttributes attributes={attributes} />
			</div>
		</div>
	);
};
