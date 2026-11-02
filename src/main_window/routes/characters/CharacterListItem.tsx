import { observer } from "mobx-react-lite"
import { type FC, useCallback, useRef } from "react"
import { AvatarWrapper } from "../../../shared/components/avatarWrapper/AvatarWrapper.tsx"
import { Button } from "../../../shared/components/button/Button.tsx"
import { IconButton } from "../../../shared/components/iconButton/IconButton.tsx"
import { ListItem } from "../../../shared/components/list/ListItem.tsx"
import { ListItemButtons } from "../../../shared/components/list/ListItemButtons.tsx"
import { ListItemName } from "../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../shared/components/list/ListItemSeparator.tsx"
import { TooltipHint } from "../../../shared/components/tooltipHint/TooltipHint.tsx"
import { VerticalList } from "../../../shared/components/verticalList/VerticalList.tsx"
import type { CharacterOverview } from "../../../shared/domain/character.ts"
import { useTranslate } from "../../../shared/hooks/translate.ts"
import { ExternalAPI } from "../../external.ts"
import { useAppDispatch } from "../../hooks/redux.ts"
import { goToTab } from "../../slices/routeSlice.ts"

type Props = {
  character: CharacterOverview
}

/**
 * Returns a single character item.
 */
export const CharacterListItem: FC<Props> = observer(props => {
  const {
    character: {
      id,
      name,
      avatar,
      raceName,
      cultureName,
      professionName,
      totalAdventurePoints,
      adventurePointsSpent,
    },
  } = props

  const dispatch = useAppDispatch()
  const translate = useTranslate()

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
          <span className="race">{raceName ?? ""}</span>
          <span className="culture">{cultureName ?? ""}</span>
          <span className="profession">{professionName ?? ""}</span>
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
        <Button
          className="save"
          onClick={() => ExternalAPI.execute("saveCharacter", id)}
          // TODO: only allow save when unsaved changes
        >
          {translate("Save")}
        </Button>
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
})
