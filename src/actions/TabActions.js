"use strict";
var AppDispatcher_1 = require("../dispatcher/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
exports.showSection = function (section, tab) { return ({
    type: ActionTypes.SHOW_SECTION,
    payload: {
        section: section,
        tab: tab
    }
}); };
exports.showTab = function (tab) { return ({
    type: ActionTypes.SHOW_TAB,
    payload: {
        tab: tab
    }
}); };
exports.__esModule = true;
exports["default"] = {
    showTab: function (tab) {
        AppDispatcher_1["default"].dispatch({
            type: ActionTypes.SHOW_TAB,
            tab: tab
        });
    },
    showSection: function (section) {
        AppDispatcher_1["default"].dispatch({
            type: 'SHOW_TAB_SECTION',
            section: section
        });
    }
};
