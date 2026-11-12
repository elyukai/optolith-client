import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { Sheet } from "../Sheet.tsx"
import { SheetWrapper } from "../SheetWrapper.tsx"
import "./SkillsSheet.css"
import { SkillsSheetSkills } from "./SkillsSheetSkills.tsx"

export const SkillsSheet: FC = observer(function SkillsSheet() {
  const translate = useTranslate()

  return (
    <SheetWrapper>
      <Sheet id="skills-sheet" title={translate("Game Stats")}>
        <SkillsSheetSkills />
        <div className="lower">
          <div className="abilites">
            {/* <SkillsSheetLanguages
              languagesStateEntry={languagesStateEntry}
              languagesWikiEntry={languagesWikiEntry}
              staticData={staticData}
              /> */}
            {/* <SkillsSheetScripts
              scriptsStateEntry={scriptsStateEntry}
              scriptsWikiEntry={scriptsWikiEntry}
              staticData={staticData}
              /> */}
          </div>
        </div>
      </Sheet>
    </SheetWrapper>
  )
})
