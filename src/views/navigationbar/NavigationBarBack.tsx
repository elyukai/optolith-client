import * as React from 'react';

export interface NavigationBarBackProps {
	setTab(): void;
}

export function NavigationBarBack(props: NavigationBarBackProps) {
	return (
		<div className="navigationbar-back">
			<div className="navigationbar-back-inner" onClick={props.setTab}>
				&#xE905;
			</div>
		</div>
	);
}
