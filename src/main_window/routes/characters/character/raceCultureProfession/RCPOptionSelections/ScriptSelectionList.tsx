import * as React from "react"
import { Functn } from "../../../Data/Function"
import { fmap } from "../../../Data/Functor"
import { List, map, toArray } from "../../../Data/List"
import { bindF, elem, fromJust, fromMaybe, isJust, Just, listToMaybe, mapMaybe, Nothing } from "../../../Data/Maybe"
import { lookup, OrderedMap, sum } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Pair, snd } from "../../../Data/Tuple"
import { SpecialAbilityId } from "../../Constants/Ids"
import { Rules } from "../../Models/Hero/Rules"
import { ScriptsSelectionListItemOptions } from "../../Models/View/ScriptsSelectionListItemOptions"
import { Culture } from "../../Models/Wiki/Culture"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { findSelectOption } from "../../Utilities/Activatable/selectionUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { isAvailable } from "../../Utilities/RulesUtils"
import { sortRecordsByName } from "../../Utilities/sortBy"
import { ScriptSelectionListItem } from "./ScriptSelectionListItem"

const SDA = StaticData.A
const CA = Culture.A
const SOA = SelectOption.A
const SAA = SpecialAbility.A

const isSOAvailable = (wiki: StaticDataRecord) => (rules: Record<Rules>) =>
  isAvailable (SOA.src) (Pair (SDA.books (wiki), rules))

const getScripts =
  (staticData: StaticDataRecord) =>
  (rules: Record<Rules>) =>
  (culture: Record<Culture>) =>
  (mainScript: number) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (isScriptSelectionNeeded: Pair<boolean, boolean>) =>
    pipe_ (
      staticData,
      SDA.specialAbilities,
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

                    if (typeof optionId === "number"
                        && isSOAvailable (staticData) (rules) (option)) {
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
          sortRecordsByName (staticData)
        ))
      ))),
      fromMaybe (List ())
    )

export const getScriptSelectionAPSpent = (selected_scripts: OrderedMap<number, number>) =>
  sum (selected_scripts)

interface Props {
  staticData: StaticDataRecord
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
    mainScript,
    rules,
    staticData,
    toggleScript,
  } = props

  const scripts = React.useMemo (
    () => getScripts (staticData)
                     (rules)
                     (culture)
                     (mainScript)
                     (isBuyingMainScriptEnabled)
                     (isScriptSelectionNeeded),
    [
      culture,
      isBuyingMainScriptEnabled,
      isScriptSelectionNeeded,
      mainScript,
      rules,
      staticData,
    ]
  )

  return (
    <ul className="scripts">
      {pipe_ (
        scripts,
        map (options => (
          <ScriptSelectionListItem
            key={ScriptsSelectionListItemOptions.A.id (options)}
            staticData={staticData}
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
