// @ts-check
const { L10n } = require ("../../../Models/Wiki/L10n")
const { ActiveActivatable } = require ("../../../Models/View/ActiveActivatable")
const { makeLenses } = require ("../../../../Data/Record")
const { set } = require ("../../../../Data/Lens")
const { Just, Nothing } = require ("../../../../Data/Maybe")
const { List } = require ("../../../../Data/List")
const { compressList } = require ("../activatableNameUtils")

const L10nL = makeLenses (L10n)

const L10nMockup = set (L10nL.id) ("de-DE") (L10n.default)

test ('compressList', () => {
  expect (compressList (L10nMockup)
                       (List ( ActiveActivatable ({
                                 id: "DISADV_47",
                                 tier: Nothing,
                                 index: Nothing,
                                 name: "Persönlichkeitsschwäche (Arroganz)",
                                 baseName: "Persönlichkeitsschwäche",
                                 addName: Just ("Arroganz"),
                                 levelName: Nothing,
                                 finalCost: Nothing,
                                 disabled: Nothing,
                                 stateEntry: Nothing,
                                 wikiEntry: Nothing,
                               })
                             , ActiveActivatable ({
                                 id: "DISADV_47",
                                 tier: Nothing,
                                 index: Nothing,
                                 name: "Persönlichkeitsschwäche (Weltfremd)",
                                 baseName: "Persönlichkeitsschwäche",
                                 addName: Just ("Weltfremd"),
                                 levelName: Nothing,
                                 finalCost: Nothing,
                                 disabled: Nothing,
                                 stateEntry: Nothing,
                                 wikiEntry: Nothing,
                               }))))
    .toEqual ("Persönlichkeitsschwäche (Arroganz, Weltfremd)")
})
