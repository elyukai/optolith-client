/* TypeScript file generated from Activatable.rei by genType. */
/* eslint-disable import/first */


import {Activatable_parameter as Hero_Activatable_parameter} from '../../../src/App/Models/Hero.gen';

import {list} from '../../../src/shims/ReasonPervasives.shim';

// tslint:disable-next-line:interface-over-type-literal
export type singleWithId = {
  readonly id: number; 
  readonly options: list<Hero_Activatable_parameter>; 
  readonly level?: number; 
  readonly customCost?: number
};
export type ActivatableSingleWithId = singleWithId;
