import * as React from 'react';
import { TitleBarBackArrow } from './TitleBarBackArrow';

export interface TitleBarBackProps {
	setSection(id: string): void;
}

export function TitleBarBack(props: TitleBarBackProps) {
	return (
		<div className="titlebar-back">
			<div className="titlebar-back-inner" onClick={props.setSection.bind(null, 'main')}>
				<TitleBarBackArrow />
			</div>
		</div>
	);
}
