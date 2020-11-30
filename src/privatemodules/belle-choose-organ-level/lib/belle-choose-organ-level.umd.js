(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"));
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["belle-choose-organ-level"] = factory(require("vue"));
	else
		root["belle-choose-organ-level"] = factory(root["Vue"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__8bbf__) {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "112a");
/******/ })
/************************************************************************/
/******/ ({

/***/ "008a":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("f6b4");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "064e":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("69b3");
var IE8_DOM_DEFINE = __webpack_require__("db6b");
var toPrimitive = __webpack_require__("94b3");
var dP = Object.defineProperty;

exports.f = __webpack_require__("149f") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "09b9":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("224c");
var defined = __webpack_require__("f6b4");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "0aed":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("aaba");
var redefine = __webpack_require__("bf16");
var hide = __webpack_require__("86d4");
var fails = __webpack_require__("238a");
var defined = __webpack_require__("f6b4");
var wks = __webpack_require__("cb3d");
var regexpExec = __webpack_require__("8714");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "0dc8":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("064e");
var anObject = __webpack_require__("69b3");
var getKeys = __webpack_require__("80a9");

module.exports = __webpack_require__("149f") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "112a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/_@vue_cli-service@3.12.1@@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("e67d")
  }

  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.11@core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("cc57");

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"918bad2c-vue-loader-template"}!./node_modules/_vue-loader@15.9.3@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.3@vue-loader/lib??vue-loader-options!./packages/src/index.vue?vue&type=template&id=d739fefa&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(_vm.dataConfig.targetLevel >= 1)?_c('el-select-all',_vm._b({attrs:{"popper-append-to-body":false,"filterable":"","placeholder":"选择大区","clearable":""},on:{"input":_vm.listSmallAreaWrap},model:{value:(_vm.organOpt.bigAreas),callback:function ($$v) {_vm.$set(_vm.organOpt, "bigAreas", $$v)},expression:"organOpt.bigAreas"}},'el-select-all',_vm.config,false),_vm._l((_vm.bigAreas),function(bigArea,index){return _c('el-option',{key:index,attrs:{"label":bigArea.orgName,"value":bigArea.orgCodeLong}})}),1):_vm._e(),(_vm.dataConfig.targetLevel >= 2)?_c('el-select-all',_vm._b({attrs:{"popper-append-to-body":false,"filterable":"","placeholder":"选择子地区","clearable":""},on:{"input":_vm.listManagerAreasWrap},model:{value:(_vm.organOpt.smallAreas),callback:function ($$v) {_vm.$set(_vm.organOpt, "smallAreas", $$v)},expression:"organOpt.smallAreas"}},'el-select-all',_vm.config,false),_vm._l((_vm.smallAreas),function(smallArea,index){return _c('el-option',{key:index,attrs:{"label":smallArea.orgName,"value":smallArea.orgCodeLong}})}),1):_vm._e(),(_vm.dataConfig.targetLevel >= 3)?_c('el-select-all',_vm._b({attrs:{"popper-append-to-body":false,"filterable":"","placeholder":"选择管理区域","clearable":""},on:{"input":_vm.listManagerCityAreasWrap},model:{value:(_vm.organOpt.managerAreas),callback:function ($$v) {_vm.$set(_vm.organOpt, "managerAreas", $$v)},expression:"organOpt.managerAreas"}},'el-select-all',_vm.config,false),_vm._l((_vm.managerAreas),function(managerArea,index){return _c('el-option',{key:index,attrs:{"label":managerArea.orgName,"value":managerArea.orgCodeLong}})}),1):_vm._e(),(_vm.dataConfig.targetLevel >= 4)?_c('el-select-all',_vm._b({attrs:{"popper-append-to-body":false,"filterable":"","placeholder":"选择管理城市","clearable":""},on:{"input":_vm.listOperateCitiesWrap},model:{value:(_vm.organOpt.managerCityAreas),callback:function ($$v) {_vm.$set(_vm.organOpt, "managerCityAreas", $$v)},expression:"organOpt.managerCityAreas"}},'el-select-all',_vm.config,false),_vm._l((_vm.managerCityAreas),function(managerCityArea,index){return _c('el-option',{key:index,attrs:{"label":managerCityArea.orgName,"value":managerCityArea.orgCodeLong}})}),1):_vm._e(),(_vm.dataConfig.targetLevel >= 5)?_c('el-select-all',_vm._b({attrs:{"popper-append-to-body":false,"filterable":"","placeholder":"选择运营城市","clearable":""},on:{"input":_vm.listStoreItemsWrap},model:{value:(_vm.organOpt.operateCities),callback:function ($$v) {_vm.$set(_vm.organOpt, "operateCities", $$v)},expression:"organOpt.operateCities"}},'el-select-all',_vm.config,false),_vm._l((_vm.operateCities),function(operateCity,index){return _c('el-option-item',{key:index,attrs:{"label":operateCity.orgName,"value":operateCity.orgCodeLong}},[_c('span',[_vm._v("（"+_vm._s(operateCity.orgCode)+"）"+_vm._s(operateCity.orgName))])])}),1):_vm._e(),(_vm.dataConfig.targetLevel >= 6)?_c('el-select-all',_vm._b({attrs:{"popper-append-to-body":false,"filterable":"","placeholder":"选择门店","clearable":"","multiple":!_vm.config.storeMultiple},on:{"input":_vm.syncOpt},model:{value:(_vm.organOpt.storeItems),callback:function ($$v) {_vm.$set(_vm.organOpt, "storeItems", $$v)},expression:"organOpt.storeItems"}},'el-select-all',_vm.config,false),_vm._l((_vm.storeItems),function(storeItem,index){return _c('el-option-item',{key:index,attrs:{"label":storeItem.orgName,"value":storeItem.orgCodeLong}},[_c('span',[_vm._v("（"+_vm._s(storeItem.orgCode)+"）"+_vm._s(storeItem.orgName))])])}),1):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./packages/src/index.vue?vue&type=template&id=d739fefa&

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.11@core-js/modules/es6.object.assign.js
var es6_object_assign = __webpack_require__("5f54");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.11@core-js/modules/es6.regexp.constructor.js
var es6_regexp_constructor = __webpack_require__("9dd9");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.11@core-js/modules/es6.regexp.split.js
var es6_regexp_split = __webpack_require__("9a33");

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"918bad2c-vue-loader-template"}!./node_modules/_vue-loader@15.9.3@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.3@vue-loader/lib??vue-loader-options!./packages/src/option-item.vue?vue&type=template&id=53627bea&
var option_itemvue_type_template_id_53627bea_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{directives:[{name:"show",rawName:"v-show",value:(_vm.visible),expression:"visible"}],staticClass:"el-select-dropdown__item",class:{
    'selected': _vm.itemSelected,
    'is-disabled': _vm.disabled || _vm.groupDisabled || _vm.limitReached,
    'hover': _vm.hover
  },on:{"mouseenter":_vm.hoverItem,"click":function($event){$event.stopPropagation();return _vm.selectOptionClick($event)}}},[_vm._t("default",[_c('span',[_vm._v(_vm._s(_vm.currentLabel))])])],2)}
