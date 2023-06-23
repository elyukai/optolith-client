import { WeightDiceOffsetStrategy } from "optolith-database-schema/types/Race"
import { FC, useCallback, useMemo } from "react"
import { DropdownOption } from "../../../../../shared/components/dropdown/DropdownItem.tsx"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { minus, plusMinus, signStr } from "../../../../../shared/utils/math.ts"
import { isEmptyOr, isFloat, isNaturalNumber } from "../../../../../shared/utils/regex.ts"
import { compareAt, reduceCompare } from "../../../../../shared/utils/sort.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectAvailableEyeColors, selectAvailableEyeColorsIdDice, selectAvailableHairColors, selectAvailableHairColorsIdDice, selectAvailableSocialStatuses, selectRandomHeightCalculation, selectRandomWeightCalculation } from "../../../../selectors/personalDataSelectors.ts"
import { selectAge, selectCharacteristics, selectDateOfBirth, selectFamily, selectOtherInfo, selectPlaceOfBirth, selectPredefinedEyeColor, selectPredefinedHairColor, selectSize, selectSocialStatusId, selectTitle, selectWeight } from "../../../../slices/characterSlice.ts"
import { rerollEyeColor, rerollHairColor, rerollSize, rerollWeight, setAge, setCharacteristics, setDateOfBirth, setFamily, setOtherInfo, setPlaceOfBirth, setPredefinedEyeColor, setPredefinedHairColor, setSize, setSocialStatus, setTitle, setWeight } from "../../../../slices/personalDataSlice.ts"
import { PersonalDataDropdown } from "./PersonalDataDropdown.tsx"
import { PersonalDataDropdownWithReroll } from "./PersonalDataDropdownWithReroll.tsx"
import { PersonalDataTextField } from "./PersonalDataTextField.tsx"
import { PersonalDataTextFieldWithReroll } from "./PersonalDataTextFieldWithReroll.tsx"

const validateEmptyOrNaturalNumber = (value: string | undefined) =>
  value === undefined || isEmptyOr(isNaturalNumber, value)

const validateEmptyOrFloat = (value: string | undefined) =>
  value === undefined || isEmptyOr(isFloat, value)

