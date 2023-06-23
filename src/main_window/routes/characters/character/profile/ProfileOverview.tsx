import { FC, useCallback, useState } from "react"
import { AvatarWrapper } from "../../../../../shared/components/avatarWrapper/AvatarWrapper.tsx"
import { Button } from "../../../../../shared/components/button/Button.tsx"
import { EditText } from "../../../../../shared/components/editText/EditText.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { VerticalList } from "../../../../../shared/components/verticalList/VerticalList.tsx"
import { getFullCultureName } from "../../../../../shared/domain/culture.ts"
import { getFullRaceName } from "../../../../../shared/domain/race.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useProfessionName } from "../../../../hooks/professionName.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectCanAddAdventurePoints } from "../../../../selectors/characterSelectors.ts"
import { selectCurrentCulture } from "../../../../selectors/cultureSelectors.ts"
import { selectCurrentExperienceLevel, selectStartExperienceLevel } from "../../../../selectors/experienceLevelSelectors.ts"
import { selectCurrentProfession } from "../../../../selectors/professionSelectors.ts"
import { selectCanDefineCustomProfessionName, selectCanFinishCharacterCreation, selectShowFinishCharacterCreation } from "../../../../selectors/profileSelectors.ts"
import { selectCurrentRace, selectCurrentRaceVariant } from "../../../../selectors/raceSelectors.ts"
import { deleteAvatar, finishCharacterCreation, selectAvatar, selectName, selectSex, selectTotalAdventurePoints, setName } from "../../../../slices/characterSlice.ts"
import { setCustomProfessionName } from "../../../../slices/professionSlice.ts"
import { PersonalData } from "./PersonalData.tsx"
import "./ProfileOverview.scss"