var option_itemvue_type_template_id_53627bea_staticRenderFns = []


// CONCATENATED MODULE: ./packages/src/option-item.vue?vue&type=template&id=53627bea&

// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.10.5@@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}
// EXTERNAL MODULE: ./node_modules/_core-js@2.6.11@core-js/modules/es6.regexp.to-string.js
var es6_regexp_to_string = __webpack_require__("2b45");

// EXTERNAL MODULE: ./node_modules/_core-js@2.6.11@core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("163d");

// CONCATENATED MODULE: ./node_modules/_element-ui@2.13.2@element-ui/src/mixins/emitter.js
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
/* harmony default export */ var emitter = ({
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
});

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
var external_commonjs_vue_commonjs2_vue_root_Vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_);

// CONCATENATED MODULE: ./node_modules/_element-ui@2.13.2@element-ui/src/utils/types.js
function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
}

const isFunction = (functionToCheck) => {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

const isUndefined = (val)=> {
  return val === void 0;
};

const isDefined = (val) => {
  return val !== undefined && val !== null;
};

// CONCATENATED MODULE: ./node_modules/_element-ui@2.13.2@element-ui/src/utils/util.js



const util_hasOwnProperty = Object.prototype.hasOwnProperty;

function noop() {};

function hasOwn(obj, key) {
  return util_hasOwnProperty.call(obj, key);
};

function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key];
  }
  return to;
};

function toObject(arr) {
  var res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
};

const getValueByPath = function(object, prop) {
  prop = prop || '';
  const paths = prop.split('.');
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
};

function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');

  let keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  };
};

const generateId = function() {
  return Math.floor(Math.random() * 10000);
};

