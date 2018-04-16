import { AppState } from '../reducers/app';
import * as activatable from '../selectors/activatableSelectors';
import * as attributes from '../selectors/attributeSelectors';
import * as combatTechniques from '../selectors/combatTechniquesSelectors';
import { getForSave as getEquipmentForSave } from '../selectors/equipmentSelectors';
import { getLiturgicalChantsAndBlessingsForSave } from '../selectors/liturgiesSelectors';
import { getForSave as getPetsForSave } from '../selectors/petsSelectors';
import { getSpellsAndCantripsForSave} from '../selectors/spellsSelectors';
import { getSkillsForSave } from '../selectors/talentsSelectors';
import { HeroForSave } from '../types/data.d';
import { currentVersion } from '../utils/VersionUtils';
import { AdventurePointsObject } from '../selectors/adventurePointsSelectors';

export function generateHeroSaveData(
  state: AppState,
  adventurePoints: AdventurePointsObject
): HeroForSave {
  const {
    currentHero: {
      present: {
        dependent,
        el,
        equipment,
        pets,
        phase,
        rcp: {
          race: r,
          raceVariant: rv,
          culture: c,
          profession: p,
          professionVariant: pv
        },
        profile: {
          avatar,
          dateCreated,
          dateModified,
          name,
          sex,
          professionName,
          ...pers
        },
        rules: {
          enabledRuleBooks,
          ...otherRules
        }
      }
    },
    herolist: {
      currentId
    }
  } = state;
  const obj: HeroForSave = {
    clientVersion: currentVersion,
    dateCreated,
    dateModified,
    id: currentId,
    phase,
    name: name!,
    avatar,
    ap: {
      total: adventurePoints.total,
      spent: adventurePoints.spent,
    },
    el: el.startId!,
    r: r!,
    rv,
    c: c!,
    p: p!,
    professionName: p === 'P_0' ? professionName : undefined,
    pv,
    sex: sex!,
    pers,
    attr: attributes.getForSave(state),
    activatable: activatable.getForSave(dependent),
    talents: getSkillsForSave(state),
    ct: combatTechniques.getForSave(state),
    ...getSpellsAndCantripsForSave(state),
    ...getLiturgicalChantsAndBlessingsForSave(state),
    belongings: getEquipmentForSave(equipment),
    rules: {
      ...otherRules,
      enabledRuleBooks: [...enabledRuleBooks]
    },
    pets: getPetsForSave(pets)
  };

  return obj;
}
