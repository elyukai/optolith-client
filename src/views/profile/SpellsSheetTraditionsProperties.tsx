import * as React from 'react';
import { _translate, UIMessages } from '../../utils/I18n';

export interface SpellsSheetTraditionsPropertiesProps {
	magicalPrimary: string;
	magicalTradition: string;
	properties: string[];
	locale: UIMessages;
}

export function SpellsSheetTraditionsProperties(props: SpellsSheetTraditionsPropertiesProps) {
	const { magicalPrimary, magicalTradition, properties, locale } = props;

	return (
		<div className="tradition-properties">
			<div className="primary">
				<span className="label">{_translate(locale, 'charactersheet.spells.traditionsproperties.labels.primaryattribute')}</span>
				<span className="value">{magicalPrimary}</span>
			</div>
			<div className="properties">
				<span className="label">{_translate(locale, 'charactersheet.spells.traditionsproperties.labels.properties')}</span>
				<span className="value">{properties.join(', ')}</span>
			</div>
			<div className="tradition">
				<span className="label">{_translate(locale, 'charactersheet.spells.traditionsproperties.labels.tradition')}</span>
				<span className="value">{magicalTradition}</span>
			</div>
		</div>
	);
}