const valueEquals = (a, b) => {
  // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) return true;
  if (!(a instanceof Array)) return false;
  if (!(b instanceof Array)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');

// TODO: use native Array.find, Array.findIndex when IE support is dropped
const arrayFindIndex = function(arr, pred) {
  for (let i = 0; i !== arr.length; ++i) {
    if (pred(arr[i])) {
      return i;
    }
  }
  return -1;
};

const arrayFind = function(arr, pred) {
  const idx = arrayFindIndex(arr, pred);
  return idx !== -1 ? arr[idx] : undefined;
};

// coerce truthy value to array
const coerceTruthyValueToArray = function(val) {
  if (Array.isArray(val)) {
    return val;
  } else if (val) {
    return [val];
  } else {
    return [];
  }
};

const isIE = function() {
  return !external_commonjs_vue_commonjs2_vue_root_Vue_default.a.prototype.$isServer && !isNaN(Number(document.documentMode));
};

const isEdge = function() {
  return !external_commonjs_vue_commonjs2_vue_root_Vue_default.a.prototype.$isServer && navigator.userAgent.indexOf('Edge') > -1;
};

const isFirefox = function() {
  return !external_commonjs_vue_commonjs2_vue_root_Vue_default.a.prototype.$isServer && !!window.navigator.userAgent.match(/firefox/i);
};

const autoprefixer = function(style) {
  if (typeof style !== 'object') return style;
  const rules = ['transform', 'transition', 'animation'];
  const prefixes = ['ms-', 'webkit-'];
  rules.forEach(rule => {
    const value = style[rule];
    if (rule && value) {
      prefixes.forEach(prefix => {
        style[prefix + rule] = value;
      });
    }
  });
  return style;
};

const kebabCase = function(str) {
  const hyphenateRE = /([^-])([A-Z])/g;
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase();
};

const capitalize = function(str) {
  if (!isString(str)) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const looseEqual = function(a, b) {
  const isObjectA = isObject(a);
  const isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    return JSON.stringify(a) === JSON.stringify(b);
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
};

const arrayEquals = function(arrayA, arrayB) {
  arrayA = arrayA || [];
  arrayB = arrayB || [];

  if (arrayA.length !== arrayB.length) {
    return false;
  }

  for (let i = 0; i < arrayA.length; i++) {
    if (!looseEqual(arrayA[i], arrayB[i])) {
      return false;
    }
  }

  return true;
};

const util_isEqual = function(value1, value2) {
  if (Array.isArray(value1) && Array.isArray(value2)) {
    return arrayEquals(value1, value2);
  }
  return looseEqual(value1, value2);
};

const isEmpty = function(val) {
  // null or undefined
  if (val == null) return true;

  if (typeof val === 'boolean') return false;

  if (typeof val === 'number') return !val;

  if (val instanceof Error) return val.message === '';

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length;

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size;
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length;
    }
  }

  return false;
};

function rafThrottle(fn) {
  let locked = false;
  return function(...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame(_ => {
      fn.apply(this, args);
      locked = false;
    });
  };
}

function objToArray(obj) {
  if (Array.isArray(obj)) {
    return obj;
  }
  return isEmpty(obj) ? [] : [obj];
}

// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.1.0@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.3@vue-loader/lib??vue-loader-options!./packages/src/option-item.vue?vue&type=script&lang=js&




//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var option_itemvue_type_script_lang_js_ = ({
  mixins: [emitter],
  name: 'ElOptionItem',
  componentName: 'ElOption',
  inject: ['select'],
  props: {
    value: {
      required: true
    },
    label: [String, Number],
    created: Boolean,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      index: -1,
      groupDisabled: false,
      visible: true,
      hitState: false,
      hover: false
    };
  },
  computed: {
    isObject: function isObject() {
      return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]';
    },
    currentLabel: function currentLabel() {
      return this.label || (this.isObject ? '' : this.value);
    },
    currentValue: function currentValue() {
      return this.value || this.label || '';
    },
    itemSelected: function itemSelected() {
      if (!this.select.multiple) {
        return this.isEqual(this.value, this.select.value);
      } else {
        return this.contains(this.select.value, this.value);
      }
    },
    limitReached: function limitReached() {
      if (this.select.multiple) {
        return !this.itemSelected && (this.select.value || []).length >= this.select.multipleLimit && this.select.multipleLimit > 0;
      } else {
        return false;
      }
    }
  },
  watch: {
    currentLabel: function currentLabel() {
      if (!this.created && !this.select.remote) this.dispatch('ElSelect', 'setSelected');
    },
    value: function value(val, oldVal) {
      var _this$select = this.select,
          remote = _this$select.remote,
          valueKey = _this$select.valueKey;

      if (!this.created && !remote) {
        if (valueKey && _typeof(val) === 'object' && _typeof(oldVal) === 'object' && val[valueKey] === oldVal[valueKey]) {
          return;
        }

        this.dispatch('ElSelect', 'setSelected');
      }
    }
  },
  methods: {
    isEqual: function isEqual(a, b) {
      if (!this.isObject) {
        return a === b;
      } else {
        var valueKey = this.select.valueKey;
        return getValueByPath(a, valueKey) === getValueByPath(b, valueKey);
      }
    },
    contains: function contains() {
      var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var target = arguments.length > 1 ? arguments[1] : undefined;

      if (!this.isObject) {
        return arr && arr.indexOf(target) > -1;
      } else {
        var valueKey = this.select.valueKey;
        return arr && arr.some(function (item) {
          return getValueByPath(item, valueKey) === getValueByPath(target, valueKey);
        });
      }
    },
    handleGroupDisabled: function handleGroupDisabled(val) {
      this.groupDisabled = val;
    },
    hoverItem: function hoverItem() {
      if (!this.disabled && !this.groupDisabled) {
        this.select.hoverIndex = this.select.options.indexOf(this);
      }
    },
    selectOptionClick: function selectOptionClick() {
      if (this.disabled !== true && this.groupDisabled !== true) {
        this.dispatch('ElSelect', 'handleOptionClick', [this, true]);
      }
    },
    queryChange: function queryChange(query) {
      this.visible = new RegExp(escapeRegexpString(query), 'i').test(this.currentLabel) || new RegExp(escapeRegexpString(query), 'i').test(this.currentValue) || this.created;

      if (!this.visible) {
        this.select.filteredOptionsCount--;
      }
    }
  },
  created: function created() {
    this.select.options.push(this);
    this.select.cachedOptions.push(this);
    this.select.optionsCount++;
    this.select.filteredOptionsCount++;
    this.$on('queryChange', this.queryChange);
    this.$on('handleGroupDisabled', this.handleGroupDisabled);
  },
  beforeDestroy: function beforeDestroy() {
    var _this$select2 = this.select,
        selected = _this$select2.selected,
        multiple = _this$select2.multiple;
    var selectedOptions = multiple ? selected : [selected];
    var index = this.select.cachedOptions.indexOf(this);
    var selectedIndex = selectedOptions.indexOf(this); // if option is not selected, remove it from cache

    if (index > -1 && selectedIndex < 0) {
      this.select.cachedOptions.splice(index, 1);
    }

    this.select.onOptionDestroy(this.select.options.indexOf(this));
  }
});
// CONCATENATED MODULE: ./packages/src/option-item.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_option_itemvue_type_script_lang_js_ = (option_itemvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/_vue-loader@15.9.3@vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./packages/src/option-item.vue





/* normalize component */

