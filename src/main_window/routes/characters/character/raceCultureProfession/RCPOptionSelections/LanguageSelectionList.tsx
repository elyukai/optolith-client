import * as React from "react"
import { Functn } from "../../../Data/Function"
import { fmap } from "../../../Data/Functor"
import { List, map, toArray } from "../../../Data/List"
import { bindF, elem, fromMaybe, Just, listToMaybe, mapMaybe, Maybe, Nothing } from "../../../Data/Maybe"
import { lookup, OrderedMap, sum } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Pair } from "../../../Data/Tuple"
import { SpecialAbilityId } from "../../Constants/Ids"
import { Rules } from "../../Models/Hero/Rules"
import { LanguagesSelectionListItemOptions } from "../../Models/View/LanguagesSelectionListItemOptions"
import { Culture } from "../../Models/Wiki/Culture"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { findSelectOption } from "../../Utilities/Activatable/selectionUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { isAvailable } from "../../Utilities/RulesUtils"
import { sortRecordsByName } from "../../Utilities/sortBy"
import { LanguagesSelectionListItem } from "./LanguageSelectionListItem"

const SDA = StaticData.A
const CA = Culture.A
const SOA = SelectOption.A
const SAA = SpecialAbility.A

const isSOAvailable = (staticData: StaticDataRecord) => (rules: Record<Rules>) =>
  isAvailable (SOA.src) (Pair (SDA.books (staticData), rules))

const getLanguages =
  (staticData: StaticDataRecord) =>
  (rules: Record<Rules>) =>
  (culture: Record<Culture>) =>
  (motherTongue: number) =>
  (isMotherTongueSelectionNeeded: boolean) =>
    pipe_ (
      staticData,
      SDA.specialAbilities,
      lookup (SpecialAbilityId.Language as string),
      bindF (Functn.join (wiki_languages => pipe (
        SAA.select,
        fmap (pipe (
          mapMaybe (pipe (
            SOA.id,
            Just,
            findSelectOption (wiki_languages),
            bindF (option => {
                    const optionId = SOA.id (option)

                    if (typeof optionId === "number"
                        && isSOAvailable (staticData) (rules) (option)) {
                      const native =
                        (
                          !isMotherTongueSelectionNeeded
                          && pipe (CA.languages, listToMaybe, elem (optionId))
                                  (culture)
                        )
                        || optionId === motherTongue

                      return Just (LanguagesSelectionListItemOptions ({
                        id: optionId,
                        name: SOA.name (option),
                        native,
                      }))
                    }

                    return Nothing
                  })
          )),
          sortRecordsByName (staticData)
        )),
      ))),
      fromMaybe (List ())
    )

export const getLanguageSelectionAPSpent = (selected_languages: OrderedMap<number, number>) =>
  sum (selected_languages) * 2

interface Props {
  staticData: StaticDataRecord
  rules: Record<Rules>
  active: OrderedMap<number, number>
  ap_left: number
  culture: Record<Culture>
  isMotherTongueSelectionNeeded: boolean
  motherTongue: number
  adjustLanguage: (id: number) => (mlevel: Maybe<number>) => void
}

export const LanguageSelectionList: React.FC<Props> = props => {
  const {
    active,
    ap_left,
    culture,
    isMotherTongueSelectionNeeded,
    motherTongue,
    rules,
    staticData,
    adjustLanguage,
  } = props

  const languages = React.useMemo (
    () => getLanguages (staticData)
                       (rules)
                       (culture)
                       (motherTongue)
                       (isMotherTongueSelectionNeeded),
    [ culture, isMotherTongueSelectionNeeded, motherTongue, rules, staticData ]
  )

  return (
    <ul className="languages">
      {pipe_ (
        languages,
        map (options => (
          <LanguagesSelectionListItem
            key={LanguagesSelectionListItemOptions.A.id (options)}
            staticData={staticData}
            apLeft={ap_left}
            active={active}
            options={options}
            adjustLanguage={adjustLanguage}
            />
        )),
        toArray
      )}
    </ul>
  )
}
