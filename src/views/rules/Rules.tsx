import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { Dropdown } from '../../components/Dropdown';
import { Scroll } from '../../components/Scroll';
import { Rules as RulesState } from '../../types/data';
import { Book } from '../../types/wiki';
import { Just, List, Maybe, OrderedSet, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';

export interface RulesOwnProps {
  locale: UIMessagesObject;
}

export interface RulesStateProps {
  rules: Maybe<Record<RulesState>>;
  sortedBooks: List<Record<Book>>;
  ruleBooksEnabled: Maybe<true | OrderedSet<string>>;
  isEnableLanguageSpecializationsDeactivatable: boolean;
}

export interface RulesDispatchProps {
  changeAttributeValueLimit (): void;
  changeHigherParadeValues (id: Maybe<number>): void;
  switchEnableAllRuleBooks (): void;
  switchEnableRuleBook (id: string): void;
  switchEnableLanguageSpecializations (): void;
}

export type RulesProps = RulesStateProps & RulesDispatchProps & RulesOwnProps;

export function Rules (props: RulesProps) {
  const {
    sortedBooks,
    changeAttributeValueLimit,
    changeHigherParadeValues,
    locale,
    rules: maybeRules,
    ruleBooksEnabled: maybeRuleBooksEnabled,
    switchEnableAllRuleBooks,
    switchEnableRuleBook,
    isEnableLanguageSpecializationsDeactivatable,
    switchEnableLanguageSpecializations,
  } = props;

  const coreBooks = List.of ('US25001', 'US25002');

  const allRuleBooksEnabled = Maybe.elem<true | OrderedSet<string>> (true) (maybeRuleBooksEnabled);

  const higherParadeValues = maybeRules
    .fmap (Record.get<RulesState, 'higherParadeValues'> ('higherParadeValues'));

  const areHigherParadeValuesEnabled = higherParadeValues .gt (Just (0));

  const attributeValueLimit = maybeRules
    .fmap (Record.get<RulesState, 'attributeValueLimit'> ('attributeValueLimit'));

  const enableLanguageSpecializations = maybeRules
    .fmap (
      Record.get<RulesState, 'enableLanguageSpecializations'> ('enableLanguageSpecializations')
    );

  return (
    <div className="page" id="optional-rules">
      <Scroll>
        <h3>{translate (locale, 'rules.rulebase')}</h3>
        <Checkbox
          checked={allRuleBooksEnabled}
          onClick={switchEnableAllRuleBooks}
          label={translate (locale, 'rules.enableallrulebooks')}
          />
        {sortedBooks.map (e => {
          const isCore = coreBooks .elem (e .get ('id'));

          return (
            <Checkbox
              key={e .get ('id')}
              checked={
                isCore
                || Maybe.fromMaybe
                  (false)
                  (maybeRuleBooksEnabled .fmap (
                    ruleBooksEnabled => typeof ruleBooksEnabled === 'boolean'
                      ? ruleBooksEnabled
                      : ruleBooksEnabled .member (e .get ('id'))
                  ))
              }
              onClick={() => switchEnableRuleBook (e .get ('id'))}
              label={e .get ('name')}
              disabled={allRuleBooksEnabled || isCore}
              />
          );
        })}
        <h3>{translate (locale, 'rules.optionalrules')}</h3>
        <div className="extended">
          <Checkbox
            checked={areHigherParadeValuesEnabled}
            onClick={() => changeHigherParadeValues (Just (areHigherParadeValuesEnabled ? 0 : 2))}
            label={translate (locale, 'rules.optionalrules.higherdefensestats')}
            />
          <Dropdown
            options={List.of (
              { id: Just (2), name: '+2' },
              { id: Just (4), name: '+4' }
            )}
            value={higherParadeValues}
            onChange={changeHigherParadeValues}
            disabled={Maybe.elem (0) (higherParadeValues)}
            />
        </div>
        <Checkbox
          checked={Maybe.elem (true) (attributeValueLimit)}
          onClick={changeAttributeValueLimit}
          label={translate (locale, 'rules.optionalrules.maximumattributescores')}
          />
        <Checkbox
          checked={Maybe.elem (true) (enableLanguageSpecializations)}
          onClick={switchEnableLanguageSpecializations}
          label={translate (locale, 'rules.optionalrules.languagespecializations')}
          disabled={isEnableLanguageSpecializationsDeactivatable}
          />
      </Scroll>
    </div>
  );
}
