import { AppState } from '../reducers/app';
import * as activatable from '../selectors/activatableSelectors';
import * as attributes from '../selectors/attributeSelectors';
import * as combatTechniques from '../selectors/combatTechniquesSelectors';
import { getForSave as getEquipmentForSave } from '../selectors/equipmentSelectors';
import * as liturgies from '../selectors/liturgiesSelectors';
import { getForSave as getPetsForSave } from '../selectors/petsSelectors';
import * as skills from '../selectors/skills';
import * as spells from '../selectors/spellsSelectors';
import { HeroForSave } from '../types/data.d';
import { currentVersion } from '../utils/VersionUtils';

export function generateHeroSaveData(state: AppState): HeroForSave {
	const {
		currentHero: { present: {
			ap,
			dependent,
			el,
			equipment,
			pets,
			phase,
			rcp: { race: r, culture: c, profession: p, professionVariant: pv },
			profile: {
				avatar,
				dateCreated,
				dateModified,
				name,
				sex,
				professionName,
				...pers
			},
			rules
		}},
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
		ap,
		el: el.startId!,
		r: r!,
		c: c!,
		p: p!,
		professionName: p === 'P_0' ? professionName : undefined,
		pv,
		sex: sex!,
		pers,
		attr: attributes.getForSave(state),
		activatable: activatable.getForSave(dependent),
		talents: skills.getForSave(dependent),
		ct: combatTechniques.getForSave(state),
		spells: spells.getForSave(dependent),
		cantrips: spells.getCantripsForSave(dependent),
		liturgies: liturgies.getForSave(dependent),
		blessings: liturgies.getBlessingsForSave(dependent),
		belongings: getEquipmentForSave(equipment),
		rules,
		pets: getPetsForSave(pets)
	};

	return obj;
}
