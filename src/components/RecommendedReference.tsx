import * as React from 'react';
import { translate } from '../utils/I18n';

export function RecommendedReference() {
	return (
		<div className="recommended-ref">
			<div className="rec">
				<div className="icon"></div>
				<div className="name">{translate('view.commoninculture')}</div>
			</div>
			<div className="unrec">
				<div className="icon"></div>
				<div className="name">{translate('view.uncommoninculture')}</div>
			</div>
		</div>
	);
}
