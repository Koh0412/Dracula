/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/renderer/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/renderer/config/render.ts":
/*!***************************************!*\
  !*** ./src/renderer/config/render.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar Keys_1 = __webpack_require__(/*! ../../window/constants/Keys */ \"./src/window/constants/Keys.ts\");\r\nvar electron_1 = __webpack_require__(/*! electron */ \"electron\");\r\nvar Render = /** @class */ (function () {\r\n    function Render() {\r\n        this.footer = document.getElementById(\"footer\");\r\n    }\r\n    Object.defineProperty(Render.prototype, \"input\", {\r\n        get: function () {\r\n            var input = document.getElementById(\"input\");\r\n            return input;\r\n        },\r\n        enumerable: true,\r\n        configurable: true\r\n    });\r\n    Render.prototype.init = function () {\r\n        var _this = this;\r\n        electron_1.ipcRenderer.on(Keys_1.ICPKeys.save.request, function (event, _) {\r\n            event.sender.send(Keys_1.ICPKeys.save.value, _this.input.value);\r\n        });\r\n        electron_1.ipcRenderer.on(Keys_1.ICPKeys.save.path, function (_, filePath) {\r\n            _this.footer.innerHTML = \"the file has been saved\";\r\n            setTimeout(function () {\r\n                _this.footer.innerHTML = filePath;\r\n            }, 1500);\r\n        });\r\n        electron_1.ipcRenderer.on(Keys_1.ICPKeys.open.value, function (_, params) {\r\n            _this.input.value = params[0];\r\n            _this.footer.innerHTML = params[1];\r\n        });\r\n    };\r\n    return Render;\r\n}());\r\nexports.Render = Render;\r\n\n\n//# sourceURL=webpack:///./src/renderer/config/render.ts?");

/***/ }),

/***/ "./src/renderer/index.ts":
/*!*******************************!*\
  !*** ./src/renderer/index.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar render_1 = __webpack_require__(/*! ./config/render */ \"./src/renderer/config/render.ts\");\r\nvar render = new render_1.Render();\r\nrender.init();\r\n\n\n//# sourceURL=webpack:///./src/renderer/index.ts?");

/***/ }),

/***/ "./src/window/constants/Keys.ts":
/*!**************************************!*\
  !*** ./src/window/constants/Keys.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.ICPKeys = {\r\n    save: {\r\n        request: \"save-request\",\r\n        value: \"save-value\",\r\n        path: \"save-path\",\r\n    },\r\n    open: {\r\n        value: \"open-value\"\r\n    }\r\n};\r\nvar shortcutKeys;\r\n(function (shortcutKeys) {\r\n    shortcutKeys[\"atMark\"] = \"CmdOrCtrl+@\";\r\n    shortcutKeys[\"S\"] = \"CmdOrCtrl+S\";\r\n    shortcutKeys[\"O\"] = \"CmdOrCtrl+O\";\r\n})(shortcutKeys = exports.shortcutKeys || (exports.shortcutKeys = {}));\r\n\n\n//# sourceURL=webpack:///./src/window/constants/Keys.ts?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22electron%22?");

/***/ })

/******/ });