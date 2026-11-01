import { isEmptyOr, isFloat, isNaturalNumber } from "@elyukai/utils/string/regex"
import type { FC } from "react"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { PersonalDataDropdown } from "./PersonalDataDropdown.tsx"
import { PersonalDataDropdownWithReroll } from "./PersonalDataDropdownWithReroll.tsx"
import { PersonalDataTextField } from "./PersonalDataTextField.tsx"
import { PersonalDataTextFieldWithReroll } from "./PersonalDataTextFieldWithReroll.tsx"

const validateEmptyOrNaturalNumber = (value: string | undefined) =>
  value === undefined || isEmptyOr(isNaturalNumber, value)

const validateEmptyOrFloat = (value: string | undefined) =>
  value === undefined || isEmptyOr(isFloat, value)

/**
 * Returns a page for managing personal data of the character.
 */
export const PersonalData: FC = () => {
  const translate = useTranslate()

  const state = useCharacterState()
  const actions = useCharacterActions()

  return (
    <div className="personal-data">
      <PersonalDataTextField
        label={translate("Family")}
        value={state.family}
        action={actions.setFamily}
      />
      <PersonalDataTextField
        label={translate("Place of Birth")}
        value={state.placeOfBirth}
        action={actions.setPlaceOfBirth}
      />
      <PersonalDataTextField
        label={translate("Date of Birth")}
        value={state.dateOfBirth}
        action={actions.setDateOfBirth}
      />
      <PersonalDataTextField
        label={translate("Age")}
        value={state.age}
        action={actions.setAge}
        validator={validateEmptyOrNaturalNumber}
      />
      <PersonalDataDropdownWithReroll
        label={translate("Hair Color")}
        rerollLabel={translate("Reroll Hair Color")}
        options={state.availableHairColors}
        value={state.predefinedHairColor}
        action={actions.setPredefinedHairColor}
        onReroll={() => actions.rerollHairColor()}
      />
      <PersonalDataDropdownWithReroll
        label={translate("Eye Color")}
        rerollLabel={translate("Reroll Eye Color")}
        options={state.availableEyeColors}
        value={state.predefinedEyeColor}
        action={actions.setPredefinedEyeColor}
        onReroll={() => actions.rerollEyeColor()}
      />
      <PersonalDataTextFieldWithReroll
        label={`${translate("Size")}${state.randomHeightCalculationString}`}
        rerollLabel={translate("Reroll Size")}
        value={state.size}
        action={actions.setSize}
        onReroll={() => actions.rerollSize()}
        validator={validateEmptyOrFloat}
      />
      <PersonalDataTextFieldWithReroll
        label={`${translate("Weight")}${state.randomWeightCalculationString}`}
        rerollLabel={translate("Reroll Weight")}
        value={state.weight}
        action={actions.setWeight}
        onReroll={() => actions.rerollWeight()}
        validator={validateEmptyOrNaturalNumber}
      />
      <PersonalDataTextField
        label={translate("Title")}
        value={state.title}
        action={actions.setTitle}
      />
      <PersonalDataDropdown
        label={translate("Social Status")}
        value={state.socialStatus}
        action={actions.setSocialStatus}
        options={state.availableSocialStatuses}
      />
      <PersonalDataTextField
        label={translate("Characteristics")}
        value={state.characteristics}
        action={actions.setCharacteristics}
      />
      <PersonalDataTextField
        label={translate("Other Information")}
        value={state.otherInfo}
        action={actions.setOtherInfo}
      />
    </div>
  )
}
