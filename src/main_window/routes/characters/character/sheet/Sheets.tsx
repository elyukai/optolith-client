import { classList } from "@elyukai/utils/classList"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { Button } from "../../../../../shared/components/button/Button.tsx"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Options } from "../../../../../shared/components/options/Options.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import {
  changeSheetCheckAttributeValueVisibility,
  changeSheetUseParchment,
  changeSheetZoomFactor,
  selectSheetCheckAttributeValueVisibility,
  selectSheetUseParchment,
  selectSheetZoomFactor,
} from "../../../../slices/settingsSlice.ts"
import { CombatSheet } from "./CombatSheet/CombatSheet.tsx"
import { LiturgicalChantsSheet } from "./LiturgicalChantsSheet/LiturgicalChantsSheet.tsx"
import { MainSheet } from "./MainSheet/MainSheet.tsx"
import "./Sheets.css"
import { SkillsSheet } from "./SkillsSheet/SkillsSheet.tsx"
import { SpellsSheet } from "./SpellsSheet/SpellsSheet.tsx"

export const Sheets: FC = observer(function Shee() {
  const translate = useTranslate()
  const { printToPDF } = useCharacterActions()
  const { isBlessedOne, isSpellcaster } = useCharacterState()

  const dispatch = useAppDispatch()
  const zoomFactor = useAppSelector(selectSheetZoomFactor)
  const useParchment = useAppSelector(selectSheetUseParchment)
  const useCheckAttributeValues = useAppSelector(selectSheetCheckAttributeValueVisibility)

  const setZoomFactor = (factor: number) => dispatch(changeSheetZoomFactor(factor))
  const switchUseParchment = () => dispatch(changeSheetUseParchment(!useParchment))
  const switchCheckAttributeValues = () =>
    dispatch(changeSheetCheckAttributeValueVisibility(!useCheckAttributeValues))

  return (
    <Page id="sheets">
      <Options>
        <Button onClick={() => printToPDF()}>{translate("Print to PDF")}</Button>
        {/* <BorderButton
          className="export-rptok"
          label={translate(staticData)("sheets.exportasrptokbtn")}
          onClick={exportAsRptok}
        />
        <p className="maptool-hint">
          <a href="https://www.youtube.com/watch?v=1GhtRMBgSWY" target="_blank" rel="noreferrer">
            {translate(staticData)("sheets.maptool.whatisthis")}
          </a>
          {" — "}
          <a
            href="https://www.orkenspalter.de/filebase/index.php?file/2736-dsa5-regelsatz-f%C3%BCr-maptool/"
            target="_blank"
            rel="noreferrer"
          >
            {translate(staticData)("sheets.maptool.download")}
          </a>
        </p> */}
        <Checkbox checked={useParchment} onClick={switchUseParchment}>
          {translate("Use parchment background")}
        </Checkbox>
        <Checkbox checked={useCheckAttributeValues} onClick={switchCheckAttributeValues}>
          {translate("Show check attribute values")}
        </Checkbox>
        <Dropdown
          label={translate("Zoom factor")}
          value={zoomFactor}
          onChange={setZoomFactor}
          options={[100, 125, 150, 175, 200].map(value => ({
            id: value,
            name: translate(".input {$value :number} {{{$value}%}}", { value }),
          }))}
          getKey={option => option.id}
        />
      </Options>
      <Main>
        <Scroll className={classList("sheet-wrapper", `zoom-${zoomFactor}`)}>
          <MainSheet />
          <SkillsSheet />
          <CombatSheet />
          {isSpellcaster && <SpellsSheet />}
          {isBlessedOne && <LiturgicalChantsSheet />}
          {/* <BelongingsSheet
          attributes={attributes}
          items={items}
          staticData={staticData}
          pet={pet}
          purse={purse}
          totalPrice={totalPrice}
          totalWeight={totalWeight}
          useParchment={useParchment}
        /> */}
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
})
