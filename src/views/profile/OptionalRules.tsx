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
}

export interface OptionalRulesDispatchProps {
	changeAttributeValueLimit(): void;
	changeHigherParadeValues(id: number): void;
}

export type OptionalRulesProps = OptionalRulesStateProps & OptionalRulesDispatchProps & OptionalRulesOwnProps;

export function OptionalRules(props: OptionalRulesProps) {
	const { sortedBooks, changeAttributeValueLimit, changeHigherParadeValues, locale, rules: { attributeValueLimit, higherParadeValues } } = props;
	const changeCheckboxTrap = () => undefined;

	return (
		<div className="page" id="optional-rules">
			<Scroll>
				<h3>{_translate(locale, 'rules.rulebase')}</h3>
				{sortedBooks.map(e => {
					return (
						<Checkbox
							key={e.id}
							checked
							onClick={changeCheckboxTrap}
							label={e.name}
							disabled
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
			</Scroll>
		</div>
	);
}
