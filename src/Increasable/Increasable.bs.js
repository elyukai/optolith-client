// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Ley_List$OptolithClient from "../Data/Ley_List.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";

function Make(Config) {
  var minValue = Config.minValue;
  var empty = function (id) {
    return {
            id: id,
            value: minValue,
            dependencies: /* [] */0
          };
  };
  var isEmpty = function (x) {
    if (x.value <= minValue) {
      return Curry._1(Ley_List$OptolithClient.$$null, x.dependencies);
    } else {
      return false;
    }
  };
  var getValueDef = function (param) {
    return Ley_Option$OptolithClient.option(minValue, (function (x) {
                  return x.value;
                }), param);
  };
  return {
          minValue: minValue,
          empty: empty,
          isEmpty: isEmpty,
          getValueDef: getValueDef
        };
}

var Dynamic = {
  Make: Make
};

export {
  Dynamic ,
  
}
/* Ley_List-OptolithClient Not a pure module */
