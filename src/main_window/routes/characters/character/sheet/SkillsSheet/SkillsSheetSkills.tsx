import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../../hooks/characterState.ts"
import "./SkillsSheetSkills.css"
import { SkillsSheetSkillsSide } from "./SkillsSheetSkillsSide.tsx"

export const SkillsSheetSkills: FC = observer(function SkillsSheetSkills() {
  const translate = useTranslate()
  const { skillsByGroup } = useCharacterState()

  const leftGroups = skillsByGroup.slice(0, Math.ceil(skillsByGroup.length / 2))
  const rightGroups = skillsByGroup.slice(Math.ceil(skillsByGroup.length / 2))

  return (
    <>
      <h3>{translate("Skills")}</h3>
      <div className="upper">
        <SkillsSheetSkillsSide skillsByGroup={leftGroups} />
        <SkillsSheetSkillsSide skillsByGroup={rightGroups} />
      </div>
    </>
  )
})
