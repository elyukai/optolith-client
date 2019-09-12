import * as React from "react";
import { fmap } from "../../../Data/Functor";
import { List } from "../../../Data/List";
import { any, isNothing, Maybe, maybe, maybeRNull } from "../../../Data/Maybe";
import { gt, lt } from "../../../Data/Num";
import { Record } from "../../../Data/Record";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { PersonalData } from "../../Models/Hero/PersonalData";
import { ActiveActivatable } from "../../Models/View/ActiveActivatable";
import { Advantage } from "../../Models/Wiki/Advantage";
import { Culture } from "../../Models/Wiki/Culture";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Profession } from "../../Models/Wiki/Profession";
import { Race } from "../../Models/Wiki/Race";
import { RaceVariant } from "../../Models/Wiki/RaceVariant";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { renderMaybe, renderMaybeWith } from "../../Utilities/ReactUtils";
import { ActivatableTextList } from "../Activatable/ActivatableTextList";
import { AvatarChange } from "../Universal/AvatarChange";
import { AvatarWrapper } from "../Universal/AvatarWrapper";
import { BorderButton } from "../Universal/BorderButton";
import { EditText } from "../Universal/EditText";
import { IconButton } from "../Universal/IconButton";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { VerticalList } from "../Universal/VerticalList";
import { OverviewAddAP } from "./OverviewAddAP";
import { OverviewPersonalData, OverviewPersonalDataDispatchProps } from "./OverviewPersonalData";
import { ProfessionId } from "../../Constants/Ids";

export interface PersonalDataOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface PersonalDataStateProps {
  apLeft: Maybe<number>
  apTotal: Maybe<number>
  advantages: Maybe<List<Record<ActiveActivatable<Advantage>>>>
  avatar: Maybe<string>
  culture: Maybe<Record<Culture>>
  currentEl: Maybe<Record<ExperienceLevel>>
  disadvantages: Maybe<List<Record<ActiveActivatable<Disadvantage>>>>
  name: Maybe<string>
  phase: Maybe<number>
  profession: Maybe<Record<Profession>>
  professionName: Maybe<string>
  fullProfessionName: Maybe<string>
  profile: Maybe<Record<PersonalData>>
  race: Maybe<Record<Race>>
  raceVariant: Maybe<Record<RaceVariant>>
  sex: Maybe<Sex>
  isRemovingEnabled: boolean
  isAddAdventurePointsOpen: boolean
  isEditCharacterAvatarOpen: boolean
  isAlbino: Maybe<boolean>
  sizeCalcStr: Maybe<string>
  weightCalcStr: Maybe<string>
}

export interface PersonalDataDispatchProps extends OverviewPersonalDataDispatchProps {
  setAvatar (path: string): void
  deleteAvatar (): void
  setHeroName (name: string): void
  setCustomProfessionName (name: string): void
  endCharacterCreation (): void
  addAdventurePoints (ap: number): void
  openAddAdventurePoints (): void
  closeAddAdventurePoints (): void
  openEditCharacterAvatar (): void
  closeEditCharacterAvatar (): void
}

export type PersonalDataProps =
  PersonalDataStateProps
  & PersonalDataDispatchProps
  & PersonalDataOwnProps

export interface PersonalDataState {
  editName: boolean
  editProfessionName: boolean
}

export class PersonalDataView extends React.Component<PersonalDataProps, PersonalDataState> {
  state = {
    editName: false,
    editProfessionName: false,
  }

  changeName = (name: string) => {
    const { setHeroName } = this.props
    setHeroName (name)
    this.setState ({ editName: false })
  }

  changeProfessionName = (name: string) => {
    const { setCustomProfessionName } = this.props
    setCustomProfessionName (name)
    this.setState ({ editProfessionName: false })
  }

  handleNameUpdate = () => this.setState ({ editName: true })

  editNameCancel = () => this.setState ({ editName: false })

  handleProfessionNameUpdate = () => this.setState ({ editProfessionName: true })

  editProfessionNameCancel = () => this.setState ({ editProfessionName: false })

