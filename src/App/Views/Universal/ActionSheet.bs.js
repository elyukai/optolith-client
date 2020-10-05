// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as React from "react";
import * as Overlay$OptolithClient from "./Overlay.bs.js";
import * as Ley_List$OptolithClient from "../../../Data/Ley_List.bs.js";
import * as ClassNames$OptolithClient from "../../../Utilities/ClassNames.bs.js";
import * as ReactUtils$OptolithClient from "../../../Utilities/ReactUtils.bs.js";

function ActionSheet$Button(Props) {
  var label = Props.label;
  var value = Props.value;
  var style = Props.style;
  var disabled = Props.disabled;
  var onClick = Props.onClick;
  var handleClick = React.useCallback((function (param) {
          if (disabled) {
            return Curry._1(onClick, value);
          }
          
        }), [
        value,
        disabled,
        onClick
      ]);
  return React.createElement("button", {
              className: ClassNames$OptolithClient.fold({
                    hd: ClassNames$OptolithClient.cond("disabled", disabled),
                    tl: {
                      hd: ClassNames$OptolithClient.cond("destructive", style === /* Destructive */1),
                      tl: /* [] */0
                    }
                  }),
              type: "button",
              onClick: handleClick
            }, ReactUtils$OptolithClient.s(label));
}

var Button = {
  make: ActionSheet$Button
};

function ActionSheet(Props) {
  var description = Props.description;
  var buttons = Props.buttons;
  var isOpen = Props.isOpen;
  var onClick = Props.onClick;
  var onClose = Props.onClose;
  var cancelLabel = Props.cancelLabel;
  return React.createElement(Overlay$OptolithClient.make, {
              baseClassName: "actionsheet",
              children: null,
              isOpen: isOpen,
              onBackdrop: onClose
            }, React.createElement("div", {
                  className: "buttons"
                }, ReactUtils$OptolithClient.optionR((function (str) {
                        return React.createElement("p", {
                                    className: "description"
                                  }, ReactUtils$OptolithClient.s(str));
                      }), description), Ley_List$OptolithClient.listToArray(Curry._2(Ley_List$OptolithClient.map, (function (button) {
                            return React.createElement(ActionSheet$Button, {
                                        label: button.label,
                                        value: button.value,
                                        style: button.style,
                                        disabled: button.disabled,
                                        onClick: onClick
                                      });
                          }), buttons))), React.createElement("footer", undefined, React.createElement("button", {
                      className: "primary",
                      type: "button",
                      onClick: onClose
                    }, ReactUtils$OptolithClient.s(cancelLabel))));
}

var make = ActionSheet;

export {
  Button ,
  make ,
  
}
/* react Not a pure module */