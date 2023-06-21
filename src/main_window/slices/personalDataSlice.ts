import { ActionReducerMapBuilder, createAction } from "@reduxjs/toolkit"
import { Height, Weight, WeightDiceOffsetStrategy } from "optolith-database-schema/types/Race"
import { DieType } from "optolith-database-schema/types/_Dice"
import { rollDice, separateDice } from "../../shared/utils/dice.ts"
import { even, parseInt, randomInt } from "../../shared/utils/math.ts"
import { assertExhaustive } from "../../shared/utils/typeSafety.ts"
import { CharacterState } from "./characterSlice.ts"

export const setFamily = createAction<string>("personalData/setFamily")
export const setPlaceOfBirth = createAction<string>("personalData/setPlaceOfBirth")
export const setDateOfBirth = createAction<string>("personalData/setDateOfBirth")
export const setAge = createAction<string>("personalData/setAge")
export const setPredefinedHairColor = createAction<number>("personalData/setPredefinedHairColor")
export const setPredefinedEyeColor = createAction<number>("personalData/setPredefinedEyeColor")
export const setSize = createAction<string>("personalData/setSize")
export const setWeight = createAction<string>("personalData/setWeight")
export const setTitle = createAction<string>("personalData/setTitle")
export const setSocialStatus = createAction<number>("personalData/setSocialStatusId")
export const setCharacteristics = createAction<string>("personalData/setCharacteristics")
export const setOtherInfo = createAction<string>("personalData/setOtherInfo")

export const rerollHairColor = createAction(
  "personalData/rerollHairColor",
  (hairColorIdDice: number[]) => ({ payload: hairColorIdDice[randomInt(19)] }),
)

export const rerollEyeColor = createAction(
  "personalData/rerollEyeColor",
  (eyeColorIdDice: number[]) => ({ payload: eyeColorIdDice[randomInt(19)] }),
)

const rerollHeightLogic = (height: Height) => {
  const separatedDice = height.random.flatMap(separateDice)
  const diceRollSum = separatedDice.reduce((acc, sides) => acc + rollDice(sides), 0)
  return height.base + diceRollSum
}

const rerollWeightLogic = (weight: Weight) => {
  const separatedDice = weight.random.flatMap(dice =>
    Array.from({ length: dice.number }, () => [ dice.sides, dice.offset_strategy ] as const))

  const rollWeightDice = (sides: DieType, strategy: WeightDiceOffsetStrategy) => {
    switch (strategy) {
      case "Add": return rollDice(sides)
      case "Subtract": return -rollDice(sides)
      case "AddEvenSubtractOdd": {
        const result = rollDice(sides)
        return result * (even(result) ? 1 : -1)
      }
      default: return assertExhaustive(strategy)
    }
  }

  const diceRollSum = separatedDice.reduce(
    (acc, [ sides, strategy ]) => acc + rollWeightDice(sides, strategy),
    0
  )
  return -weight.base + diceRollSum
}

export const rerollSize = createAction(
  "personalData/rerollSize",
  (height: Height) => ({ payload: rerollHeightLogic(height) })
)

export const rerollWeight = createAction(
  "personalData/rerollWeight",
  (weight: Weight, height: Height) => ({
    payload: {
      heightModifier: rerollWeightLogic(weight),
      height: rerollHeightLogic(height),
    },
  })
)

export const personalDataReducer = (builder: ActionReducerMapBuilder<CharacterState>) =>
  builder
    .addCase(setFamily, (state, action) => {
      state.personalData.family = action.payload === "" ? undefined : action.payload
    })
    .addCase(setPlaceOfBirth, (state, action) => {
      state.personalData.placeOfBirth = action.payload === "" ? undefined : action.payload
    })
    .addCase(setDateOfBirth, (state, action) => {
      state.personalData.dateOfBirth = action.payload === "" ? undefined : action.payload
    })
    .addCase(setAge, (state, action) => {
      state.personalData.age = action.payload === "" ? undefined : action.payload
    })
    .addCase(setPredefinedHairColor, (state, action) => {
      state.personalData.hairColor = { type: "Predefined", id: action.payload }
    })
    .addCase(rerollHairColor, (state, action) => {
      if (action.payload !== undefined) {
        state.personalData.hairColor = { type: "Predefined", id: action.payload }
      }
    })
    .addCase(setPredefinedEyeColor, (state, action) => {
      state.personalData.eyeColor = { type: "Predefined", id: action.payload }
    })
    .addCase(rerollEyeColor, (state, action) => {
      if (action.payload !== undefined) {
        state.personalData.eyeColor = { type: "Predefined", id: action.payload }
      }
    })
    .addCase(setSize, (state, action) => {
      state.personalData.size = action.payload === "" ? undefined : action.payload
    })
    .addCase(rerollSize, (state, action) => {
      state.personalData.size = action.payload.toString()
    })
    .addCase(setWeight, (state, action) => {
      state.personalData.weight = action.payload === "" ? undefined : action.payload
    })
    .addCase(rerollWeight, (state, action) => {
      const { height, isNew } = (() => {
        const heightStr = state.personalData.size
        const previousHeight = heightStr === undefined ? undefined : parseInt(heightStr)

        if (previousHeight === undefined) {
          return { height: action.payload.height, isNew: true }
        }

        return { height: previousHeight, isNew: false }
      })()

      if (isNew) {
        state.personalData.size = height.toString()
      }

      state.personalData.weight = (height + action.payload.heightModifier).toString()
    })
    .addCase(setTitle, (state, action) => {
      state.personalData.title = action.payload === "" ? undefined : action.payload
    })
    .addCase(setSocialStatus, (state, action) => {
      state.personalData.socialStatus.id = action.payload
    })
    .addCase(setCharacteristics, (state, action) => {
      state.personalData.characteristics = action.payload === "" ? undefined : action.payload
    })
    .addCase(setOtherInfo, (state, action) => {
      state.personalData.otherInfo = action.payload === "" ? undefined : action.payload
    })