  render () {
    const {
      advantages: maybeAdvantages,
      avatar,
      apLeft,
      apTotal,
      culture,
      currentEl,
      disadvantages: maybeDisadvantages,
      endCharacterCreation,
      l10n,
      name,
      phase,
      profession,
      professionName,
      fullProfessionName,
      profile: maybeProfile,
      race,
      raceVariant,
      sex: maybeSex,
      isAddAdventurePointsOpen,
      isEditCharacterAvatarOpen,
      openAddAdventurePoints,
      openEditCharacterAvatar,
      closeAddAdventurePoints,
      closeEditCharacterAvatar,
      setAvatar,
      deleteAvatar,
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
      isAlbino,
      sizeCalcStr,
      weightCalcStr,
      isRemovingEnabled,
      addAdventurePoints,
    } = this.props

    const {
      editName,
      editProfessionName,
    } = this.state

    const isOwnProfession =
      pipe_ (
        profession,
        fmap (Profession.A.id),
        Maybe.elem<string> (ProfessionId.CustomProfession)
      )

    const isProfessionUndefined = isNothing (profession)

    const nameElement = editName ? (
      <EditText
        className="change-name"
        cancel={this.editNameCancel}
        submit={this.changeName}
        text={renderMaybe (name)}
        autoFocus
        />
    ) : (
      <h1 className="confirm-edit">
        {renderMaybe (name)}
        <IconButton icon="&#xE90c;" onClick={this.handleNameUpdate} />
      </h1>
    )

    const professionNameElement =
      any (gt (1)) (phase) && isOwnProfession
        ? (editProfessionName
          ? (
            <EditText
              cancel={this.editProfessionNameCancel}
              submit={this.changeProfessionName}
              text={renderMaybe (professionName)}
              />
          )
          : (
            <BorderButton
              className="edit-profession-name-btn"
              label={translate (l10n) ("editprofessionname")}
              onClick={this.handleProfessionNameUpdate}
              />
          ))
        : null

    return maybe (<></>)
                 ((profile: Record<PersonalData>) => (
                   <Page id="personal-data">
                     <Scroll className="text">
                       <div className="title-wrapper">
                         <AvatarWrapper src={avatar} onClick={openEditCharacterAvatar} />
                         <div className="text-wrapper">
                           {nameElement}
                           {
                             isProfessionUndefined
                             ? null
                             : (
                               <VerticalList className="rcp">
                                 {
                                   maybe (<></>)
                                         ((sex: Sex) => (
                                             <span>
                                               {translate (l10n)
                                                          (sex === "m" ? "male" : "female")}
                                             </span>
                                           ))
                                         (maybeSex)
                                 }
                                 <span className="race">
                                   {renderMaybeWith (Race.A.name) (race)}
                                   {renderMaybeWith (pipe (
                                                      RaceVariant.A.name,
                                                      str => ` (${str})`
                                                    ))
                                                    (raceVariant)}
                                 </span>
                                 <span className="culture">
                                   {renderMaybeWith (Culture.A.name) (culture)}
                                 </span>
                                 <span className="profession">
                                   {renderMaybe (fullProfessionName)}
                                 </span>
                               </VerticalList>
                             )
                           }
                           <VerticalList className="el">
                             <span>
                               {renderMaybeWith (ExperienceLevel.A.name) (currentEl)}
                             </span>
                             <span>
                               {Maybe.sum (apTotal)}
                               {" "}
                               {translate (l10n) ("adventurepoints.short")}
                             </span>
                           </VerticalList>
                         </div>
                       </div>
                       <div className="main-profile-actions">
                         {
                           Maybe.elem (3) (phase)
                             ? (
                                 <BorderButton
                                   className="add-ap"
                                   label={translate (l10n) ("addadventurepoints")}
                                   onClick={openAddAdventurePoints}
                                   />
                               )
                             : null
                         }
                         <BorderButton
                           className="delete-avatar"
                           label={translate (l10n) ("deleteavatar")}
                           onClick={deleteAvatar}
                           disabled={isNothing (avatar)}
                           />
                         {professionNameElement}
                       </div>
                       {
                         isProfessionUndefined
                         ? null
                         : (
                           <>
                             <h3>{translate (l10n) ("personaldata")}</h3>
                             <OverviewPersonalData
                               profile={profile}
                               culture={culture}
                               eyecolorTags={translate (l10n) ("eyecolors")}
                               haircolorTags={translate (l10n) ("haircolors")}
                               race={race}
                               raceVariant={raceVariant}
                               socialstatusTags={translate (l10n) ("socialstatuses")}
                               isAlbino={isAlbino}
                               sizeCalcStr={sizeCalcStr}
                               weightCalcStr={weightCalcStr}
                               l10n={l10n}
                               changeFamily={changeFamily}
                               changePlaceOfBirth={changePlaceOfBirth}
                               changeDateOfBirth={changeDateOfBirth}
                               changeAge={changeAge}
                               changeHaircolor={changeHaircolor}
                               changeEyecolor={changeEyecolor}
                               changeSize={changeSize}
                               changeWeight={changeWeight}
                               changeTitle={changeTitle}
                               changeSocialStatus={changeSocialStatus}
                               changeCharacteristics={changeCharacteristics}
                               changeOtherInfo={changeOtherInfo}
                               changeCultureAreaKnowledge={changeCultureAreaKnowledge}
                               rerollHair={rerollHair}
                               rerollEyes={rerollEyes}
                               rerollSize={rerollSize}
                               rerollWeight={rerollWeight}
                               />
                           </>
                         )
                       }
                       {
                         Maybe.elem (2) (phase)
                           ? (
                             <div>
                               <BorderButton
                                 className="end-char-creation"
                                 label={translate (l10n) ("endherocreation")}
                                 onClick={endCharacterCreation}
                                 primary
                                 disabled={any (lt (0)) (apLeft) || any (gt (10)) (apLeft)}
                                 />
                             </div>
                           )
                           : null
                       }
                       {
                         Maybe.elem (3) (phase)
                           ? (
                             <div>
                               <h3>{translate (l10n) ("advantages")}</h3>
                               {maybeRNull ((advantages: List<Record<ActiveActivatable>>) => (
                                               <ActivatableTextList
                                                 list={advantages}
                                                 l10n={l10n}
                                                 />
                                             ))
                                           (maybeAdvantages)}
                               <h3>{translate (l10n) ("disadvantages")}</h3>
                               {maybeRNull ((disadvantages: List<Record<ActiveActivatable>>) => (
                                               <ActivatableTextList
                                                 list={disadvantages}
                                                 l10n={l10n}
                                                 />
                                             ))
                                           (maybeDisadvantages)}
                             </div>
                           )
                         : null
                       }
                     </Scroll>
                     <OverviewAddAP
                       close={closeAddAdventurePoints}
                       isOpen={isAddAdventurePointsOpen}
                       isRemovingEnabled={isRemovingEnabled}
                       addAdventurePoints={addAdventurePoints}
                       l10n={l10n}
                       />
                     <AvatarChange
                       setPath={setAvatar}
                       close={closeEditCharacterAvatar}
                       isOpen={isEditCharacterAvatarOpen}
                       l10n={l10n}
                       />
                   </Page>
                 ))
                 (maybeProfile)
  }
}
