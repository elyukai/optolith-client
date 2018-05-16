import * as React from 'react';
import { Pact } from '../../actions/PactActions';
import { Dropdown } from '../../components/Dropdown';
import { Page } from '../../components/Page';
import { TextField } from '../../components/TextField';
import { InputTextEvent } from '../../types/data';
import { UIMessages } from '../../types/ui.d';
import { translate } from '../../utils/I18n';
import { getRoman } from '../../utils/NumberUtils';

export interface PactSettingsOwnProps {
	locale: UIMessages;
}

export interface PactSettingsStateProps {
	pact: Pact | null;
	isPactValid: boolean;
	isPactEditable: boolean;
}

export interface PactSettingsDispatchProps {
	setPactCategory(category: number | undefined): void;
	setPactLevel(level: number): void;
	setTargetType(level: number): void;
	setTargetDomain(domain: number | string): void;
	setTargetName(name: string): void;
}

export type PactSettingsProps = PactSettingsStateProps & PactSettingsDispatchProps & PactSettingsOwnProps;

export class PactSettings extends React.Component<PactSettingsProps> {
	render() {
		const {
			pact,
			isPactEditable,
			setPactCategory,
			setPactLevel,
			setTargetDomain,
			setTargetName,
			setTargetType,
			locale,
		} = this.props;

		return (
			<Page id="pact">
				<div className="pact-content">
					<Dropdown
						label={translate(locale, 'pact.category')}
						options={[
							{
								name: translate(locale, 'pact.nopact'),
							},
							...translate(locale, 'pact.categories').map((name, i) => ({
								id: i + 1,
								name,
							})),
						]}
						onChange={setPactCategory}
						value={pact ? pact.category : undefined}
						disabled={!isPactEditable}
						/>
					<Dropdown
						label={translate(locale, 'pact.level')}
						options={Array.from({ length: 3 }, (_, i) => {
							return {
								id: i + 1,
								name: getRoman(i, true),
								disabled: pact === null || !isPactEditable && i + 1 <= pact.level
							};
						})}
						onChange={setPactLevel}
						value={pact ? pact.level : undefined}
						disabled={pact === null}
						/>
					<Dropdown
						label={translate(locale, 'pact.fairytype')}
						options={translate(locale, 'pact.fairytypes').map((name, i) => {
							return {
								id: i + 1,
								name
							};
						})}
						onChange={setTargetType}
						value={pact ? pact.type : undefined}
						disabled={!isPactEditable || pact === null}
						/>
					<Dropdown
						label={translate(locale, 'domain')}
						options={translate(locale, 'pact.fairydomains').map((name, i) => {
							return {
								id: i + 1,
								name
							};
						})}
						onChange={setTargetDomain}
						value={pact && typeof pact.domain === 'number' ? pact.domain : undefined}
						disabled={!isPactEditable || pact === null || typeof pact.domain === 'string' && pact.domain.length > 0}
						/>
					<TextField
						label={`${translate(locale, 'domain')} (${translate(locale, 'userdefined')})`}
						hint={pact && typeof pact.domain === 'number' ? translate(locale, 'pact.fairydomains')[pact.domain - 1] : undefined}
						onChange={(event: InputTextEvent) => setTargetDomain(event.target.value)}
						value={pact && typeof pact.domain === 'string' ? pact.domain : ''}
						disabled={!isPactEditable || pact === null}
						/>
					<TextField
						label={translate(locale, 'name')}
						onChange={(event: InputTextEvent) => setTargetName(event.target.value)}
						value={pact ? pact.name : undefined}
						disabled={!isPactEditable || pact === null}
						/>
				</div>
			</Page>
		);
	}
}
