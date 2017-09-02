import * as React from 'react';

export interface TitleBarBackProps {
	setSection(id: string): void;
}

export function TitleBarBack(props: TitleBarBackProps) {
	return (
		<div className="titlebar-back">
			<div className="titlebar-back-inner" onClick={props.setSection.bind(null, 'main')}>
				&#xE905;
			</div>
		</div>
	);
}
