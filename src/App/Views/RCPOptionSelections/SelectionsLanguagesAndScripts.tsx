import * as classNames from "classnames";
import * as React from "react";
import { filter, List, map, toArray } from "../../../Data/List";
import { Just, Maybe, Nothing } from "../../../Data/Maybe";
import { findWithDefault, member, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { LanguagesSelectionListItem } from "../../Models/Hero/LanguagesSelectionListItem";
import { ScriptsSelectionListItem } from "../../Models/Hero/ScriptsSelectionListItem";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate, translateP } from "../../Utilities/I18n";
import { getLevelElements } from "../../Utilities/levelUtils";
import { pipe_ } from "../../Utilities/pipe";
import { misNumberM } from "../../Utilities/typeCheckUtils";
import { Checkbox } from "../Universal/Checkbox";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";

export interface SelectionsLanguagesAndScriptsProps {
  scriptsActive: OrderedMap<number, number>
  languagesActive: OrderedMap<number, number>
  apLeft: number
  apTotal: number
  scripts: List<Record<ScriptsSelectionListItem>>
  languages: List<Record<LanguagesSelectionListItem>>
  l10n: L10nRecord
  adjustLanguage (id: number): (level: Maybe<number>) => void
  adjustScript (id: number): (ap: number) => void
}

const LSLIA = LanguagesSelectionListItem.A
const SSLIA = ScriptsSelectionListItem.A

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

  const levels = getLevelElements (3)

  return (
    <div className="lang_lit list">
      <h4>
        {translateP (l10n)
                    ("languagesandliteracytotalingapleft")
                    (List (apTotal, apLeft))}
      </h4>
      <div className="languages-scripts">
        <div className="languages">
          {pipe_ (
            languages,
            map (e => {
              const id = LSLIA.id (e)
              const name = LSLIA.name (e)
              const native = LSLIA.native (e)

              const is_active = member (id) (languagesActive)

              const disabled = native || !is_active && apLeft <= 0

              return (
                <div key={id} className={classNames (disabled ? "disabled" : undefined)}>
                  <Checkbox
                    checked={is_active || native}
                    disabled={disabled}
                    onClick={() => adjustLanguage (id) (is_active ? Nothing : Just (1))}
                    >
                    {name}
                  </Checkbox>
                  {(() => {
                    if (native) {
                      return (
                        <Dropdown
                          className="tiers"
                          value={4}
                          options={List (
                            DropdownOption ({
                              id: Just (4),
                              name: translate (l10n) ("nativetongue.short"),
                            })
                          )}
                          disabled
                          />
                      )
                    }
                    else if (is_active) {
                      return (
                        <Dropdown
                          className="tiers"
                          value={is_active}
                          onChange={optionId => adjustLanguage (id) (misNumberM (optionId))}
                          options={filter ((option: Record<DropdownOption>) => {
                                            const current_level =
                                              Maybe.sum (misNumberM (DropdownOption.A.id (option)))

                                            const active_level =
                                              findWithDefault (0) (id) (languagesActive)

                                            return (current_level - active_level) * 2 <= apLeft
                                          })
                                          (levels)}
                          />
                      )
                    }

                    return null
                  }) ()}
                </div>
              )
            }),
            toArray
          )}
        </div>
        <div className="scripts">
          {pipe_ (
            scripts,
            map (e => {
              const id = SSLIA.id (e)
              const name = SSLIA.name (e)
              const cost = SSLIA.cost (e)
              const native = SSLIA.native (e)

              const is_active = member (id) (scriptsActive)

              const disabled = native || !is_active && apLeft - cost < 0

              return (
                <div key={id} className={classNames (disabled ? "disabled" : undefined)}>
                  <Checkbox
                    checked={is_active || native}
                    disabled={disabled}
                    onClick={() => adjustScript (id) (cost)}>
                    {name} ({cost} {translate (l10n) ("adventurepoints.short")})
                  </Checkbox>
                </div>
              )
            }),
            toArray
          )}
        </div>
      </div>
    </div>
  )
}
