import * as React from 'react';
import * as LocationActions from '../../actions/LocationActions';
import { TitleBarBackArrow } from './TitleBarBackArrow';

export function TitleBarBack() {
	return (
		<div className="titlebar-back">
			<div className="titlebar-back-inner" onClick={() => LocationActions.setSection('main')}>
				<TitleBarBackArrow />
			</div>
		</div>
	);
}
