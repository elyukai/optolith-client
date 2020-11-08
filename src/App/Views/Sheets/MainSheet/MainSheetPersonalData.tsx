import * as React from "react"
import { fmap, fmapF } from "../../../../Data/Functor"
import { bindF, Just, Maybe, maybeRNullF } from "../../../../Data/Maybe"
import { lookupF } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Sex } from "../../../Models/Hero/heroTypeHelpers"
import { PersonalData } from "../../../Models/Hero/PersonalData"
import { NumIdName } from "../../../Models/NumIdName"
import { AdventurePointsCategories } from "../../../Models/View/AdventurePointsCategories"
import { Culture } from "../../../Models/Wiki/Culture"
import { ExperienceLevel } from "../../../Models/Wiki/ExperienceLevel"
import { Race } from "../../../Models/Wiki/Race"
import { StaticData, StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { localizeSize, localizeWeight, translate } from "../../../Utilities/I18n"
import { toInt } from "../../../Utilities/NumberUtils"
import { pipe_ } from "../../../Utilities/pipe"
import { Avatar } from "../../Universal/Avatar"
import { LabelBox } from "../../Universal/LabelBox"
import { Plain } from "../../Universal/Plain"

const SDA = StaticData.A
const PDA = PersonalData.A
const NINA = NumIdName.A

interface Props {
  ap: Maybe<Record<AdventurePointsCategories>>
  avatar: Maybe<string>
  culture: Maybe<Record<Culture>>
  el: Maybe<Record<ExperienceLevel>>
  staticData: StaticDataRecord
  name: Maybe<string>
  professionName: Maybe<string>
  profile: Record<PersonalData>
  race: Maybe<Record<Race>>
  sex: Maybe<Sex>
}

export const MainSheetPersonalData: React.FC<Props> = props => {
  const {
    ap,
    avatar: maybeAvatar,
    culture: maybeCulture,
    el: maybeExperienceLevel,
    staticData,
    name,
    professionName,
    profile,
    race: maybeRace,
    sex,
  } = props

  const raceName = fmapF (maybeRace) (Race.A.name)
  const cultureName = fmapF (maybeCulture) (Culture.A.name)

  const haircolorName =
    pipe_ (
      profile,
      PDA.hairColor,
      bindF (lookupF (SDA.hairColors (staticData))),
      fmap (NINA.name)
    )

  const eyecolorName =
    pipe_ (
      profile,
      PDA.eyeColor,
      bindF (lookupF (SDA.eyeColors (staticData))),
      fmap (NINA.name)
    )

  const socialstatusName =
    pipe_ (
      profile,
      PDA.socialStatus,
      bindF (lookupF (SDA.socialStatuses (staticData))),
      fmap (NINA.name)
    )

  return (
    <div className="upper">
      <div className="info">
        <Plain
          className="name"
          label={translate (staticData) ("sheets.mainsheet.name")}
          value={name}
          />
        <Plain
          className="family"
          label={translate (staticData) ("sheets.mainsheet.family")}
          value={PDA.family (profile)}
          />
        <Plain
          className="placeofbirth"
          label={translate (staticData) ("sheets.mainsheet.placeofbirth")}
          value={PDA.placeOfBirth (profile)}
          />
        <Plain
          className="dateofbirth"
          label={translate (staticData) ("sheets.mainsheet.dateofbirth")}
          value={PDA.dateOfBirth (profile)}
          />
        <Plain
          className="age"
          label={translate (staticData) ("sheets.mainsheet.age")}
          value={PDA.age (profile)}
          />
        <Plain
          className="sex"
          label={translate (staticData) ("sheets.mainsheet.sex")}
          value={sex}
          />
        <Plain
          className="race"
          label={translate (staticData) ("sheets.mainsheet.race")}
          value={raceName}
          />
        <Plain
          className="size"
          label={translate (staticData) ("sheets.mainsheet.size")}
          value={pipe_ (
            profile,
            PDA.size,
            bindF (toInt),
            fmap (localizeSize (staticData))
          )}
          />
        <Plain
          className="weight"
          label={translate (staticData) ("sheets.mainsheet.weight")}
          value={pipe_ (
            profile,
            PDA.weight,
            bindF (toInt),
            fmap (localizeWeight (staticData))
          )}
          />
        <Plain
          className="haircolor"
          label={translate (staticData) ("sheets.mainsheet.haircolor")}
          value={haircolorName}
          />
        <Plain
          className="eyecolor"
          label={translate (staticData) ("sheets.mainsheet.eyecolor")}
          value={eyecolorName}
          />
        <Plain
          className="culture"
          label={translate (staticData) ("sheets.mainsheet.culture")}
          value={cultureName}
          />
        <Plain
          className="socialstatus"
          label={translate (staticData) ("sheets.mainsheet.socialstatus")}
          value={socialstatusName}
          />
        <Plain
          className="profession"
          label={translate (staticData) ("sheets.mainsheet.profession")}
          value={professionName}
          />
        <Plain
          className="title"
          label={translate (staticData) ("sheets.mainsheet.rank")}
          value={PDA.title (profile)}
          />
        <Plain
          className="characteristics"
          label={translate (staticData) ("sheets.mainsheet.characteristics")}
          value={PDA.characteristics (profile)}
          />
        <Plain
          className="otherinfo"
          label={translate (staticData) ("sheets.mainsheet.otherinfo")}
          value={PDA.otherInfo (profile)}
          multi
          />
      </div>
      <div className="ap-portrait">
        <LabelBox
          className="el"
          label={translate (staticData) ("sheets.mainsheet.experiencelevellabel")}
          value={fmapF (maybeExperienceLevel) (ExperienceLevel.A.name)}
          />
        <LabelBox
          className="ap-total"
          label={translate (staticData) ("sheets.mainsheet.totalaplabel")}
          value={fmapF (ap) (AdventurePointsCategories.A.total)}
          />
        <LabelBox
          className="portrait"
          label={translate (staticData) ("sheets.mainsheet.avatarlabel")}
          >
          {maybeRNullF (maybeAvatar) (avatar => <Avatar src={Just (avatar)} img />)}
        </LabelBox>
        <LabelBox
          className="ap-available"
          label={translate (staticData) ("sheets.mainsheet.apcollectedlabel")}
          value={fmapF (ap) (AdventurePointsCategories.A.available)}
          />
        <LabelBox
          className="ap-used"
          label={translate (staticData) ("sheets.mainsheet.apspentlabel")}
          value={fmapF (ap) (AdventurePointsCategories.A.spent)}
          />
      </div>
    </div>
  )
}
