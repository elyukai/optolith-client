import * as Categories from '../constants/Categories';
import { ValueOptionalDependency } from './reusable.d';

export interface AttributeInstance {
	readonly id: string;
	readonly name: string;
	readonly short: string;
	readonly ic: number;
	readonly category: Categories.ATTRIBUTES;
	dependencies: (number | ValueOptionalDependency)[];
	mod: number;
	value: number;
}

export interface ATTR_1 extends AttributeInstance {
	id: "ATTR_1";
}

export interface ATTR_2 extends AttributeInstance {
	id: "ATTR_2";
}

export interface ATTR_3 extends AttributeInstance {
	id: "ATTR_3";
}

export interface ATTR_4 extends AttributeInstance {
	id: "ATTR_4";
}

export interface ATTR_5 extends AttributeInstance {
	id: "ATTR_5";
}

export interface ATTR_6 extends AttributeInstance {
	id: "ATTR_6";
}

export interface ATTR_7 extends AttributeInstance {
	id: "ATTR_7";
}

export interface ATTR_8 extends AttributeInstance {
	id: "ATTR_8";
}

export type AllAttributes = ATTR_1 | ATTR_2 | ATTR_3 | ATTR_4 | ATTR_5 | ATTR_6 | ATTR_7 | ATTR_8;
