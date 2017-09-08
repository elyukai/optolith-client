import * as React from 'react';

export interface NavigationBarBackProps {
	setSection(id: string): void;
}

export function NavigationBarBack(props: NavigationBarBackProps) {
	return (
		<div className="navigationbar-back">
			<div className="navigationbar-back-inner" onClick={props.setSection.bind(null, 'main')}>
				&#xE905;
			</div>
		</div>
	);
}
