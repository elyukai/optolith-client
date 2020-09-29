import * as React from "react"
import { fmap } from "../../../../Data/Functor"
import { List } from "../../../../Data/List"
import { fromMaybe, Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { Sex } from "../../../Models/Hero/heroTypeHelpers"
import { PersonalData } from "../../../Models/Hero/PersonalData"
import { ActiveActivatable } from "../../../Models/View/ActiveActivatable"
import { AdventurePointsCategories } from "../../../Models/View/AdventurePointsCategories"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { Advantage } from "../../../Models/Wiki/Advantage"
import { Culture } from "../../../Models/Wiki/Culture"
import { Disadvantage } from "../../../Models/Wiki/Disadvantage"
import { ExperienceLevel } from "../../../Models/Wiki/ExperienceLevel"
import { Race } from "../../../Models/Wiki/Race"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { DCPair } from "../../../Selectors/derivedCharacteristicsSelectors"
import { compressList } from "../../../Utilities/Activatable/activatableNameUtils"
import { translate } from "../../../Utilities/I18n"
import { pipe_ } from "../../../Utilities/pipe"
import { TextBox } from "../../Universal/TextBox"
import { Sheet } from "../Sheet"
import { SheetWrapper } from "../SheetWrapper"
import { MainSheetAttributes } from "./MainSheetAttributes"
import { MainSheetPersonalData } from "./MainSheetPersonalData"

interface Props {
  advantagesActive: Maybe<List<Record<ActiveActivatable<Advantage>>>>
  ap: Maybe<Record<AdventurePointsCategories>>
  attributes: List<Record<AttributeCombined>>
  avatar: Maybe<string>
  culture: Maybe<Record<Culture>>
  derivedCharacteristics: List<DCPair>
  disadvantagesActive: Maybe<List<Record<ActiveActivatable<Disadvantage>>>>
  el: Maybe<Record<ExperienceLevel>>
  fatePointsModifier: number
  generalsaActive: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  staticData: StaticDataRecord
  name: Maybe<string>
  professionName: Maybe<string>
  profile: Record<PersonalData>
  race: Maybe<Record<Race>>
  sex: Maybe<Sex>
  useParchment: boolean
  printToPDF (): void
  switchUseParchment (): void
}

export const MainSheet: React.FC<Props> = props => {
  const {
    advantagesActive: maybeAdvantagesActive,
    ap,
    avatar,
    attributes,
    culture,
    derivedCharacteristics,
    disadvantagesActive: maybeDisadvantagesActive,
    el,
    fatePointsModifier,
    generalsaActive: maybeGeneralsaActive,
    name,
    professionName,
    profile,
    staticData,
    race,
    sex,
    useParchment,
  } = props

  return (
    <SheetWrapper>
      <Sheet
        id="main-sheet"
        title={translate (staticData) ("sheets.mainsheet.title")}
        attributes={attributes}
        staticData={staticData}
        useParchment={useParchment}
        >
        <MainSheetPersonalData
          ap={ap}
          avatar={avatar}
          culture={culture}
          el={el}
          staticData={staticData}
          name={name}
          professionName={professionName}
          profile={profile}
          race={race}
          sex={sex}
          />
        <div className="lower">
          <div className="lists">
            {pipe_ (
              maybeAdvantagesActive,
              fmap (advantagesActive => (
                <TextBox
                  className="activatable-list"
                  label={translate (staticData) ("sheets.mainsheet.advantages")}
                  value={compressList (staticData) (advantagesActive)}
                  />
              )),
              fromMaybe (null as React.ReactNode)
            )}
            {pipe_ (
              maybeDisadvantagesActive,
              fmap (disadvantagesActive => (
                <TextBox
                  className="activatable-list"
                  label={translate (staticData) ("sheets.mainsheet.disadvantages")}
                  value={compressList (staticData) (disadvantagesActive)}
                  />
              )),
              fromMaybe (null as React.ReactNode)
            )}
            {pipe_ (
              maybeGeneralsaActive,
              fmap (generalsaActive => (
                <TextBox
                  className="activatable-list"
                  label={translate (staticData) ("sheets.mainsheet.generalspecialabilites")}
                  value={compressList (staticData) (generalsaActive)}
                  />
              )),
              fromMaybe (null as React.ReactNode)
            )}
          </div>
          <MainSheetAttributes
            attributes={derivedCharacteristics}
            fatePointsModifier={fatePointsModifier}
            staticData={staticData}
            race={race}
            />
        </div>
      </Sheet>
    </SheetWrapper>
  )
}
