// Generated by ReScript, PLEASE EDIT WITH CARE

import * as React from "react";
import * as ClassNames$OptolithClient from "../../../Utilities/ClassNames.bs.js";

function Button(Props) {
  var className = Props.className;
  var disabledOpt = Props.disabled;
  var label = Props.label;
  var onClick = Props.onClick;
  var disabled = disabledOpt !== undefined ? disabledOpt : false;
  return React.createElement("button", {
              className: ClassNames$OptolithClient.fold({
                    hd: className,
                    tl: {
                      hd: ClassNames$OptolithClient.cond("disabled", disabled),
                      tl: /* [] */0
                    }
                  }),
              onClick: onClick
            }, label);
}

var make = Button;

export {
  make ,
  
}
/* react Not a pure module */
