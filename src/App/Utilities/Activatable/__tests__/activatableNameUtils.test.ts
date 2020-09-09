import { set } from "../../../../Data/Lens"
import { List } from "../../../../Data/List"
import { Just, Nothing } from "../../../../Data/Maybe"
import { makeLenses } from "../../../../Data/Record"
import { DisadvantageId } from "../../../Constants/Ids"
import { ActiveObjectWithId } from "../../../Models/ActiveEntries/ActiveObjectWithId"
import { ActivatableActivationValidation } from "../../../Models/View/ActivatableActivationValidationObject"
import { ActivatableCombinedName } from "../../../Models/View/ActivatableCombinedName"
import { ActivatableNameCost } from "../../../Models/View/ActivatableNameCost"
import { ActiveActivatable } from "../../../Models/View/ActiveActivatable"
import { L10n } from "../../../Models/Wiki/L10n"
import { StaticData, StaticDataL } from "../../../Models/Wiki/WikiModel"
import { composeL } from "../../compose"
import { compressList } from "../activatableNameUtils"

const L10nL = makeLenses (L10n)

const StaticDataMockup = set (composeL (StaticDataL.ui, L10nL.id)) ("de-DE") (StaticData.default)

test ("compressList", () => {
  expect (compressList (StaticDataMockup)
                       (List (ActiveActivatable ({
                                 nameAndCost: ActivatableNameCost ({
                                   active: ActiveObjectWithId ({
                                     id: DisadvantageId.PersonalityFlaw,
                                     index: Nothing,
                                   }),
                                   finalCost: Nothing,
                                   naming: ActivatableCombinedName ({
                                     addName: Just ("Arroganz"),
                                     baseName: "Persönlichkeitsschwäche",
                                     name: "Persönlichkeitsschwäche (Arroganz)",
                                   }),
                                   isAutomatic: false,
                                 }),
                                 validation: ActivatableActivationValidation ({
                                   disabled: Nothing,
                                 }),
                                 heroEntry: Nothing,
                                 wikiEntry: Nothing,
                               })
                             , ActiveActivatable ({
                                 nameAndCost: ActivatableNameCost ({
                                   active: ActiveObjectWithId ({
                                     id: DisadvantageId.PersonalityFlaw,
                                     index: Nothing,
                                   }),
                                   finalCost: Nothing,
                                   naming: ActivatableCombinedName ({
                                     addName: Just ("Weltfremd"),
                                     baseName: "Persönlichkeitsschwäche",
                                     name: "Persönlichkeitsschwäche (Weltfremd)",
                                   }),
                                   isAutomatic: false,
                                 }),
                                 validation: ActivatableActivationValidation ({
                                   disabled: Nothing,
                                 }),
                                 heroEntry: Nothing,
                                 wikiEntry: Nothing,
                               }))))
    .toEqual ("Persönlichkeitsschwäche (Arroganz, Weltfremd)")
})
