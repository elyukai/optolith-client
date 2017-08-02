import { AddArcaneEnergyPointAction, AddAttributePointAction, AddBoughtBackAEPointAction, AddBoughtBackKPPointAction, AddKarmaPointAction, AddLifePointAction, AddLostAEPointAction, AddLostAEPointsAction, AddLostKPPointAction, AddLostKPPointsAction, RemoveAttributePointAction, RemoveBoughtBackAEPointAction, RemoveBoughtBackKPPointAction, RemoveLostAEPointAction, RemoveLostKPPointAction } from '../actions/AttributesActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { UndoTriggerActions } from '../actions/HistoryActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';

import { AttributeInstance, SpecialAbilityInstance } from '../types/data.d';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import { HistoryStore } from './HistoryStore';
import { get, getAllByCategory, ListStore } from './ListStore';
import { RequirementsStore } from './RequirementsStore';
import { Store } from './Store';

type Action = AddAttributePointAction | RemoveAttributePointAction | AddArcaneEnergyPointAction | AddKarmaPointAction | AddLifePointAction | LoadHeroAction | CreateHeroAction | UndoTriggerActions | AddBoughtBackAEPointAction | AddBoughtBackKPPointAction | AddLostAEPointAction | AddLostAEPointsAction | AddLostKPPointAction | AddLostKPPointsAction | RemoveBoughtBackAEPointAction | RemoveBoughtBackKPPointAction | RemoveLostAEPointAction | RemoveLostKPPointAction | SetSelectionsAction;
type ids = 'LP' | 'AE' | 'KP';

class AttributeStoreStatic extends Store {
	private readonly category = Categories.ATTRIBUTES;
	private addedLifePoints = 0;
	private addedArcaneEnergy = 0;
	private addedKarmaPoints = 0;
	private permanentArcaneEnergy = {
		lost: 0,
		redeemed: 0,
	};
	private permanentKarmaPoints = {
		lost: 0,
		redeemed: 0,
	};
	readonly dispatchToken: string;

	getAll() {
		return getAllByCategory(this.category) as AttributeInstance[];
	}

	getAdd(id: ids) {
		switch (id) {
			case 'LP':
				return this.addedLifePoints;
			case 'AE':
				return this.addedArcaneEnergy;
			case 'KP':
				return this.addedKarmaPoints;
		}
	}

	getAddEnergies() {
		return {
			ae: this.addedArcaneEnergy,
			kp: this.addedKarmaPoints,
			lp: this.addedLifePoints,
			permanentAE: this.permanentArcaneEnergy,
			permanentKP: this.permanentKarmaPoints,
		};
	}

	getSum() {
		return this.getAll().reduce((a, b) => a + b.value, 0);
	}

	getForSave() {
		return {
			values: this.getAll().map(e => [e.id, e.value, e.mod] as [string, number, number]),
			...this.getAddEnergies(),
		};
	}

	private addLifePoint() {
		this.addedLifePoints++;
	}

	private addArcaneEnergyPoint() {
		this.addedArcaneEnergy++;
	}

	private addKarmaPoint() {
		this.addedKarmaPoints++;
	}

	private removeLifePoint() {
		this.addedLifePoints--;
	}

	private removeArcaneEnergyPoint() {
		this.addedArcaneEnergy--;
	}

	private removeKarmaPoint() {
		this.addedKarmaPoints--;
	}

	private addBoughtBackAEPoint() {
		this.permanentArcaneEnergy.redeemed++;
	}

	private addBoughtBackKPPoint() {
		this.permanentKarmaPoints.redeemed++;
	}

	private removeBoughtBackAEPoint() {
		this.permanentArcaneEnergy.redeemed--;
	}

	private removeBoughtBackKPPoint() {
		this.permanentKarmaPoints.redeemed--;
	}

	private removePermanentAEPoints(value: number) {
		this.permanentArcaneEnergy.lost += value;
	}

	private removePermanentKPPoints(value: number) {
		this.permanentKarmaPoints.lost += value;
	}

	private addLostAEPoint() {
		this.permanentArcaneEnergy.lost++;
	}

	private addLostKPPoint() {
		this.permanentKarmaPoints.lost++;
	}

	private removeLostAEPoint() {
		this.permanentArcaneEnergy.lost--;
	}

	private removeLostKPPoint() {
		this.permanentKarmaPoints.lost--;
	}

	private addPermanentAEPoints(value: number) {
		this.permanentArcaneEnergy.lost -= value;
	}

	private addPermanentKPPoints(value: number) {
		this.permanentKarmaPoints.lost -= value;
	}

	private clear() {
		this.addedLifePoints = 0;
		this.addedArcaneEnergy = 0;
		this.addedKarmaPoints = 0;
		this.permanentArcaneEnergy = { lost: 0, redeemed: 0 };
		this.permanentKarmaPoints = { lost: 0, redeemed: 0 };
	}

	private updateAll(obj: { lp: number; ae: number; kp: number; permanentAE: { lost: number; redeemed: number; }; permanentKP: { lost: number; redeemed: number; }; }) {
		this.addedLifePoints = obj.lp;
		this.addedArcaneEnergy = obj.ae;
		this.addedKarmaPoints = obj.kp;
		this.permanentArcaneEnergy = obj.permanentAE;
		this.permanentKarmaPoints = obj.permanentKP;
	}

	private assign() {
		if (ActivatableUtils.isActive(get('SA_92') as SpecialAbilityInstance)) {
			this.permanentArcaneEnergy.lost += 2;
		}
	}
}

export const AttributeStore: AttributeStoreStatic = new AttributeStoreStatic();
