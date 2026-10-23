import { FC, useCallback, useRef } from "react"
import { AvatarWrapper } from "../../../shared/components/avatarWrapper/AvatarWrapper.tsx"
import { IconButton } from "../../../shared/components/iconButton/IconButton.tsx"
import { ListItem } from "../../../shared/components/list/ListItem.tsx"
import { ListItemButtons } from "../../../shared/components/list/ListItemButtons.tsx"
import { ListItemName } from "../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../shared/components/list/ListItemSeparator.tsx"
import { TooltipHint } from "../../../shared/components/tooltipHint/TooltipHint.tsx"
import { VerticalList } from "../../../shared/components/verticalList/VerticalList.tsx"
import type { CharacterOverview } from "../../../shared/domain/character.ts"
import { getFullCultureName } from "../../../shared/domain/culture.ts"
import { getFullProfessionNameParts } from "../../../shared/domain/profession.ts"
import { getFullRaceName } from "../../../shared/domain/race.ts"
import { useTranslate } from "../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../shared/hooks/translateMap.ts"
import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts"
import { selectCustomProfessionName } from "../../slices/characterSlice.ts"
import { goToTab } from "../../slices/routeSlice.ts"

type Props = {
  character: CharacterOverview
}

/**
 * Returns a single character item.
 */
export const CharactersItem: FC<Props> = props => {
  const {
    character: {
      id,
      name,
      avatar,
      race,
      raceVariant,
      culture,
      profession,
      professionVariant,
      totalAdventurePoints,
      adventurePointsSpent,
    },
  } = props

  const dispatch = useAppDispatch()
  const translate = useTranslate()
  const translateMap = useTranslateMap()

  const customProfessionName = useAppSelector(selectCustomProfessionName)

  const handleOpen = useCallback(() => {
    dispatch(goToTab(["characters", id, "profile"]))
  }, [id, dispatch])

  const duplicateRef = useRef<HTMLButtonElement>(null)
  const exportRef = useRef<HTMLButtonElement>(null)
  const deleteRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)

  return (
    <ListItem>
      <AvatarWrapper src={avatar ?? ""} />
      <ListItemName
        name={name}
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
                  {
                    type: "Custom",
                    name: "",
                    ruleBasedInterpretation: {
                      asFemale: false,
                      asMale: false,
                      sexualCharacteristics: { hasPenis: false, hasVagina: false },
                    },
                  }, // TODO: character.personalData.sex,
                  profession,
                  professionVariant,
                  // TODO: customProfessionName,
                ).fullName}
          </span>
          <span className="totalap">
            {translate("{$value} Adventure Points", {
              value:
                adventurePointsSpent === totalAdventurePoints
                  ? totalAdventurePoints.toFixed()
                  : `${adventurePointsSpent.toFixed()} / ${totalAdventurePoints.toFixed()}`,
            })}
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
