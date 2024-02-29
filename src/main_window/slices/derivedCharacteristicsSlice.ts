/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable max-len */
import { createAction } from "@reduxjs/toolkit"
import { DraftReducer } from "../../shared/utils/redux.ts"
import { CharacterState } from "./characterSlice.ts"

export const incrementLifePoints = createAction("derivedCharacteristics/incrementLifePoints")
export const decrementLifePoints = createAction("derivedCharacteristics/decrementLifePoints")
export const incrementLifePointsPermanentlyLost = createAction(
  "derivedCharacteristics/incrementLifePointsPermanentlyLost",
)
export const decrementLifePointsPermanentlyLost = createAction(
  "derivedCharacteristics/decrementLifePointsPermanentlyLost",
)
export const addLifePointsPermanentlyLost = createAction<number>(
  "derivedCharacteristics/addLifePointsPermanentlyLost",
)
export const incrementArcaneEnergy = createAction("derivedCharacteristics/incrementArcaneEnergy")
export const decrementArcaneEnergy = createAction("derivedCharacteristics/decrementArcaneEnergy")
export const incrementArcaneEnergyPermanentlyLost = createAction(
  "derivedCharacteristics/incrementArcaneEnergyPermanentlyLost",
)
export const decrementArcaneEnergyPermanentlyLost = createAction(
  "derivedCharacteristics/decrementArcaneEnergyPermanentlyLost",
)
export const addArcaneEnergyPermanentlyLost = createAction<number>(
  "derivedCharacteristics/addArcaneEnergyPermanentlyLost",
)
export const incrementArcaneEnergyBoughtBack = createAction(
  "derivedCharacteristics/incrementArcaneEnergyBoughtBack",
)
export const decrementArcaneEnergyBoughtBack = createAction(
  "derivedCharacteristics/decrementArcaneEnergyBoughtBack",
)
export const incrementKarmaPoints = createAction("derivedCharacteristics/incrementKarmaPoints")
export const decrementKarmaPoints = createAction("derivedCharacteristics/decrementKarmaPoints")
export const incrementKarmaPointsPermanentlyLost = createAction(
  "derivedCharacteristics/incrementKarmaPointsPermanentlyLost",
)
export const decrementKarmaPointsPermanentlyLost = createAction(
  "derivedCharacteristics/decrementKarmaPointsPermanentlyLost",
)
export const addKarmaPointsPermanentlyLost = createAction<number>(
  "derivedCharacteristics/addKarmaPointsPermanentlyLost",
)
export const incrementKarmaPointsBoughtBack = createAction(
  "derivedCharacteristics/incrementKarmaPointsBoughtBack",
)
export const decrementKarmaPointsBoughtBack = createAction(
  "derivedCharacteristics/decrementKarmaPointsBoughtBack",
)

export const derivedCharacteristicsReducer: DraftReducer<CharacterState> = (state, action) => {
  if (incrementLifePoints.match(action)) {
    state.derivedCharacteristics.lifePoints.purchased++
  } else if (decrementLifePoints.match(action)) {
    if (state.derivedCharacteristics.lifePoints.purchased > 0) {
      state.derivedCharacteristics.lifePoints.purchased--
    }
  } else if (incrementLifePointsPermanentlyLost.match(action)) {
    state.derivedCharacteristics.lifePoints.permanentlyLost++
  } else if (decrementLifePointsPermanentlyLost.match(action)) {
    if (state.derivedCharacteristics.lifePoints.permanentlyLost > 0) {
      state.derivedCharacteristics.lifePoints.permanentlyLost--
    }
  } else if (addLifePointsPermanentlyLost.match(action)) {
    state.derivedCharacteristics.lifePoints.permanentlyLost += action.payload
  } else if (incrementArcaneEnergy.match(action)) {
    state.derivedCharacteristics.arcaneEnergy.purchased++
  } else if (decrementArcaneEnergy.match(action)) {
    if (state.derivedCharacteristics.arcaneEnergy.purchased > 0) {
      state.derivedCharacteristics.arcaneEnergy.purchased--
    }
  } else if (incrementArcaneEnergyPermanentlyLost.match(action)) {
    state.derivedCharacteristics.arcaneEnergy.permanentlyLost++
  } else if (decrementArcaneEnergyPermanentlyLost.match(action)) {
    if (state.derivedCharacteristics.arcaneEnergy.permanentlyLost > 0) {
      state.derivedCharacteristics.arcaneEnergy.permanentlyLost--
    }
  } else if (addArcaneEnergyPermanentlyLost.match(action)) {
    state.derivedCharacteristics.arcaneEnergy.permanentlyLost += action.payload
  } else if (incrementArcaneEnergyBoughtBack.match(action)) {
    state.derivedCharacteristics.arcaneEnergy.permanentlyLostBoughtBack++
  } else if (decrementArcaneEnergyBoughtBack.match(action)) {
    if (state.derivedCharacteristics.arcaneEnergy.permanentlyLostBoughtBack > 0) {
      state.derivedCharacteristics.arcaneEnergy.permanentlyLostBoughtBack--
    }
  } else if (incrementKarmaPoints.match(action)) {
    state.derivedCharacteristics.karmaPoints.purchased++
  } else if (decrementKarmaPoints.match(action)) {
    if (state.derivedCharacteristics.karmaPoints.purchased > 0) {
      state.derivedCharacteristics.karmaPoints.purchased--
    }
  } else if (incrementKarmaPointsPermanentlyLost.match(action)) {
    state.derivedCharacteristics.karmaPoints.permanentlyLost++
  } else if (decrementKarmaPointsPermanentlyLost.match(action)) {
    if (state.derivedCharacteristics.karmaPoints.permanentlyLost > 0) {
      state.derivedCharacteristics.karmaPoints.permanentlyLost--
    }
  } else if (addKarmaPointsPermanentlyLost.match(action)) {
    state.derivedCharacteristics.karmaPoints.permanentlyLost += action.payload
  } else if (incrementKarmaPointsBoughtBack.match(action)) {
    state.derivedCharacteristics.karmaPoints.permanentlyLostBoughtBack++
  } else if (decrementKarmaPointsBoughtBack.match(action)) {
    if (state.derivedCharacteristics.karmaPoints.permanentlyLostBoughtBack > 0) {
      state.derivedCharacteristics.karmaPoints.permanentlyLostBoughtBack--
    }
  }
}
