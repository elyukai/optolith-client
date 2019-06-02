import * as React from "react";
import { List } from "../../../Data/List";
import { isJust, Just, Maybe, maybeR, Nothing } from "../../../Data/Maybe";
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
  hero_locale: string
  mcurrent_guild_mage_spell: Maybe<Maybe<string>>
  all_spells_select_options: List<Record<DropdownOption>>
}

export interface RulesDispatchProps {
  changeAttributeValueLimit (): void
  changeHigherParadeValues (id: Maybe<number>): void
  switchEnableAllRuleBooks (): void
  switchEnableRuleBook (id: string): void
  switchEnableLanguageSpecializations (): void
  setHeroLocale (locale: string): void
  setGuildMageSpell (spellId: string): void
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
    all_spells_select_options,
    hero_locale,
    mcurrent_guild_mage_spell,
    setGuildMageSpell,
    setHeroLocale,
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
        <div className="temporary-fixes">
          <h3>Temporary Options</h3>
          <p>
            Die folgenden ein bis zwei Optionen sind nur temporär verfügbar. Die
            Sprache sollte auf die Sprache eingestellt sein, mit der der Held erstellt
            wurde. Die gildenmagische Tradition muss auch konfiguriert werden, um
            spätere Bände zuzulassen.
          </p>
          <p>
          The following one or two options are only temporarily available. The
          language should be set to the language the hero was created in. The guild
          mage tradition must also be configured to allow later rule books to
          introduce more options for your hero.
          </p>
          <Dropdown
            options={List (
              DropdownOption ({
                id: Just ("de-DE"),
                name: "Deutsch (Deutschland)",
              }),
              DropdownOption ({
                id: Just ("en-US"),
                name: "English (United States)",
              }),
              DropdownOption ({
                id: Just ("nl-BE"),
                name: "Nederlands (België)",
              }),
              DropdownOption ({
                id: Just ("fr-FR"),
                name: "Français (France)",
              })
            )}
            value={hero_locale}
            label={translate (l10n) ("language")}
            onChangeJust={setHeroLocale}
            />
          {maybeR (
                    <Dropdown
                      options={List ()}
                      value={Nothing}
                      label="Tradition (Guild Mage) Unfamiliar Spell"
                      hint="No 'Tradition (Guild Mage)' present"
                      onChangeJust={setGuildMageSpell}
                      disabled
                      />
                  )
                  ((mcurr_spell_id: Maybe<string>) => (
                    <Dropdown
                      options={all_spells_select_options}
                      value={mcurr_spell_id}
                      label="Tradition (Guild Mage) Unfamiliar Spell"
                      onChangeJust={setGuildMageSpell}
                      disabled={isJust (mcurr_spell_id)}
                      />
                  ))
                  (mcurrent_guild_mage_spell)}
        </div>
      </Scroll>
    </div>
  )
}
