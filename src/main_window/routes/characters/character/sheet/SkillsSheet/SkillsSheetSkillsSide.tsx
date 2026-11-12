import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { SkillsByGroup } from "../../../../../../shared/domain/rated/skill.ts"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { SkillsSheetSkillsGroup } from "./SkillsSheetSkillsGroup.tsx"

type Props = {
  skillsByGroup: SkillsByGroup[]
}

const EmptyRow: FC = () => (
  <tr>
    <td />
    <td />
    <td />
    <td />
    <td />
    <td />
    <td />
  </tr>
)

export const SkillsSheetSkillsSide: FC<Props> = observer(function SkillsSheetSkillSide(props) {
  const translate = useTranslate()

  return (
    <table className="skills">
      <thead>
        <tr>
          <th className="name">{translate("Skill")}</th>
          <th className="check">{translate("Check")}</th>
          <th className="enc">{translate("ENC")}</th>
          <th className="ic">{translate("IC")}</th>
          <th className="sr">{translate("SR")}</th>
          <th className="routine">{translate("R")}</th>
          <th className="comment">{translate("Notes")}</th>
        </tr>
      </thead>
      <tbody>
        {props.skillsByGroup.map(({ group, skillsInGroup }, index) => (
          <>
            {index > 0 && <EmptyRow />}
            <SkillsSheetSkillsGroup group={group} skillsInGroup={skillsInGroup} />
          </>
        ))}
      </tbody>
    </table>
  )
})
