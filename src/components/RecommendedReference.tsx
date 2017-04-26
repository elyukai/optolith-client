import * as React from 'react';

export function RecommendedReference() {
	return (
		<div className="recommended-ref">
			<div className="rec">
				<div className="icon"></div>
				<div className="name">Empfohlen</div>
			</div>
			<div className="unrec">
				<div className="icon"></div>
				<div className="name">Unempfohlen</div>
			</div>
		</div>
	);
}
