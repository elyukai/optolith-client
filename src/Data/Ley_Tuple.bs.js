// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";

function pair(x, y) {
  return [
          x,
          y
        ];
}

function bimap(f, g, param) {
  return [
          Curry._1(f, param[0]),
          Curry._1(g, param[1])
        ];
}

function first(f, param) {
  return [
          Curry._1(f, param[0]),
          param[1]
        ];
}

function second(f, param) {
  return [
          param[0],
          Curry._1(f, param[1])
        ];
}

var Bifunctor = {
  bimap: bimap,
  first: first,
  second: second
};

function fst(param) {
  return param[0];
}

function snd(param) {
  return param[1];
}

function swap(param) {
  return [
          param[1],
          param[0]
        ];
}

export {
  pair ,
  Bifunctor ,
  fst ,
  snd ,
  swap ,
  
}
/* No side effect */
