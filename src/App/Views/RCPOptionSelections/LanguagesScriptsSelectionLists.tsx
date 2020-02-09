import * as React from "react"
import { List } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Pair } from "../../../Data/Tuple"
import { Rules } from "../../Models/Hero/Rules"
import { Culture } from "../../Models/Wiki/Culture"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { LanguagesScriptsSelection } from "../../Models/Wiki/professionSelections/LanguagesScriptsSelection"
import { WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { translateP } from "../../Utilities/I18n"
import { getLanguageSelectionAPSpent, LanguageSelectionList } from "./LanguageSelectionList"
import { getScriptSelectionAPSpent, ScriptSelectionList } from "./ScriptSelectionList"

const LSSOA = LanguagesScriptsSelection.A

/**
 * Returns `(is_valid, ap_left)`.
 */
export const isLanguagesScriptsSelectionValid =
  (languagesActive: OrderedMap<number, number>) =>
  (scriptsActive: OrderedMap<number, number>) =>
  (selection: Record<LanguagesScriptsSelection>): Pair<boolean, number> => {
    const ap_total = LSSOA.value (selection)
    const ap_spent_on_langs = getLanguageSelectionAPSpent (languagesActive)
    const ap_spent_on_scripts = getScriptSelectionAPSpent (scriptsActive)

    const ap_left = ap_total - ap_spent_on_langs - ap_spent_on_scripts

    const is_valid = ap_left === 0

    return Pair (is_valid, ap_left)
  }

interface Props {
  l10n: L10nRecord
  wiki: WikiModelRecord
  rules: Record<Rules>
  ap_left: number
  culture: Record<Culture>
  isBuyingMainScriptEnabled: boolean
  isMotherTongueSelectionNeeded: boolean
  isScriptSelectionNeeded: Pair<boolean, boolean>
  languagesActive: OrderedMap<number, number>
  mainScript: number
  motherTongue: number
  scriptsActive: OrderedMap<number, number>
  selection: Record<LanguagesScriptsSelection>
  toggleScript: (id: number) => (cost: number) => void
  adjustLanguage: (id: number) => (mlevel: Maybe<number>) => void
}

export const LanguagesScriptsSelectionLists: React.FC<Props> = props => {
  const {
    l10n,
    wiki,
    rules,
    ap_left,
    culture,
    isBuyingMainScriptEnabled,
    isMotherTongueSelectionNeeded,
    isScriptSelectionNeeded,
    languagesActive,
    mainScript,
    motherTongue,
    scriptsActive,
    selection,
    toggleScript,
    adjustLanguage,
  } = props

  const ap_total = LSSOA.value (selection)

  return (
    <div className="lang_lit list">
      <h4>
        {translateP (l10n)
                    ("rcpselectoptions.languagesandliteracytotalingapleft")
                    (List (ap_total, ap_left))}
      </h4>
      <div className="languages-scripts">
        <LanguageSelectionList
          l10n={l10n}
          wiki={wiki}
          rules={rules}
          active={languagesActive}
          ap_left={ap_left}
          culture={culture}
          isMotherTongueSelectionNeeded={isMotherTongueSelectionNeeded}
          motherTongue={motherTongue}
          adjustLanguage={adjustLanguage}
          />
        <ScriptSelectionList
          l10n={l10n}
          wiki={wiki}
          rules={rules}
          active={scriptsActive}
          ap_left={ap_left}
          culture={culture}
          isBuyingMainScriptEnabled={isBuyingMainScriptEnabled}
          isScriptSelectionNeeded={isScriptSelectionNeeded}
          mainScript={mainScript}
          toggleScript={toggleScript}
          />
      </div>
    </div>
  )
}
