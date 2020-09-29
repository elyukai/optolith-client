import * as React from "react"
import { cons, drop, fnull, head, List, map } from "../../../../Data/List"
import { Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { fst, snd } from "../../../../Data/Tuple"
import { ActiveActivatable } from "../../../Models/View/ActiveActivatable"
import { Armor } from "../../../Models/View/Armor"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { CombatTechniqueWithAttackParryBase } from "../../../Models/View/CombatTechniqueWithAttackParryBase"
import { DerivedCharacteristicValues } from "../../../Models/View/DerivedCharacteristicCombined"
import { MeleeWeapon } from "../../../Models/View/MeleeWeapon"
import { RangedWeapon } from "../../../Models/View/RangedWeapon"
import { ShieldOrParryingWeapon } from "../../../Models/View/ShieldOrParryingWeapon"
import { Condition } from "../../../Models/Wiki/Condition"
import { DerivedCharacteristic } from "../../../Models/Wiki/DerivedCharacteristic"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { State } from "../../../Models/Wiki/State"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { DCPair } from "../../../Selectors/derivedCharacteristicsSelectors"
import { translate } from "../../../Utilities/I18n"
import { Sheet } from "../Sheet"
import { HeaderValue } from "../SheetHeader"
import { SheetWrapper } from "../SheetWrapper"
import { CombatSheetArmor } from "./CombatSheetArmor"
import { CombatSheetLifePoints } from "./CombatSheetLifePoints"
import { CombatSheetMeleeWeapons } from "./CombatSheetMeleeWeapons"
import { CombatSheetRangedWeapons } from "./CombatSheetRangedWeapons"
import { CombatSheetShields } from "./CombatSheetShields"
import { CombatSheetSpecialAbilities } from "./CombatSheetSpecialAbilities"
import { CombatSheetStates } from "./CombatSheetStates"
import { CombatSheetTechniques } from "./CombatSheetTechniques"

const dcToHeaderVal =
  (e: DCPair) =>
    HeaderValue ({
      id: DerivedCharacteristic.A.id (fst (e)),
      short: DerivedCharacteristic.A.short (fst (e)),
      value: DerivedCharacteristicValues.A.value (snd (e)),
    })

export const getAddCombatHeaderVals =
  (derivedCharacteristics: List<DCPair>) =>
    fnull (derivedCharacteristics)
      ? List<Record<HeaderValue>> ()
      : cons (drop (3) (map (dcToHeaderVal) (derivedCharacteristics)))
             (dcToHeaderVal (head (derivedCharacteristics)))

interface Props {
  armors: Maybe<List<Record<Armor>>>
  attributes: List<Record<AttributeCombined>>
  combatSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  combatTechniques: Maybe<List<Record<CombatTechniqueWithAttackParryBase>>>
  derivedCharacteristics: List<DCPair>
  staticData: StaticDataRecord
  meleeWeapons: Maybe<List<Record<MeleeWeapon>>>
  rangedWeapons: Maybe<List<Record<RangedWeapon>>>
  shieldsAndParryingWeapons: Maybe<List<Record<ShieldOrParryingWeapon>>>
  conditions: List<Record<Condition>>
  states: List<Record<State>>
  useParchment: boolean
}

export const CombatSheet: React.FC<Props> = props => {
  const {
    armors,
    attributes,
    combatSpecialAbilities,
    combatTechniques,
    derivedCharacteristics,
    staticData,
    meleeWeapons,
    rangedWeapons,
    shieldsAndParryingWeapons,
    conditions,
    states,
    useParchment,
  } = props

  const addHeader = getAddCombatHeaderVals (derivedCharacteristics)

  return (
    <SheetWrapper>
      <Sheet
        id="combat-sheet"
        title={translate (staticData) ("sheets.combatsheet.title")}
        addHeaderInfo={addHeader}
        attributes={attributes}
        staticData={staticData}
        useParchment={useParchment}
        >
        <div className="upper">
          <CombatSheetTechniques
            attributes={attributes}
            combatTechniques={combatTechniques}
            staticData={staticData}
            />
          <CombatSheetLifePoints
            derivedCharacteristics={derivedCharacteristics}
            staticData={staticData}
            />
        </div>
        <div className="lower">
          <CombatSheetMeleeWeapons
            staticData={staticData}
            meleeWeapons={meleeWeapons}
            />
          <CombatSheetRangedWeapons
            staticData={staticData}
            rangedWeapons={rangedWeapons}
            />
          <CombatSheetArmor
            armors={armors}
            staticData={staticData}
            />
          <CombatSheetShields
            staticData={staticData}
            shieldsAndParryingWeapons={shieldsAndParryingWeapons}
            />
          <CombatSheetSpecialAbilities
            staticData={staticData}
            combatSpecialAbilities={combatSpecialAbilities}
            />
          <CombatSheetStates staticData={staticData} conditions={conditions} states={states} />
        </div>
      </Sheet>
    </SheetWrapper>
  )
}
