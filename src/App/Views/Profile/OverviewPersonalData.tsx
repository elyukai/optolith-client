import * as React from "react";
import { fmap } from "../../../Data/Functor";
import { elem, elemF, List, subscriptF } from "../../../Data/List";
import { all, alt, bind, catMaybes, ensure, fromJust, imapMaybe, isJust, Just, liftM2, Maybe, maybe, or } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { PersonalData } from "../../Models/Hero/PersonalData";
import { Culture } from "../../Models/Wiki/Culture";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { Race } from "../../Models/Wiki/Race";
import { RaceVariant } from "../../Models/Wiki/RaceVariant";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { renderMaybeWith } from "../../Utilities/ReactUtils";
import { isEmptyOr, isFloat, isNaturalNumber } from "../../Utilities/RegexUtils";
import { sortRecordsByName } from "../../Utilities/sortBy";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { IconButton } from "../Universal/IconButton";
import { InputButtonGroup } from "../Universal/InputButtonGroup";
import { TextField } from "../Universal/TextField";

export interface OverviewPersonalDataOwnProps {
  culture: Maybe<Record<Culture>>
  eyecolorTags: List<string>
  haircolorTags: List<string>
  l10n: L10nRecord
  profile: Record<PersonalData>
  race: Maybe<Record<Race>>
  raceVariant: Maybe<Record<RaceVariant>>
  socialstatusTags: List<string>
  isAlbino: Maybe<boolean>
  sizeCalcStr: Maybe<string>
  weightCalcStr: Maybe<string>
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
  changeSocialStatus (result: Maybe<number>): void
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

interface HairColorAndEyeColorOptions {
  hairOptions: List<Record<DropdownOption<number>>>
  eyeOptions: List<Record<DropdownOption<number>>>
}

const wrapParenSpace = renderMaybeWith<string> (str => ` (${str})`)

const getDropdownOption =
  (id: number) => fmap ((name: string) => DropdownOption ({ id: Just (id), name }))

const getHairColorAndEyeColorOptions =
  (l10n: L10nRecord) =>
  (mrace: Maybe<Record<Race>>) =>
  (mrace_var: Maybe<Record<RaceVariant>>) =>
  (hair_color_tags: List<string>) =>
  (eye_color_tags: List<string>) =>
  (mis_albino: Maybe<boolean>): HairColorAndEyeColorOptions => {
    if (or (mis_albino)) {
      return {
        hairOptions: catMaybes (List (pipe_ (
                                       hair_color_tags,
                                       subscriptF (23),
                                       getDropdownOption (24)
                                     ))),
        eyeOptions: pipe_ (
          List (
            pipe_ (eye_color_tags, subscriptF (18), getDropdownOption (19)),
            pipe_ (eye_color_tags, subscriptF (19), getDropdownOption (20))
          ),
          catMaybes,
          sortRecordsByName (L10n.A.id (l10n))
        ),
      }
    }

    if (isJust (mrace)) {
      const race = fromJust (mrace)
      const raceHairColors = Race.A.hairColors (race)
      const raceEyeColors = Race.A.eyeColors (race)

      const raceVariantHairColors =
        bind (mrace_var) (RaceVariant.A.hairColors)

      const raceVariantEyeColors =
        bind (mrace_var) (RaceVariant.A.eyeColors)

      const hairColors = alt (raceHairColors) (raceVariantHairColors)
      const eyeColors = alt (raceEyeColors) (raceVariantEyeColors)

      return {
        hairOptions: pipe_ (
          hair_color_tags,
          imapMaybe (index => (name: string) =>
                      ensure<Record<DropdownOption<number>>>
                        (pipe (
                          DropdownOption.A.id,
                          id => or (liftM2 (elem as elem<number>) (id) (hairColors))
                        ))
                        (DropdownOption ({ id: Just (index + 1), name }))),
          sortRecordsByName (l10n)
        ),
        eyeOptions: pipe_ (
          eye_color_tags,
          imapMaybe (index => (name: string) =>
                      ensure<Record<DropdownOption<number>>>
                        (pipe (
                          DropdownOption.A.id,
                          id => or (liftM2 (elem as elem<number>) (id) (eyeColors))
                        ))
                        (DropdownOption ({ id: Just (index + 1), name }))),
          sortRecordsByName (L10n.A.id (l10n))
        ),
      }
    }

    return {
      hairOptions: List (),
      eyeOptions: List (),
    }
  }

export const OverviewPersonalData: React.FC<OverviewPersonalDataProps> = props => {
  const {
    culture: mculture,
    eyecolorTags,
    haircolorTags,
    l10n,
    profile,
    race,
    raceVariant,
    socialstatusTags,
    isAlbino,
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
  } = props

  const hairAndEyeColorOptions = getHairColorAndEyeColorOptions (l10n)
                                                                (race)
                                                                (raceVariant)
                                                                (haircolorTags)
                                                                (eyecolorTags)
                                                                (isAlbino)

  const socialOptions =
    maybe (List<Record<DropdownOption<number>>> ())
          ((culture: Record<Culture>) =>
            imapMaybe (index => (name: string) =>
                        ensure<Record<DropdownOption<number>>>
                          (pipe (
                            DropdownOption.A.id,
                            fmap (elemF (Culture.A.socialStatus (culture))),
                            or
                          ))
                          (DropdownOption ({ id: Just (index + 1), name })))
                      (socialstatusTags))
          (mculture)

  const age = PersonalData.A.age (profile)
  const size = PersonalData.A.size (profile)
  const weight = PersonalData.A.weight (profile)

  return (
    <div className="personal-data">
      <div>
        <TextField
          label={translate (l10n) ("family")}
          value={PersonalData.A.family (profile)}
          onChange={changeFamily}
          />
      </div>
      <div>
        <TextField
          label={translate (l10n) ("placeofbirth")}
          value={PersonalData.A.placeOfBirth (profile)}
          onChange={changePlaceOfBirth}
          />
      </div>
      <div>
        <TextField
          label={translate (l10n) ("dateofbirth")}
          value={PersonalData.A.dateOfBirth (profile)}
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
          value={PersonalData.A.hairColor (profile)}
          onChange={changeHaircolor}
          options={hairAndEyeColorOptions.hairOptions}
          disabled={isAlbino}
          />
        <IconButton icon="&#xE913;" onClick={rerollHair} disabled={isAlbino} />
      </InputButtonGroup>
      <InputButtonGroup className="reroll">
        <Dropdown
          label={translate (l10n) ("eyecolor")}
          value={PersonalData.A.eyeColor (profile)}
          onChange={changeEyecolor}
          options={hairAndEyeColorOptions.eyeOptions}
          />
        <IconButton icon="&#xE913;" onClick={rerollEyes} />
      </InputButtonGroup>
      <InputButtonGroup className="reroll">
        <TextField
          label={`${translate (l10n) ("size")}${wrapParenSpace (sizeCalcStr)}`}
          value={PersonalData.A.size (profile)}
          onChange={changeSize}
          valid={all (isEmptyOr (isFloat)) (size)}
          />
        <IconButton icon="&#xE913;" onClick={rerollSize} />
      </InputButtonGroup>
      <InputButtonGroup className="reroll">
        <TextField
          label={`${translate (l10n) ("weight")}${wrapParenSpace (weightCalcStr)}`}
          value={PersonalData.A.weight (profile)}
          onChange={changeWeight}
          valid={all (isEmptyOr (isNaturalNumber)) (weight)}
          />
        <IconButton icon="&#xE913;" onClick={rerollWeight} />
      </InputButtonGroup>
      <div>
        <TextField
          label={translate (l10n) ("title")}
          value={PersonalData.A.title (profile)}
          onChange={changeTitle}
          />
      </div>
      <div>
        <Dropdown
          label={translate (l10n) ("socialstatus")}
          value={PersonalData.A.socialStatus (profile)}
          onChange={changeSocialStatus}
          options={socialOptions}
          />
      </div>
      <div>
        <TextField
          label={translate (l10n) ("characteristics")}
          value={PersonalData.A.characteristics (profile)}
          onChange={changeCharacteristics}
          />
      </div>
      <div>
        <TextField
          label={translate (l10n) ("otherinfo")}
          value={PersonalData.A.otherInfo (profile)}
          onChange={changeOtherInfo}
          />
      </div>
      <div>
        <TextField
          label={translate (l10n) ("cultureareaknowledge")}
          value={PersonalData.A.cultureAreaKnowledge (profile)}
          onChange={changeCultureAreaKnowledge}
          />
      </div>
    </div>
  )
}
