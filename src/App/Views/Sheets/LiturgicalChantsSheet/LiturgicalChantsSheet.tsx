import * as React from "react"
import { equals } from "../../../../Data/Eq"
import { find, List } from "../../../../Data/List"
import { bindF, Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { DCId } from "../../../Constants/Ids"
import { ActiveActivatable } from "../../../Models/View/ActiveActivatable"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { BlessingCombined } from "../../../Models/View/BlessingCombined"
import { DerivedCharacteristic } from "../../../Models/View/DerivedCharacteristic"
import { LiturgicalChantWithRequirements } from "../../../Models/View/LiturgicalChantWithRequirements"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { Checkbox } from "../../Universal/Checkbox"
import { Options } from "../../Universal/Options"
import { AttributeMods } from "../AttributeMods"
import { Sheet } from "../Sheet"
import { HeaderValue } from "../SheetHeader"
import { SheetWrapper } from "../SheetWrapper"
import { LiturgicalChantsSheetBlessings } from "./LiturgicalChantsSheetBlessings"
import { LiturgicalChantsSheetLiturgicalChants } from "./LiturgicalChantsSheetLiturgicalChants"
import { LiturgicalChantsSheetSpecialAbilities } from "./LiturgicalChantsSheetSpecialAbilities"
import { LiturgicalChantsSheetTraditionsAspects } from "./LiturgicalChantsSheetTraditionsAspects"

interface Props {
  aspects: Maybe<string>
  attributes: List<Record<AttributeCombined>>
  blessedPrimary: Maybe<string>
  blessedSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  blessedTradition: Maybe<string>
  blessings: Maybe<List<Record<BlessingCombined>>>
  checkAttributeValueVisibility: boolean
  derivedCharacteristics: List<Record<DerivedCharacteristic>>
  liturgicalChants: Maybe<List<Record<LiturgicalChantWithRequirements>>>
  staticData: StaticDataRecord
  switchAttributeValueVisibility (): void
}

export const LiturgicalChantsSheet: React.FC<Props> = props => {
  const {
    aspects,
    attributes,
    blessedPrimary,
    blessedSpecialAbilities,
    blessedTradition,
    blessings,
    checkAttributeValueVisibility,
    derivedCharacteristics,
    liturgicalChants,
    staticData,
    switchAttributeValueVisibility,
  } = props

  const addHeader = List<Record<HeaderValue>> (
    HeaderValue ({
      id: "KP_MAX",
      short: translate (staticData) ("sheets.chantssheet.header.labels.kpmax"),
      value:
        pipe_ (
          derivedCharacteristics,
          find (pipe (DerivedCharacteristic.A.id, equals<DCId> (DCId.KP))),
          bindF (DerivedCharacteristic.A.value)
        ),
    }),
    HeaderValue ({
      id: "KP_CURRENT",
      short: translate (staticData) ("sheets.chantssheet.header.labels.kpcurrent"),
    })
  )

  return (
    <SheetWrapper>
      <Options>
        <Checkbox
          checked={checkAttributeValueVisibility}
          onClick={switchAttributeValueVisibility}
          >
          {translate (staticData) ("sheets.showattributevalues")}
        </Checkbox>
      </Options>
      <Sheet
        id="liturgies-sheet"
        title={translate (staticData) ("sheets.chantssheet.title")}
        addHeaderInfo={addHeader}
        staticData={staticData}
        attributes={attributes}
        >
        <div className="all">
          <LiturgicalChantsSheetLiturgicalChants
            attributes={attributes}
            checkAttributeValueVisibility={checkAttributeValueVisibility}
            liturgicalChants={liturgicalChants}
            staticData={staticData}
            />
          <AttributeMods
            staticData={staticData}
            attributes={attributes}
            />
          <LiturgicalChantsSheetTraditionsAspects
            staticData={staticData}
            aspects={aspects}
            blessedPrimary={blessedPrimary}
            blessedTradition={blessedTradition}
            />
          <LiturgicalChantsSheetSpecialAbilities
            staticData={staticData}
            blessedSpecialAbilities={blessedSpecialAbilities}
            />
          <LiturgicalChantsSheetBlessings
            staticData={staticData}
            blessings={blessings}
            />
        </div>
      </Sheet>
    </SheetWrapper>
  )
}
