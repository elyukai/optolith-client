import { remote } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { UIMessages } from '../../utils/I18n';

export interface HelpOwnProps {
	locale: UIMessages;
}

export interface HelpStateProps {
}

export interface HelpDispatchProps {
}

export type HelpProps = HelpStateProps & HelpDispatchProps & HelpOwnProps;

export function Help(props: HelpProps) {
	const { locale } = props;
	const text = fs.readFileSync(path.join(remote.app.getAppPath(), 'app', 'docs', `FAQ.${locale.id}.md`), 'UTF-8');
	return (
		<section id="help">
			<Page>
				<Scroll>
					<Markdown source={text} />
				</Scroll>
			</Page>
		</section>
	);
}