export const ProfileOverview: FC = () => {
  const dispatch = useAppDispatch()
  const name = useAppSelector(selectName)
  const [ isEditingName, setIsEditingName ] = useState(false)
  const [ isEditingProfessionName, setIsEditingProfessionName ] = useState(false)

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const canAddAdventurePoints = useAppSelector(selectCanAddAdventurePoints)
  const startExpLevel = useAppSelector(selectStartExperienceLevel)
  const currentExpLevel = useAppSelector(selectCurrentExperienceLevel)
  const totalAdventurePoints = useAppSelector(selectTotalAdventurePoints)
  const sex = useAppSelector(selectSex)
  const avatar = useAppSelector(selectAvatar)
  const currentRace = useAppSelector(selectCurrentRace)
  const currentRaceVariant = useAppSelector(selectCurrentRaceVariant)
  const currentCulture = useAppSelector(selectCurrentCulture)
  const currentProfession = useAppSelector(selectCurrentProfession)
  const { name: professionName = "", fullName: fullProfessionName = "" } = useProfessionName() ?? {}
  const showFinishCharacterCreation = useAppSelector(selectShowFinishCharacterCreation)
  const canFinishCharacterCreation = useAppSelector(selectCanFinishCharacterCreation)
  const canDefineCustomProfessionName = useAppSelector(selectCanDefineCustomProfessionName)

  const handleEditName = useCallback(
    (newName: string) => {
      dispatch(setName(newName))
      setIsEditingName(false)
    },
    [ dispatch ]
  )

  const handleEditProfessionName = useCallback(
    (newName: string) => {
      dispatch(setCustomProfessionName(newName))
      setIsEditingProfessionName(false)
    },
    [ dispatch ]
  )

  const handleStartEditName = useCallback(
    () => setIsEditingName(true),
    [ setIsEditingName ]
  )

  const handleCancelEditName = useCallback(
    () => setIsEditingName(false),
    [ setIsEditingName ]
  )

  const handleStartEditProfessionName = useCallback(
    () => setIsEditingProfessionName(true),
    [ setIsEditingProfessionName ]
  )

  const handleCancelEditProfessionName = useCallback(
    () => setIsEditingProfessionName(false),
    [ setIsEditingProfessionName ]
  )

  const handleDeleteAvatar = useCallback(
    () => dispatch(deleteAvatar()),
    [ dispatch ]
  )

  const handlFinishCharacterCreation = useCallback(
    () => dispatch(finishCharacterCreation()),
    [ dispatch ]
  )

  const nameElement = isEditingName
    ? (
      <EditText
        className="change-name"
        cancel={handleCancelEditName}
        submit={handleEditName}
        text={name}
        autoFocus
        submitLabel={translate("Edit Name")}
        cancelLabel={translate("Cancel")}
        />
    )
    : (
      <h1 className="confirm-edit">
        {name}
        <IconButton label={translate("Edit Name")} icon="&#xE90c;" onClick={handleStartEditName} />
      </h1>
    )

  const professionNameElement =
    canDefineCustomProfessionName
      ? (isEditingProfessionName
        ? (
          <EditText
            submit={handleEditProfessionName}
            submitLabel={translate("Edit Profession Name")}
            cancel={handleCancelEditProfessionName}
            cancelLabel={translate("Cancel")}
            text={professionName}
            />
        )
        : (
          <Button
            className="edit-profession-name-btn"
            onClick={handleStartEditProfessionName}
            >
            {translate("Edit Profession Name")}
          </Button>
        ))
      : null

  return (
    <Page id="personal-data">
      <Scroll className="text">
        <div className="title-wrapper">
          <AvatarWrapper src={avatar ?? ""} /* TODO: onClick={openEditCharacterAvatar} */ />
          <div className="text-wrapper">
            {nameElement}
            {
              currentProfession === undefined
              ? null
              : (
                <VerticalList className="rcp">
                  <span>
                    {((): string => {
                      switch (sex.type) {
                        case "Male":     return translate("Male")
                        case "Female":   return translate("Female")
                        case "BalThani": return translate("Bal’Thani")
                        case "Tsajana":  return translate("Tsajana")
                        case "Custom":   return sex.name
                        default: return assertExhaustive(sex)
                      }
                    })()}
                  </span>
                  <span className="race">
                    {currentRace === undefined
                      ? ""
                      : getFullRaceName(translateMap, currentRace, currentRaceVariant)}
                  </span>
                  <span className="culture">
                    {currentCulture === undefined
                      ? ""
                      : getFullCultureName(translateMap, currentCulture)}
                  </span>
                  <span className="profession">
                    {fullProfessionName}
                  </span>
                </VerticalList>
              )
            }
            <VerticalList className="el">
              <span>
                {
                  startExpLevel === undefined || currentExpLevel === undefined
                  ? "—"
                  : currentExpLevel.id === startExpLevel.id
                  ? (translateMap(startExpLevel.translations)?.name ?? "—")
                  : `${(translateMap(currentExpLevel.translations)?.name ?? "—")} (${(translateMap(startExpLevel.translations)?.name ?? "—")})`
                }
              </span>
              <span>
                {translate("{0} AP", totalAdventurePoints ?? 0)}
              </span>
            </VerticalList>
          </div>
        </div>
        <div className="main-profile-actions">
          {
            canAddAdventurePoints
              ? (
                  <Button
                    className="add-ap"
                    disabled // TODO: onClick={openAddAdventurePoints}
                    >
                    {translate("Add AP")}
                  </Button>
                )
              : null
          }
          <Button
            className="delete-avatar"
            onClick={handleDeleteAvatar}
            disabled={avatar === undefined}
            >
            {translate("Delete Avatar")}
          </Button>
          {professionNameElement}
        </div>
        {
          currentProfession === undefined
          ? null
          : (
            <>
              <h3>{translate("Personal Data")}</h3>
              <PersonalData />
            </>
          )
        }
        {
          showFinishCharacterCreation
            ? (
              <div>
                <Button
                  className="end-char-creation"
                  onClick={handlFinishCharacterCreation}
                  primary
                  disabled={!canFinishCharacterCreation}
                  >
                  {translate("Finish Character Creation")}
                </Button>
              </div>
            )
            : null
        }
        {
          // TODO: Maybe.elem(3)(phase)
          //   ? (
          //     <div>
          //       <h3>{translate("profile.advantages")}</h3>
          //       {maybeRNull((advantages: List<Record<ActiveActivatable>>) => (
          //                       <ActivatableTextList
          //                         list={advantages}
          //                         staticData={staticData}
          //                         />
          //                     ))
          //                   (maybeAdvantages)}
          //       <h3>{translate("profile.disadvantages")}</h3>
          //       {maybeRNull((disadvantages: List<Record<ActiveActivatable>>) => (
          //                       <ActivatableTextList
          //                         list={disadvantages}
          //                         staticData={staticData}
          //                         />
          //                     ))
          //                   (maybeDisadvantages)}
          //     </div>
          //   )
          // : null
        }
      </Scroll>
      {/* TODO: <OverviewAddAP
        close={closeAddAdventurePoints}
        isOpen={isAddAdventurePointsOpen}
        isRemovingEnabled={isRemovingEnabled}
        addAdventurePoints={addAdventurePoints}
        staticData={staticData}
        /> */}
      {/* TODO: <AvatarChange
        setPath={setAvatar}
        close={closeEditCharacterAvatar}
        isOpen={isEditCharacterAvatarOpen}
        staticData={staticData}
        /> */}
    </Page>
  )
}
