import * as React from "react";
import { Functn } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { List, map, toArray } from "../../../Data/List";
import { bindF, elem, fromJust, fromMaybe, isJust, Just, listToMaybe, mapMaybe, Nothing } from "../../../Data/Maybe";
import { lookup, OrderedMap, sum } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Pair, snd } from "../../../Data/Tuple";
import { SpecialAbilityId } from "../../Constants/Ids";
import { Rules } from "../../Models/Hero/Rules";
import { ScriptsSelectionListItemOptions } from "../../Models/View/ScriptsSelectionListItemOptions";
import { Culture } from "../../Models/Wiki/Culture";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { findSelectOption } from "../../Utilities/Activatable/selectionUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { isAvailable } from "../../Utilities/RulesUtils";
import { sortRecordsByName } from "../../Utilities/sortBy";
import { ScriptSelectionListItem } from "./ScriptSelectionListItem";

const WA = WikiModel.A
const CA = Culture.A
const SOA = SelectOption.A
const SAA = SpecialAbility.A

const isSOAvailable = (wiki: WikiModelRecord) => (rules: Record<Rules>) =>
  isAvailable (SOA.src) (Pair (WA.books (wiki), rules))

const getScripts =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (rules: Record<Rules>) =>
  (culture: Record<Culture>) =>
  (mainScript: number) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (isScriptSelectionNeeded: Pair<boolean, boolean>) =>
    pipe_ (
      wiki,
      WA.specialAbilities,
      lookup (SpecialAbilityId.Literacy as string),
      bindF (Functn.join (wiki_scripts => pipe (
        SAA.select,
        fmap (pipe (
          mapMaybe (pipe (
            SOA.id,
            Just,
            findSelectOption (wiki_scripts),
            bindF (option => {
                    const optionId = SOA.id (option)

                    if (typeof optionId === "number" && isSOAvailable (wiki) (rules) (option)) {
                      const maybeCost = SOA.cost (option)

                      if (isJust (maybeCost)) {
                        const native =
                          isBuyingMainScriptEnabled
                          && (
                            (
                              !snd (isScriptSelectionNeeded)
                              && pipe (CA.scripts, listToMaybe, elem (optionId))
                                      (culture)
                            )
                            || optionId === mainScript
                          )

                        return Just (ScriptsSelectionListItemOptions ({
                          id: optionId,
                          name: SOA.name (option),
                          cost: fromJust (maybeCost),
                          native,
                        }))
                      }
                    }

                    return Nothing
                  })
          )),
          sortRecordsByName (l10n)
        ))
      ))),
      fromMaybe (List ())
    )

export const getScriptSelectionAPSpent = (selected_scripts: OrderedMap<number, number>) =>
  sum (selected_scripts)

interface Props {
  l10n: L10nRecord
  wiki: WikiModelRecord
  rules: Record<Rules>
  active: OrderedMap<number, number>
  ap_left: number
  culture: Record<Culture>
  isBuyingMainScriptEnabled: boolean
  isScriptSelectionNeeded: Pair<boolean, boolean>
  mainScript: number
  toggleScript: (id: number) => (cost: number) => void
}

export const ScriptSelectionList: React.FC<Props> = props => {
  const {
    active,
    ap_left,
    culture,
    isBuyingMainScriptEnabled,
    isScriptSelectionNeeded,
    l10n,
    mainScript,
    rules,
    wiki,
    toggleScript,
  } = props

  const scripts = React.useMemo (
    () => getScripts (l10n)
                     (wiki)
                     (rules)
                     (culture)
                     (mainScript)
                     (isBuyingMainScriptEnabled)
                     (isScriptSelectionNeeded),
    [
      culture,
      isBuyingMainScriptEnabled,
      isScriptSelectionNeeded,
      l10n,
      mainScript,
      rules,
      wiki,
    ]
  )

  return (
    <ul className="scripts">
      {pipe_ (
        scripts,
        map (options => (
          <ScriptSelectionListItem
            l10n={l10n}
            apLeft={ap_left}
            active={active}
            options={options}
            toggleScript={toggleScript}
            />
        )),
        toArray
      )}
    </ul>
  )
}