var component = normalizeComponent(
  src_option_itemvue_type_script_lang_js_,
  option_itemvue_type_template_id_53627bea_render,
  option_itemvue_type_template_id_53627bea_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var option_item = (component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.1.0@babel-loader/lib!./node_modules/_cache-loader@2.0.1@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.3@vue-loader/lib??vue-loader-options!./packages/src/index.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
 // import ElSelectAll from 'el-select-all' //打包时候注释掉，因为这个在项目中单独引用组件

/* harmony default export */ var srcvue_type_script_lang_js_ = ({
  name: 'BelleChooseorgLevel',
  componentName: 'BelleChooseorgLevel',
  components: {
    ElOptionItem: option_item // ElSelectAll

  },
  props: {
    config: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    brandCode: {
      type: String,
      default: function _default() {
        return 'TS';
      }
    },
    dataConfig: {
      type: Object,
      default: function _default() {
        return {
          // 控制显示数据到哪一层
          targetLevel: 6,
          bigAreas: []
        };
      }
    },
    platform: {
      type: String,
      default: '1'
    },
    opt: {
      type: Object,
      default: function _default() {
        return {
          bigAreas: '',
          smallAreas: '',
          managerAreas: '',
          managerCityAreas: '',
          operateCities: '',
          storeItems: ''
        };
      }
    }
  },
  data: function data() {
    return {
      bigAreas: [],
      smallAreas: [],
      managerAreas: [],
      managerCityAreas: [],
      operateCities: [],
      storeItems: [],
      organOpt: {
        bigAreas: this.initData('bigAreas'),
        smallAreas: this.initData('smallAreas'),
        managerAreas: this.initData('managerAreas'),
        managerCityAreas: this.initData('managerCityAreas'),
        operateCities: this.initData('operateCities'),
        storeItems: this.initData('storeItems') || []
      },
      orgLevelMap: {
        1: 'bigAreas',
        2: 'smallAreas',
        3: 'managerAreas',
        4: 'managerCityAreas',
        5: 'operateCities',
        6: 'storeItems'
      },
      belleOrgLevelMap: {
        1: 'regionCode',
        2: 'areaCode',
        3: 'manageAreaCode',
        4: 'manageCityCode',
        5: 'businessCityCode',
        6: 'keyword'
      },
      miniAuthOrgLevelMap: null,
      authOrgLevels: []
    };
  },
  mounted: function mounted() {
    this.preConditionInit();
  },
  methods: {
    initData: function initData(key) {
      var temp;

      if (this.config.multiple) {
        if (this.opt[key]) {
          temp = this.opt[key].split(',');
        } else {
          temp = [];
        }
      } else {
        temp = '';
      }

      return temp;
    },
    preConditionInit: function preConditionInit() {
      var _this = this;

      var params = {};

      if (this.brandCode) {
        params.brandCode = this.brandCode;
      }

      this.$request2({
        url: '/component/choosingStore/queryAuthorityAreaList',
        params: params,
        method: 'get'
      }).then(function (res) {
        if (res.bizCode === 20000) {
          if (res.data.list.length) {
            var areaItems = res.data.list;
            _this[_this.orgLevelMap[areaItems[0].orgLevel]] = (_this.dataConfig.bigAreas || []).concat(areaItems[0].children); // 缓存所有orgLevels

            _this.authOrgLevels = areaItems;
            _this.miniAuthOrgLevelMap = _this.getMinAuthOrgLevels(areaItems);

            _this.init();
          } else {
            _this.$message({
              type: 'error',
              message: '当前账户没有授权任何权限'
            });
          }
        }
      });
    },
    getMinAuthOrgLevels: function getMinAuthOrgLevels(authOrgLevels) {
      var parentAuthOrgLevels;
      var childAuthOrgLevels;
      var orgLevelMap = {};
      var parentOrg;
      var i;
      var j;

      for (i = 0; i < authOrgLevels.length; i++) {
        orgLevelMap[authOrgLevels[i].orgLevel] = [];
      }

      for (i = 0; i < authOrgLevels.length; i++) {
        parentOrg = authOrgLevels[i];
        parentAuthOrgLevels = parentOrg.children;

        if (authOrgLevels[i + 1]) {
          childAuthOrgLevels = authOrgLevels[i + 1].children;
        } else {
          childAuthOrgLevels = [];
        }

        for (j = 0; j < parentAuthOrgLevels.length; j++) {
          if (!this.checkIfParentIncludeChildren(parentAuthOrgLevels[j].orgCodeLong, childAuthOrgLevels)) {
            orgLevelMap[parentOrg.orgLevel].push(parentAuthOrgLevels[j].orgCodeLong);
          }
        }
      }

      return orgLevelMap;
    },
    checkIfParentIncludeChildren: function checkIfParentIncludeChildren(parentOrgCodeLong, childAuthOrgLevels) {
      for (var i = 0; i < childAuthOrgLevels.length; i++) {
        if (new RegExp('^' + parentOrgCodeLong + '-').test(childAuthOrgLevels[i].orgCodeLong)) {
          return true;
        }
      }

      return false;
    },
    getOrgLevelAuthAreas: function getOrgLevelAuthAreas(orgLevel) {
      for (var i = 0; i < this.authOrgLevels.length; i++) {
        if (this.authOrgLevels[i].orgLevel === orgLevel) {
          return this.authOrgLevels[i].children;
        }
      }

      return [];
    },
    checkOrgCodeIsExistAuthOrgLevels: function checkOrgCodeIsExistAuthOrgLevels(orgCodeLong, nextOrgLevelItems) {
      for (var i = 0; i < nextOrgLevelItems.length; i++) {
        // new RegExp('H-P87-').test("H-P87-xxx") 必须以结束作为匹配规则
        // var str = 'H-P87-A144-M0482'   new RegExp(/^H-P87-A144-/).test(str)
        if (new RegExp('^' + orgCodeLong + '-').test(nextOrgLevelItems[i].orgCodeLong)) {
          return true;
        }
      }

      return false;
    },
    init: function init() {
      if (this.dataConfig.targetLevel >= 6) {
        if (this.opt.operateCities && this.opt.storeItems) {
          this.listStoreItems();
        } else {
          this.queryShopListByCondition();
        }
      }

      if (this.dataConfig.targetLevel >= 5) {
        if (this.opt.managerCityAreas) {
          this.listOperateCities();
        }
      }

      if (this.dataConfig.targetLevel >= 4) {
        if (this.opt.managerAreas) {
          this.listManagerCityAreas();
        }
      }

      if (this.dataConfig.targetLevel >= 3) {
        if (this.opt.smallAreas) {
          this.listManagerAreas();
        }
      }

      if (this.dataConfig.targetLevel >= 2) {
        if (this.opt.bigAreas) {
          this.listSmallArea();
        }
      } // 不用初始化第一级数据

    },
    fetchData: function fetchData(params) {
      var _this2 = this;

      var i;
      var curLevelParOrgCodeChildren;
      var parOrgCodeLongs = params.parOrgCodeLongs; // 所有的parOrgCodeLongs

      var parOrgCodeLongsArr;

      if (parOrgCodeLongs) {
        parOrgCodeLongsArr = parOrgCodeLongs.split(',');
      } // 从缓存的authOrgLevels数组中获取当前等级的权限


      var orgLevelAuthAreas = this.getOrgLevelAuthAreas(params.orgLevel); // 页面选择的parOrgCodeLongsArr父级组织机构长编码和当前等级缓存的组织机构长编码orgLevelAuthAreas做比对，计算出应该发请求的长编码

      var newParOrgCodeLongs = [];

      for (i = 0; i < parOrgCodeLongsArr.length; i++) {
        // 营销活动查询全国条件
        if (parOrgCodeLongsArr[i] === 'ALL') {
          continue;
        }

        if (orgLevelAuthAreas) {
          if (!this.checkOrgCodeIsExistAuthOrgLevels(parOrgCodeLongsArr[i], orgLevelAuthAreas)) {
            newParOrgCodeLongs.push(parOrgCodeLongsArr[i]);
          }
        } else {
          newParOrgCodeLongs.push(parOrgCodeLongsArr[i]);
        }
      }

      var diffParams = {
        orgLevel: params.orgLevel,
        parOrgCodeLongs: newParOrgCodeLongs.join(',')
      };

      if (typeof params.shopStatus !== 'undefined') {
        diffParams.shopStatus = params.shopStatus;
      }

      if (this.brandCode) {
        diffParams.brandCode = this.brandCode;
      }

      if (newParOrgCodeLongs.length) {
        this.$request({
          url: '/component/choosingStore/queryChildAreaList',
          data: diffParams,
          method: 'post'
        }).then(function (res) {
          if (res.data) {
            curLevelParOrgCodeChildren = [];

            if (orgLevelAuthAreas && orgLevelAuthAreas.length) {
              for (i = 0; i < orgLevelAuthAreas.length; i++) {
                if (parOrgCodeLongs.indexOf(orgLevelAuthAreas[i].parOrgCode) > -1) {
                  curLevelParOrgCodeChildren.push(orgLevelAuthAreas[i]);
                }
              }
            }

            _this2[_this2.orgLevelMap[params.orgLevel]] = (res.data.list || []).concat(curLevelParOrgCodeChildren);
          }
        });
      } else {
        curLevelParOrgCodeChildren = [];

        for (i = 0; i < orgLevelAuthAreas.length; i++) {
          if (parOrgCodeLongs.indexOf(orgLevelAuthAreas[i].parOrgCode) > -1) {
            curLevelParOrgCodeChildren.push(orgLevelAuthAreas[i]);
          }
        }

        this[this.orgLevelMap[params.orgLevel]] = curLevelParOrgCodeChildren;
      }
    },
    listSmallArea: function listSmallArea() {
      var bigAreas = this.config.multiple ? this.organOpt.bigAreas.join(',') : this.organOpt.bigAreas;

      if (bigAreas) {
        this.fetchData({
          orgLevel: 2,
          parOrgCodeLongs: bigAreas
        });
      }
    },
    listSmallAreaWrap: function listSmallAreaWrap() {
      if (this.config.multiple) {
        this.organOpt.smallAreas = [];
        this.organOpt.managerAreas = [];
        this.organOpt.managerCityAreas = [];
        this.organOpt.operateCities = [];
      } else {
        this.organOpt.smallAreas = '';
        this.organOpt.managerAreas = '';
        this.organOpt.managerCityAreas = '';
        this.organOpt.operateCities = '';
      }

      if (this.config.storeMultiple) {
        this.organOpt.storeItems = '';
      } else {
        this.organOpt.storeItems = [];
      }

      this.smallAreas = [];
      this.managerAreas = [];
      this.managerCityAreas = [];
      this.operateCities = [];
      this.storeItems = [];
      this.syncOpt();
      if (this.dataConfig.targetLevel < 2) return;
      this.listSmallArea();
      this.queryShopListByCondition();
    },
    listManagerAreas: function listManagerAreas() {
      var smallAreas = this.config.multiple ? this.organOpt.smallAreas.join(',') : this.organOpt.smallAreas;

      if (smallAreas) {
        this.fetchData({
          orgLevel: 3,
          parOrgCodeLongs: smallAreas
        });
      }
    },
    listManagerAreasWrap: function listManagerAreasWrap() {
      if (this.config.multiple) {
        this.organOpt.managerAreas = [];
        this.organOpt.managerCityAreas = [];
        this.organOpt.operateCities = [];
      } else {
        this.organOpt.managerAreas = '';
        this.organOpt.managerCityAreas = '';
        this.organOpt.operateCities = '';
      }

      if (this.config.storeMultiple) {
        this.organOpt.storeItems = '';
      } else {
        this.organOpt.storeItems = [];
      }

      this.managerAreas = [];
      this.managerCityAreas = [];
      this.operateCities = [];
      this.storeItems = [];
      this.syncOpt();
      if (this.dataConfig.targetLevel < 3) return;
      this.listManagerAreas();
      this.queryShopListByCondition();
    },
    listManagerCityAreas: function listManagerCityAreas() {
      var managerAreas = this.config.multiple ? this.organOpt.managerAreas.join(',') : this.organOpt.managerAreas;

      if (managerAreas) {
        this.fetchData({
          orgLevel: 4,
          parOrgCodeLongs: managerAreas
        });
      }
    },
    listManagerCityAreasWrap: function listManagerCityAreasWrap() {
      this.managerCityAreas = [];
      this.operateCities = [];
      this.storeItems = [];

      if (this.config.multiple) {
        this.organOpt.managerCityAreas = [];
        this.organOpt.operateCities = [];
      } else {
        this.organOpt.managerCityAreas = '';
        this.organOpt.operateCities = '';
      }

      if (this.config.storeMultiple) {
        this.organOpt.storeItems = '';
      } else {
        this.organOpt.storeItems = [];
      }

      this.syncOpt();
      if (this.dataConfig.targetLevel < 4) return;
      this.listManagerCityAreas();
      this.queryShopListByCondition();
    },
    listOperateCities: function listOperateCities() {
      var managerCityAreas = this.config.multiple ? this.organOpt.managerCityAreas.join(',') : this.organOpt.managerCityAreas;

      if (managerCityAreas) {
        this.fetchData({
          orgLevel: 5,
          parOrgCodeLongs: managerCityAreas
        });
      }
    },
    listOperateCitiesWrap: function listOperateCitiesWrap() {
      this.operateCities = [];
      this.storeItems = [];

      if (this.config.multiple) {
        this.organOpt.operateCities = [];
      } else {
        this.organOpt.operateCities = '';
      }

      if (this.config.storeMultiple) {
        this.organOpt.storeItems = '';
      } else {
        this.organOpt.storeItems = [];
      }

      this.syncOpt();
      if (this.dataConfig.targetLevel < 5) return;
      this.listOperateCities();
      this.queryShopListByCondition();
    },
    listStoreItems: function listStoreItems() {
      this.queryShopListByCondition();
    },
    listStoreItemsWrap: function listStoreItemsWrap() {
      this.storeItems = [];

      if (this.config.storeMultiple) {
        this.organOpt.storeItems = '';
      } else {
        this.organOpt.storeItems = [];
      }

      this.syncOpt();
      if (this.dataConfig.targetLevel < 6) return;
      this.listStoreItems();
    },
    syncOpt: function syncOpt() {
      if (this.config.multiple) {
        this.opt.bigAreas = this.organOpt.bigAreas.join(',');
        this.opt.smallAreas = this.organOpt.smallAreas.join(',');
        this.opt.managerAreas = this.organOpt.managerAreas.join(',');
        this.opt.managerCityAreas = this.organOpt.managerCityAreas.join(',');
        this.opt.operateCities = this.organOpt.operateCities.join(',');
      } else {
        this.opt.bigAreas = this.organOpt.bigAreas;
        this.opt.smallAreas = this.organOpt.smallAreas;
        this.opt.managerAreas = this.organOpt.managerAreas;
        this.opt.managerCityAreas = this.organOpt.managerCityAreas;
        this.opt.operateCities = this.organOpt.operateCities;
      }

      if (this.config.storeMultiple) {
        this.opt.storeItems = this.organOpt.storeItems;
      } else {
        this.opt.storeItems = this.organOpt.storeItems.join(',');
      }

      this.$emit('change', this.opt);
    },

    /**
     * 通过orgLevel orgCodes 查询门店
     */
    queryShopListByCondition: function queryShopListByCondition() {
      if (this.dataConfig.targetLevel < 6) return;

      if (this.platform === '1' || this.platform === 1) {
        this.queryShopListNoAuth();
      } else {
        this.queryShopListAuth();
      }
    },
    queryShopListAuth: function queryShopListAuth() {
      var _this3 = this;

      var params = {
        shopStatus: 1
      };
      var baseOrgLevel = 0;
      var curSelectOrgCodes = '';

      if (this.opt.bigAreas) {
        baseOrgLevel = 1;
        curSelectOrgCodes = this.organOpt.bigAreas;
      }

      if (this.opt.smallAreas) {
        baseOrgLevel = 2;
        curSelectOrgCodes = this.organOpt.smallAreas;
      }

      if (this.opt.managerAreas) {
        baseOrgLevel = 3;
        curSelectOrgCodes = this.organOpt.managerAreas;
      }

      if (this.opt.managerCityAreas) {
        baseOrgLevel = 4;
        curSelectOrgCodes = this.organOpt.managerCityAreas;
      }

      if (this.opt.operateCities) {
        baseOrgLevel = 5;
        curSelectOrgCodes = this.organOpt.operateCities;
      }

      if (baseOrgLevel > 0) {
        this.$request({
          url: '/component/choosingStore/queryShopListByEachCondition',
          params: Object.assign(params, this.getMinAuthParam(baseOrgLevel, curSelectOrgCodes)),
          method: 'get'
        }).then(function (res) {
          if (res.data) {
            _this3[_this3.orgLevelMap[6]] = res.data.list;
          }
        });
      }
    },
    getMinAuthParam: function getMinAuthParam(baseOrgLevel, curSelectOrgCodes) {
      var j;
      var k;
      var curAuthOrgLevelItems;
      var paramMap = {};
      var attr;

      if (curSelectOrgCodes.length) {
        if (baseOrgLevel in this.miniAuthOrgLevelMap) {
          for (attr in this.miniAuthOrgLevelMap) {
            curAuthOrgLevelItems = this.miniAuthOrgLevelMap[attr];

            for (j = 0; j < curAuthOrgLevelItems.length; j++) {
              for (k = 0; k < curSelectOrgCodes.length; k++) {
                if (baseOrgLevel < attr) {
                  if (new RegExp('^' + curSelectOrgCodes[k]).test(curAuthOrgLevelItems[j])) {
                    // 当前选中的的组织机构长编码为授权长编码的一部分时，取授权组织机构长编码（编码越长权限越小）
                    if (!paramMap[this.belleOrgLevelMap[attr]]) {
                      paramMap[this.belleOrgLevelMap[attr]] = [];
                    }

                    if (attr === 6 || attr === '6') {
                      paramMap[this.belleOrgLevelMap[attr]].push(curAuthOrgLevelItems[j].split('-').slice(-1)[0]);
                    } else {
                      paramMap[this.belleOrgLevelMap[attr]].push(curAuthOrgLevelItems[j]);
                    }
                  }
                } else if (curSelectOrgCodes[k] === curAuthOrgLevelItems[j]) {
                  // 当前选中的的组织机构长编码为授权长编码的一部分时，取授权组织机构长编码（编码越长权限越小）
                  if (!paramMap[this.belleOrgLevelMap[attr]]) {
                    paramMap[this.belleOrgLevelMap[attr]] = [];
                  }

                  if (attr === 6 || attr === '6') {
                    paramMap[this.belleOrgLevelMap[attr]].push(curAuthOrgLevelItems[j].split('-').slice(-1)[0]);
                  } else {
                    paramMap[this.belleOrgLevelMap[attr]].push(curAuthOrgLevelItems[j]);
                  }
                }
              }
            }
          }
        } else {
          for (k = 0; k < curSelectOrgCodes.length; k++) {
            // 当前选中的组织机构长编码包含授权的组织机构长编码，则去选中的组织机构长编码
            if (!paramMap[this.belleOrgLevelMap[baseOrgLevel]]) {
              paramMap[this.belleOrgLevelMap[baseOrgLevel]] = [];
            }

            if (baseOrgLevel === 6 || baseOrgLevel === '6') {
              paramMap[this.belleOrgLevelMap[baseOrgLevel]].push(curSelectOrgCodes[k].split('-').slice(-1)[0]);
            } else {
              paramMap[this.belleOrgLevelMap[baseOrgLevel]].push(curSelectOrgCodes[k]);
            }
          }
        }
      } else {
        // 组织机构中未选择任何数据时，取设置的最小权限，去获取门店
        for (attr in this.miniAuthOrgLevelMap) {
          curAuthOrgLevelItems = this.miniAuthOrgLevelMap[attr];

          for (j = 0; j < curAuthOrgLevelItems.length; j++) {
            if (!paramMap[this.belleOrgLevelMap[attr]]) {
              paramMap[this.belleOrgLevelMap[attr]] = [];
            }

            if (attr === 6 || attr === '6') {
              paramMap[this.belleOrgLevelMap[attr]].push(curAuthOrgLevelItems[j].split('-').slice(-1)[0]);
            } else {
              paramMap[this.belleOrgLevelMap[attr]].push(curAuthOrgLevelItems[j]);
            }
          }
        }
      }

      for (attr in paramMap) {
        paramMap[attr] = paramMap[attr].join(',');
      }

      return paramMap;
    },
    queryShopListNoAuth: function queryShopListNoAuth() {
      var _this4 = this;

      var params = {
        shopStatus: 1
      };
      var orgLevel;
      var orgCodes;

      if (this.opt.bigAreas) {
        orgLevel = 1;
        orgCodes = this.opt.bigAreas;
      }

      if (this.opt.smallAreas) {
        orgLevel = 2;
        orgCodes = this.opt.smallAreas;
      }

      if (this.opt.managerAreas) {
        orgLevel = 3;
        orgCodes = this.opt.managerAreas;
      }

      if (this.opt.managerCityAreas) {
        orgLevel = 4;
        orgCodes = this.opt.managerCityAreas;
      }

      if (this.opt.operateCities) {
        orgLevel = 5;
        orgCodes = this.opt.operateCities;
      }

      if (orgLevel && orgCodes) {
        params.orgLevel = orgLevel;
        params.orgCodes = orgCodes;
        this.$request({
          url: '/component/choosingStore/queryShopListByCondition',
          params: params,
          method: 'get'
        }).then(function (res) {
          if (res.data) {
            _this4[_this4.orgLevelMap[6]] = res.data.list;
          }
        });
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/src/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var packages_srcvue_type_script_lang_js_ = (srcvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/src/index.vue





/* normalize component */

var src_component = normalizeComponent(
  packages_srcvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var src = (src_component.exports);
// CONCATENATED MODULE: ./packages/index.js

// 导入组件，组件必须声明 name
 // 为组件提供 install 安装方法，供按需引入

src.install = function (Vue) {
  Vue.component(src.name, src);
};

if (typeof window !== 'undefined' && window.Vue) {
  src.install(window.Vue);
} // 默认导出组件


/* harmony default export */ var packages_0 = (src);
// CONCATENATED MODULE: ./node_modules/_@vue_cli-service@3.12.1@@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (packages_0);



/***/ }),

/***/ "1157":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("e7ad");
var dP = __webpack_require__("064e");
var DESCRIPTORS = __webpack_require__("149f");
var SPECIES = __webpack_require__("cb3d")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "149f":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("238a")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "163d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("e7ad");
var has = __webpack_require__("e042");
var cof = __webpack_require__("75c4");
var inheritIfRequired = __webpack_require__("1e5b");
var toPrimitive = __webpack_require__("94b3");
var fails = __webpack_require__("238a");
var gOPN = __webpack_require__("2ea2").f;
var gOPD = __webpack_require__("dcb7").f;
var dP = __webpack_require__("064e").f;
var $trim = __webpack_require__("777a").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("e005")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("149f") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("bf16")(global, NUMBER, $Number);
}


/***/ }),

/***/ "190b":
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__("149f") && /./g.flags != 'g') __webpack_require__("064e").f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__("f1fe")
});


/***/ }),