export const PersonalData: FC = () => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()

  const availableHairColors = useAppSelector(selectAvailableHairColors)
  const availableEyeColors = useAppSelector(selectAvailableEyeColors)

  const hairColorOptions = useMemo(
    () =>
      availableHairColors
        .map((hairColor): DropdownOption<number> => ({
          id: hairColor.id,
          name: translateMap(hairColor.translations)?.name ?? hairColor.id.toFixed(),
        }))
        .sort(reduceCompare(compareAt(x => x.name, localeCompare))),
    [ availableHairColors, localeCompare, translateMap ],
  )

  const eyeColorOptions = useMemo(
    () =>
      availableEyeColors
        .map((eyeColor): DropdownOption<number> => ({
          id: eyeColor.id,
          name: translateMap(eyeColor.translations)?.name ?? eyeColor.id.toFixed(),
        }))
        .sort(reduceCompare(compareAt(x => x.name, localeCompare))),
    [ availableEyeColors, localeCompare, translateMap ],
  )

  const randomHeightCalculation = useAppSelector(selectRandomHeightCalculation)

  const heightCalculationString = useMemo(() => {
    const dice = translate("D")

    const randomPart =
      randomHeightCalculation.random
        .map(({ number, sides }) => ` ${signStr(sides)} ${number}${dice}${sides}`)
        .join("")

    return ` (${randomHeightCalculation.base}${randomPart})`
  }, [ randomHeightCalculation.base, randomHeightCalculation.random, translate ])

  const randomWeightCalculation = useAppSelector(selectRandomWeightCalculation)

  const weightCalculationString = useMemo(() => {
    const dice = translate("D")
    const size = translate("Size")

    const signStrWeight = (offsetStrategy: WeightDiceOffsetStrategy) => {
      switch (offsetStrategy) {
        case "Add":                return "+"
        case "Subtract":           return minus
        case "AddEvenSubtractOdd": return plusMinus
        default: return assertExhaustive(offsetStrategy)
      }
    }

    const randomPart =
      randomWeightCalculation.random
        .map(({ number, sides, offset_strategy }) => ` ${signStrWeight(offset_strategy)} ${number}${dice}${sides}`)
        .join("")

    return ` (${size} ${minus} ${randomWeightCalculation.base}${randomPart})`
  }, [
    randomWeightCalculation.base,
    randomWeightCalculation.random,
    translate,
  ])

  const availableSocialStatuses = useAppSelector(selectAvailableSocialStatuses)

  const socialStatusOptions = useMemo(
    () =>
      availableSocialStatuses
        .map((socialStatus): DropdownOption<number> => ({
          id: socialStatus.id,
          name: translateMap(socialStatus.translations)?.name ?? socialStatus.id.toFixed(),
        }))
        .sort(reduceCompare(compareAt(x => x.name, localeCompare))),
    [ availableSocialStatuses, localeCompare, translateMap ],
  )

  const dispatch = useAppDispatch()
  const availableHairColorsIdDice = useAppSelector(selectAvailableHairColorsIdDice)
  const availableEyeColorsIdDice = useAppSelector(selectAvailableEyeColorsIdDice)

  const handleRerollHairColor = useCallback(
    () => dispatch(rerollHairColor(availableHairColorsIdDice)),
    [ dispatch, availableHairColorsIdDice ]
  )

  const handleRerollEyeColor = useCallback(
    () => dispatch(rerollEyeColor(availableEyeColorsIdDice)),
    [ dispatch, availableEyeColorsIdDice ]
  )

  const handleRerollSize = useCallback(
    () => dispatch(rerollSize(randomHeightCalculation)),
    [ dispatch, randomHeightCalculation ]
  )

  const handleRerollWeight = useCallback(
    () => dispatch(rerollWeight(randomWeightCalculation, randomHeightCalculation)),
    [ dispatch, randomWeightCalculation, randomHeightCalculation ]
  )

  return (
    <div className="personal-data">
      <PersonalDataTextField
        label={translate("Family")}
        selector={selectFamily}
        action={setFamily}
        />
      <PersonalDataTextField
        label={translate("Place of Birth")}
        selector={selectPlaceOfBirth}
        action={setPlaceOfBirth}
        />
      <PersonalDataTextField
        label={translate("Date of Birth")}
        selector={selectDateOfBirth}
        action={setDateOfBirth}
        />
      <PersonalDataTextField
        label={translate("Age")}
        selector={selectAge}
        action={setAge}
        validator={validateEmptyOrNaturalNumber}
        />
      <PersonalDataDropdownWithReroll
        label={translate("Hair Color")}
        rerollLabel={translate("Reroll Hair Color")}
        options={hairColorOptions}
        selector={selectPredefinedHairColor}
        action={setPredefinedHairColor}
        onReroll={handleRerollHairColor}
        />
      <PersonalDataDropdownWithReroll
        label={translate("Eye Color")}
        rerollLabel={translate("Reroll Eye Color")}
        options={eyeColorOptions}
        selector={selectPredefinedEyeColor}
        action={setPredefinedEyeColor}
        onReroll={handleRerollEyeColor}
        />
      <PersonalDataTextFieldWithReroll
        label={`${translate("Size")}${heightCalculationString}`}
        rerollLabel={translate("Reroll Size")}
        selector={selectSize}
        action={setSize}
        onReroll={handleRerollSize}
        validator={validateEmptyOrFloat}
        />
      <PersonalDataTextFieldWithReroll
        label={`${translate("Weight")}${weightCalculationString}`}
        rerollLabel={translate("Reroll Weight")}
        selector={selectWeight}
        action={setWeight}
        onReroll={handleRerollWeight}
        validator={validateEmptyOrNaturalNumber}
        />
      <PersonalDataTextField
        label={translate("Title")}
        selector={selectTitle}
        action={setTitle}
        />
      <PersonalDataDropdown
        label={translate("Social Status")}
        selector={selectSocialStatusId}
        action={setSocialStatus}
        options={socialStatusOptions}
        />
      <PersonalDataTextField
        label={translate("Characteristics")}
        selector={selectCharacteristics}
        action={setCharacteristics}
        />
      <PersonalDataTextField
        label={translate("Other Information")}
        selector={selectOtherInfo}
        action={setOtherInfo}
        />
    </div>
  )
}
