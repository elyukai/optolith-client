import { FC, useCallback, useMemo, useRef } from "react"
import { AvatarWrapper } from "../../../shared/components/avatarWrapper/AvatarWrapper.tsx"
import { IconButton } from "../../../shared/components/iconButton/IconButton.tsx"
import { ListItem } from "../../../shared/components/list/ListItem.tsx"
import { ListItemButtons } from "../../../shared/components/list/ListItemButtons.tsx"
import { ListItemName } from "../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../shared/components/list/ListItemSeparator.tsx"
import { TooltipHint } from "../../../shared/components/tooltipHint/TooltipHint.tsx"
import { VerticalList } from "../../../shared/components/verticalList/VerticalList.tsx"
import { getCulture, getFullCultureName } from "../../../shared/domain/culture.ts"
import {
  getFullProfessionNameParts,
  getProfessionParts,
  getProfessionVariant,
} from "../../../shared/domain/profession.ts"
import { getFullRaceName, getRace, getRaceVariant } from "../../../shared/domain/race.ts"
import { useTranslate } from "../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../shared/hooks/translateMap.ts"
import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts"
import { CharacterState, selectCustomProfessionName } from "../../slices/characterSlice.ts"
import {
  selectCultures,
  selectExperienceLevels,
  selectProfessions,
  selectRaces,
} from "../../slices/databaseSlice.ts"
import { goToTab } from "../../slices/routeSlice.ts"

export type HerolistItemProps = {
  character: CharacterState
}

export const CharactersItem: FC<HerolistItemProps> = props => {
  const { character } = props

  const dispatch = useAppDispatch()
  const translate = useTranslate()
  const translateMap = useTranslateMap()

  const experienceLevels = useAppSelector(selectExperienceLevels)
  const startExperienceLevel = experienceLevels[character.experienceLevelStartId]

  const races = useAppSelector(selectRaces)
  const race = useMemo(
    () => (character.race.id === undefined ? undefined : getRace(races, character.race.id)),
    [character.race.id, races],
  )
  const raceVariant = useMemo(
    () => (race === undefined ? undefined : getRaceVariant(race, character.race.variantId)),
    [character.race.variantId, race],
  )

  const cultures = useAppSelector(selectCultures)
  const culture = useMemo(
    () =>
      character.culture.id === undefined ? undefined : getCulture(cultures, character.culture.id),
    [character.culture.id, cultures],
  )

  const professions = useAppSelector(selectProfessions)
  const profession = useMemo(
    () =>
      character.profession.id === undefined ||
      character.profession.instanceId === undefined ||
      startExperienceLevel === undefined
        ? undefined
        : getProfessionParts(
            professions,
            character.profession.id,
            character.profession.instanceId,
            startExperienceLevel,
          ),
    [character.profession.id, character.profession.instanceId, professions, startExperienceLevel],
  )
  const professionVariant = useMemo(
    () =>
      profession === undefined
        ? undefined
        : getProfessionVariant(profession, character.profession.variantId),
    [character.profession.variantId, profession],
  )
  const customProfessionName = useAppSelector(selectCustomProfessionName)

  const handleOpen = useCallback(() => {
    dispatch(goToTab(["characters", character.id, "profile"]))
  }, [character.id, dispatch])

  const duplicateRef = useRef<HTMLButtonElement>(null)
  const exportRef = useRef<HTMLButtonElement>(null)
  const deleteRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)

  return (
    <ListItem>
      <AvatarWrapper src={character.avatar ?? ""} />
      <ListItemName
        name={character.name}
        // addName={pipe_(
        //   hero,
        //   HA.player,
        //   bindF(lookupF(users)),
        //   fmap((user: User) => user.displayName)
        // )}
        large
      >
        <VerticalList className="rcp">
          <span className="race">
            {race === undefined ? "" : getFullRaceName(translateMap, race, raceVariant)}
          </span>
          <span className="culture">
            {culture === undefined ? "" : getFullCultureName(translateMap, culture)}
          </span>
          <span className="profession">
            {profession === undefined
              ? ""
              : getFullProfessionNameParts(
                  translateMap,
                  character.personalData.sex,
                  profession,
                  professionVariant,
                  customProfessionName,
                ).fullName}
          </span>
          <span className="totalap">
            {translate("{0} Adventure Points", character.totalAdventurePoints)}
          </span>
        </VerticalList>
      </ListItemName>
      <ListItemSeparator />
      <ListItemButtons>
        {/* <Button
          className="save"
          // TODO: onClick={saveHero}
          disabled// ={notMember(id)(unsavedHeroesById)}
          >
          {translate("Save")}
        </Button> */}
        <TooltipHint hint={translate("Duplicate Character")} targetRef={duplicateRef} margin={8} />
        <IconButton
          icon="&#xE907;"
          // TODO: onClick={duplicateHero}
          label={translate("Duplicate Character")}
          ref={duplicateRef}
        />
        <TooltipHint
          hint={translate("Export Character as OPTLC file")}
          targetRef={exportRef}
          margin={8}
        />
        <IconButton
          icon="&#xE914;"
          // TODO: onClick={saveHeroAsJSON}
          label={translate("Export Character as OPTLC file")}
          ref={exportRef}
        />
        <TooltipHint hint={translate("Delete Character")} targetRef={deleteRef} margin={8} />
        <IconButton
          icon="&#xE90b;"
          // TODO: onClick={deleteHero}
          label={translate("Delete Character")}
          ref={deleteRef}
        />
        <TooltipHint hint={translate("Open Character")} targetRef={openRef} margin={8} />
        <IconButton
          icon="&#xE90e;"
          onClick={handleOpen}
          label={translate("Open Character")}
          ref={openRef}
        />
      </ListItemButtons>
    </ListItem>
  )
}