/***/ "1e5b":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("fb68");
var setPrototypeOf = __webpack_require__("859b").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "224c":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("75c4");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "238a":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "2b45":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("190b");
var anObject = __webpack_require__("69b3");
var $flags = __webpack_require__("f1fe");
var DESCRIPTORS = __webpack_require__("149f");
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__("bf16")(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__("238a")(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),

/***/ "2ea2":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("c2f7");
var hiddenKeys = __webpack_require__("ceac").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "2f77":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "2fd4":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("fb68");
var cof = __webpack_require__("75c4");
var MATCH = __webpack_require__("cb3d")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "4ce5":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("5daa");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "4f18":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "550e":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "56f2":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("6798")('keys');
var uid = __webpack_require__("ec45");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "5daa":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "5f54":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__("e46b");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__("e118") });


/***/ }),

/***/ "6798":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("7ddc");
var global = __webpack_require__("e7ad");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("550e") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "69b3":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("fb68");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "7108":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__("7e23");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "75c4":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "777a":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("e46b");
var defined = __webpack_require__("f6b4");
var fails = __webpack_require__("238a");
var spaces = __webpack_require__("9769");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "7ddc":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "7e23":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("75c4");
var TAG = __webpack_require__("cb3d")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "80a9":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("c2f7");
var enumBugKeys = __webpack_require__("ceac");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "859b":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("fb68");
var anObject = __webpack_require__("69b3");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("4ce5")(Function.call, __webpack_require__("dcb7").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "86d4":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("064e");
var createDesc = __webpack_require__("cc33");
module.exports = __webpack_require__("149f") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "8714":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__("f1fe");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;

/***/ }),

