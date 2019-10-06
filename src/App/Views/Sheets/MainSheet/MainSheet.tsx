import * as React from "react";
import { fmap } from "../../../../Data/Functor";
import { List } from "../../../../Data/List";
import { fromMaybe, Maybe } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { Sex } from "../../../Models/Hero/heroTypeHelpers";
import { PersonalData } from "../../../Models/Hero/PersonalData";
import { ActiveActivatable } from "../../../Models/View/ActiveActivatable";
import { AdventurePointsCategories } from "../../../Models/View/AdventurePointsCategories";
import { AttributeCombined } from "../../../Models/View/AttributeCombined";
import { DerivedCharacteristic } from "../../../Models/View/DerivedCharacteristic";
import { Advantage } from "../../../Models/Wiki/Advantage";
import { Culture } from "../../../Models/Wiki/Culture";
import { Disadvantage } from "../../../Models/Wiki/Disadvantage";
import { ExperienceLevel } from "../../../Models/Wiki/ExperienceLevel";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { Race } from "../../../Models/Wiki/Race";
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { compressList } from "../../../Utilities/Activatable/activatableNameUtils";
import { translate } from "../../../Utilities/I18n";
import { pipe_ } from "../../../Utilities/pipe";
import { BorderButton } from "../../Universal/BorderButton";
import { Options } from "../../Universal/Options";
import { TextBox } from "../../Universal/TextBox";
import { Sheet } from "../Sheet";
import { SheetWrapper } from "../SheetWrapper";
import { MainSheetAttributes } from "./MainSheetAttributes";
import { MainSheetPersonalData } from "./MainSheetPersonalData";

export interface MainSheetProps {
  advantagesActive: Maybe<List<Record<ActiveActivatable<Advantage>>>>
  ap: Maybe<Record<AdventurePointsCategories>>
  attributes: List<Record<AttributeCombined>>
  avatar: Maybe<string>
  culture: Maybe<Record<Culture>>
  derivedCharacteristics: List<Record<DerivedCharacteristic>>
  disadvantagesActive: Maybe<List<Record<ActiveActivatable<Disadvantage>>>>
  el: Maybe<Record<ExperienceLevel>>
  fatePointsModifier: number
  generalsaActive: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  l10n: L10nRecord
  name: Maybe<string>
  professionName: Maybe<string>
  profile: Maybe<Record<PersonalData>>
  race: Maybe<Record<Race>>
  sex: Maybe<Sex>
  printToPDF (): void
}

export function MainSheet (props: MainSheetProps) {
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
    l10n,
    printToPDF,
    race,
    sex,
  } = props

  return (
    <SheetWrapper>
      <Options>
        <BorderButton
          className="print-document"
          label={translate (l10n) ("printtopdf")}
          onClick={printToPDF}
          />
      </Options>
      <Sheet
        id="main-sheet"
        title={translate (l10n) ("personaldata")}
        attributes={attributes}
        l10n={l10n}
        >
        <MainSheetPersonalData
          ap={ap}
          avatar={avatar}
          culture={culture}
          el={el}
          eyeColorTags={translate (l10n) ("eyecolors")}
          hairColorTags={translate (l10n) ("haircolors")}
          l10n={l10n}
          name={name}
          professionName={professionName}
          profile={profile}
          race={race}
          sex={sex}
          socialstatusTags={translate (l10n) ("socialstatuses")}
          />
        <div className="lower">
          <div className="lists">
            {pipe_ (
              maybeAdvantagesActive,
              fmap (advantagesActive => (
                <TextBox
                  className="activatable-list"
                  label={translate (l10n) ("advantages")}
                  value={compressList (l10n) (advantagesActive)}
                  />
              )),
              fromMaybe (null as React.ReactNode)
            )}
            {pipe_ (
              maybeDisadvantagesActive,
              fmap (disadvantagesActive => (
                <TextBox
                  className="activatable-list"
                  label={translate (l10n) ("disadvantages")}
                  value={compressList (l10n) (disadvantagesActive)}
                  />
              )),
              fromMaybe (null as React.ReactNode)
            )}
            {pipe_ (
              maybeGeneralsaActive,
              fmap (generalsaActive => (
                <TextBox
                  className="activatable-list"
                  label={translate (l10n) ("generalspecialabilites")}
                  value={compressList (l10n) (generalsaActive)}
                  />
              )),
              fromMaybe (null as React.ReactNode)
            )}
          </div>
          <MainSheetAttributes
            attributes={derivedCharacteristics}
            fatePointsModifier={fatePointsModifier}
            l10n={l10n}
            race={race}
            />
        </div>
      </Sheet>
    </SheetWrapper>
  )
}
