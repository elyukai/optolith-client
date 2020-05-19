/* TypeScript file generated from SegmentedControls.re by genType. */
/* eslint-disable import/first */


import * as React from 'react';

// tslint:disable-next-line:no-var-requires
const SegmentedControlsBS = require('./SegmentedControls.bs');

import {list} from '../../../../src/shims/ReasonPervasives.shim';

// tslint:disable-next-line:interface-over-type-literal
export type segment<a> = {
  readonly name: string; 
  readonly label: string; 
  readonly value?: a; 
  readonly disabled: boolean
};

// tslint:disable-next-line:interface-over-type-literal
export type Props<T1> = {
  readonly active?: T1; 
  readonly disabled?: boolean; 
  readonly label?: string; 
  readonly name: string; 
  readonly onClick: (_1:(null | undefined | T1)) => void; 
  readonly onClickSafe: (_1:T1) => void; 
  readonly options: list<segment<T1>>
};

export const make: React.ComponentType<{
  readonly active?: any; 
  readonly disabled?: boolean; 
  readonly label?: string; 
  readonly name: string; 
  readonly onClick: (_1:(null | undefined | any)) => void; 
  readonly onClickSafe: (_1:any) => void; 
  readonly options: list<segment<any>>
}> = SegmentedControlsBS.make;
