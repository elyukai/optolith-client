/* TypeScript file generated from OptionalRule.re by genType. */
/* eslint-disable import/first */


import {list} from './ReasonPervasives.gen';

import {t as Erratum_t} from './Erratum.gen';

import {t as SourceRef_t} from './SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: string; 
  readonly name: string; 
  readonly description: string; 
  readonly src: list<SourceRef_t>; 
  readonly errata: list<Erratum_t>
};
