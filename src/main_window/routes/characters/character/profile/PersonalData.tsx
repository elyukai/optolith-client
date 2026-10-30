import { isEmptyOr, isFloat, isNaturalNumber } from "@elyukai/utils/string/regex"
import type { FC } from "react"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { SharedActions, SharedState } from "../../../../external.ts"
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

  return (
    <div className="personal-data">
      <PersonalDataTextField
        label={translate("Family")}
        value={SharedState.family}
        action={SharedActions.setFamily}
      />
      <PersonalDataTextField
        label={translate("Place of Birth")}
        value={SharedState.placeOfBirth}
        action={SharedActions.setPlaceOfBirth}
      />
      <PersonalDataTextField
        label={translate("Date of Birth")}
        value={SharedState.dateOfBirth}
        action={SharedActions.setDateOfBirth}
      />
      <PersonalDataTextField
        label={translate("Age")}
        value={SharedState.age}
        action={SharedActions.setAge}
        validator={validateEmptyOrNaturalNumber}
      />
      <PersonalDataDropdownWithReroll
        label={translate("Hair Color")}
        rerollLabel={translate("Reroll Hair Color")}
        options={SharedState.availableHairColors}
        value={SharedState.predefinedHairColor}
        action={SharedActions.setPredefinedHairColor}
        onReroll={() => SharedActions.rerollHairColor()}
      />
      <PersonalDataDropdownWithReroll
        label={translate("Eye Color")}
        rerollLabel={translate("Reroll Eye Color")}
        options={SharedState.availableEyeColors}
        value={SharedState.predefinedEyeColor}
        action={SharedActions.setPredefinedEyeColor}
        onReroll={() => SharedActions.rerollEyeColor()}
      />
      <PersonalDataTextFieldWithReroll
        label={`${translate("Size")}${SharedState.randomHeightCalculationString}`}
        rerollLabel={translate("Reroll Size")}
        value={SharedState.size}
        action={SharedActions.setSize}
        onReroll={() => SharedActions.rerollSize()}
        validator={validateEmptyOrFloat}
      />
      <PersonalDataTextFieldWithReroll
        label={`${translate("Weight")}${SharedState.randomWeightCalculationString}`}
        rerollLabel={translate("Reroll Weight")}
        value={SharedState.weight}
        action={SharedActions.setWeight}
        onReroll={() => SharedActions.rerollWeight()}
        validator={validateEmptyOrNaturalNumber}
      />
      <PersonalDataTextField
        label={translate("Title")}
        value={SharedState.title}
        action={SharedActions.setTitle}
      />
      <PersonalDataDropdown
        label={translate("Social Status")}
        value={SharedState.socialStatus}
        action={SharedActions.setSocialStatus}
        options={SharedState.availableSocialStatuses}
      />
      <PersonalDataTextField
        label={translate("Characteristics")}
        value={SharedState.characteristics}
        action={SharedActions.setCharacteristics}
      />
      <PersonalDataTextField
        label={translate("Other Information")}
        value={SharedState.otherInfo}
        action={SharedActions.setOtherInfo}
      />
    </div>
  )
}
