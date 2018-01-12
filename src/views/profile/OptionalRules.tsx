import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { Dropdown } from '../../components/Dropdown';
import { Scroll } from '../../components/Scroll';
import { RulesState } from '../../reducers/rules';
import { Book } from '../../types/data';
import { _translate, UIMessages } from '../../utils/I18n';

export interface OptionalRulesOwnProps {
	locale: UIMessages;
}

export interface OptionalRulesStateProps {
	rules: RulesState;
	sortedBooks: Book[];
	ruleBooksEnabled: boolean | Set<string>;
	isEnableLanguageSpecializationsDeactivatable: boolean;
}

export interface OptionalRulesDispatchProps {
	changeAttributeValueLimit(): void;
	changeHigherParadeValues(id: number): void;
	switchEnableAllRuleBooks(): void;
	switchEnableRuleBook(id: string): void;
	switchEnableLanguageSpecializations(): void;
}

export type OptionalRulesProps = OptionalRulesStateProps & OptionalRulesDispatchProps & OptionalRulesOwnProps;

export function OptionalRules(props: OptionalRulesProps) {
	const { sortedBooks, changeAttributeValueLimit, changeHigherParadeValues, locale, rules: { attributeValueLimit, higherParadeValues, enableLanguageSpecializations }, ruleBooksEnabled, switchEnableAllRuleBooks, switchEnableRuleBook, isEnableLanguageSpecializationsDeactivatable, switchEnableLanguageSpecializations } = props;

	return (
		<div className="page" id="optional-rules">
			<Scroll>
				<h3>{_translate(locale, 'rules.rulebase')}</h3>
				<Checkbox
					checked={ruleBooksEnabled === true}
					onClick={switchEnableAllRuleBooks}
					label={_translate(locale, 'rules.enableallrulebooks')}
					/>
				{sortedBooks.map(e => {
					const isCore = ['US25001', 'US25002'].includes(e.id);
					return (
						<Checkbox
							key={e.id}
							checked={typeof ruleBooksEnabled === 'boolean' ? ruleBooksEnabled : ruleBooksEnabled.has(e.id) || isCore}
							onClick={() => switchEnableRuleBook(e.id)}
							label={e.name}
							disabled={ruleBooksEnabled === true || isCore}
							/>
					);
				})}
				<h3>{_translate(locale, 'rules.optionalrules')}</h3>
				<div className="extended">
					<Checkbox
						checked={higherParadeValues > 0}
						onClick={() => changeHigherParadeValues(higherParadeValues > 0 ? 0 : 2)}
						label={_translate(locale, 'rules.optionalrules.higherdefensestats')}
						/>
					<Dropdown
						options={[{id: 2, name: '+2'}, {id: 4, name: '+4'}]}
						value={higherParadeValues}
						onChange={changeHigherParadeValues}
						disabled={higherParadeValues === 0}
						/>
				</div>
				<Checkbox
					checked={attributeValueLimit}
					onClick={changeAttributeValueLimit}
					label={_translate(locale, 'rules.optionalrules.maximumattributescores')}
					/>
				<Checkbox
					checked={enableLanguageSpecializations}
					onClick={switchEnableLanguageSpecializations}
					label={_translate(locale, 'rules.optionalrules.languagespecializations')}
					disabled={isEnableLanguageSpecializationsDeactivatable}
					/>
			</Scroll>
		</div>
	);
}
