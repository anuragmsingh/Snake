/**
 * Created by ansingh on 8/19/2015.
 */

define(function (require) {
    "use strict";

    var React = require("react");
    var Snake = require("./Snake.react");

    var _startup = function () {

        var props = {
            fParentPath     : '../../../',
            pSnakeStartSize : 3,
            pBlockSize      : 16
        };

        React.render(new Snake(props), document.getElementById("app"), function () {
        });
    };
    var _shutdown = function () {};

    if (window.__PG_DEBUG__ === true) {}

    if (document.readyState === "complete")
        _startup();
    else
        window.addEventListener("load", _startup);

    window.addEventListener("beforeunload", _shutdown);
});