/***/ "8df1":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("e7ad").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "94b3":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("fb68");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "9769":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "9a33":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isRegExp = __webpack_require__("2fd4");
var anObject = __webpack_require__("69b3");
var speciesConstructor = __webpack_require__("f63e");
var advanceStringIndex = __webpack_require__("e754");
var toLength = __webpack_require__("eafa");
var callRegExpExec = __webpack_require__("7108");
var regexpExec = __webpack_require__("8714");
var fails = __webpack_require__("238a");
var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';
var MAX_UINT32 = 0xffffffff;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { RegExp(MAX_UINT32, 'y'); });

// @@split logic
__webpack_require__("0aed")('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});


/***/ }),

/***/ "9dd9":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("e7ad");
var inheritIfRequired = __webpack_require__("1e5b");
var dP = __webpack_require__("064e").f;
var gOPN = __webpack_require__("2ea2").f;
var isRegExp = __webpack_require__("2fd4");
var $flags = __webpack_require__("f1fe");
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__("149f") && (!CORRECT_NEW || __webpack_require__("238a")(function () {
  re2[__webpack_require__("cb3d")('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__("bf16")(global, 'RegExp', $RegExp);
}

__webpack_require__("1157")('RegExp');


/***/ }),

/***/ "aaba":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__("8714");
__webpack_require__("e46b")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "b3a6":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("09b9");
var toLength = __webpack_require__("eafa");
var toAbsoluteIndex = __webpack_require__("f58a");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "bf16":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("e7ad");
var hide = __webpack_require__("86d4");
var has = __webpack_require__("e042");
var SRC = __webpack_require__("ec45")('src');
var $toString = __webpack_require__("d07e");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("7ddc").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "bfe7":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("fb68");
var document = __webpack_require__("e7ad").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "c2f7":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("e042");
var toIObject = __webpack_require__("09b9");
var arrayIndexOf = __webpack_require__("b3a6")(false);
var IE_PROTO = __webpack_require__("56f2")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "cb3d":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("6798")('wks');
var uid = __webpack_require__("ec45");
var Symbol = __webpack_require__("e7ad").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "cc33":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "cc57":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("064e").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("149f") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "ceac":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "d07e":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("6798")('native-function-to-string', Function.toString);


/***/ }),

