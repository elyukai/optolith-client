import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { Options } from '../../components/Options';
import { ActiveViewObject, BlessingInstance, SecondaryAttribute } from '../../types/data.d';
import { Attribute, Liturgy, UIMessages } from '../../types/view.d';
import { translate } from '../../utils/I18n';
import { AttributeMods } from './AttributeMods';
import { LiturgiesSheetBlessings } from './LiturgiesSheetBlessings';
import { LiturgiesSheetLiturgies } from './LiturgiesSheetLiturgies';
import { LiturgiesSheetSpecialAbilities } from './LiturgiesSheetSpecialAbilities';
import { LiturgiesSheetTraditionsAspects } from './LiturgiesSheetTraditionsAspects';
import { Sheet } from './Sheet';
import { SheetWrapper } from './SheetWrapper';

export interface LiturgiesSheetProps {
	aspects: string[];
	attributes: Attribute[];
	blessedPrimary: string | undefined;
	blessedSpecialAbilities: ActiveViewObject[];
	blessedTradition: string | undefined;
	blessings: BlessingInstance[];
	checkAttributeValueVisibility: boolean;
	derivedCharacteristics: SecondaryAttribute[];
	liturgies: Liturgy[];
	locale: UIMessages;
	switchAttributeValueVisibility(): void;
}

export function LiturgiesSheet(props: LiturgiesSheetProps) {
	const { checkAttributeValueVisibility, derivedCharacteristics, locale, switchAttributeValueVisibility } = props;
	const addHeader = [
		{ id: 'KP_MAX', short: translate(locale, 'charactersheet.chants.headers.kpmax'), value: derivedCharacteristics.find(e => e.id === 'KP')!.value },
		{ id: 'KP_CURRENT', short: translate(locale, 'charactersheet.chants.headers.kpcurrent') },
	];

	return (
		<SheetWrapper>
			<Options>
				<Checkbox
					checked={checkAttributeValueVisibility}
					onClick={switchAttributeValueVisibility}
					>
					{translate(locale, 'charactersheet.options.showattributevalues')}
				</Checkbox>
			</Options>
			<Sheet
				{...props}
				id="liturgies-sheet"
				title={translate(locale, 'charactersheet.chants.title')}
				addHeaderInfo={addHeader}
				>
				<div className="all">
					<LiturgiesSheetLiturgies {...props} />
					<AttributeMods {...props} />
					<LiturgiesSheetTraditionsAspects {...props} />
					<LiturgiesSheetSpecialAbilities {...props} />
					<LiturgiesSheetBlessings {...props} />
				</div>
			</Sheet>
		</SheetWrapper>
	);
}
