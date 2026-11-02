import { observer } from "mobx-react-lite"
import { type FC, useCallback, useState } from "react"
import { AvatarWrapper } from "../../../../../shared/components/avatarWrapper/AvatarWrapper.tsx"
import { Button } from "../../../../../shared/components/button/Button.tsx"
import { EditText } from "../../../../../shared/components/editText/EditText.tsx"
import { Grid } from "../../../../../shared/components/grid/Grid.tsx"
import { GridItem } from "../../../../../shared/components/grid/GridItem.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { VerticalList } from "../../../../../shared/components/verticalList/VerticalList.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useAppDispatch } from "../../../../hooks/redux.ts"
import { PersonalData } from "./PersonalData.tsx"
import "./ProfileOverview.scss"

/**
 * Returns a page for managing the character’s profile, including the name,
 * adventure points and personal data.
 */
export const ProfileOverview: FC = observer(() => {
  const dispatch = useAppDispatch()
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingProfessionName, setIsEditingProfessionName] = useState(false)

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const {
    name,
    avatar,
    canAddAdventurePoints,
    adventurePointsStats,
    showFinishCharacterCreation,
    canFinishCharacterCreation,
    canDefineCustomProfessionName,
    sexName,
    raceName,
    cultureName,
    professionName,
    startExperienceLevel,
    currentExperienceLevel,
  } = useCharacterState()

  const actions = useCharacterActions()

  const handleEditName = useCallback(
    (newName: string) => {
      actions.setName(newName)
      setIsEditingName(false)
    },
    [dispatch],
  )

  const handleEditProfessionName = useCallback(
    (newName: string) => {
      actions.setCustomProfessionName(newName)
      setIsEditingProfessionName(false)
    },
    [dispatch],
  )

  const handleStartEditName = useCallback(() => setIsEditingName(true), [setIsEditingName])

  const handleCancelEditName = useCallback(() => setIsEditingName(false), [setIsEditingName])

  const handleStartEditProfessionName = useCallback(
    () => setIsEditingProfessionName(true),
    [setIsEditingProfessionName],
  )

  const handleCancelEditProfessionName = useCallback(
    () => setIsEditingProfessionName(false),
    [setIsEditingProfessionName],
  )

  const handleDeleteAvatar = useCallback(
    () => undefined /* TODO: dispatch(deleteAvatar()) */,
    [dispatch],
  )

  const handlFinishCharacterCreation = useCallback(
    () => undefined /* TODO: dispatch(finishCharacterCreation()) */,
    [dispatch],
  )

  const nameElement = isEditingName ? (
    <EditText
      className="change-name"
      cancel={handleCancelEditName}
      submit={handleEditName}
      text={name}
      autoFocus
      submitLabel={translate("Edit Name")}
      cancelLabel={translate("Cancel")}
    />
  ) : (
    <h1 className="confirm-edit">
      {name}
      <IconButton label={translate("Edit Name")} icon="&#xE90c;" onClick={handleStartEditName} />
    </h1>
  )

  const professionNameElement = canDefineCustomProfessionName ? (
    isEditingProfessionName ? (
      <EditText
        submit={handleEditProfessionName}
        submitLabel={translate("Edit Profession Name")}
        cancel={handleCancelEditProfessionName}
        cancelLabel={translate("Cancel")}
        text={professionName}
      />
    ) : (
      <Button className="edit-profession-name-btn" onClick={handleStartEditProfessionName}>
        {translate("Edit Profession Name")}
      </Button>
    )
  ) : null

  return (
    <Page id="personal-data">
      <Main>
        <Scroll className="text">
          <Grid size="large">
            <GridItem className="title-wrapper">
              <AvatarWrapper src={avatar ?? ""} /* TODO: onClick={openEditCharacterAvatar} */ />
              <div className="text-wrapper">
                {nameElement}
                {professionName === undefined ? null : (
                  <VerticalList className="rcp">
                    <span>{sexName}</span>
                    <span className="race">{raceName}</span>
                    <span className="culture">{cultureName}</span>
                    <span className="profession">{professionName}</span>
                  </VerticalList>
                )}
                <VerticalList className="el">
                  <span>
                    {startExperienceLevel === undefined || currentExperienceLevel === undefined
                      ? "—"
                      : startExperienceLevel.adventure_points ===
                          currentExperienceLevel.adventure_points
                        ? (translateMap(startExperienceLevel.translations)?.name ?? "—")
                        : `${translateMap(currentExperienceLevel.translations)?.name ?? "—"} (${
                            translateMap(startExperienceLevel.translations)?.name ?? "—"
                          })`}
                  </span>
                  <span>
                    {translate("{$value} AP", {
                      value: adventurePointsStats.total.toFixed(),
                    })}
                  </span>
                </VerticalList>
              </div>
            </GridItem>
            <GridItem className="main-profile-actions">
              {canAddAdventurePoints ? (
                <Button
                  className="add-ap"
                  disabled // TODO: onClick={openAddAdventurePoints}
                >
                  {translate("Add AP")}
                </Button>
              ) : null}
              <Button
                className="delete-avatar"
                onClick={handleDeleteAvatar}
                disabled={avatar === undefined}
              >
                {translate("Delete Avatar")}
              </Button>
              {professionNameElement}
            </GridItem>
            {professionName === undefined ? null : (
              <GridItem>
                <h3>{translate("Personal Data")}</h3>
                <PersonalData />
              </GridItem>
            )}
            {showFinishCharacterCreation ? (
              <GridItem>
                <Button
                  className="end-char-creation"
                  onClick={handlFinishCharacterCreation}
                  primary
                  disabled={!canFinishCharacterCreation}
                >
                  {translate("Finish Character Creation")}
                </Button>
                <p className="help">
                  {translate(
                    "You can save up no more than 10 AP to use later during the game, and you cannot begin the game with a negative AP balance.",
                  )}
                </p>
              </GridItem>
            ) : null}
            {
              // TODO: Maybe.elem(3)(phase)
              //   ? (
              //     <GridItem>
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
              //     </GridItem>
              //   )
              // : null
            }
          </Grid>
        </Scroll>
      </Main>
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
})
