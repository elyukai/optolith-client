import APStore from '../stores/APStore';
import AttributeStore from '../stores/AttributeStore';
import CombatTechniquesStore from '../stores/CombatTechniquesStore';
import CultureStore from '../stores/rcp/CultureStore';
import DisAdvStore from '../stores/DisAdvStore';
import ELStore from '../stores/ELStore';
import LiturgiesStore from '../stores/LiturgiesStore';
import ProfessionStore from '../stores/rcp/ProfessionStore';
import ProfessionVariantStore from '../stores/rcp/ProfessionVariantStore';
import ProfileStore from '../stores/ProfileStore';
import RaceStore from '../stores/rcp/RaceStore';
import SpecialAbilitiesStore from '../stores/SpecialAbilitiesStore';
import SpellsStore from '../stores/SpellsStore';
import TalentsStore from '../stores/TalentsStore';
import WebAPIUtils from './WebAPIUtils';

export default () => {
	var data = [
		{
			id: 'H_0',
			name: ProfileStore.getName(),
			avatar: ProfileStore.getPortrait(),
			ap: APStore.getForSave(),
			el: ELStore.getStartID(),
			r: RaceStore.getCurrentID(),
			c: CultureStore.getCurrentID(),
			p: ProfessionStore.getCurrentID(),
			pv: ProfessionVariantStore.getCurrentID()
		},
		{
			sex: ProfileStore.getGender(),
			pers: ProfileStore.getAppearance(),
			attr: AttributeStore.getForSave(),
			disadv: DisAdvStore.getForSave(),
			talents: TalentsStore.getForSave(),
			ct: CombatTechniquesStore.getForSave(),
			spells: SpellsStore.getForSave(),
			chants: LiturgiesStore.getForSave(),
			sa: SpecialAbilitiesStore.getForSave()
		}
	];

	var json = JSON.stringify(data);

	WebAPIUtils.saveHero(json);

	return true;
};