import * as fs from 'fs';
import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';

export function LastChanges() {
	const text = fs.readFileSync('CHANGELOG.md', 'UTF-8');
	return (
		<div className="page" id="last-changes">
			<Scroll className="text">
				<Markdown source={text} />
			</Scroll>
		</div>
	);
}
