import { ATTRIBUTES } from '../constants/Categories';
import { CurrentHeroState } from '../reducers/currentHero';
import { getAllByCategory } from '../reducers/dependentInstances';
import { AttributeInstance } from '../types/data.d';

export function getForSave(state: CurrentHeroState) {
	const {
		dependent,
		energies: {
			addedArcaneEnergy: ae,
			addedKarmaPoints: kp,
			addedLifePoints: lp,
			permanentArcaneEnergy: permanentAE,
			permanentKarmaPoints: permanentKP
		}
	} = state;
	return {
		values: (getAllByCategory(dependent, ATTRIBUTES) as AttributeInstance[]).map(e => [e.id, e.value, e.mod] as [string, number, number]),
		ae,
		kp,
		lp,
		permanentAE,
		permanentKP
	};
}
