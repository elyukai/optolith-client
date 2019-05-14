import * as React from "react";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Rules } from "../../Models/Hero/Rules";
import { Book } from "../../Models/Wiki/Book";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { Checkbox } from "../Universal/Checkbox";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { Scroll } from "../Universal/Scroll";
import { BookSelection } from "./BookSelection";

export interface RulesOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface RulesStateProps {
  sortedBooks: List<Record<Book>>
  isEnableLanguageSpecializationsDeactivatable: boolean
}

export interface RulesDispatchProps {
  changeAttributeValueLimit (): void
  changeHigherParadeValues (id: Maybe<number>): void
  switchEnableAllRuleBooks (): void
  switchEnableRuleBook (id: string): void
  switchEnableLanguageSpecializations (): void
}

export type RulesProps = RulesStateProps & RulesDispatchProps & RulesOwnProps

export function RulesView (props: RulesProps) {
  const {
    sortedBooks,
    changeAttributeValueLimit,
    changeHigherParadeValues,
    l10n,
    switchEnableAllRuleBooks,
    switchEnableRuleBook,
    isEnableLanguageSpecializationsDeactivatable,
    switchEnableLanguageSpecializations,
    hero,
  } = props

  const rules = HeroModel.A.rules (hero)
  const allRuleBooksEnabled = Rules.A.enableAllRuleBooks (rules)
  const enabledRuleBooks = Rules.A.enabledRuleBooks (rules)

  const higherParadeValues = Rules.A.higherParadeValues (rules)

  const areHigherParadeValuesEnabled = higherParadeValues > 0

  const attributeValueLimit = Rules.A.attributeValueLimit (rules)

  const enableLanguageSpecializations = Rules.A.enableLanguageSpecializations (rules)

  return (
    <div className="page" id="optional-rules">
      <Scroll>
        <h3>{translate (l10n) ("rulebase")}</h3>
        <BookSelection
          allRuleBooksEnabled={allRuleBooksEnabled}
          enabledRuleBooks={enabledRuleBooks}
          l10n={l10n}
          sortedBooks={sortedBooks}
          switchEnableAllRuleBooks={switchEnableAllRuleBooks}
          switchEnableRuleBook={switchEnableRuleBook}
          />
        <h3>{translate (l10n) ("optionalrules")}</h3>
        <div className="extended">
          <Checkbox
            checked={areHigherParadeValuesEnabled}
            onClick={() => changeHigherParadeValues (Just (areHigherParadeValuesEnabled ? 0 : 2))}
            label={translate (l10n) ("higherdefensestats")}
            />
          <Dropdown
            options={List (
              DropdownOption ({ id: Just (2), name: "+2" }),
              DropdownOption ({ id: Just (4), name: "+4" })
            )}
            value={higherParadeValues}
            onChange={changeHigherParadeValues}
            disabled={higherParadeValues === 0}
            />
        </div>
        <Checkbox
          checked={attributeValueLimit}
          onClick={changeAttributeValueLimit}
          label={translate (l10n) ("maximumattributescores")}
          />
        <Checkbox
          checked={enableLanguageSpecializations}
          onClick={switchEnableLanguageSpecializations}
          label={translate (l10n) ("languagespecializations")}
          disabled={isEnableLanguageSpecializationsDeactivatable}
          />
      </Scroll>
    </div>
  )
}
