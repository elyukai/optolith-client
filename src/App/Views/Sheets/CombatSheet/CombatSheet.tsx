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
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
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
  l10n: L10nRecord
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
    l10n,
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
        title={translate (l10n) ("sheets.combatsheet.title")}
        addHeaderInfo={addHeader}
        attributes={attributes}
        l10n={l10n}
        >
        <div className="upper">
          <CombatSheetTechniques
            attributes={attributes}
            combatTechniques={combatTechniques}
            l10n={l10n}
            />
          <CombatSheetLifePoints
            derivedCharacteristics={derivedCharacteristics}
            l10n={l10n}
            />
        </div>
        <div className="lower">
          <CombatSheetMeleeWeapons
            l10n={l10n}
            meleeWeapons={meleeWeapons}
            />
          <CombatSheetRangedWeapons
            l10n={l10n}
            rangedWeapons={rangedWeapons}
            />
          <CombatSheetArmor
            armors={armors}
            l10n={l10n}
            />
          <CombatSheetShields
            l10n={l10n}
            shieldsAndParryingWeapons={shieldsAndParryingWeapons}
            />
          <CombatSheetSpecialAbilities
            l10n={l10n}
            combatSpecialAbilities={combatSpecialAbilities}
            />
          <CombatSheetStates l10n={l10n} conditions={conditions} states={states} />
        </div>
      </Sheet>
    </SheetWrapper>
  )
}
