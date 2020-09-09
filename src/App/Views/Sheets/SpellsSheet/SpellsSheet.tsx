import * as React from "react"
import { DerivedCharacteristicId } from "../../../../../app/Database/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { equals } from "../../../../Data/Eq"
import { find, List } from "../../../../Data/List"
import { bindF, Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { fst, snd } from "../../../../Data/Tuple"
import { DCId } from "../../../Constants/Ids"
import { ActiveActivatable } from "../../../Models/View/ActiveActivatable"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { CantripCombined } from "../../../Models/View/CantripCombined"
import { DerivedCharacteristicValues } from "../../../Models/View/DerivedCharacteristicCombined"
import { SpellWithRequirements } from "../../../Models/View/SpellWithRequirements"
import { DerivedCharacteristic } from "../../../Models/Wiki/DerivedCharacteristic"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { DCPair } from "../../../Selectors/derivedCharacteristicsSelectors"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { AttributeMods } from "../AttributeMods"
import { Sheet } from "../Sheet"
import { HeaderValue } from "../SheetHeader"
import { SheetWrapper } from "../SheetWrapper"
import { SpellsSheetCantrips } from "./SpellsSheetCantrips"
import { SpellsSheetSpecialAbilities } from "./SpellsSheetSpecialAbilities"
import { SpellsSheetSpells } from "./SpellsSheetSpells"
import { SpellsSheetTraditionsProperties } from "./SpellsSheetTraditionsProperties"

export interface SpellsSheetProps {
  attributes: List<Record<AttributeCombined>>
  cantrips: Maybe<List<Record<CantripCombined>>>
  checkAttributeValueVisibility: boolean
  derivedCharacteristics: List<DCPair>
  staticData: StaticDataRecord
  magicalPrimary: List<string>
  magicalSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  magicalTradition: string
  properties: Maybe<string>
  spells: Maybe<List<Record<SpellWithRequirements>>>
  switchAttributeValueVisibility (): void
  useParchment: boolean
}

export function SpellsSheet (props: SpellsSheetProps) {
  const {
    attributes,
    cantrips,
    checkAttributeValueVisibility,
    derivedCharacteristics,
    staticData,
    magicalPrimary,
    magicalSpecialAbilities,
    magicalTradition,
    properties,
    spells,
    useParchment,
  } = props

  const addHeader = List<Record<HeaderValue>> (
    HeaderValue ({
      id: "AE_MAX",
      short: translate (staticData) ("sheets.spellssheet.header.labels.aemax"),
      value:
        pipe_ (
          derivedCharacteristics,
          find (pipe (
            fst,
            DerivedCharacteristic.A.id,
            equals<DerivedCharacteristicId> (DCId.AE)
          )),
          bindF (pipe (snd, DerivedCharacteristicValues.A.value))
        ),
    }),
    HeaderValue ({
      id: "AE_CURRENT",
      short: translate (staticData) ("sheets.spellssheet.header.labels.aecurrent"),
    })
  )

  return (
    <SheetWrapper>
      <Sheet
        id="spells-sheet"
        title={translate (staticData) ("sheets.spellssheet.title")}
        addHeaderInfo={addHeader}
        staticData={staticData}
        attributes={attributes}
        useParchment={useParchment}
        >
        <div className="all">
          <SpellsSheetSpells
            staticData={staticData}
            attributes={attributes}
            checkAttributeValueVisibility={checkAttributeValueVisibility}
            spells={spells}
            />
          <AttributeMods
            staticData={staticData}
            attributes={attributes}
            />
          <SpellsSheetTraditionsProperties
            staticData={staticData}
            magicalPrimary={magicalPrimary}
            magicalTradition={magicalTradition}
            properties={properties}
            />
          <SpellsSheetSpecialAbilities
            staticData={staticData}
            magicalSpecialAbilities={magicalSpecialAbilities}
            />
          <SpellsSheetCantrips
            staticData={staticData}
            cantrips={cantrips}
            />
        </div>
      </Sheet>
    </SheetWrapper>
  )
}
