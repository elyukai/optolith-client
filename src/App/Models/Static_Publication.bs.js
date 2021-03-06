// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Json_decode = require("@glennsl/bs-json/src/Json_decode.bs.js");
var ListH$OptolithClient = require("../../Data/ListH.bs.js");
var StrMap$OptolithClient = require("../../Data/StrMap.bs.js");

function t(json) {
  return {
          id: Json_decode.field("id", Json_decode.string, json),
          name: Json_decode.field("name", Json_decode.string, json),
          short: Json_decode.field("short", Json_decode.string, json),
          isCore: Json_decode.field("isCore", Json_decode.bool, json),
          isAdultContent: Json_decode.field("isAdultContent", Json_decode.bool, json)
        };
}

function all(yamlData) {
  return Curry._1(StrMap$OptolithClient.fromList, ListH$OptolithClient.map((function (x) {
                    return [
                            x.id,
                            x
                          ];
                  }), Json_decode.list(t, yamlData.booksL10n)));
}

var Decode = {
  t: t,
  all: all
};

exports.Decode = Decode;
/* StrMap-OptolithClient Not a pure module */
