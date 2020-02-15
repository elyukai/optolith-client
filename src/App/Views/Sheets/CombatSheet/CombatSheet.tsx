import * as React from "react"
import { cons, drop, fnull, head, List, map } from "../../../../Data/List"
import { Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { ActiveActivatable } from "../../../Models/View/ActiveActivatable"
import { Armor } from "../../../Models/View/Armor"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { CombatTechniqueWithAttackParryBase } from "../../../Models/View/CombatTechniqueWithAttackParryBase"
import { DerivedCharacteristic } from "../../../Models/View/DerivedCharacteristic"
import { MeleeWeapon } from "../../../Models/View/MeleeWeapon"
import { RangedWeapon } from "../../../Models/View/RangedWeapon"
import { ShieldOrParryingWeapon } from "../../../Models/View/ShieldOrParryingWeapon"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { Options } from "../../Universal/Options"
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
  (e: Record<DerivedCharacteristic>) =>
    HeaderValue ({
      id: DerivedCharacteristic.A.id (e),
      short: DerivedCharacteristic.A.short (e),
      value: DerivedCharacteristic.A.value (e),
    })

export const getAddCombatHeaderVals =
  (derivedCharacteristics: List<Record<DerivedCharacteristic>>) =>
    fnull (derivedCharacteristics)
      ? List<Record<HeaderValue>> ()
      : cons (drop (3) (map (dcToHeaderVal) (derivedCharacteristics)))
             (dcToHeaderVal (head (derivedCharacteristics)))

interface Props {
  armors: Maybe<List<Record<Armor>>>
  attributes: List<Record<AttributeCombined>>
  combatSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  combatTechniques: Maybe<List<Record<CombatTechniqueWithAttackParryBase>>>
  derivedCharacteristics: List<Record<DerivedCharacteristic>>
  staticData: StaticDataRecord
  meleeWeapons: Maybe<List<Record<MeleeWeapon>>>
  rangedWeapons: Maybe<List<Record<RangedWeapon>>>
  shieldsAndParryingWeapons: Maybe<List<Record<ShieldOrParryingWeapon>>>
  conditions: List<Record<NumIdName>>
  states: List<Record<NumIdName>>
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
  } = props

  const addHeader = getAddCombatHeaderVals (derivedCharacteristics)

  return (
    <SheetWrapper>
      <Options />
      <Sheet
        id="combat-sheet"
        title={translate (staticData) ("sheets.combatsheet.title")}
        addHeaderInfo={addHeader}
        attributes={attributes}
        staticData={staticData}
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
