import * as React from 'react';
import { _translate, UIMessages } from '../utils/I18n';

export interface RecommendedReferenceProps {
	locale: UIMessages;
}

export function RecommendedReference(props: RecommendedReferenceProps) {
	return (
		<div className="recommended-ref">
			<div className="rec">
				<div className="icon"></div>
				<div className="name">{_translate(props.locale, 'view.commoninculture')}</div>
			</div>
			<div className="unrec">
				<div className="icon"></div>
				<div className="name">{_translate(props.locale, 'view.uncommoninculture')}</div>
			</div>
		</div>
	);
}
