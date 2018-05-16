import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { Options } from '../../components/Options';
import { ActiveViewObject, CantripInstance, SecondaryAttribute } from '../../types/data.d';
import { Attribute, Spell, UIMessages } from '../../types/view.d';
import { translate } from '../../utils/I18n';
import { AttributeMods } from './AttributeMods';
import { Sheet } from './Sheet';
import { SheetWrapper } from './SheetWrapper';
import { SpellsSheetCantrips } from './SpellsSheetCantrips';
import { SpellsSheetSpecialAbilities } from './SpellsSheetSpecialAbilities';
import { SpellsSheetSpells } from './SpellsSheetSpells';
import { SpellsSheetTraditionsProperties } from './SpellsSheetTraditionsProperties';

export interface SpellsSheetProps {
	attributes: Attribute[];
	cantrips: CantripInstance[];
	checkAttributeValueVisibility: boolean;
	derivedCharacteristics: SecondaryAttribute[];
	locale: UIMessages;
	magicalPrimary: string | undefined;
	magicalSpecialAbilities: ActiveViewObject[];
	magicalTradition: string;
	properties: string[];
	spells: Spell[];
	switchAttributeValueVisibility(): void;
}

export function SpellsSheet(props: SpellsSheetProps) {
	const { checkAttributeValueVisibility, derivedCharacteristics, locale, switchAttributeValueVisibility } = props;
	const addHeader = [
		{ id: 'AE_MAX', short: translate(locale, 'charactersheet.spells.headers.aemax'), value: derivedCharacteristics.find(e => e.id === 'AE')!.value },
		{ id: 'AE_CURRENT', short: translate(locale, 'charactersheet.spells.headers.aecurrent') },
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
				id="spells-sheet"
				title={translate(locale, 'charactersheet.spells.title')}
				addHeaderInfo={addHeader}
				>
				<div className="all">
					<SpellsSheetSpells {...props} />
					<AttributeMods {...props} />
					<SpellsSheetTraditionsProperties {...props} />
					<SpellsSheetSpecialAbilities {...props} />
					<SpellsSheetCantrips {...props} />
				</div>
			</Sheet>
		</SheetWrapper>
	);
}
