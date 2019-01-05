import * as React from 'react';
import { Armor, AttributeCombined, CombatTechniqueWithAttackParryBase, MeleeWeapon, RangedWeapon, ShieldOrParryingWeapon } from '../../../App/Models/View/viewTypeHelpers';
import { SpecialAbility } from '../../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { Options } from '../../../components/Options';
import { ActiveViewObject, SecondaryAttribute } from '../../../types/data';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { Sheet } from '../Sheet';
import { HeaderValue } from '../SheetHeader';
import { SheetWrapper } from '../SheetWrapper';
import { CombatSheetArmor } from './CombatSheetArmor';
import { CombatSheetLifePoints } from './CombatSheetLifePoints';
import { CombatSheetMeleeWeapons } from './CombatSheetMeleeWeapons';
import { CombatSheetRangedWeapons } from './CombatSheetRangedWeapons';
import { CombatSheetShields } from './CombatSheetShields';
import { CombatSheetSpecialAbilities } from './CombatSheetSpecialAbilities';
import { CombatSheetStates } from './CombatSheetStates';
import { CombatSheetTechniques } from './CombatSheetTechniques';

export interface CombatSheetProps {
  armors: Maybe<List<Record<Armor>>>;
  attributes: List<Record<AttributeCombined>>;
  combatSpecialAbilities: Maybe<List<Record<ActiveViewObject<SpecialAbility>>>>;
  combatTechniques: Maybe<List<Record<CombatTechniqueWithAttackParryBase>>>;
  derivedCharacteristics: List<Record<SecondaryAttribute>>;
  locale: UIMessagesObject;
  meleeWeapons: Maybe<List<Record<MeleeWeapon>>>;
  rangedWeapons: Maybe<List<Record<RangedWeapon>>>;
  shieldsAndParryingWeapons: Maybe<List<Record<ShieldOrParryingWeapon>>>;
}

export function CombatSheet (props: CombatSheetProps) {
  const {
    armors,
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
        id="combat-sheet"
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
          <CombatSheetArmor
            armors={armors}
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
