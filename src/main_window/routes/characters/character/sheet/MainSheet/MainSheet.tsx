import type { SpecialAbilityIdentifier } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../../hooks/characterState.ts"
import { ActivatableList } from "../ActivatableList.tsx"
import { Sheet } from "../Sheet.tsx"
import { SheetSpecialAbilities } from "../SheetSpecialAbilities.tsx"
import { SheetWrapper } from "../SheetWrapper.tsx"

const includedSpecialAbilityTypes: SpecialAbilityIdentifier["kind"][] = [
  "AdvancedSkillSpecialAbility",
  "FatePointSexSpecialAbility",
  "FatePointSpecialAbility",
  "GeneralSpecialAbility",
  "LycantropicGift",
  "PactGift",
  "Sermon",
  "SexSpecialAbility",
  "SikaryanDrainSpecialAbility",
  "SkillStyleSpecialAbility",
  "VampiricGift",
  "Vision",
]

export const MainSheet: FC = observer(function MainSheet() {
  const translate = useTranslate()
  const { activeAdvantages, activeDisadvantages } = useCharacterState()

  return (
    <SheetWrapper>
      <Sheet id="main-sheet" title={translate("Personal Data")}>
        {/* <MainSheetPersonalData
          ap={ap}
          avatar={avatar}
          culture={culture}
          el={el}
          staticData={staticData}
          name={name}
          professionName={professionName}
          profile={profile}
          race={race}
          sex={sex}
        /> */}
        <div className="lower">
          <div className="lists">
            <ActivatableList label={translate("Advantages")} list={activeAdvantages} />
            <ActivatableList label={translate("Disadvantages")} list={activeDisadvantages} />
            <SheetSpecialAbilities
              label={translate("General Special Abilities")}
              types={includedSpecialAbilityTypes}
            />
            {/* {toNewMaybe(maybeGeneralsaActive).maybe<React.ReactNode>(null, generalsaActive => (
              <TextBox
                className="activatable-list"
                label={translate(staticData)("sheets.mainsheet.generalspecialabilites")}
                value={compressList(staticData)(generalsaActive)}
              />
            ))} */}
          </div>
          {/* <MainSheetAttributes
            attributes={derivedCharacteristics}
            fatePointsModifier={fatePointsModifier}
            staticData={staticData}
            race={race}
          /> */}
        </div>
      </Sheet>
    </SheetWrapper>
  )
})
