import { observer } from "mobx-react-lite"
import { useCallback, useRef, type FC } from "react"
import { AvatarWrapper } from "../../shared/components/avatarWrapper/AvatarWrapper.tsx"
import { Button } from "../../shared/components/button/Button.tsx"
import { IconButton } from "../../shared/components/iconButton/IconButton.tsx"
import { TooltipToggle } from "../../shared/components/tooltipToggle/TooltipToggle.tsx"
import { useTranslate } from "../../shared/hooks/translate.ts"
import { ExternalAPI } from "../external.ts"
import { useCharacterState } from "../hooks/characterState.ts"
import { useAppDispatch } from "../hooks/redux.ts"
import { useVisibleCharacterTabs } from "../hooks/visibleTabs.ts"
import { goToTab } from "../slices/routeSlice.ts"
import { AdventurePointsTooltip } from "./AdventurePointsTooltip.tsx"
import { NavigationBar } from "./NavigationBar.tsx"

/**
 * Returns a top navigation bar.
 */
export const CharacterNavigationBar: FC = observer(() => {
  const translate = useTranslate()
  const dispatch = useAppDispatch()
  const { avatar, adventurePointsStats, id: characterId } = useCharacterState()
  const handleCharactersTab = useCallback(() => dispatch(goToTab(["characters"])), [dispatch])
  const { mainTabs, subTabs } = useVisibleCharacterTabs()

  const ref = useRef<HTMLDivElement>(null)

  return (
    <NavigationBar
      backToMainView={handleCharactersTab}
      leftChildren={<AvatarWrapper src={avatar ?? ""} />}
      rightChildren={
        <>
          <TooltipToggle
            position="bottom"
            margin={12}
            content={<AdventurePointsTooltip />}
            targetRef={ref}
          />
          <div className="collected-ap" ref={ref}>
            {translate("{$value} AP Remaining", {
              value: adventurePointsStats.available.toFixed(),
            })}
          </div>
          <IconButton
            icon="&#xE90f;"
            label={translate("Undo")}
            // onClick={undo}
            disabled /* ={!isUndoAvailable} */
          />
          <IconButton
            icon="&#xE910;"
            label={translate("Redo")}
            // onClick={redo}
            disabled /* ={!isRedoAvailable} */
          />
          <Button onClick={() => ExternalAPI.execute("saveCharacter", characterId)}>
            {translate("Save")}
          </Button>
        </>
      }
      mainTabs={mainTabs}
      subTabs={subTabs}
    />
  )
})
