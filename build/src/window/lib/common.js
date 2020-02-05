"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Common = /** @class */ (function () {
    function Common() {
    }
    Common.size = {
        width: 800,
        height: 640
    };
    Common.backgroundColor = "#23282f";
    Common.mainURL = path.join(__dirname, "../../index.html");
    Common.iconPath = path.join(__dirname, "../../../../resources/image/pen-icon.png");
    return Common;
}());
exports.default = Common;
//# sourceMappingURL=common.js.map