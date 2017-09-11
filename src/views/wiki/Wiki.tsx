import * as React from 'react';
import { Aside } from '../../components/Aside';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface WikiOwnProps {
	locale: UIMessages;
}

export interface WikiStateProps {
}

export interface WikiDispatchProps {
}

export type WikiProps = WikiStateProps & WikiDispatchProps & WikiOwnProps;

export function Wiki(props: WikiProps) {
	return (
		<section id="wiki">
			<Page>
				<Options>

				</Options>
				<Scroll>

				</Scroll>
				<Aside>

				</Aside>
			</Page>
		</section>
	);
}
