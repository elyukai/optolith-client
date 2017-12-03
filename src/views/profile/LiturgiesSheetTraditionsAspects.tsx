import * as React from 'react';
import { _translate, UIMessages } from '../../utils/I18n';

export interface LiturgiesSheetTraditionsAspectsProps {
	aspects: string[];
	blessedPrimary: string | undefined;
	blessedTradition: string | undefined;
	locale: UIMessages;
}

export function LiturgiesSheetTraditionsAspects(props: LiturgiesSheetTraditionsAspectsProps) {
	const { aspects, blessedPrimary, blessedTradition, locale } = props;

	return (
		<div className="tradition-aspects">
			<div className="primary">
				<span className="label">{_translate(locale, 'charactersheet.chants.traditionsaspects.labels.primaryattribute')}</span>
				<span className="value">{blessedPrimary}</span>
			</div>
			<div className="aspects">
				<span className="label">{_translate(locale, 'charactersheet.chants.traditionsaspects.labels.aspects')}</span>
				<span className="value">{aspects.join(', ')}</span>
			</div>
			<div className="tradition">
				<span className="label">{_translate(locale, 'charactersheet.chants.traditionsaspects.labels.tradition')}</span>
				<span className="value">{blessedTradition}</span>
			</div>
		</div>
	);
}
