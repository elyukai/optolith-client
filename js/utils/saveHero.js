import APStore from '../stores/APStore';
import AttributeStore from '../stores/AttributeStore';
import CombatTechniquesStore from '../stores/CombatTechniquesStore';
import CultureStore from '../stores/CultureStore';
import DisAdvStore from '../stores/DisAdvStore';
import ELStore from '../stores/ELStore';
import HistoryStore from '../stores/HistoryStore';
import LiturgiesStore from '../stores/LiturgiesStore';
import PhaseStore from '../stores/PhaseStore';
import ProfessionStore from '../stores/ProfessionStore';
import ProfessionVariantStore from '../stores/ProfessionVariantStore';
import ProfileStore from '../stores/ProfileStore';
import RaceStore from '../stores/RaceStore';
import SpecialAbilitiesStore from '../stores/SpecialAbilitiesStore';
import SpellsStore from '../stores/SpellsStore';
import TalentsStore from '../stores/TalentsStore';
import VersionStore from '../stores/VersionStore';
import WebAPIUtils from './WebAPIUtils';

export const generateArray = () => [
	{
		client_version: VersionStore.get(),
		date: (new Date()).toJSON(),
		id: ProfileStore.getID(),
		phase: PhaseStore.get(),
		name: ProfileStore.getName(),
		avatar: ProfileStore.getAvatar(),
		ap: APStore.getForSave(),
		el: ELStore.getStartID(),
		r: RaceStore.getCurrentID(),
		c: CultureStore.getCurrentID(),
		p: ProfessionStore.getCurrentID(),
		pv: ProfessionVariantStore.getCurrentID(),
		sex: ProfileStore.getSex()
	},
	{
		pers: ProfileStore.getAppearance(),
		attr: AttributeStore.getForSave(),
		disadv: DisAdvStore.getForSave(),
		talents: TalentsStore.getForSave(),
		ct: CombatTechniquesStore.getForSave(),
		spells: SpellsStore.getForSave(),
		chants: LiturgiesStore.getForSave(),
		sa: SpecialAbilitiesStore.getForSave(),
		eq: {},
		items: {},
		history: HistoryStore.getAll()
	}
];

export default () => {
	var json = JSON.stringify(generateArray());

	WebAPIUtils.saveHero(json);

	return true;
};
