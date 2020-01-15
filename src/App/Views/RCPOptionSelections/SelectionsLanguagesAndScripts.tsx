import * as React from "react";
import { List } from "../../../Data/List";
import { Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { LanguagesSelectionListItemOptions } from "../../Models/Hero/LanguagesSelectionListItem";
import { ScriptsSelectionListItem } from "../../Models/Hero/ScriptsSelectionListItem";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translateP } from "../../Utilities/I18n";
import { getLevelElements } from "../../Utilities/levelUtils";

export interface SelectionsLanguagesAndScriptsProps {
  scriptsActive: OrderedMap<number, number>
  languagesActive: OrderedMap<number, number>
  apLeft: number
  apTotal: number
  scripts: List<Record<ScriptsSelectionListItem>>
  languages: List<Record<LanguagesSelectionListItemOptions>>
  l10n: L10nRecord
  adjustLanguage (id: number): (level: Maybe<number>) => void
  adjustScript (id: number): (ap: number) => void
}

const LSLIA = LanguagesSelectionListItem.A
const SSLIA = ScriptsSelectionListItem.A

const levels = getLevelElements (3)

export function SelectionsLanguagesAndScripts (props: SelectionsLanguagesAndScriptsProps) {
  const {
    apTotal,
    apLeft,
    scripts,
    scriptsActive,
    languages,
    languagesActive,
    l10n,
    adjustLanguage,
    adjustScript,
  } = props

  return (
    <div className="lang_lit list">
      <h4>
        {translateP (l10n)
                    ("languagesandliteracytotalingapleft")
                    (List (apTotal, apLeft))}
      </h4>
      <div className="languages-scripts" />
    </div>
  )
}
