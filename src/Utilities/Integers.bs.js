// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Ley_List$OptolithClient from "../Data/Ley_List.bs.js";

var romanNumbers = {
  hd: "I",
  tl: {
    hd: "II",
    tl: {
      hd: "III",
      tl: {
        hd: "IV",
        tl: {
          hd: "V",
          tl: {
            hd: "VI",
            tl: {
              hd: "VII",
              tl: {
                hd: "VIII",
                tl: {
                  hd: "IX",
                  tl: {
                    hd: "X",
                    tl: {
                      hd: "XI",
                      tl: {
                        hd: "XII",
                        tl: {
                          hd: "XIII",
                          tl: /* [] */0
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

function intToRoman(x) {
  return Ley_List$OptolithClient.Safe.atMay(romanNumbers, x - 1 | 0);
}

export {
  romanNumbers ,
  intToRoman ,
  
}
/* Ley_List-OptolithClient Not a pure module */