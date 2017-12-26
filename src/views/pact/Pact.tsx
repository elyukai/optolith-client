import * as React from 'react';
import { Pact } from '../../actions/PactActions';
import { Dropdown } from '../../components/Dropdown';
import { Page } from '../../components/Page';
import { TextField } from '../../components/TextField';
import { InputTextEvent } from '../../types/data';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
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
						label={_translate(locale, 'pact.category')}
						options={[
							{
								name: _translate(locale, 'pact.nopact'),
							},
							..._translate(locale, 'pact.categories').map((name, i) => ({
								id: i + 1,
								name,
							})),
						]}
						onChange={setPactCategory}
						value={pact ? pact.category : undefined}
						disabled={!isPactEditable}
						/>
					<Dropdown
						label={_translate(locale, 'pact.level')}
						options={Array.from({ length: 3 }, (_, i) => {
							return {
								id: i + 1,
								name: getRoman(i, true),
								disabled: pact === null || !isPactEditable && pact.level <= i + 1
							};
						})}
						onChange={setPactLevel}
						value={pact ? pact.level : undefined}
						disabled={pact === null}
						/>
					<Dropdown
						label={_translate(locale, 'pact.fairytype')}
						options={_translate(locale, 'pact.fairytypes').map((name, i) => {
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
						label={_translate(locale, 'domain')}
						options={_translate(locale, 'pact.fairydomains').map((name, i) => {
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
						label={`${_translate(locale, 'domain')} (${_translate(locale, 'userdefined')})`}
						hint={pact && typeof pact.domain === 'number' ? _translate(locale, 'pact.fairydomains')[pact.domain - 1] : undefined}
						onChange={(event: InputTextEvent) => setTargetDomain(event.target.value)}
						value={pact && typeof pact.domain === 'string' ? pact.domain : ''}
						disabled={!isPactEditable || pact === null}
						/>
					<TextField
						label={_translate(locale, 'name')}
						onChange={(event: InputTextEvent) => setTargetName(event.target.value)}
						value={pact ? pact.name : undefined}
						disabled={!isPactEditable || pact === null}
						/>
				</div>
			</Page>
		);
	}
}
