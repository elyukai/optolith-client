import * as React from 'react';
import { ArmorZone, AttributeCombined, CombatTechniqueWithAttackParryBase, MeleeWeapon, RangedWeapon, ShieldOrParryingWeapon } from '../../../App/Models/View/viewTypeHelpers';
import { SpecialAbility } from '../../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { Options } from '../../../components/Options';
import { ActiveViewObject, SecondaryAttribute } from '../../../types/data';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { Sheet } from '../Sheet';
import { HeaderValue } from '../SheetHeader';
import { SheetWrapper } from '../SheetWrapper';
import { CombatSheetArmorZones } from './CombatSheetArmorZones';
import { CombatSheetLifePoints } from './CombatSheetLifePoints';
import { CombatSheetMeleeWeapons } from './CombatSheetMeleeWeapons';
import { CombatSheetRangedWeapons } from './CombatSheetRangedWeapons';
import { CombatSheetShields } from './CombatSheetShields';
import { CombatSheetSpecialAbilities } from './CombatSheetSpecialAbilities';
import { CombatSheetStates } from './CombatSheetStates';
import { CombatSheetTechniques } from './CombatSheetTechniques';

export interface CombatSheetZonesProps {
  armorZones: Maybe<List<Record<ArmorZone>>>;
  attributes: List<Record<AttributeCombined>>;
  combatSpecialAbilities: Maybe<List<Record<ActiveViewObject<SpecialAbility>>>>;
  combatTechniques: Maybe<List<Record<CombatTechniqueWithAttackParryBase>>>;
  derivedCharacteristics: List<Record<SecondaryAttribute>>;
  locale: UIMessagesObject;
  meleeWeapons: Maybe<List<Record<MeleeWeapon>>>;
  rangedWeapons: Maybe<List<Record<RangedWeapon>>>;
  shieldsAndParryingWeapons: Maybe<List<Record<ShieldOrParryingWeapon>>>;
}

export function CombatSheetZones (props: CombatSheetZonesProps) {
  const {
    armorZones,
    attributes,
    combatSpecialAbilities,
    combatTechniques,
    derivedCharacteristics,
    locale,
    meleeWeapons,
    rangedWeapons,
    shieldsAndParryingWeapons,
  } = props;

  const addHeader = List.null (derivedCharacteristics)
    ? List.empty<Record<HeaderValue>> ()
    : List.drop<Record<HeaderValue>>
        (3)
        (derivedCharacteristics as any as List<Record<HeaderValue>>)
          .cons (List.head (derivedCharacteristics as any as List<Record<HeaderValue>>));

  return (
    <SheetWrapper>
      <Options/>
      <Sheet
        id="combat-sheet-zones"
        title={translate (locale, 'charactersheet.combat.title')}
        addHeaderInfo={addHeader}
        attributes={attributes}
        locale={locale}
        >
        <div className="upper">
          <CombatSheetTechniques
            attributes={attributes}
            combatTechniques={combatTechniques}
            locale={locale}
            />
          <CombatSheetLifePoints
            derivedCharacteristics={derivedCharacteristics}
            locale={locale}
            />
        </div>
        <div className="lower">
          <CombatSheetMeleeWeapons
            locale={locale}
            meleeWeapons={meleeWeapons}
            />
          <CombatSheetRangedWeapons
            locale={locale}
            rangedWeapons={rangedWeapons}
            />
          <CombatSheetArmorZones
            armorZones={armorZones}
            locale={locale}
            />
          <CombatSheetShields
            locale={locale}
            shieldsAndParryingWeapons={shieldsAndParryingWeapons}
            />
          <CombatSheetSpecialAbilities
            locale={locale}
            combatSpecialAbilities={combatSpecialAbilities}
            />
          <CombatSheetStates locale={locale} />
        </div>
      </Sheet>
    </SheetWrapper>
  );
}
