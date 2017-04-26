import { PetEditorInstance, PetInstance } from '../types/data.d';

export function convertToEdit(item: PetInstance): PetEditorInstance {
	return {
		...item,
		spentAp: item.spentAp ? item.spentAp.toString() : '',
		totalAp: item.totalAp ? item.totalAp.toString() : '',
		cou: item.cou ? item.cou.toString() : '',
		sgc: item.sgc ? item.sgc.toString() : '',
		int: item.int ? item.int.toString() : '',
		cha: item.cha ? item.cha.toString() : '',
		dex: item.dex ? item.dex.toString() : '',
		agi: item.agi ? item.agi.toString() : '',
		con: item.con ? item.con.toString() : '',
		str: item.str ? item.str.toString() : '',
		lp: item.lp ? item.lp.toString() : '',
		ae: item.ae ? item.ae.toString() : '',
		spi: item.spi ? item.spi.toString() : '',
		tou: item.tou ? item.tou.toString() : '',
		pro: item.pro ? item.pro.toString() : '',
		ini: item.ini ? item.ini.toString() : '',
		mov: item.mov ? item.mov.toString() : '',
		at: item.at ? item.at.toString() : '',
		pa: item.pa ? item.pa.toString() : ''
	};
}

export function getNewInstance(): PetEditorInstance {
	return {
		name: '',
		size: '',
		type: '',
		avatar: '',
		attack: '',
		dp: '',
		reach: 1,
		actions: '',
		talents: '',
		skills: '',
		spentAp: '',
		totalAp: '',
		cou: '',
		sgc: '',
		int: '',
		cha: '',
		dex: '',
		agi: '',
		con: '',
		str: '',
		lp: '',
		ae: '',
		spi: '',
		tou: '',
		pro: '',
		ini: '',
		mov: '',
		at: '',
		pa: '',
		notes: ''
	};
}

export function convertToSave(item: PetEditorInstance): PetInstance {
	return {
		...item,
		spentAp: item.spentAp ? Number.parseInt(item.spentAp.replace(/\,/, '.')) : 0,
		totalAp: item.totalAp ? Number.parseInt(item.totalAp.replace(/\,/, '.')) : 0,
		cou: item.cou ? Number.parseInt(item.cou.replace(/\,/, '.')) : 0,
		sgc: item.sgc ? Number.parseInt(item.sgc.replace(/\,/, '.')) : 0,
		int: item.int ? Number.parseInt(item.int.replace(/\,/, '.')) : 0,
		cha: item.cha ? Number.parseInt(item.cha.replace(/\,/, '.')) : 0,
		dex: item.dex ? Number.parseInt(item.dex.replace(/\,/, '.')) : 0,
		agi: item.agi ? Number.parseInt(item.agi.replace(/\,/, '.')) : 0,
		con: item.con ? Number.parseInt(item.con.replace(/\,/, '.')) : 0,
		str: item.str ? Number.parseInt(item.str.replace(/\,/, '.')) : 0,
		lp: item.lp ? Number.parseInt(item.lp.replace(/\,/, '.')) : 0,
		ae: item.ae ? Number.parseInt(item.ae.replace(/\,/, '.')) : 0,
		spi: item.spi ? Number.parseInt(item.spi.replace(/\,/, '.')) : 0,
		tou: item.tou ? Number.parseInt(item.tou.replace(/\,/, '.')) : 0,
		pro: item.pro ? Number.parseInt(item.pro.replace(/\,/, '.')) : 0,
		ini: item.ini ? Number.parseInt(item.ini.replace(/\,/, '.')) : 0,
		mov: item.mov ? Number.parseInt(item.mov.replace(/\,/, '.')) : 0,
		at: item.at ? Number.parseInt(item.at.replace(/\,/, '.')) : 0,
		pa: item.pa ? Number.parseInt(item.pa.replace(/\,/, '.')) : 0
	};
}
