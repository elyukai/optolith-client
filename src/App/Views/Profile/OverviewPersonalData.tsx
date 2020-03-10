import * as React from "react"
import { equals } from "../../../Data/Eq"
import { flength, List } from "../../../Data/List"
import { all, bind, listToMaybe, Maybe, maybeToUndefined } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { SocialStatusId } from "../../Constants/Ids"
import { PersonalData } from "../../Models/Hero/PersonalData"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { renderMaybeWith } from "../../Utilities/ReactUtils"
import { isEmptyOr, isFloat, isNaturalNumber } from "../../Utilities/RegexUtils"
import { Dropdown } from "../Universal/Dropdown"
import { IconButton } from "../Universal/IconButton"
import { InputButtonGroup } from "../Universal/InputButtonGroup"
import { TextFieldLazy } from "../Universal/TextFieldLazy"

const PDA = PersonalData.A
const DOA = DropdownOption.A

export interface OverviewPersonalDataOwnProps {
  staticData: StaticDataRecord
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
    staticData,
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
        <TextFieldLazy
          label={translate (staticData) ("personaldata.family")}
          value={maybeToUndefined (PDA.family (profile))}
          onChange={changeFamily}
          />
      </div>
      <div>
        <TextFieldLazy
          label={translate (staticData) ("personaldata.placeofbirth")}
          value={maybeToUndefined (PDA.placeOfBirth (profile))}
          onChange={changePlaceOfBirth}
          />
      </div>
      <div>
        <TextFieldLazy
          label={translate (staticData) ("personaldata.dateofbirth")}
          value={maybeToUndefined (PDA.dateOfBirth (profile))}
          onChange={changeDateOfBirth}
          />
      </div>
      <div>
        <TextFieldLazy
          label={translate (staticData) ("personaldata.age")}
          value={maybeToUndefined (age)}
          onChange={changeAge}
          valid={all (isEmptyOr (isNaturalNumber)) (age)}
          />
      </div>
      <InputButtonGroup className="reroll">
        <Dropdown
          label={translate (staticData) ("personaldata.haircolor")}
          value={hair_color}
          onChange={changeHaircolor}
          options={hairColors}
          disabled={is_hcsel_disabled}
          />
        <IconButton icon="&#xE913;" onClick={rerollHair} disabled={is_hcsel_disabled} />
      </InputButtonGroup>
      <InputButtonGroup className="reroll">
        <Dropdown
          label={translate (staticData) ("personaldata.eyecolor")}
          value={PDA.eyeColor (profile)}
          onChange={changeEyecolor}
          options={eyeColors}
          />
        <IconButton icon="&#xE913;" onClick={rerollEyes} />
      </InputButtonGroup>
      <InputButtonGroup className="reroll">
        <TextFieldLazy
          label={`${translate (staticData) ("personaldata.size")}${wrapParenSpace (sizeCalcStr)}`}
          value={maybeToUndefined (PDA.size (profile))}
          onChange={changeSize}
          valid={all (isEmptyOr (isFloat)) (size)}
          />
        <IconButton icon="&#xE913;" onClick={rerollSize} />
      </InputButtonGroup>
      <InputButtonGroup className="reroll">
        <TextFieldLazy
          label={
            `${translate (staticData) ("personaldata.weight")}${wrapParenSpace (weightCalcStr)}`
          }
          value={maybeToUndefined (PDA.weight (profile))}
          onChange={changeWeight}
          valid={all (isEmptyOr (isNaturalNumber)) (weight)}
          />
        <IconButton icon="&#xE913;" onClick={rerollWeight} />
      </InputButtonGroup>
      <div>
        <TextFieldLazy
          label={translate (staticData) ("personaldata.rank")}
          value={maybeToUndefined (PDA.title (profile))}
          onChange={changeTitle}
          />
      </div>
      <div>
        <Dropdown
          label={translate (staticData) ("personaldata.socialstatus")}
          value={PDA.socialStatus (profile)}
          onChange={changeSocialStatus}
          options={socialStatuses}
          />
      </div>
      <div>
        <TextFieldLazy
          label={translate (staticData) ("personaldata.characteristics")}
          value={maybeToUndefined (PDA.characteristics (profile))}
          onChange={changeCharacteristics}
          />
      </div>
      <div>
        <TextFieldLazy
          label={translate (staticData) ("personaldata.otherinfo")}
          value={maybeToUndefined (PDA.otherInfo (profile))}
          onChange={changeOtherInfo}
          />
      </div>
      <div>
        <TextFieldLazy
          label={translate (staticData) ("personaldata.cultureareaknowledge")}
          value={maybeToUndefined (PDA.cultureAreaKnowledge (profile))}
          onChange={changeCultureAreaKnowledge}
          />
      </div>
    </div>
  )
}
