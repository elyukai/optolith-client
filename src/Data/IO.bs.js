// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Fs from "fs";
import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Ley_Monad$OptolithClient from "./Ley_Monad.bs.js";
import * as Ley_Option$OptolithClient from "./Ley_Option.bs.js";
import * as Ley_Functor$OptolithClient from "./Ley_Functor.bs.js";

function fmap(f, m) {
  return m.then(function (x) {
              return Promise.resolve(Curry._1(f, x));
            });
}

var include = Ley_Functor$OptolithClient.Make({
      fmap: fmap
    });

var fmap$1 = include.fmap;

function pure(prim) {
  return Promise.resolve(prim);
}

function bind(prim, prim$1) {
  return prim$1.then(Curry.__1(prim));
}

var include$1 = Ley_Monad$OptolithClient.Make({
      pure: pure,
      fmap: fmap$1,
      bind: bind
    });

var $$return = include$1.$$return;

var include$2 = Ley_Functor$OptolithClient.MakeInfix({
      fmap: fmap$1
    });

var $less$amp$great = include$2.$less$amp$great;

function bind$1(prim, prim$1) {
  return prim$1.then(Curry.__1(prim));
}

var include$3 = Ley_Monad$OptolithClient.MakeInfix({
      pure: $$return,
      fmap: fmap$1,
      bind: bind$1
    });

var $great$great$eq = include$3.$great$great$eq;

var Infix_$less$dollar$great = include$2.$less$$great;

var Infix_$less$dollar = include$2.$less$;

var Infix_$$great = include$2.$$great;

var Infix_$eq$less$less = include$3.$eq$less$less;

var Infix_$great$eq$great = include$3.$great$eq$great;

var Infix_$less$eq$less = include$3.$less$eq$less;

var Infix = {
  $less$$great: Infix_$less$dollar$great,
  $less$amp$great: $less$amp$great,
  $less$: Infix_$less$dollar,
  $$great: Infix_$$great,
  $great$great$eq: $great$great$eq,
  $eq$less$less: Infix_$eq$less$less,
  $great$eq$great: Infix_$great$eq$great,
  $less$eq$less: Infix_$less$eq$less
};

function mapM(f, xs) {
  if (!xs) {
    return Curry._1($$return, /* [] */0);
  }
  var ys = xs.tl;
  return Curry._2($great$great$eq, Curry._1(f, xs.hd), (function (z) {
                return Curry._2($less$amp$great, mapM(f, ys), (function (zs) {
                              return {
                                      hd: z,
                                      tl: zs
                                    };
                            }));
              }));
}

function imapMAux(i, f, xs) {
  if (!xs) {
    return Curry._1($$return, /* [] */0);
  }
  var ys = xs.tl;
  return Curry._2($great$great$eq, Curry._2(f, i, xs.hd), (function (z) {
                return Curry._2($less$amp$great, imapMAux(i + 1 | 0, f, ys), (function (zs) {
                              return {
                                      hd: z,
                                      tl: zs
                                    };
                            }));
              }));
}

function imapM(f, xs) {
  return imapMAux(0, f, xs);
}

function imapOptionMAux(i, f, xs) {
  if (!xs) {
    return Curry._1($$return, /* [] */0);
  }
  var ys = xs.tl;
  return Curry._2($great$great$eq, Curry._2(f, i, xs.hd), (function (maybeZ) {
                return Curry._2($less$amp$great, imapOptionMAux(i + 1 | 0, f, ys), (function (zs) {
                              return Ley_Option$OptolithClient.option(zs, (function (z) {
                                            return {
                                                    hd: z,
                                                    tl: zs
                                                  };
                                          }), maybeZ);
                            }));
              }));
}

function imapOptionM(f, xs) {
  return imapOptionMAux(0, f, xs);
}

function readFile(path) {
  return Fs.promises.readFile(path, "utf-8");
}

function writeFile(path, data) {
  return Fs.promises.writeFile(path, data, "utf-8");
}

function deleteFile(path) {
  return Fs.promises.unlink(path);
}

function existsFile(path) {
  return Fs.promises.access(path).then(function (param) {
                return Curry._1($$return, true);
              }).catch(function (param) {
              return Curry._1($$return, false);
            });
}

function copyFile(origin, dest) {
  return Fs.promises.copyFile(origin, dest);
}

var join = include$1.join;

var liftM2 = include$1.liftM2;

var liftM3 = include$1.liftM3;

var liftM4 = include$1.liftM4;

var liftM5 = include$1.liftM5;

export {
  fmap$1 as fmap,
  $$return ,
  join ,
  liftM2 ,
  liftM3 ,
  liftM4 ,
  liftM5 ,
  mapM ,
  imapM ,
  imapOptionM ,
  readFile ,
  writeFile ,
  deleteFile ,
  existsFile ,
  copyFile ,
  Infix ,
  
}
/* include Not a pure module */
