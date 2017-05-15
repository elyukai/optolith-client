import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { TextBox } from '../../components/TextBox';
import * as Categories from '../../constants/Categories';
import * as ActivatableStore from '../../stores/ActivatableStore';
import { APStore } from '../../stores/APStore';
import { CultureStore } from '../../stores/CultureStore';
import { ELStore } from '../../stores/ELStore';
import { ProfessionStore } from '../../stores/ProfessionStore';
import { ProfessionVariantStore } from '../../stores/ProfessionVariantStore';
import { ProfileStore } from '../../stores/ProfileStore';
import { RaceStore } from '../../stores/RaceStore';
import { printToPDF } from '../../utils/FileAPIUtils';
import { translate } from '../../utils/I18n';
import * as secondaryAttributes from '../../utils/secondaryAttributes';
import { ActivatableTextList } from './ActivatableTextList';
import { MainSheetAttributes } from './MainSheetAttributes';
import { MainSheetPersonalData } from './MainSheetPersonalData';
import { Sheet } from './Sheet';
import { SheetOptions } from './SheetOptions';
import { SheetWrapper } from './SheetWrapper';

export function MainSheet() {
	const ap = APStore.getAll();
	const el = ELStore.getStart().name;
	const profile = ProfileStore.getAll();
	const race = RaceStore.getCurrent()!;
	const culture = CultureStore.getCurrent()!;
	const profession = ProfessionStore.getCurrent()!;
	const professionVariant = ProfessionVariantStore.getCurrent();
	const haircolorTags = translate('haircolors');
	const eyecolorTags = translate('eyecolors');
	const socialstatusTags = translate('socialstatus');

	const advActive = ActivatableStore.getActiveForView(Categories.ADVANTAGES);
	const disadvActive = ActivatableStore.getActiveForView(Categories.DISADVANTAGES);
	const generalsaActive = [
		...ActivatableStore.getActiveForView(Categories.SPECIAL_ABILITIES).filter(e => [1, 2].includes(e.gr!)),
		`Ortskenntnis (Heimat: ${ProfileStore.getCultureAreaKnowledge() || ''})`,
	];

	const attributes = secondaryAttributes.getAll();

	return (
		<SheetWrapper>
			<SheetOptions>
				<BorderButton
					className="print-document"
					label={translate('charactersheet.actions.printtopdf')}
					onClick={printToPDF}
					fullWidth
					/>
			</SheetOptions>
			<Sheet id="main-sheet" title={translate('charactersheet.main.title')}>
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
						<TextBox className="activatable-list" label={translate('charactersheet.main.advantages')}>
							<ActivatableTextList list={advActive} />
						</TextBox>
						<TextBox className="activatable-list" label={translate('charactersheet.main.disadvantages')}>
							<ActivatableTextList list={disadvActive} />
						</TextBox>
						<TextBox className="activatable-list" label={translate('charactersheet.main.generalspecialabilites')}>
							<ActivatableTextList list={generalsaActive} />
						</TextBox>
					</div>
					<MainSheetAttributes attributes={attributes} />
				</div>
			</Sheet>
		</SheetWrapper>
	);
}
