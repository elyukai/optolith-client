/* TypeScript file generated from Maybe.rei by genType. */
/* eslint-disable import/first */


const $$toJS1024164449: { [key: string]: any } = {"0": "Nothing"};

const $$toRE1024164449: { [key: string]: any } = {"Nothing": 0};

// tslint:disable-next-line:no-var-requires
const CreateBucklescriptBlock = require('bs-platform/lib/js/block.js');

// tslint:disable-next-line:no-var-requires
const MaybeBS = require('./Maybe.bs');

// tslint:disable-next-line:interface-over-type-literal
export type t<a> = "Nothing" | { tag: "Just"; value: a };
export type Maybe<a> = t<a>;

// tslint:disable-next-line:interface-over-type-literal
export type maybe<a> = t<a>;
export type Maybe_<a> = maybe<a>;

/** 
   * Removes one level of monadic structure.
    */
export const Monad_join: <a>(_1:t<t<a>>) => t<a> = function <a>(Arg1: any) {
  const result = 
/* WARNING: circular type t. Only shallow converter applied. */
  MaybeBS.Monad.join(typeof(Arg1) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : $$toRE1024164449[Arg1]);
  return typeof(result) === 'object'
    ? {tag:"Just", value:result[0]}
    : $$toJS1024164449[result]
};

/** 
 *
  */
export const maybeToOption: <a>(_1:t<a>) => (null | undefined | a) = function <a>(Arg1: any) {
  const result = MaybeBS.maybeToOption(typeof(Arg1) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : $$toRE1024164449[Arg1]);
  return result
};

/** 
 *
  */
export const optionToMaybe: <a>(_1:(null | undefined | a)) => t<a> = function <a>(Arg1: any) {
  const result = MaybeBS.optionToMaybe((Arg1 == null ? undefined : Arg1));
  return typeof(result) === 'object'
    ? {tag:"Just", value:result[0]}
    : $$toJS1024164449[result]
};
