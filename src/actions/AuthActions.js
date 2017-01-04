"use strict";
var ActionTypes = require("../constants/ActionTypes");
exports.login = function (name, displayName, email, sessionToken) { return ({
    type: ActionTypes.LOGIN,
    payload: {
        name: name,
        displayName: displayName,
        email: email,
        sessionToken: sessionToken
    }
}); };
exports.logout = function (tab) { return ({
    type: ActionTypes.LOGOUT
}); };
