// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Json_decode = require("@glennsl/bs-json/src/Json_decode.bs.js");
var IntMap$OptolithClient = require("../../Data/IntMap.bs.js");
var IntSet$OptolithClient = require("../../Data/IntSet.bs.js");

function uniquePairs(xs) {
  return List.fold_right((function (param, mp) {
                var k = param[0];
                if (Curry._2(IntMap$OptolithClient.member, k, mp)) {
                  throw {
                        RE_EXN_ID: Json_decode.DecodeError,
                        _1: "toMapIntegrity: Key " + (k.toString() + "is set twice"),
                        Error: new Error()
                      };
                }
                return Curry._3(IntMap$OptolithClient.insert, k, param[1], mp);
              }), xs, IntMap$OptolithClient.empty);
}

function uniqueList(xs) {
  return List.fold_right((function (x, s) {
                if (Curry._1(IntSet$OptolithClient.member(x), s)) {
                  throw {
                        RE_EXN_ID: Json_decode.DecodeError,
                        _1: "toMapIntegrity: Key " + (x.toString() + "is set twice"),
                        Error: new Error()
                      };
                }
                return Curry._2(IntSet$OptolithClient.insert, x, s);
              }), xs, IntSet$OptolithClient.empty);
}

var Entity = {
  uniquePairs: uniquePairs,
  uniqueList: uniqueList
};

exports.Entity = Entity;
/* IntMap-OptolithClient Not a pure module */
