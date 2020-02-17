// @ts-check
const { L10n } = require ("../../../Models/Wiki/L10n")
const { StaticData, StaticDataL } = require ("../../../Models/Wiki/WikiModel")
const { ActiveActivatable } = require ("../../../Models/View/ActiveActivatable")
const { ActivatableNameCost } = require ("../../../Models/View/ActivatableNameCost")
const { ActiveObjectWithId } = require ("../../../Models/ActiveEntries/ActiveObjectWithId")
const { ActivatableCombinedName } = require ("../../../Models/View/ActivatableCombinedName")
const { ActivatableActivationValidation } = require ("../../../Models/View/ActivatableActivationValidationObject")
const { makeLenses } = require ("../../../../Data/Record")
const { set } = require ("../../../../Data/Lens")
const { Just, Nothing } = require ("../../../../Data/Maybe")
const { List } = require ("../../../../Data/List")
const { compressList } = require ("../activatableNameUtils")
const { composeL } = require ("../../compose")
const { DisadvantageId } = require ("../../../Constants/Ids")

const L10nL = makeLenses (L10n)

const StaticDataMockup = set (composeL (StaticDataL.ui, L10nL.id)) ("de-DE") (StaticData.default)

test ('compressList', () => {
  expect (compressList (StaticDataMockup)
                       (List ( ActiveActivatable ({
                                 nameAndCost: ActivatableNameCost ({
                                   active: ActiveObjectWithId ({
                                     id: DisadvantageId.PersonalityFlaw,
                                     index: Nothing,
                                   }),
                                   finalCost: Nothing,
                                   naming: ActivatableCombinedName ({
                                     addName: Just ("Arroganz"),
                                     baseName: "Persönlichkeitsschwäche",
                                     name: "Persönlichkeitsschwäche (Arroganz)"
                                   }),
                                   isAutomatic: false,
                                 }),
                                 validation: ActivatableActivationValidation ({
                                   disabled: Nothing
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
                                     name: "Persönlichkeitsschwäche (Weltfremd)"
                                   }),
                                   isAutomatic: false,
                                 }),
                                 validation: ActivatableActivationValidation ({
                                   disabled: Nothing
                                 }),
                                 heroEntry: Nothing,
                                 wikiEntry: Nothing,
                               }))))
    .toEqual ("Persönlichkeitsschwäche (Arroganz, Weltfremd)")
})
