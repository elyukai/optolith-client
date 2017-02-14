import Core from './Core';
import { fixIDs } from '../utils/DataUtils';
import dice from '../utils/dice';
import * as Categories from '../constants/Categories';

export default class Race extends Core implements RaceInstance {

	static hairColors = ['blauschwarz', 'blond', 'braun', 'dunkelblond', 'dunkelbraun', 'goldblond', 'grau', 'hellblond', 'hellbraun', 'kupferrot', 'mittelblond', 'mittelbraun', 'rot', 'rotblond', 'schneeweiß', 'schwarz', 'silbern', 'weißblond', 'dunkelgrau', 'hellgrau', 'salzweiß', 'silberweiß', 'feuerrot'];
	static eyeColors = ['amethystviolett', 'bernsteinfarben', 'blau', 'braun', 'dunkelbraun', 'dunkelviolett', 'eisgrau', 'goldgesprenkelt', 'grau', 'graublau', 'grün', 'hellbraun', 'rubinrot', 'saphirblau', 'schwarz', 'schwarzbraun', 'silbergrau', 'smaragdgrün'];
	readonly ap: number;
	readonly lp: number;
	readonly spi: number;
	readonly tou: number;
	readonly mov: number;
	readonly attributes: (string | number)[][];
	readonly attributeSelection: [number, string[]];
	readonly typicalCultures: string[];
	readonly autoAdvantages: (string | number)[][];
	readonly importantAdvantages: (string | number)[][];
	readonly importantDisadvantages: (string | number)[][];
	readonly typicalAdvantages: string[];
	readonly typicalDisadvantages: string[];
	readonly untypicalAdvantages: string[];
	readonly untypicalDisadvantages: string[];
	readonly hairColors: number[];
	readonly eyeColors: number[];
	readonly size: (number | [number, number])[];
	readonly weight: (number | [number, number])[];
	readonly category = Categories.RACES;

	constructor({ ap, le, sk, zk, gs, attr, attr_sel, typ_cultures, auto_adv, imp_adv, imp_dadv, typ_adv, typ_dadv, untyp_adv, untyp_dadv, hair, eyes, size, weight, ...args }: RawRace) {
		super(args);

		this.ap = ap;

		this.lp = le;
		this.spi = sk;
		this.tou = zk;
		this.mov = gs;

		this.attributes = fixIDs<number>(attr, 'ATTR', 1);
		this.attributeSelection = [attr_sel[0], attr_sel[1].map(k => `ATTR_${k}`)];

		this.typicalCultures = typ_cultures.map(e => `C_${e}`);

		this.autoAdvantages = fixIDs<number>(auto_adv, 'ADV');
		this.importantAdvantages = fixIDs<number>(imp_adv, 'ADV');
		this.importantDisadvantages = fixIDs<number>(imp_dadv, 'DISADV');

		this.typicalAdvantages = typ_adv.map(e => `ADV_${e}`);
		this.typicalDisadvantages = typ_dadv.map(e => `DISADV_${e}`);
		this.untypicalAdvantages = untyp_adv.map(e => `ADV_${e}`);
		this.untypicalDisadvantages = untyp_dadv.map(e => `DISADV_${e}`);

		this.hairColors = hair;
		this.eyeColors = eyes;
		this.size = size;
		this.weight = weight;
	}

	static rerollHairColor(current: RaceInstance) {
		const result = dice(20);
		return current.hairColors[result - 1];
	}

	static rerollEyeColor(current: RaceInstance) {
		const result = dice(20);
		return current.eyeColors[result - 1];
	}

	static rerollSize(race: RaceInstance) {
		const [ base, ...dices ] = race.size;
		const arr: number[] = [];
		dices.forEach((e: [number, number]) => {
			const elements = Array.from({ length: e[0] }, () => e[1]);
			arr.push(...elements);
		});
		const result = (base as number) + arr.map(e => dice(e)).reduce((a,b) => a + b, 0);
		return result.toString();
	}

	static rerollWeight(race: RaceInstance, size: string = this.rerollSize(race)) {
		const { id, weight } = race;
		const [ base, ...dices ] = weight;
		const arr: number[] = [];
		dices.forEach((e: [number, number]) => {
			const elements = Array.from({ length: e[0] }, () => e[1]);
			arr.push(...elements);
		});
		const add = ['R_1','R_2','R_3','R_4','R_5','R_6','R_7'].includes(id) ?
			arr.map(e => {
				const result = dice(Math.abs(e));
				return result % 2 > 0 ? -result : result;
			}) :
			arr.map(e => {
				const result = dice(Math.abs(e));
				return e < 0 ? -result : result;
			});
		const result = Number.parseInt(size) + (base as number) + add.reduce((a,b) => a + b, 0);
		return [result.toString(), size] as [string, string];
	}
}
