import * as React from "react";
import { fmapF } from "../../../../Data/Functor";
import { List, subscript } from "../../../../Data/List";
import { bind, bindF, Maybe } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { Sex } from "../../../Models/Hero/heroTypeHelpers";
import { PersonalData } from "../../../Models/Hero/PersonalData";
import { AdventurePointsCategories } from "../../../Models/View/AdventurePointsCategories";
import { Culture } from "../../../Models/Wiki/Culture";
import { ExperienceLevel } from "../../../Models/Wiki/ExperienceLevel";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { Race } from "../../../Models/Wiki/Race";
import { translate } from "../../../Utilities/I18n";
import { dec } from "../../../Utilities/mathUtils";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { Avatar } from "../../Universal/Avatar";
import { LabelBox } from "../../Universal/LabelBox";
import { Plain } from "../../Universal/Plain";

export interface MainSheetPersonalDataProps {
  ap: Maybe<Record<AdventurePointsCategories>>
  avatar: Maybe<string>
  culture: Maybe<Record<Culture>>
  el: Maybe<Record<ExperienceLevel>>
  eyeColorTags: List<string>
  hairColorTags: List<string>
  l10n: L10nRecord
  name: Maybe<string>
  professionName: Maybe<string>
  profile: Maybe<Record<PersonalData>>
  race: Maybe<Record<Race>>
  sex: Maybe<Sex>
  socialstatusTags: List<string>
}

export function MainSheetPersonalData (props: MainSheetPersonalDataProps) {
  const {
    ap,
    avatar,
    culture: maybeCulture,
    el: maybeExperienceLevel,
    eyeColorTags,
    hairColorTags,
    l10n,
    name,
    professionName,
    profile: maybeProfile,
    race: maybeRace,
    sex,
    socialstatusTags,
  } = props

  const raceName = fmapF (maybeRace) (Race.A.name)
  const cultureName = fmapF (maybeCulture) (Culture.A.name)

  const haircolorName =
    pipe_ (
      maybeProfile,
      bindF (PersonalData.A.hairColor),
      bindF (pipe (dec, subscript (hairColorTags)))
    )

  const eyecolorName =
    pipe_ (
      maybeProfile,
      bindF (PersonalData.A.eyeColor),
      bindF (pipe (dec, subscript (eyeColorTags)))
    )

  const socialstatusName =
    pipe_ (
      maybeProfile,
      bindF (PersonalData.A.socialStatus),
      bindF (pipe (dec, subscript (socialstatusTags)))
    )

  return (
    <div className="upper">
      <div className="info">
        <Plain
          className="name"
          label={translate (l10n) ("name")}
          value={name}
          />
        <Plain
          className="family"
          label={translate (l10n) ("family")}
          value={bind (maybeProfile) (PersonalData.A.family)}
          />
        <Plain
          className="placeofbirth"
          label={translate (l10n) ("placeofbirth")}
          value={bind (maybeProfile) (PersonalData.A.placeOfBirth)}
          />
        <Plain
          className="dateofbirth"
          label={translate (l10n) ("dateofbirth")}
          value={bind (maybeProfile) (PersonalData.A.dateOfBirth)}
          />
        <Plain
          className="age"
          label={translate (l10n) ("age")}
          value={bind (maybeProfile) (PersonalData.A.age)}
          />
        <Plain
          className="sex"
          label={translate (l10n) ("sex")}
          value={sex}
          />
        <Plain
          className="race"
          label={translate (l10n) ("race")}
          value={raceName}
          />
        <Plain
          className="size"
          label={translate (l10n) ("size")}
          value={bind (maybeProfile) (PersonalData.A.size)}
          />
        <Plain
          className="weight"
          label={translate (l10n) ("weight")}
          value={bind (maybeProfile) (PersonalData.A.weight)}
          />
        <Plain
          className="haircolor"
          label={translate (l10n) ("haircolor")}
          value={haircolorName}
          />
        <Plain
          className="eyecolor"
          label={translate (l10n) ("eyecolor")}
          value={eyecolorName}
          />
        <Plain
          className="culture"
          label={translate (l10n) ("culture")}
          value={cultureName}
          />
        <Plain
          className="socialstatus"
          label={translate (l10n) ("socialstatus")}
          value={socialstatusName}
          />
        <Plain
          className="profession"
          label={translate (l10n) ("profession")}
          value={professionName}
          />
        <Plain
          className="title"
          label={translate (l10n) ("title")}
          value={bind (maybeProfile) (PersonalData.A.title)}
          />
        <Plain
          className="characteristics"
          label={translate (l10n) ("characteristics")}
          value={bind (maybeProfile) (PersonalData.A.characteristics)}
          />
        <Plain
          className="otherinfo"
          label={translate (l10n) ("otherinfo")}
          value={bind (maybeProfile) (PersonalData.A.otherInfo)}
          multi />
      </div>
      <div className="ap-portrait">
        <LabelBox
          className="el"
          label={translate (l10n) ("experiencelevel")}
          value={fmapF (maybeExperienceLevel) (ExperienceLevel.A.name)}
          />
        <LabelBox
          className="ap-total"
          label={translate (l10n) ("totalap")}
          value={fmapF (ap) (AdventurePointsCategories.A.total)}
          />
        <LabelBox
          className="portrait"
          label={translate (l10n) ("avatar")}
          >
          <Avatar src={avatar} img />
        </LabelBox>
        <LabelBox
          className="ap-available"
          label={translate (l10n) ("apcollected")}
          value={fmapF (ap) (AdventurePointsCategories.A.available)}
          />
        <LabelBox
          className="ap-used"
          label={translate (l10n) ("apspent")}
          value={fmapF (ap) (AdventurePointsCategories.A.spent)}
          />
      </div>
    </div>
  )
}
