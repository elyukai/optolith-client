import { sign } from "@elyukai/utils/string/number"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type {
  DisplayedSkill,
  DisplayedSkillGroup,
} from "../../../../../../shared/domain/rated/skill.ts"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../../hooks/characterState.ts"
import { useInlineLibrarySelect } from "../../../../../hooks/inlineLibrary.ts"
import { useAppSelector } from "../../../../../hooks/redux.ts"
import { selectSheetCheckAttributeValueVisibility } from "../../../../../slices/settingsSlice.ts"

type Props = {
  group: DisplayedSkillGroup
  skillsInGroup: DisplayedSkill[]
}

export const SkillsSheetSkillsGroup: FC<Props> = observer(function SkillsSheetSkillsGroup(props) {
  const translate = useTranslate()
  const { attributes } = useCharacterState()
  const useCheckAttributeValues = useAppSelector(selectSheetCheckAttributeValueVisibility)
  const displayInlineLibraryEntry = useInlineLibrarySelect()

  return (
    <>
      <tr className="group">
        <td className="name">{props.group.name}</td>
        <td className="check">
          {props.group.check
            .map(
              checkAttr =>
                attributes.find(attr => attr.id === checkAttr)?.[
                  useCheckAttributeValues ? "value" : "abbreviation"
                ],
            )
            .join("/")}
        </td>
        <td className="enc" />
        <td className="ic" />
        <td className="sr" />
        <td className="routine" />
        <td className="comment">
          {/* TODO: {pipe_(
                      pages,
                      lookup(index + 1),
                      renderMaybeWith(p => `${page} ${fst(p)}${ndash}${snd(p)}`),
                    )} */}
        </td>
      </tr>
      {props.skillsInGroup.map(skill => (
        <tr>
          <td className="name">
            <span
              className="has-sheet-inline-info"
              onClick={() => displayInlineLibraryEntry("Skill", skill.id)}
            >
              {skill.name}
            </span>
          </td>
          <td className="check">
            {skill.check
              .map(
                checkAttr =>
                  attributes.find(attr => attr.id === checkAttr)?.[
                    useCheckAttributeValues ? "value" : "abbreviation"
                  ],
              )
              .join("/")}
          </td>
          <td className="enc">
            {(() => {
              switch (skill.encumbranceInfluence) {
                case "Yes":
                  return translate("Yes")
                case "No":
                  return translate("No")
                case "Maybe":
                  return translate("Myb.")
                default:
                  return assertExhaustive(skill.encumbranceInfluence)
              }
            })()}
          </td>
          <td className="ic">{skill.improvementCost}</td>
          <td className="sr">{skill.value}</td>
          <td className="routine">{skill.routine === undefined ? "–" : sign(skill.routine)}</td>
          <td className="comment" />
        </tr>
      ))}
    </>
  )
})