/***/ "db6b":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("149f") && !__webpack_require__("238a")(function () {
  return Object.defineProperty(__webpack_require__("bfe7")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "dcb7":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("4f18");
var createDesc = __webpack_require__("cc33");
var toIObject = __webpack_require__("09b9");
var toPrimitive = __webpack_require__("94b3");
var has = __webpack_require__("e042");
var IE8_DOM_DEFINE = __webpack_require__("db6b");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("149f") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "e005":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("69b3");
var dPs = __webpack_require__("0dc8");
var enumBugKeys = __webpack_require__("ceac");
var IE_PROTO = __webpack_require__("56f2")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("bfe7")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("8df1").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "e042":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "e118":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = __webpack_require__("149f");
var getKeys = __webpack_require__("80a9");
var gOPS = __webpack_require__("2f77");
var pIE = __webpack_require__("4f18");
var toObject = __webpack_require__("008a");
var IObject = __webpack_require__("224c");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__("238a")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ "e46b":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("e7ad");
var core = __webpack_require__("7ddc");
var hide = __webpack_require__("86d4");
var redefine = __webpack_require__("bf16");
var ctx = __webpack_require__("4ce5");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "e67d":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "e754":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__("fc81")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "e7ad":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "eafa":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("ee21");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "ec45":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "ee21":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "f1fe":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("69b3");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "f58a":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("ee21");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "f63e":
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__("69b3");
var aFunction = __webpack_require__("5daa");
var SPECIES = __webpack_require__("cb3d")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "f6b4":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "fb68":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "fc81":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("ee21");
var defined = __webpack_require__("f6b4");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ })

/******/ });
});
//# sourceMappingURL=belle-choose-organ-level.umd.js.map