import * as React from "react";
import { equals } from "../../../Data/Eq";
import { flength, List } from "../../../Data/List";
import { all, bind, listToMaybe, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { SocialStatusId } from "../../Constants/Ids";
import { PersonalData } from "../../Models/Hero/PersonalData";
import { DropdownOption } from "../../Models/View/DropdownOption";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { renderMaybeWith } from "../../Utilities/ReactUtils";
import { isEmptyOr, isFloat, isNaturalNumber } from "../../Utilities/RegexUtils";
import { Dropdown } from "../Universal/Dropdown";
import { IconButton } from "../Universal/IconButton";
import { InputButtonGroup } from "../Universal/InputButtonGroup";
import { TextField } from "../Universal/TextField";

const PDA = PersonalData.A
const DOA = DropdownOption.A

export interface OverviewPersonalDataOwnProps {
  l10n: L10nRecord
  profile: Record<PersonalData>
  socialStatuses: List<Record<DropdownOption<SocialStatusId>>>
  sizeCalcStr: Maybe<string>
  weightCalcStr: Maybe<string>
  hairColors: List<Record<DropdownOption<number>>>
  eyeColors: List<Record<DropdownOption<number>>>
}

export interface OverviewPersonalDataDispatchProps {
  changeFamily (newText: string): void
  changePlaceOfBirth (newText: string): void
  changeDateOfBirth (newText: string): void
  changeAge (newText: string): void
  changeHaircolor (result: Maybe<number>): void
  changeEyecolor (result: Maybe<number>): void
  changeSize (newText: string): void
  changeWeight (newText: string): void
  changeTitle (newText: string): void
  changeSocialStatus (result: Maybe<SocialStatusId>): void
  changeCharacteristics (newText: string): void
  changeOtherInfo (newText: string): void
  changeCultureAreaKnowledge (newText: string): void
  rerollHair (): void
  rerollEyes (): void
  rerollSize (): void
  rerollWeight (): void
}

export type OverviewPersonalDataProps =
  OverviewPersonalDataDispatchProps
  & OverviewPersonalDataOwnProps

const wrapParenSpace = renderMaybeWith<string> (str => ` (${str})`)

export const OverviewPersonalData: React.FC<OverviewPersonalDataProps> = props => {
  const {
    l10n,
    profile,
    socialStatuses,
    sizeCalcStr,
    weightCalcStr,
    changeFamily,
    changePlaceOfBirth,
    changeDateOfBirth,
    changeAge,
    changeHaircolor,
    changeEyecolor,
    changeSize,
    changeWeight,
    changeTitle,
    changeSocialStatus,
    changeCharacteristics,
    changeOtherInfo,
    changeCultureAreaKnowledge,
    rerollHair,
    rerollEyes,
    rerollSize,
    rerollWeight,
    hairColors,
    eyeColors,
  } = props

  const age = PDA.age (profile)
  const size = PDA.size (profile)
  const weight = PDA.weight (profile)
  const hair_color = PDA.hairColor (profile)

  const is_hcsel_disabled = React.useMemo (
    () => flength (hairColors) === 1
          && equals (hair_color) (bind (listToMaybe (hairColors)) (DOA.id)),
    [ hairColors, hair_color ]
  )

  return (
    <div className="personal-data">
      <div>
        <TextField
          label={translate (l10n) ("family")}
          value={PDA.family (profile)}
          onChange={changeFamily}
          />
      </div>
      <div>
        <TextField
          label={translate (l10n) ("placeofbirth")}
          value={PDA.placeOfBirth (profile)}
          onChange={changePlaceOfBirth}
          />
      </div>
      <div>
        <TextField
          label={translate (l10n) ("dateofbirth")}
          value={PDA.dateOfBirth (profile)}
          onChange={changeDateOfBirth}
          />
      </div>
      <div>
        <TextField
          label={translate (l10n) ("age")}
          value={age}
          onChange={changeAge}
          valid={all (isEmptyOr (isNaturalNumber)) (age)}
          />
      </div>
      <InputButtonGroup className="reroll">
        <Dropdown
          label={translate (l10n) ("haircolor")}
          value={hair_color}
          onChange={changeHaircolor}
          options={hairColors}
          disabled={is_hcsel_disabled}
          />
        <IconButton icon="&#xE913;" onClick={rerollHair} disabled={is_hcsel_disabled} />
      </InputButtonGroup>
      <InputButtonGroup className="reroll">
        <Dropdown
          label={translate (l10n) ("eyecolor")}
          value={PDA.eyeColor (profile)}
          onChange={changeEyecolor}
          options={eyeColors}
          />
        <IconButton icon="&#xE913;" onClick={rerollEyes} />
      </InputButtonGroup>
      <InputButtonGroup className="reroll">
        <TextField
          label={`${translate (l10n) ("size")}${wrapParenSpace (sizeCalcStr)}`}
          value={PDA.size (profile)}
          onChange={changeSize}
          valid={all (isEmptyOr (isFloat)) (size)}
          />
        <IconButton icon="&#xE913;" onClick={rerollSize} />
      </InputButtonGroup>
      <InputButtonGroup className="reroll">
        <TextField
          label={`${translate (l10n) ("weight")}${wrapParenSpace (weightCalcStr)}`}
          value={PDA.weight (profile)}
          onChange={changeWeight}
          valid={all (isEmptyOr (isNaturalNumber)) (weight)}
          />
        <IconButton icon="&#xE913;" onClick={rerollWeight} />
      </InputButtonGroup>
      <div>
        <TextField
          label={translate (l10n) ("title")}
          value={PDA.title (profile)}
          onChange={changeTitle}
          />
      </div>
      <div>
        <Dropdown
          label={translate (l10n) ("socialstatus")}
          value={PDA.socialStatus (profile)}
          onChange={changeSocialStatus}
          options={socialStatuses}
          />
      </div>
      <div>
        <TextField
          label={translate (l10n) ("characteristics")}
          value={PDA.characteristics (profile)}
          onChange={changeCharacteristics}
          />
      </div>
      <div>
        <TextField
          label={translate (l10n) ("otherinfo")}
          value={PDA.otherInfo (profile)}
          onChange={changeOtherInfo}
          />
      </div>
      <div>
        <TextField
          label={translate (l10n) ("cultureareaknowledge")}
          value={PDA.cultureAreaKnowledge (profile)}
          onChange={changeCultureAreaKnowledge}
          />
      </div>
    </div>
  )
}
