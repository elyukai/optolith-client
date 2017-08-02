import * as activatable from '../reducers/activatable';
import { AppState } from '../reducers/app';
import * as attributes from '../selectors/attributes';
import * as chants from '../selectors/chants';
import * as combatTechniques from '../selectors/combatTechniques';
import { getForSave as getEquipmentForSave } from '../selectors/equipmentSelectors';
import { getForSave as getPetsForSave } from '../selectors/petsSelectors';
import * as skills from '../selectors/skills';
import * as spells from '../selectors/spells';
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
		attr: attributes.getForSave(state.currentHero),
		activatable: activatable.getForSave(dependent),
		talents: skills.getForSave(dependent),
		ct: combatTechniques.getForSave(dependent),
		spells: spells.getForSave(dependent),
		cantrips: spells.getCantripsForSave(dependent),
		liturgies: chants.getForSave(dependent),
		blessings: chants.getBlessingsForSave(dependent),
		belongings: getEquipmentForSave(equipment),
		rules,
		pets: getPetsForSave(pets)
	};

	return obj;
}
