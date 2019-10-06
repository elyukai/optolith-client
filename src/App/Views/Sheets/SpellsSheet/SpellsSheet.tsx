import * as React from "react";
import { equals } from "../../../../Data/Eq";
import { find, List } from "../../../../Data/List";
import { bindF, Maybe } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { DCId } from "../../../Constants/Ids";
import { ActiveActivatable } from "../../../Models/View/ActiveActivatable";
import { AttributeCombined } from "../../../Models/View/AttributeCombined";
import { CantripCombined } from "../../../Models/View/CantripCombined";
import { DerivedCharacteristic } from "../../../Models/View/DerivedCharacteristic";
import { SpellWithRequirements } from "../../../Models/View/SpellWithRequirements";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { Checkbox } from "../../Universal/Checkbox";
import { Options } from "../../Universal/Options";
import { AttributeMods } from "../AttributeMods";
import { Sheet } from "../Sheet";
import { HeaderValue } from "../SheetHeader";
import { SheetWrapper } from "../SheetWrapper";
import { SpellsSheetCantrips } from "./SpellsSheetCantrips";
import { SpellsSheetSpecialAbilities } from "./SpellsSheetSpecialAbilities";
import { SpellsSheetSpells } from "./SpellsSheetSpells";
import { SpellsSheetTraditionsProperties } from "./SpellsSheetTraditionsProperties";

export interface SpellsSheetProps {
  attributes: List<Record<AttributeCombined>>
  cantrips: Maybe<List<Record<CantripCombined>>>
  checkAttributeValueVisibility: boolean
  derivedCharacteristics: List<Record<DerivedCharacteristic>>
  l10n: L10nRecord
  magicalPrimary: List<string>
  magicalSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  magicalTradition: string
  properties: Maybe<string>
  spells: Maybe<List<Record<SpellWithRequirements>>>
  switchAttributeValueVisibility (): void
}

export function SpellsSheet (props: SpellsSheetProps) {
  const {
    checkAttributeValueVisibility,
    derivedCharacteristics,
    l10n,
    switchAttributeValueVisibility,
  } = props

  const addHeader = List<Record<HeaderValue>> (
    HeaderValue ({
      id: "AE_MAX",
      short: translate (l10n) ("aemax"),
      value:
        pipe_ (
          derivedCharacteristics,
          find (pipe (DerivedCharacteristic.A.id, equals<DCId> (DCId.AE))),
          bindF (DerivedCharacteristic.A.value)
        ),
    }),
    HeaderValue ({
      id: "AE_CURRENT",
      short: translate (l10n) ("current"),
    })
  )

  return (
    <SheetWrapper>
      <Options>
        <Checkbox
          checked={checkAttributeValueVisibility}
          onClick={switchAttributeValueVisibility}
          >
          {translate (l10n) ("showattributevalues")}
        </Checkbox>
      </Options>
      <Sheet
        {...props}
        id="spells-sheet"
        title={translate (l10n) ("spellsandrituals")}
        addHeaderInfo={addHeader}
        >
        <div className="all">
          <SpellsSheetSpells {...props} />
          <AttributeMods {...props} />
          <SpellsSheetTraditionsProperties {...props} />
          <SpellsSheetSpecialAbilities {...props} />
          <SpellsSheetCantrips {...props} />
        </div>
      </Sheet>
    </SheetWrapper>
  )
}
