import * as React from 'react';
import { get, getPrimaryAttr } from '../../stores/ListStore';
import { AttributeInstance, SpecialAbilityInstance } from '../../types/data.d';
import { translate } from '../../utils/I18n';

export function LiturgiesSheetTraditionsAspects() {
	const SA_103 = get('SA_103') as SpecialAbilityInstance;
	const activeAspects = SA_103.active.map(e => e.sid);
	const activeAspectNames = activeAspects.map(sid => SA_103.sel!.find(e => e.id === sid)!.name).join(', ');

	const SA_102 = get('SA_102') as SpecialAbilityInstance;
	const activeTraditions = SA_102.active.map(e => e.sid);
	const activeTraditionNames = activeTraditions.map(sid => SA_102.sel!.find(e => e.id === sid)!.name).join(', ');

	const primary = getPrimaryAttr(2) as AttributeInstance;

	return (
		<div className="tradition-aspects">
			<div className="primary">
				<span className="label">{translate('charactersheet.chants.traditionsaspects.labels.primaryattribute')}</span>
				<span className="value">{primary && primary.short}</span>
			</div>
			<div className="aspects">
				<span className="label">{translate('charactersheet.chants.traditionsaspects.labels.aspects')}</span>
				<span className="value">{activeAspectNames}</span>
			</div>
			<div className="tradition">
				<span className="label">{translate('charactersheet.chants.traditionsaspects.labels.tradition')}</span>
				<span className="value">{activeTraditionNames}</span>
			</div>
		</div>
	);
}
