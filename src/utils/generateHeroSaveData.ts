import * as ActivatableStore from '../stores/ActivatableStore';
import { APStore } from '../stores/APStore';
import { AttributeStore } from '../stores/AttributeStore';
import { CombatTechniquesStore } from '../stores/CombatTechniquesStore';
import { CultureStore } from '../stores/CultureStore';
import { ELStore } from '../stores/ELStore';
import { EquipmentStore } from '../stores/EquipmentStore';
import { HerolistStore } from '../stores/HerolistStore';
import { HistoryStore } from '../stores/HistoryStore';
import { LiturgiesStore } from '../stores/LiturgiesStore';
import { PetsStore } from '../stores/PetsStore';
import { PhaseStore } from '../stores/PhaseStore';
import { ProfessionStore } from '../stores/ProfessionStore';
import { ProfessionVariantStore } from '../stores/ProfessionVariantStore';
import { ProfileStore } from '../stores/ProfileStore';
import { RaceStore } from '../stores/RaceStore';
import { RulesStore } from '../stores/RulesStore';
import { SpellsStore } from '../stores/SpellsStore';
import { TalentsStore } from '../stores/TalentsStore';
import { HeroForSave } from '../types/data.d';
import { currentVersion } from '../utils/VersionUtils';

export function generateHeroSaveData(): HeroForSave {
	const obj: HeroForSave = {
		clientVersion: currentVersion,
		dateCreated: ProfileStore.getDateCreated(),
		dateModified: new Date(),
		id: HerolistStore.getCurrentId(),
		phase: PhaseStore.get(),
		name: ProfileStore.getName(),
		avatar: ProfileStore.getAvatar(),
		ap: APStore.getAll(),
		el: ELStore.getStartID(),
		r: RaceStore.getCurrentID()!,
		c: CultureStore.getCurrentID()!,
		p: ProfessionStore.getCurrentId()!,
		pv: ProfessionVariantStore.getCurrentID(),
		sex: ProfileStore.getSex(),
		pers: ProfileStore.getForSave(),
		attr: AttributeStore.getForSave(),
		activatable: ActivatableStore.getForSave(),
		talents: TalentsStore.getForSave(),
		ct: CombatTechniquesStore.getAllForSave(),
		spells: SpellsStore.getForSave(),
		cantrips: SpellsStore.getCantripsForSave(),
		liturgies: LiturgiesStore.getForSave(),
		blessings: LiturgiesStore.getBlessingsForSave(),
		belongings: {
			equipment: {},
			items: EquipmentStore.getAllById(),
			pet: {},
			purse: EquipmentStore.getPurse(),
		},
		rules: RulesStore.getAll(),
		history: HistoryStore.getAll(),
		pets: PetsStore.getAllById()
	};

	if (obj.p === 'P_0') {
		obj.professionName = ProfileStore.getCustomProfessionName();
	}

	return obj;
}
