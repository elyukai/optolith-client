/* eslint-disable max-len */
import { ActionReducerMapBuilder, createAction } from "@reduxjs/toolkit"
import { CharacterState } from "./characterSlice.ts"

export const incrementLifePoints = createAction("derivedCharacteristics/incrementLifePoints")
export const decrementLifePoints = createAction("derivedCharacteristics/decrementLifePoints")
export const incrementLifePointsPermanentlyLost = createAction("derivedCharacteristics/incrementLifePointsPermanentlyLost")
export const decrementLifePointsPermanentlyLost = createAction("derivedCharacteristics/decrementLifePointsPermanentlyLost")
export const addLifePointsPermanentlyLost = createAction<number>("derivedCharacteristics/addLifePointsPermanentlyLost")
export const incrementArcaneEnergy = createAction("derivedCharacteristics/incrementArcaneEnergy")
export const decrementArcaneEnergy = createAction("derivedCharacteristics/decrementArcaneEnergy")
export const incrementArcaneEnergyPermanentlyLost = createAction("derivedCharacteristics/incrementArcaneEnergyPermanentlyLost")
export const decrementArcaneEnergyPermanentlyLost = createAction("derivedCharacteristics/decrementArcaneEnergyPermanentlyLost")
export const addArcaneEnergyPermanentlyLost = createAction<number>("derivedCharacteristics/addArcaneEnergyPermanentlyLost")
export const incrementArcaneEnergyBoughtBack = createAction("derivedCharacteristics/incrementArcaneEnergyBoughtBack")
export const decrementArcaneEnergyBoughtBack = createAction("derivedCharacteristics/decrementArcaneEnergyBoughtBack")
export const incrementKarmaPoints = createAction("derivedCharacteristics/incrementKarmaPoints")
export const decrementKarmaPoints = createAction("derivedCharacteristics/decrementKarmaPoints")
export const incrementKarmaPointsPermanentlyLost = createAction("derivedCharacteristics/incrementKarmaPointsPermanentlyLost")
export const decrementKarmaPointsPermanentlyLost = createAction("derivedCharacteristics/decrementKarmaPointsPermanentlyLost")
export const addKarmaPointsPermanentlyLost = createAction<number>("derivedCharacteristics/addKarmaPointsPermanentlyLost")
export const incrementKarmaPointsBoughtBack = createAction("derivedCharacteristics/incrementKarmaPointsBoughtBack")
export const decrementKarmaPointsBoughtBack = createAction("derivedCharacteristics/decrementKarmaPointsBoughtBack")

export const derivedCharacteristicsReducer = (builder: ActionReducerMapBuilder<CharacterState>) =>
  builder
    .addCase(incrementLifePoints, (state, _action) => {
      state.derivedCharacteristics.lifePoints.purchased++
    })
    .addCase(decrementLifePoints, (state, _action) => {
      if (state.derivedCharacteristics.lifePoints.purchased > 0) {
        state.derivedCharacteristics.lifePoints.purchased--
      }
    })
    .addCase(incrementLifePointsPermanentlyLost, (state, _action) => {
      state.derivedCharacteristics.lifePoints.permanentlyLost++
    })
    .addCase(decrementLifePointsPermanentlyLost, (state, _action) => {
      if (state.derivedCharacteristics.lifePoints.permanentlyLost > 0) {
        state.derivedCharacteristics.lifePoints.permanentlyLost--
      }
    })
    .addCase(addLifePointsPermanentlyLost, (state, action) => {
      state.derivedCharacteristics.lifePoints.permanentlyLost += action.payload
    })
    .addCase(incrementArcaneEnergy, (state, _action) => {
      state.derivedCharacteristics.arcaneEnergy.purchased++
    })
    .addCase(decrementArcaneEnergy, (state, _action) => {
      if (state.derivedCharacteristics.arcaneEnergy.purchased > 0) {
        state.derivedCharacteristics.arcaneEnergy.purchased--
      }
    })
    .addCase(incrementArcaneEnergyPermanentlyLost, (state, _action) => {
      state.derivedCharacteristics.arcaneEnergy.permanentlyLost++
    })
    .addCase(decrementArcaneEnergyPermanentlyLost, (state, _action) => {
      if (state.derivedCharacteristics.arcaneEnergy.permanentlyLost > 0) {
        state.derivedCharacteristics.arcaneEnergy.permanentlyLost--
      }
    })
    .addCase(addArcaneEnergyPermanentlyLost, (state, action) => {
      state.derivedCharacteristics.arcaneEnergy.permanentlyLost += action.payload
    })
    .addCase(incrementArcaneEnergyBoughtBack, (state, _action) => {
      state.derivedCharacteristics.arcaneEnergy.permanentlyLostBoughtBack++
    })
    .addCase(decrementArcaneEnergyBoughtBack, (state, _action) => {
      if (state.derivedCharacteristics.arcaneEnergy.permanentlyLostBoughtBack > 0) {
        state.derivedCharacteristics.arcaneEnergy.permanentlyLostBoughtBack--
      }
    })
    .addCase(incrementKarmaPoints, (state, _action) => {
      state.derivedCharacteristics.karmaPoints.purchased++
    })
    .addCase(decrementKarmaPoints, (state, _action) => {
      if (state.derivedCharacteristics.karmaPoints.purchased > 0) {
        state.derivedCharacteristics.karmaPoints.purchased--
      }
    })
    .addCase(incrementKarmaPointsPermanentlyLost, (state, _action) => {
      state.derivedCharacteristics.karmaPoints.permanentlyLost++
    })
    .addCase(decrementKarmaPointsPermanentlyLost, (state, _action) => {
      if (state.derivedCharacteristics.karmaPoints.permanentlyLost > 0) {
        state.derivedCharacteristics.karmaPoints.permanentlyLost--
      }
    })
    .addCase(addKarmaPointsPermanentlyLost, (state, action) => {
      state.derivedCharacteristics.karmaPoints.permanentlyLost += action.payload
    })
    .addCase(incrementKarmaPointsBoughtBack, (state, _action) => {
      state.derivedCharacteristics.karmaPoints.permanentlyLostBoughtBack++
    })
    .addCase(decrementKarmaPointsBoughtBack, (state, _action) => {
      if (state.derivedCharacteristics.karmaPoints.permanentlyLostBoughtBack > 0) {
        state.derivedCharacteristics.karmaPoints.permanentlyLostBoughtBack--
      }
    })
