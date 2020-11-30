import _get from 'lodash.get';

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
var script = {
  data: function data() {
    return {
      style: {
        border: 'none',
        background: 'inherit',
        padding: '9px 0'
      }
    };
  },
  mounted: function mounted() {
    // 将初始color写到style里，覆盖element的hover效果
    this.style = Object.assign({}, this.style, {
      color: getComputedStyle(this.$el).color
    });
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "el-button",
    _vm._g(
      _vm._b(
        {
          style: _vm.style,
          attrs: { type: _vm.$attrs.type || "primary", plain: "" }
        },
        "el-button",
        _vm.$attrs,
        false
      ),
      _vm.$listeners
    ),
    [_vm._t("default")],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var TextButton = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

//
var script$1 = {
  components: {
    TextButton: TextButton
  },
  props: {
    /**
     * 是否是文字按钮。
     */
    isText: {
      type: Boolean,
      "default": false
    },

    /**
     * 如果没有这个props，则通过attrs传`type`时，会导致el-button的`native-type`也被改变
     */
    type: String,

    /**
     * 点击按钮绑定的函数
     */
    click: {
      type: Function
    },

    /**
     * click函数的参数
     */
    params: {},

    /**
     * 点击事件的回调函数
     */
    callback: {
      type: Function,
      "default": function _default() {}
    }
  },
  data: function data() {
    return {
      loading: false
    };
  },
  methods: {
    // 监控按钮的Promise进程
    handleClick: function handleClick() {
      var _this = this;

      if (!this.click) return;
      this.loading = true;
      Promise.resolve(this.click(this.params)).then(function (flag) {
        if (flag === false) return; // 调用父组件中的数据刷新方法

        _this.callback();
      })["catch"](function (e) {})["finally"](function (e) {
        _this.loading = false;
      });
    }
  }
};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    _vm.isText ? "text-button" : "el-button",
    _vm._g(
      _vm._b(
        {
          tag: "component",
          attrs: { loading: _vm.loading, type: _vm.type },
          on: { click: _vm.handleClick }
        },
        "component",
        _vm.$attrs,
        false
      ),
      _vm.$listeners
    ),
    [_vm._t("default")],
    2
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var SelfLoadingButton = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

var arrayWithHoles = _arrayWithHoles;

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

var iterableToArrayLimit = _iterableToArrayLimit;

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var nonIterableRest = _nonIterableRest;

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

var slicedToArray = _slicedToArray;

var valueSeparator = '~';
var paramSeparator = ',';
var queryFlag = 'q=';
var queryPattern = new RegExp(queryFlag + '.*' + paramSeparator);
/**
 * 转换query对象成可附在url上的字符串
 * qs.stringify只能自定义delimiter，不能自定义equal
 * {a: 'a&b', b: true} => 'a~a%26b,b~true'
 *
 * @param {object} query
 * @param {string} equal - 键和值的分隔符
 * @param {string} delimiter - 键值对之间的分隔符
 * @return {string}
 */

function stringify(query) {
  var equal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : valueSeparator;
  var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : paramSeparator;
  return Object.keys(query).map(function (k) {
    return "".concat(k).concat(equal).concat(encodeURIComponent(query[k]));
  }).join(delimiter);
}
/**
 * 转换附在url上的字符串成query对象
 * qs.parse只能自定义delimiter，不能自定义equal
 * 'a~a%26b,b~true' => {a: 'a&b', b: true}
 *
 * @param {string} query
 * @param {string} equal - 键和值的分隔符
 * @param {string} delimiter - 键值对之间的分隔符
 * @return {object}
 */

function parse(query) {
  var equal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : valueSeparator;
  var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : paramSeparator;
  return query.split(delimiter).map(function (param) {
    return param.split(equal);
  }).reduce(function (obj, _ref) {
    var _ref2 = slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    obj[k] = decodeURIComponent(v);
    return obj;
  }, {});
}
/**
 * 将query对象转换成str插入到url上
 *
 * @param {string} url
 * @param {object} query
 * @param {'history'|'hash'} routerMode
 * @returns {string} 插入了query的url
 */

function set(url, query, routerMode) {
  var queryStr = queryFlag + stringify(query) + paramSeparator;

  var queryPrefix = function queryPrefix(str) {
    return str.indexOf('?') > -1 ? '&' : '?';
  };

  if (queryPattern.test(url)) {
    return url.replace(queryPattern, queryStr);
  } else if (url.indexOf('#') === -1) {
    return url + queryPrefix(url) + queryStr;
  } else {
    var _url$split = url.split('#'),
        _url$split2 = slicedToArray(_url$split, 2),
        path = _url$split2[0],
        hash = _url$split2[1];

    if (routerMode === 'history') {
      return path + queryPrefix(path) + queryStr + '#' + hash;
    } else {
      return url + queryPrefix(hash) + queryStr;
    }
  }
}
/**
 * 从url中取出query对象，如果没有，返回null
 *
 * @param {string} url
 * @return {object|null} 对象类型的query参数
 */

function get(url) {
  var found = url.match(queryPattern);
  if (!found) return null;
  var queryStr = found[0].replace(queryFlag, '').slice(0, -1); // 移除末尾的paramSeparator

  return parse(queryStr);
}
/**
 * 从url中移除(?||&)queryPattern
 * @param {string} url
 */

function clear(url) {
  if (queryPattern.test(url)) {
    var replacePattern = RegExp('[?&]' + queryPattern.source);
    return url.replace(replacePattern, '');
  } else {
    return url;
  }
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var assertThisInitialized = _assertThisInitialized;

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

var possibleConstructorReturn = _possibleConstructorReturn;

var getPrototypeOf = createCommonjsModule(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
});

var setPrototypeOf = createCommonjsModule(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
});

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

var inherits = _inherits;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

/**
 * 两种多选策略：Normal 和 PersistSelection
 */

/**
 * 多选策略接口
 */
var StrategyAbstract =
/*#__PURE__*/
function () {
  function StrategyAbstract(elDataTable) {
    classCallCheck(this, StrategyAbstract);

    this.elDataTable = elDataTable; // 绑定this后可直接在template中使用

    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
  }

  createClass(StrategyAbstract, [{
    key: "onSelectionChange",
    value: function onSelectionChange() {}
  }, {
    key: "onSelect",
    value: function onSelect() {}
  }, {
    key: "onSelectAll",
    value: function onSelectAll() {}
  }, {
    key: "toggleRowSelection",
    value: function toggleRowSelection() {}
  }, {
    key: "clearSelection",
    value: function clearSelection() {}
  }, {
    key: "updateElTableSelection",
    value: function updateElTableSelection() {}
  }, {
    key: "elTable",
    get: function get() {
      return this.elDataTable.$refs.table;
    }
  }]);

  return StrategyAbstract;
}();
/**
 * 普通策略。由el-table维护selected
 */


var StrategyNormal =
/*#__PURE__*/
function (_StrategyAbstract) {
  inherits(StrategyNormal, _StrategyAbstract);

  function StrategyNormal() {
    classCallCheck(this, StrategyNormal);

    return possibleConstructorReturn(this, getPrototypeOf(StrategyNormal).apply(this, arguments));
  }

  createClass(StrategyNormal, [{
    key: "onSelectionChange",

    /**
     * normal模式下只需要监听selection-change事件
     */
    value: function onSelectionChange(val) {
      this.elDataTable.selected = val;
    }
    /**
     * toggleRowSelection和clearSelection的表现与el-table一致
     */

  }, {
    key: "toggleRowSelection",
    value: function toggleRowSelection() {
      var _this$elTable;

      return (_this$elTable = this.elTable).toggleRowSelection.apply(_this$elTable, arguments);
    }
  }, {
    key: "clearSelection",
    value: function clearSelection() {
      return this.elTable.clearSelection();
    }
  }]);

  return StrategyNormal;
}(StrategyAbstract);
/**
 * 跨页保存多选策略。手动维护selected数组
 */


var StrategyPersistSelection =
/*#__PURE__*/
function (_StrategyAbstract2) {
  inherits(StrategyPersistSelection, _StrategyAbstract2);

  function StrategyPersistSelection() {
    classCallCheck(this, StrategyPersistSelection);

    return possibleConstructorReturn(this, getPrototypeOf(StrategyPersistSelection).apply(this, arguments));
  }

  createClass(StrategyPersistSelection, [{
    key: "onSelect",

    /**
     * el-table的selection-change事件不适用于开启跨页保存的情况。
     * 比如，当开启persistSelection时，发生以下两个场景：
     * 1. 用户点击翻页
     * 2. 用户点击行首的切换全选项按钮，清空当前页多选项数据
     * 其中场景1应该保持selected不变；而场景2只应该从selected移除当前页所有行，保留其他页面的多选状态。
     * 但el-table的selection-change事件在两个场景中无差别发生，所以这里不处理这个事件
     */

    /**
     * 用户切换某一行的多选
     */
    value: function onSelect(selection, row) {
      var isChosen = selection.indexOf(row) > -1;
      this.toggleRowSelection(row, isChosen);
    }
    /**
     * 用户切换当前页的多选
     */

  }, {
    key: "onSelectAll",
    value: function onSelectAll(selection) {
      var _this = this;

      var isSelected = !!selection.length;
      this.elDataTable.data.forEach(function (r) {
        return _this.toggleRowSelection(r, isSelected);
      });
    }
    /**
     * toggleRowSelection和clearSelection管理elDataTable的selected数组
     * 记得最后要将状态同步到el-table中
     */

  }, {
    key: "toggleRowSelection",
    value: function toggleRowSelection(row, isSelected) {
      var _this$elDataTable = this.elDataTable,
          id = _this$elDataTable.id,
          selected = _this$elDataTable.selected;
      var foundIndex = selected.findIndex(function (r) {
        return r[id] === row[id];
      });

      if (typeof isSelected === 'undefined') {
        if (foundIndex > -1) {
          selected.splice(foundIndex, 1);
        } else {
          selected.push(row);
        }
      } else if (isSelected && foundIndex === -1) {
        selected.push(row);
      } else if (!isSelected && foundIndex > -1) {
        selected.splice(foundIndex, 1);
      }

      this.updateElTableSelection();
    }
  }, {
    key: "clearSelection",
    value: function clearSelection() {
      this.elDataTable.selected = [];
      this.updateElTableSelection();
    }
    /**
     * 将selected状态同步到el-table中
     */

  }, {
    key: "updateElTableSelection",
    value: function updateElTableSelection() {
      var _this2 = this;

      var _this$elDataTable2 = this.elDataTable,
          data = _this$elDataTable2.data,
          id = _this$elDataTable2.id,
          selected = _this$elDataTable2.selected;
      data.forEach(function (r) {
        var isSelected = !!selected.find(function (r2) {
          return r[id] === r2[id];
        });

        _this2.elTable.toggleRowSelection(r, isSelected);
      });
    }
  }]);

  return StrategyPersistSelection;
}(StrategyAbstract);

function getSelectStrategy(elDataTable) {
  return elDataTable.persistSelection ? new StrategyPersistSelection(elDataTable) : new StrategyNormal(elDataTable);
}

//
//          {
//            "code":0,
//            "msg":"ok",
//            "payload":{
//              "content":[], // 数组
//              "totalElements":2, // 总数
//            }
//          }
// 可根据实际情况传入 data/total 两个字段的路径, 分别对应上面数据结构中的 content/totalElements
// 如果接口不分页, 则传hasPagination=false, 此时数据取 payload, 当然也可以自定义, 设置dataPath即可

var defaultFirstPage = 1;
var dataPath = 'payload.content';
var totalPath = 'payload.totalElements';
var noPaginationDataPath = 'payload';
var treeChildKey = 'children';
var treeParentKey = 'parentId';
var treeParentValue = 'id';
var defaultId = 'id';
var dialogForm = 'dialogForm';
var script$2 = {
  name: 'ElDataTable',
  components: {
    SelfLoadingButton: SelfLoadingButton,
    TextButton: TextButton
  },
  props: {
    /**
     * 请求url, 如果为空, 则不会发送请求; 改变url, 则table会重新发送请求
     */
    url: {
      type: String,
      "default": ''
    },

    /**
     * 主键，默认值 id，
     * 修改/删除时会用到,请求会根据定义的属性值获取主键,即row[this.id]
     */
    id: {
      type: String,
      "default": defaultId
    },

    /**
     * 分页请求的第一页的值(有的接口0是第一页)
     */
    firstPage: {
      type: Number,
      "default": defaultFirstPage
    },

    /**
     * 渲染组件的分页数据在接口返回的数据中的路径, 嵌套对象使用.表示即可
     */
    dataPath: {
      type: String,
      "default": dataPath
    },

    /**
     * 分页数据的总数在接口返回的数据中的路径, 嵌套对象使用.表示即可
     */
    totalPath: {
      type: String,
      "default": totalPath
    },

    /**
     * 列属性设置, 详情见element-ui官网
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/table#table-column-attributes
     */
    columns: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },

    /**
     * 查询字段渲染, 配置参考el-form-renderer
     * @link https://femessage.github.io/el-form-renderer/
     */
    searchForm: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },

    /**
     * 是否开启搜索栏折叠功能
     */
    canSearchCollapse: {
      type: Boolean,
      "default": false
    },

    /**
     * 点击查询按钮, 查询前执行的函数, 需要返回Promise
     */
    beforeSearch: {
      type: Function,
      "default": function _default() {
        return Promise.resolve();
      }
    },

    /**
     * 单选, 适用场景: 不可以批量删除
     */
    single: {
      type: Boolean,
      "default": false
    },

    /**
     * 切换页面时，已勾选项不会丢失
     */
    persistSelection: {
      type: Boolean,
      "default": false
    },

    /**
     * 是否有操作列
     */
    hasOperation: {
      type: Boolean,
      "default": true
    },

    /**
     * 操作列的自定义按钮, 渲染的是element-ui的button, 支持包括style在内的以下属性:
     * {type: '', text: '', atClick: row => Promise.resolve(), show: row => return true时显示 }
     * 点击事件 row参数 表示当前行数据, 需要返回Promise, 默认点击后会刷新table, resolve(false) 则不刷新
     */
    extraButtons: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },

    /**
     * 头部的自定义按钮, 渲染的是element-ui的button, 支持包括style在内的以下属性:
     * {type: '', text: '', atClick: selected => Promise.resolve(), show: selected => return true时显示, disabled: selected => return true时禁用}
     * 点击事件 selected参数 表示选中行所组成的数组, 函数需要返回Promise, 默认点击后会刷新table, resolve(false) 则不刷新
     */
    headerButtons: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },

    /**
     * 是否有新增按钮
     */
    hasNew: {
      type: Boolean,
      "default": true
    },

    /**
     * 是否有编辑按钮
     */
    hasEdit: {
      type: Boolean,
      "default": true
    },

    /**
     * 是否有查看按钮
     */
    hasView: {
      type: Boolean,
      "default": false
    },

    /**
     * table头部是否有删除按钮(该按钮要多选时才会出现)
     */
    hasDelete: {
      type: Boolean,
      "default": true
    },

    /**
     * 新增按钮文案
     */
    newText: {
      type: String,
      "default": '新增'
    },

    /**
     * 修改按钮文案
     */
    editText: {
      type: String,
      "default": '修改'
    },

    /**
     * 查看按钮文案
     */
    viewText: {
      type: String,
      "default": '查看'
    },

    /**
     * 某行数据是否可以删除, 返回true表示可以, 控制的是单选时单行的删除按钮
     */
    canDelete: {
      type: Function,
      "default": function _default() {
        return true;
      }
    },

    /**
     * 点击新增按钮时的方法, 当默认新增方法不满足需求时使用, 需要返回promise
     * 参数(data, row) data 是form表单的数据, row 是当前行的数据, 只有isTree为true时, 点击操作列的新增按钮才会有值
     */
    onNew: {
      type: Function
    },

    /**
     * 点击修改按钮时的方法, 当默认修改方法不满足需求时使用, 需要返回promise
     * 参数(data, row) data 是form表单的数据, row 是当前行的数据
     */
    onEdit: {
      type: Function
    },

    /**
     * 点击删除按钮时的方法, 当默认删除方法不满足需求时使用, 需要返回promise
     * 多选时, 参数为selected, 代表选中的行组成的数组; 非多选时参数为row, 代表单行的数据
     */
    onDelete: {
      type: Function
    },

    /**
     * 是否分页。如果不分页，则请求传参page=-1
     */
    hasPagination: {
      type: Boolean,
      "default": true
    },

    /**
     * 分页组件的子组件布局，子组件名用逗号分隔，对应element-ui pagination的layout属性
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/pagination
     */
    paginationLayout: {
      type: String,
      "default": 'total, sizes, prev, pager, next, jumper'
    },

    /**
     * 分页组件的每页显示个数选择器的选项设置，对应element-ui pagination的page-sizes属性
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/pagination
     */
    paginationSizes: {
      type: Array,
      "default": function _default() {
        return [10, 20, 30, 40, 50];
      }
    },

    /**
     * 分页组件的每页显示个数选择器默认选项，对应element-ui pagination的page-size属性
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/pagination
     */
    paginationSize: {
      type: Number,
      "default": 10
    },

    /**
     * @deprecated
     * 不分页时的size的大小(建议接口约定，不分页时传参page=-1，故一般不会用到此属性)
     */
    noPaginationSize: {
      type: Number,
      "default": 999
    },

    /**
     * 要渲染的数据是否是树形结构
     */
    isTree: {
      type: Boolean,
      "default": false
    },

    /**
     * 树形结构相关: 子节点的字段名
     */
    treeChildKey: {
      type: String,
      "default": treeChildKey
    },

    /**
     * 树形结构相关: 父节点的字段名
     */
    treeParentKey: {
      type: String,
      "default": treeParentKey
    },

    /**
     * 树形结构相关: 父节点字段值的来源字段。
     * 新增/修改时会用到, 例如, 在id为2的节点新增子节点, 则子节点的parentId为2, 也即parentId的值来源于字段id, 故treeParentValue为id
     */
    treeParentValue: {
      type: String,
      "default": treeParentValue
    },

    /**
     * 树形结构相关: 是否展开所有节点
     */
    expandAll: {
      type: Boolean,
      "default": false
    },

    /**
     * element table 属性设置, 详情配置参考element-ui官网
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/table#table-attributes
     */
    tableAttrs: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },

    /**
     * 操作列属性
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/table#table-column-attributes
     */
    operationAttrs: {
      type: Object,
      "default": function _default() {
        return {
          width: '',
          fixed: 'right'
        };
      }
    },

    /**
     * 是否有弹窗, 用于不需要弹窗时想减少DOM渲染的场景
     */
    hasDialog: {
      type: Boolean,
      "default": true
    },

    /**
     * 新增弹窗的标题，默认为newText的值
     */
    dialogNewTitle: {
      type: String,
      "default": function _default() {
        return this.newText;
      }
    },

    /**
     * 修改弹窗的标题，默认为editText的值
     */
    dialogEditTitle: {
      type: String,
      "default": function _default() {
        return this.editText;
      }
    },

    /**
     * 查看弹窗的标题，默认为viewText的值
     */
    dialogViewTitle: {
      type: String,
      "default": function _default() {
        return this.viewText;
      }
    },

    /**
     * 弹窗表单, 用于新增与修改, 详情配置参考el-form-renderer
     * @link https://femessage.github.io/el-form-renderer/
     */
    form: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },

    /**
     * 弹窗表单属性设置, 详情配置参考element-ui官网
     * @link https://element.eleme.cn/2.4/#/zh-CN/component/form#form-attributes
     */
    formAttrs: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },

    /**
     * 同extraBody
     * @deprecated
     */
    extraParams: {
      type: Object,
      "default": function _default() {
        return undefined;
      }
    },

    /**
     * 新增/修改提交时，请求体带上额外的参数。
     */
    extraBody: {
      type: Object,
      "default": function _default() {
        return undefined;
      }
    },

    /**
     * 在新增/修改弹窗 点击确认时调用，返回Promise, 如果reject, 则不会发送新增/修改请求
     * 参数: (data, isNew) data为表单数据, isNew true 表示是新增弹窗, false 为 编辑弹窗
     */
    beforeConfirm: {
      type: Function,
      "default": function _default() {
        return Promise.resolve();
      }
    },

    /**
     * 同extraQuery
     * @deprecated
     */
    customQuery: {
      type: Object,
      "default": function _default() {
        return undefined;
      }
    },

    /**
     * 向请求url添加的额外参数。
     * 可用.sync修饰，此时点击重置按钮后该参数也会被重置
     */
    extraQuery: {
      type: Object,
      "default": function _default() {
        return undefined;
      }
    },

    /**
     * 是否开启使用url保存query参数的功能
     */
    saveQuery: {
      type: Boolean,
      "default": true
    }
  },
  data: function data() {
    return {
      data: [],
      hasSelect: this.columns.length && this.columns[0].type == 'selection',
      size: this.paginationSize || this.paginationSizes[0],
      page: defaultFirstPage,
      // https://github.com/ElemeFE/element/issues/1153
      total: null,
      loading: false,
      // 多选项的数组
      selected: [],
      //弹窗
      dialogTitle: this.dialogNewTitle,
      dialogVisible: false,
      isNew: true,
      isEdit: false,
      isView: false,
      confirmLoading: false,
      // 要修改的那一行
      row: {},
      // 初始的extraQuery值, 重置查询时, 会用到
      // JSON.stringify是为了后面深拷贝作准备
      initExtraQuery: JSON.stringify(this.extraQuery || this.customQuery || {}),
      isSearchCollapse: false
    };
  },
  computed: {
    routerMode: function routerMode() {
      return this.$router ? this.$router.mode : 'hash';
    },
    hasSearchForm: function hasSearchForm() {
      return this.searchForm.length || this.$slots.search;
    },
    _extraBody: function _extraBody() {
      return this.extraBody || this.extraParams || {};
    },
    _extraQuery: function _extraQuery() {
      return this.extraQuery || this.customQuery || {};
    },
    selectStrategy: function selectStrategy() {
      return getSelectStrategy(this);
    }
  },
  watch: {
    url: function url(val, old) {
      this.page = defaultFirstPage;
      this.getList();
    },
    dialogVisible: function dialogVisible(val, old) {
      if (!val) {
        this.isNew = false;
        this.isEdit = false;
        this.isView = false;
        this.confirmLoading = false;
        this.$refs[dialogForm].resetFields();
      }
    },
    selected: function selected(val) {
      /**
       * 多选项发生变化
       * @property {array} rows - 已选中的行数据的数组
       */
      this.$emit('selection-change', val);
    }
  },
  mounted: function mounted() {
    var _this = this;

    if (this.saveQuery) {
      var query = get(location.href);

      if (query) {
        this.page = parseInt(query.page);
        this.size = parseInt(query.size); // 恢复查询条件，但对slot=search无效

        if (this.$refs.searchForm) {
          delete query.page;
          delete query.size;
          this.$refs.searchForm.updateForm(query);
        }
      }
    }

    this.$nextTick(function () {
      _this.getList();
    });
  },
  methods: {
    /**
     * 手动刷新列表数据
     * @public
     * @param {boolean} saveQuery - 是否保存query到路由上
     */
    getList: function getList(saveQuery) {
      var _this2 = this;

      var url = this.url;

      if (!url) {
        console.warn('DataTable: url 为空, 不发送请求');
        return;
      } // 构造query对象


      var query = {};

      if (this.$refs.searchForm) {
        Object.assign(query, this.$refs.searchForm.getFormValue());
      }

      Object.assign(query, this._extraQuery);
      query.size = this.hasPagination ? this.size : this.noPaginationSize; // 根据偏移值计算接口正确的页数

      var pageOffset = this.firstPage - defaultFirstPage;
      query.page = this.hasPagination ? this.page + pageOffset : -1; // 无效值过滤，注意0是有效值

      query = Object.keys(query).filter(function (k) {
        return ['', undefined, null].indexOf(query[k]) === -1;
      }).reduce(function (obj, k) {
        obj[k] = query[k].toString().trim();
        return obj;
      }, {});
      var queryStr = (url.indexOf('?') > -1 ? '&' : '?') + stringify(query, '=', '&'); // 请求开始

      this.loading = true;
      this.$axios.get(url + queryStr).then(function (_ref) {
        var resp = _ref.data;
        var data = []; // 不分页

        if (!_this2.hasPagination) {
          data = _get(resp, _this2.dataPath) || _get(resp, noPaginationDataPath) || [];
        } else {
          data = _get(resp, _this2.dataPath) || [];
          _this2.total = _get(resp, _this2.totalPath);
        }

        _this2.data = data; // 树形结构逻辑

        if (_this2.isTree) {
          _this2.data = _this2.tree2Array(data, _this2.expandAll);
        }

        _this2.loading = false;
        /**
         * 请求返回, 数据更新后触发
         * @property {object} data - table的数据
         * @property {object} resp - 请求返回的完整response
         */

        _this2.$emit('update', data, resp); // 开启persistSelection时，需要同步selected状态到el-table中


        _this2.$nextTick(function () {
          _this2.selectStrategy.updateElTableSelection();
        });
      })["catch"](function (err) {
        /**
         * 请求数据失败，返回err对象
         * @event error
         */
        _this2.$emit('error', err);

        _this2.loading = false;
      }); // 存储query记录, 便于后面恢复

      if (saveQuery) {
        // 存储的page是table的页码，无需偏移
        query.page = this.page;
        var newUrl = set(location.href, query, this.routerMode);
        history.pushState(history.state, 'el-data-table search', newUrl);
      }
    },
    search: function search() {
      var _this3 = this;

      this.$refs.searchForm.validate(function (valid) {
        if (!valid) return;

        _this3.beforeSearch().then(function () {
          _this3.page = defaultFirstPage;

          _this3.getList(_this3.saveQuery);
        })["catch"](function (err) {
          _this3.$emit('error', err);
        });
      });
    },
    resetSearch: function resetSearch() {
      var _this4 = this;

      // reset后, form里的值会变成 undefined, 在下一次查询会赋值给query
      this.$refs.searchForm.resetFields();
      this.page = defaultFirstPage; // 重置

      if (this.saveQuery) {
        var newUrl = clear(location.href);
        history.replaceState(history.state, '', newUrl);
      }

      this.$nextTick(function () {
        _this4.getList();
      });
      /**
       * 按下重置按钮后触发
       */

      this.$emit('reset');
      this.$emit('update:customQuery', JSON.parse(this.initExtraQuery));
      this.$emit('update:extraQuery', JSON.parse(this.initExtraQuery));
    },
    handleSizeChange: function handleSizeChange(val) {
      if (this.size === val) return;
      this.page = defaultFirstPage;
      this.size = val;
      this.getList(this.saveQuery);
    },
    handleCurrentChange: function handleCurrentChange(val) {
      if (this.page === val) return;
      this.page = val;
      this.getList(this.saveQuery);
    },

    /**
     * 切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否
     *
     * @public
     * @param {object} row - 要更新的数据行
     * @param {boolean} isSelected - 是否被勾选
     */
    toggleRowSelection: function toggleRowSelection(row, isSelected) {
      return this.selectStrategy.toggleRowSelection(row, isSelected);
    },

    /**
     * 清空多选项
     *
     * @public
     */
    clearSelection: function clearSelection() {
      return this.selectStrategy.clearSelection();
    },
    // 弹窗相关
    // 除非树形结构在操作列点击新增, 否则 row 都是 undefined
    onDefaultNew: function onDefaultNew() {
      var row = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.row = row;
      this.isNew = true;
      this.isEdit = false;
      this.isView = false;
      this.dialogTitle = this.dialogNewTitle;
      this.dialogVisible = true;
    },
    onDefaultView: function onDefaultView(row) {
      var _this5 = this;

      this.row = row;
      this.isView = true;
      this.isNew = false;
      this.isEdit = false;
      this.dialogTitle = this.dialogViewTitle;
      this.dialogVisible = true; // 给表单填充值

      this.$nextTick(function () {
        _this5.$refs[dialogForm].updateForm(row);
      });
    },
    onDefaultEdit: function onDefaultEdit(row) {
      var _this6 = this;

      this.row = row;
      this.isEdit = true;
      this.isNew = false;
      this.isView = false;
      this.dialogTitle = this.dialogEditTitle;
      this.dialogVisible = true; // 给表单填充值

      this.$nextTick(function () {
        _this6.$refs[dialogForm].updateForm(row);
      });
    },
    cancel: function cancel() {
      this.dialogVisible = false;
    },
    confirm: function confirm() {
      var _this7 = this;

      if (this.isView) {
        this.cancel();
        return;
      }

      this.$refs[dialogForm].validate(function (valid) {
        if (!valid) return false;
        var data = Object.assign({}, _this7.$refs[dialogForm].getFormValue(), _this7._extraBody);

        if (_this7.isTree) {
          if (_this7.isNew) data[_this7.treeParentKey] = _this7.row[_this7.treeParentValue];else data[_this7.treeParentKey] = _this7.row[_this7.treeParentKey];
        }

        _this7.beforeConfirm(data, _this7.isNew).then(function (resp) {
          var condiction = 'isNew';
          var customMethod = 'onNew';

          if (_this7.isEdit) {
            condiction = 'isEdit';
            customMethod = 'onEdit';
          }

          if (_this7[condiction] && _this7[customMethod]) {
            _this7[customMethod](data, _this7.row).then(function (resp) {
              _this7.getList();

              _this7.showMessage(true);

              _this7.cancel();
            })["catch"](function (e) {});

            return;
          } // 默认新增/修改逻辑


          var method = 'post';
          var url = _this7.url + '';

          if (_this7.isEdit) {
            method = 'put';
            url += "/".concat(_this7.row[_this7.id]);
          }

          _this7.confirmLoading = true;

          _this7.$axios[method](url, data).then(function (resp) {
            _this7.getList();

            _this7.showMessage(true);

            _this7.cancel();
          })["catch"](function (err) {
            _this7.confirmLoading = false;
          });
        })["catch"](function (e) {});
      });
    },
    onDefaultDelete: function onDefaultDelete(row) {
      var _this8 = this;

      this.$confirm('确认删除吗', '提示', {
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        beforeClose: function beforeClose(action, instance, done) {
          if (action == 'confirm') {
            instance.confirmButtonLoading = true;

            if (_this8.onDelete) {
              _this8.onDelete(_this8.hasSelect ? !_this8.single ? _this8.selected : _this8.selected[0] : row).then(function (resp) {
                _this8.showMessage(true);

                done();

                _this8.clearSelection();

                _this8.getList();
              })["catch"](function (e) {})["finally"](function (e) {
                instance.confirmButtonLoading = false;
              });

              return;
            } // 默认删除逻辑
            // 单个删除


            if (!_this8.hasSelect) {
              _this8.$axios["delete"](_this8.url + '/' + row[_this8.id]).then(function (resp) {
                instance.confirmButtonLoading = false;
                done();

                _this8.showMessage(true);

                _this8.getList();
              })["catch"](function (er) {
                instance.confirmButtonLoading = false;
              });
            } else {
              // 多选模式
              _this8.$axios["delete"](_this8.url + '/' + _this8.selected.map(function (v) {
                return v[_this8.id];
              }).toString()).then(function (resp) {
                instance.confirmButtonLoading = false;
                done();

                _this8.showMessage(true);

                _this8.clearSelection();

                _this8.getList();
              })["catch"](function (er) {
                instance.confirmButtonLoading = false;
              });
            }
          } else done();
        }
      })["catch"](function (er) {
        /*取消*/
      });
    },
    // 树形table相关
    // https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable
    tree2Array: function tree2Array(data, expandAll) {
      var _this9 = this;

      var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var tmp = [];
      data.forEach(function (record) {
        if (record._expanded === undefined) {
          _this9.$set(record, '_expanded', expandAll);
        }

        var _level = 0;

        if (level !== undefined && level !== null) {
          _level = level + 1;
        }

        _this9.$set(record, '_level', _level); // 如果有父元素


        if (parent) {
          _this9.$set(record, 'parent', parent);
        }

        tmp.push(record);

        if (record[_this9.treeChildKey] && record[_this9.treeChildKey].length > 0) {
          var children = _this9.tree2Array(record[_this9.treeChildKey], expandAll, record, _level);

          tmp = tmp.concat(children);
        }
      });
      return tmp;
    },
    showRow: function showRow(row) {
      var show = row.row.parent ? row.row.parent._expanded && row.row.parent._show : true;
      row.row._show = show;
      return show ? 'animation:treeTableShow 1s-webkit-animation:treeTableShow 1s' : 'display:none';
    },
    // 切换下级是否展开
    toggleExpanded: function toggleExpanded(trIndex) {
      var record = this.data[trIndex];
      record._expanded = !record._expanded;
    },
    // 图标显示
    iconShow: function iconShow(index, record) {
      //      return index ===0 && record.children && record.children.length > 0;
      return record[this.treeChildKey] && record[this.treeChildKey].length > 0;
    },
    showMessage: function showMessage() {
      var isSuccess = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (isSuccess) {
        this.$message({
          type: 'success',
          message: '操作成功'
        });
      } else {
        this.$message({
          type: 'error',
          message: '操作失败'
        });
      }
    }
  }
};

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "el-data-table" },
    [
      _vm.hasSearchForm
        ? _c(
            "el-form-renderer",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: !_vm.isSearchCollapse,
                  expression: "!isSearchCollapse"
                }
              ],
              ref: "searchForm",
              attrs: { inline: "", content: _vm.searchForm },
              nativeOn: {
                submit: function($event) {
                  $event.preventDefault();
                }
              }
            },
            [
              _vm._t("search"),
              _vm._v(" "),
              _c(
                "el-form-item",
                [
                  _c(
                    "el-button",
                    {
                      attrs: {
                        "native-type": "submit",
                        type: "primary",
                        size: "small"
                      },
                      on: { click: _vm.search }
                    },
                    [_vm._v("查询")]
                  ),
                  _vm._v(" "),
                  _c(
                    "el-button",
                    {
                      attrs: { size: "small" },
                      on: { click: _vm.resetSearch }
                    },
                    [_vm._v("重置")]
                  )
                ],
                1
              )
            ],
            2
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.hasNew ||
      _vm.hasDelete ||
      _vm.headerButtons.length > 0 ||
      _vm.canSearchCollapse
        ? _c(
            "el-form",
            [
              _c(
                "el-form-item",
                [
                  _vm.hasNew
                    ? _c(
                        "el-button",
                        {
                          attrs: { type: "primary", size: "small" },
                          on: { click: _vm.onDefaultNew }
                        },
                        [_vm._v(_vm._s(_vm.newText))]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm._l(_vm.headerButtons, function(btn, i) {
                    return ("show" in btn
                    ? btn.show(_vm.selected)
                    : true)
                      ? _c(
                          "self-loading-button",
                          _vm._b(
                            {
                              key: i,
                              attrs: {
                                disabled:
                                  "disabled" in btn
                                    ? btn.disabled(_vm.selected)
                                    : false,
                                click: btn.atClick,
                                params: _vm.selected,
                                callback: _vm.getList,
                                size: "small"
                              }
                            },
                            "self-loading-button",
                            btn,
                            false
                          ),
                          [
                            _vm._v(
                              "\n        " +
                                _vm._s(
                                  typeof btn.text === "function"
                                    ? btn.text(_vm.selected)
                                    : btn.text
                                ) +
                                "\n      "
                            )
                          ]
                        )
                      : _vm._e()
                  }),
                  _vm._v(" "),
                  _vm.hasSelect && _vm.hasDelete
                    ? _c(
                        "el-button",
                        {
                          attrs: {
                            type: "danger",
                            size: "small",
                            disabled: _vm.single
                              ? !_vm.selected.length || _vm.selected.length > 1
                              : !_vm.selected.length
                          },
                          on: {
                            click: function($event) {
                              return _vm.onDefaultDelete($event)
                            }
                          }
                        },
                        [_vm._v("删除")]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.canSearchCollapse
                    ? _c(
                        "el-button",
                        {
                          attrs: {
                            type: "default",
                            size: "small",
                            icon:
                              "el-icon-arrow-" +
                              (_vm.isSearchCollapse ? "down" : "up")
                          },
                          on: {
                            click: function($event) {
                              _vm.isSearchCollapse = !_vm.isSearchCollapse;
                            }
                          }
                        },
                        [
                          _vm._v(
                            _vm._s(_vm.isSearchCollapse ? "展开" : "折叠") +
                              "搜索"
                          )
                        ]
                      )
                    : _vm._e()
                ],
                2
              )
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _c(
        "el-table",
        _vm._b(
          {
            directives: [
              {
                name: "loading",
                rawName: "v-loading",
                value: _vm.loading,
                expression: "loading"
              }
            ],
            ref: "table",
            attrs: { data: _vm.data, "row-style": _vm.showRow },
            on: {
              "selection-change": _vm.selectStrategy.onSelectionChange,
              select: _vm.selectStrategy.onSelect,
              "select-all": _vm.selectStrategy.onSelectAll
            }
          },
          "el-table",
          _vm.tableAttrs,
          false
        ),
        [
          _vm.isTree
            ? [
                _vm.hasSelect
                  ? [
                      _c(
                        "el-table-column",
                        _vm._b(
                          { key: "selection-key" },
                          "el-table-column",
                          _vm.columns[0],
                          false
                        )
                      ),
                      _vm._v(" "),
                      _c(
                        "el-table-column",
                        _vm._b(
                          {
                            key: "tree-ctrl",
                            scopedSlots: _vm._u(
                              [
                                {
                                  key: "default",
                                  fn: function(scope) {
                                    return [
                                      _vm._l(scope.row._level, function(space) {
                                        return _vm.isTree
                                          ? _c("span", {
                                              key: space,
                                              staticClass: "ms-tree-space"
                                            })
                                          : _vm._e()
                                      }),
                                      _vm._v(" "),
                                      _vm.isTree &&
                                      _vm.iconShow(scope.$index, scope.row)
                                        ? _c(
                                            "span",
                                            {
                                              staticClass: "tree-ctrl",
                                              on: {
                                                click: function($event) {
                                                  return _vm.toggleExpanded(
                                                    scope.$index
                                                  )
                                                }
                                              }
                                            },
                                            [
                                              !scope.row._expanded
                                                ? _c("i", {
                                                    staticClass: "el-icon-plus"
                                                  })
                                                : _c("i", {
                                                    staticClass: "el-icon-minus"
                                                  })
                                            ]
                                          )
                                        : _vm._e(),
                                      _vm._v(
                                        "\n            " +
                                          _vm._s(
                                            scope.row[_vm.columns[1].prop]
                                          ) +
                                          "\n          "
                                      )
                                    ]
                                  }
                                }
                              ],
                              null,
                              false,
                              1667431242
                            )
                          },
                          "el-table-column",
                          _vm.columns[1],
                          false
                        )
                      ),
                      _vm._v(" "),
                      _vm._l(
                        _vm.columns.filter(function(c, i) {
                          return i !== 0 && i !== 1
                        }),
                        function(col) {
                          return _c(
                            "el-table-column",
                            _vm._b(
                              { key: col.prop },
                              "el-table-column",
                              col,
                              false
                            )
                          )
                        }
                      )
                    ]
                  : [
                      _c(
                        "el-table-column",
                        _vm._b(
                          {
                            key: "tree-ctrl",
                            scopedSlots: _vm._u(
                              [
                                {
                                  key: "default",
                                  fn: function(scope) {
                                    return [
                                      _vm._l(scope.row._level, function(space) {
                                        return _vm.isTree
                                          ? _c("span", {
                                              key: space,
                                              staticClass: "ms-tree-space"
                                            })
                                          : _vm._e()
                                      }),
                                      _vm._v(" "),
                                      _vm.isTree &&
                                      _vm.iconShow(scope.$index, scope.row)
                                        ? _c(
                                            "span",
                                            {
                                              staticClass: "tree-ctrl",
                                              on: {
                                                click: function($event) {
                                                  return _vm.toggleExpanded(
                                                    scope.$index
                                                  )
                                                }
                                              }
                                            },
                                            [
                                              !scope.row._expanded
                                                ? _c("i", {
                                                    staticClass: "el-icon-plus"
                                                  })
                                                : _c("i", {
                                                    staticClass: "el-icon-minus"
                                                  })
                                            ]
                                          )
                                        : _vm._e(),
                                      _vm._v(
                                        "\n            " +
                                          _vm._s(
                                            scope.row[_vm.columns[0].prop]
                                          ) +
                                          "\n          "
                                      )
                                    ]
                                  }
                                }
                              ],
                              null,
                              false,
                              1528062795
                            )
                          },
                          "el-table-column",
                          _vm.columns[0],
                          false
                        )
                      ),
                      _vm._v(" "),
                      _vm._l(
                        _vm.columns.filter(function(c, i) {
                          return i !== 0
                        }),
                        function(col) {
                          return _c(
                            "el-table-column",
                            _vm._b(
                              { key: col.prop },
                              "el-table-column",
                              col,
                              false
                            )
                          )
                        }
                      )
                    ]
              ]
            : _vm._l(_vm.columns, function(col) {
                return _c(
                  "el-table-column",
                  _vm._b({ key: col.prop }, "el-table-column", col, false)
                )
              }),
          _vm._v(" "),
          _vm.hasOperation
            ? _c(
                "el-table-column",
                _vm._b(
                  {
                    attrs: { label: "操作" },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "default",
                          fn: function(scope) {
                            return [
                              _vm.isTree && _vm.hasNew
                                ? _c(
                                    "text-button",
                                    {
                                      on: {
                                        click: function($event) {
                                          return _vm.onDefaultNew(scope.row)
                                        }
                                      }
                                    },
                                    [_vm._v(_vm._s(_vm.newText))]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _vm.hasEdit
                                ? _c(
                                    "text-button",
                                    {
                                      on: {
                                        click: function($event) {
                                          return _vm.onDefaultEdit(scope.row)
                                        }
                                      }
                                    },
                                    [_vm._v(_vm._s(_vm.editText))]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _vm.hasView
                                ? _c(
                                    "text-button",
                                    {
                                      on: {
                                        click: function($event) {
                                          return _vm.onDefaultView(scope.row)
                                        }
                                      }
                                    },
                                    [_vm._v(_vm._s(_vm.viewText))]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _vm._l(_vm.extraButtons, function(btn, i) {
                                return ("show" in btn
                                ? btn.show(scope.row)
                                : true)
                                  ? _c(
                                      "self-loading-button",
                                      _vm._b(
                                        {
                                          key: i,
                                          attrs: {
                                            click: btn.atClick,
                                            params: scope.row,
                                            callback: _vm.getList,
                                            "is-text": ""
                                          }
                                        },
                                        "self-loading-button",
                                        btn,
                                        false
                                      ),
                                      [
                                        _vm._v(
                                          "\n          " +
                                            _vm._s(
                                              typeof btn.text === "function"
                                                ? btn.text(scope.row)
                                                : btn.text
                                            ) +
                                            "\n        "
                                        )
                                      ]
                                    )
                                  : _vm._e()
                              }),
                              _vm._v(" "),
                              !_vm.hasSelect &&
                              _vm.hasDelete &&
                              _vm.canDelete(scope.row)
                                ? _c(
                                    "text-button",
                                    {
                                      attrs: { type: "danger" },
                                      on: {
                                        click: function($event) {
                                          return _vm.onDefaultDelete(scope.row)
                                        }
                                      }
                                    },
                                    [_vm._v("删除")]
                                  )
                                : _vm._e()
                            ]
                          }
                        }
                      ],
                      null,
                      false,
                      4130849817
                    )
                  },
                  "el-table-column",
                  _vm.operationAttrs,
                  false
                )
              )
            : _vm._e(),
          _vm._v(" "),
          _vm._t("default")
        ],
        2
      ),
      _vm._v(" "),
      _vm.hasPagination
        ? _c("el-pagination", {
            staticStyle: { "text-align": "right", padding: "10px 0" },
            attrs: {
              "current-page": _vm.page,
              "page-sizes": _vm.paginationSizes,
              "page-size": _vm.size,
              total: _vm.total,
              layout: _vm.paginationLayout
            },
            on: {
              "size-change": _vm.handleSizeChange,
              "current-change": _vm.handleCurrentChange
            }
          })
        : _vm._e(),
      _vm._v(" "),
      _vm.hasDialog
        ? _c(
            "el-dialog",
            {
              attrs: { title: _vm.dialogTitle, visible: _vm.dialogVisible },
              on: {
                "update:visible": function($event) {
                  _vm.dialogVisible = $event;
                }
              }
            },
            [
              _c(
                "el-form-renderer",
                _vm._b(
                  {
                    ref: "dialogForm",
                    attrs: { content: _vm.form, disabled: _vm.isView }
                  },
                  "el-form-renderer",
                  _vm.formAttrs,
                  false
                ),
                [_vm._t("form")],
                2
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: !_vm.isView,
                      expression: "!isView"
                    }
                  ],
                  attrs: { slot: "footer" },
                  slot: "footer"
                },
                [
                  _c(
                    "el-button",
                    { attrs: { size: "small" }, on: { click: _vm.cancel } },
                    [_vm._v("取 消")]
                  ),
                  _vm._v(" "),
                  _c(
                    "el-button",
                    {
                      attrs: {
                        type: "primary",
                        loading: _vm.confirmLoading,
                        size: "small"
                      },
                      on: { click: _vm.confirm }
                    },
                    [_vm._v("确 定")]
                  )
                ],
                1
              )
            ],
            1
          )
        : _vm._e()
    ],
    1
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-79a2a716_0", { source: ".el-data-table .ms-tree-space {\n  position: relative;\n  top: 1px;\n  display: inline-block;\n  font-style: normal;\n  font-weight: 400;\n  line-height: 1;\n  width: 18px;\n  height: 14px;\n}\n.el-data-table .ms-tree-space::before {\n  content: '';\n}\n.el-data-table .tree-ctrl {\n  position: relative;\n  cursor: pointer;\n  color: #2196f3;\n}\n@-moz-keyframes treeTableShow {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-webkit-keyframes treeTableShow {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-o-keyframes treeTableShow {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@keyframes treeTableShow {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n", map: {"version":3,"sources":["/home/travis/build/FEMessage/el-data-table/src/el-data-table.vue","el-data-table.vue"],"names":[],"mappings":"AA0mCA;EACA,kBAAA;EACA,QAAA;EACA,qBAAA;EACA,kBAAA;EACA,gBAAA;EACA,cAAA;EACA,WAAA;EACA,YAAA;ACzmCA;AD2mCA;EACA,WAAA;ACzmCA;AD6mCA;EACA,kBAAA;EACA,eAAA;EACA,cAAA;AC3mCA;AD8mCA;AACA;IACA,UAAA;AC5mCE;AD+mCF;IACA,UAAA;AC7mCE;AACF;ADsmCA;AACA;IACA,UAAA;ACpmCE;ADumCF;IACA,UAAA;ACrmCE;AACF;AD8lCA;AACA;IACA,UAAA;AC5lCE;AD+lCF;IACA,UAAA;AC7lCE;AACF;ADslCA;AACA;IACA,UAAA;ACplCE;ADulCF;IACA,UAAA;ACrlCE;AACF","file":"el-data-table.vue","sourcesContent":["<template>\n  <div class=\"el-data-table\">\n    <!-- @submit.native.prevent -->\n    <!-- 阻止表单提交的默认行为 -->\n    <!-- https://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2 -->\n    <!--搜索字段-->\n    <el-form-renderer\n      v-if=\"hasSearchForm\"\n      v-show=\"!isSearchCollapse\"\n      inline\n      :content=\"searchForm\"\n      ref=\"searchForm\"\n      @submit.native.prevent\n    >\n      <!--@slot 额外的搜索内容, 当searchForm不满足需求时可以使用-->\n      <slot name=\"search\"></slot>\n      <el-form-item>\n        <!--https://github.com/ElemeFE/element/pull/5920-->\n        <el-button native-type=\"submit\" type=\"primary\" @click=\"search\" size=\"small\">查询</el-button>\n        <el-button @click=\"resetSearch\" size=\"small\">重置</el-button>\n      </el-form-item>\n    </el-form-renderer>\n\n    <el-form v-if=\"hasNew || hasDelete || headerButtons.length > 0 || canSearchCollapse\">\n      <el-form-item>\n        <el-button v-if=\"hasNew\" type=\"primary\" size=\"small\" @click=\"onDefaultNew\">{{ newText }}</el-button>\n        <self-loading-button\n          v-for=\"(btn, i) in headerButtons\"\n          v-if=\"'show' in btn ? btn.show(selected) : true\"\n          :disabled=\"'disabled' in btn ? btn.disabled(selected) : false\"\n          :click=\"btn.atClick\"\n          :params=\"selected\"\n          :callback=\"getList\"\n          v-bind=\"btn\"\n          :key=\"i\"\n          size=\"small\"\n        >\n          {{typeof btn.text === 'function' ? btn.text(selected) : btn.text}}\n        </self-loading-button>\n        <el-button\n          v-if=\"hasSelect && hasDelete\"\n          type=\"danger\"\n          size=\"small\"\n          @click=\"onDefaultDelete($event)\"\n          :disabled=\"single ? (!selected.length || selected.length > 1) : !selected.length\"\n        >删除</el-button>\n        <el-button\n          v-if=\"canSearchCollapse\"\n          type=\"default\"\n          size=\"small\"\n          :icon=\"`el-icon-arrow-${isSearchCollapse ? 'down' : 'up'}`\"\n          @click=\"isSearchCollapse = !isSearchCollapse\"\n        >{{ isSearchCollapse ? '展开' : '折叠' }}搜索</el-button>\n      </el-form-item>\n    </el-form>\n\n    <el-table\n      ref=\"table\"\n      v-bind=\"tableAttrs\"\n      :data=\"data\"\n      :row-style=\"showRow\"\n      v-loading=\"loading\"\n      @selection-change=\"selectStrategy.onSelectionChange\"\n      @select=\"selectStrategy.onSelect\"\n      @select-all=\"selectStrategy.onSelectAll\"\n    >\n      <!--TODO 不用jsx写, 感觉template逻辑有点不清晰了-->\n      <template v-if=\"isTree\">\n        <!--有多选-->\n        <template v-if=\"hasSelect\">\n          <el-table-column key=\"selection-key\" v-bind=\"columns[0]\"></el-table-column>\n\n          <el-table-column key=\"tree-ctrl\" v-bind=\"columns[1]\">\n            <template slot-scope=\"scope\">\n              <span\n                v-if=\"isTree\"\n                v-for=\"space in scope.row._level\"\n                class=\"ms-tree-space\"\n                :key=\"space\"\n              ></span>\n              <span\n                v-if=\"isTree && iconShow(scope.$index, scope.row)\"\n                class=\"tree-ctrl\"\n                @click=\"toggleExpanded(scope.$index)\"\n              >\n                <i v-if=\"!scope.row._expanded\" class=\"el-icon-plus\"></i>\n                <i v-else class=\"el-icon-minus\"></i>\n              </span>\n              {{scope.row[columns[1].prop]}}\n            </template>\n          </el-table-column>\n\n          <el-table-column\n            v-for=\"(col) in columns.filter((c, i) => i !== 0 && i !== 1)\"\n            :key=\"col.prop\"\n            v-bind=\"col\"\n          ></el-table-column>\n        </template>\n\n        <!--无选择-->\n        <template v-else>\n          <!--展开这列, 丢失 el-table-column属性-->\n          <el-table-column key=\"tree-ctrl\" v-bind=\"columns[0]\">\n            <template slot-scope=\"scope\">\n              <span\n                v-if=\"isTree\"\n                v-for=\"space in scope.row._level\"\n                class=\"ms-tree-space\"\n                :key=\"space\"\n              ></span>\n              <span\n                v-if=\"isTree && iconShow(scope.$index, scope.row)\"\n                class=\"tree-ctrl\"\n                @click=\"toggleExpanded(scope.$index)\"\n              >\n                <i v-if=\"!scope.row._expanded\" class=\"el-icon-plus\"></i>\n                <i v-else class=\"el-icon-minus\"></i>\n              </span>\n              {{scope.row[columns[0].prop]}}\n            </template>\n          </el-table-column>\n\n          <el-table-column\n            v-for=\"(col) in columns.filter((c, i) => i !== 0)\"\n            :key=\"col.prop\"\n            v-bind=\"col\"\n          ></el-table-column>\n        </template>\n      </template>\n\n      <!--非树-->\n      <template v-else>\n        <el-table-column v-for=\"(col) in columns\" :key=\"col.prop\" v-bind=\"col\"></el-table-column>\n      </template>\n\n      <!--默认操作列-->\n      <el-table-column label=\"操作\" v-if=\"hasOperation\" v-bind=\"operationAttrs\">\n        <template slot-scope=\"scope\">\n          <text-button\n            v-if=\"isTree && hasNew\"\n            @click=\"onDefaultNew(scope.row)\"\n          >{{ newText }}</text-button>\n          <text-button\n            v-if=\"hasEdit\"\n            @click=\"onDefaultEdit(scope.row)\"\n          >{{ editText }}</text-button>\n          <text-button\n            v-if=\"hasView\"\n            @click=\"onDefaultView(scope.row)\"\n          >{{ viewText }}</text-button>\n          <self-loading-button\n            v-for=\"(btn, i) in extraButtons\"\n            v-if=\"'show' in btn ? btn.show(scope.row) : true\"\n            v-bind=\"btn\"\n            :click=\"btn.atClick\"\n            :params=\"scope.row\"\n            :callback=\"getList\"\n            :key=\"i\"\n            is-text\n          >\n            {{typeof btn.text === 'function' ? btn.text(scope.row) : btn.text}}\n          </self-loading-button>\n          <text-button\n            v-if=\"!hasSelect && hasDelete && canDelete(scope.row)\"\n            type=\"danger\"\n            @click=\"onDefaultDelete(scope.row)\"\n          >删除</text-button>\n        </template>\n      </el-table-column>\n\n      <!--@slot 自定义操作列, 当extraButtons不满足需求时可以使用 -->\n      <slot></slot>\n    </el-table>\n    <el-pagination\n      v-if=\"hasPagination\"\n      @size-change=\"handleSizeChange\"\n      @current-change=\"handleCurrentChange\"\n      :current-page=\"page\"\n      :page-sizes=\"paginationSizes\"\n      :page-size=\"size\"\n      :total=\"total\"\n      style=\"text-align: right; padding: 10px 0\"\n      :layout=\"paginationLayout\"\n    ></el-pagination>\n    <el-dialog :title=\"dialogTitle\" :visible.sync=\"dialogVisible\" v-if=\"hasDialog\">\n      <!--https://github.com/FEMessage/el-form-renderer-->\n      <el-form-renderer :content=\"form\" ref=\"dialogForm\" v-bind=\"formAttrs\" :disabled=\"isView\">\n        <!--@slot 额外的弹窗表单内容, 当form不满足需求时可以使用，参考：https://femessage.github.io/el-form-renderer/#/Demo?id=slot -->\n        <slot name=\"form\"></slot>\n      </el-form-renderer>\n\n      <div slot=\"footer\" v-show=\"!isView\">\n        <el-button @click=\"cancel\" size=\"small\">取 消</el-button>\n        <el-button type=\"primary\" @click=\"confirm\" :loading=\"confirmLoading\" size=\"small\">确 定</el-button>\n      </div>\n    </el-dialog>\n  </div>\n</template>\n\n<script>\nimport _get from 'lodash.get'\nimport SelfLoadingButton from './self-loading-button.vue'\nimport TextButton from './text-button.vue'\nimport * as queryUtil from './utils/query'\nimport getSelectStrategy from './utils/select-strategy'\n\n// 默认返回的数据格式如下\n//          {\n//            \"code\":0,\n//            \"msg\":\"ok\",\n//            \"payload\":{\n//              \"content\":[], // 数组\n//              \"totalElements\":2, // 总数\n//            }\n//          }\n// 可根据实际情况传入 data/total 两个字段的路径, 分别对应上面数据结构中的 content/totalElements\n// 如果接口不分页, 则传hasPagination=false, 此时数据取 payload, 当然也可以自定义, 设置dataPath即可\n\nconst defaultFirstPage = 1\n\nconst dataPath = 'payload.content'\nconst totalPath = 'payload.totalElements'\nconst noPaginationDataPath = 'payload'\n\nconst treeChildKey = 'children'\nconst treeParentKey = 'parentId'\nconst treeParentValue = 'id'\nconst defaultId = 'id'\n\nconst dialogForm = 'dialogForm'\n\nexport default {\n  name: 'ElDataTable',\n  components: {\n    SelfLoadingButton,\n    TextButton\n  },\n  props: {\n    /**\n     * 请求url, 如果为空, 则不会发送请求; 改变url, 则table会重新发送请求\n     */\n    url: {\n      type: String,\n      default: ''\n    },\n    /**\n     * 主键，默认值 id，\n     * 修改/删除时会用到,请求会根据定义的属性值获取主键,即row[this.id]\n     */\n    id: {\n      type: String,\n      default: defaultId\n    },\n    /**\n     * 分页请求的第一页的值(有的接口0是第一页)\n     */\n    firstPage: {\n      type: Number,\n      default: defaultFirstPage\n    },\n    /**\n     * 渲染组件的分页数据在接口返回的数据中的路径, 嵌套对象使用.表示即可\n     */\n    dataPath: {\n      type: String,\n      default: dataPath\n    },\n    /**\n     * 分页数据的总数在接口返回的数据中的路径, 嵌套对象使用.表示即可\n     */\n    totalPath: {\n      type: String,\n      default: totalPath\n    },\n    /**\n     * 列属性设置, 详情见element-ui官网\n     * @link https://element.eleme.cn/2.4/#/zh-CN/component/table#table-column-attributes\n     */\n    columns: {\n      type: Array,\n      default() {\n        return []\n      }\n    },\n    /**\n     * 查询字段渲染, 配置参考el-form-renderer\n     * @link https://femessage.github.io/el-form-renderer/\n     */\n    searchForm: {\n      type: Array,\n      default() {\n        return []\n      }\n    },\n    /**\n     * 是否开启搜索栏折叠功能\n     */\n    canSearchCollapse: {\n      type: Boolean,\n      default: false\n    },\n    /**\n     * 点击查询按钮, 查询前执行的函数, 需要返回Promise\n     */\n    beforeSearch: {\n      type: Function,\n      default() {\n        return Promise.resolve()\n      }\n    },\n    /**\n     * 单选, 适用场景: 不可以批量删除\n     */\n    single: {\n      type: Boolean,\n      default: false\n    },\n    /**\n     * 切换页面时，已勾选项不会丢失\n     */\n    persistSelection: {\n      type: Boolean,\n      default: false\n    },\n    /**\n     * 是否有操作列\n     */\n    hasOperation: {\n      type: Boolean,\n      default: true\n    },\n    /**\n     * 操作列的自定义按钮, 渲染的是element-ui的button, 支持包括style在内的以下属性:\n     * {type: '', text: '', atClick: row => Promise.resolve(), show: row => return true时显示 }\n     * 点击事件 row参数 表示当前行数据, 需要返回Promise, 默认点击后会刷新table, resolve(false) 则不刷新\n     */\n    extraButtons: {\n      type: Array,\n      default() {\n        return []\n      }\n    },\n    /**\n     * 头部的自定义按钮, 渲染的是element-ui的button, 支持包括style在内的以下属性:\n     * {type: '', text: '', atClick: selected => Promise.resolve(), show: selected => return true时显示, disabled: selected => return true时禁用}\n     * 点击事件 selected参数 表示选中行所组成的数组, 函数需要返回Promise, 默认点击后会刷新table, resolve(false) 则不刷新\n     */\n    headerButtons: {\n      type: Array,\n      default() {\n        return []\n      }\n    },\n    /**\n     * 是否有新增按钮\n     */\n    hasNew: {\n      type: Boolean,\n      default: true\n    },\n    /**\n     * 是否有编辑按钮\n     */\n    hasEdit: {\n      type: Boolean,\n      default: true\n    },\n    /**\n     * 是否有查看按钮\n     */\n    hasView: {\n      type: Boolean,\n      default: false\n    },\n    /**\n     * table头部是否有删除按钮(该按钮要多选时才会出现)\n     */\n    hasDelete: {\n      type: Boolean,\n      default: true\n    },\n    /**\n     * 新增按钮文案\n     */\n    newText: {\n      type: String,\n      default: '新增'\n    },\n    /**\n     * 修改按钮文案\n     */\n    editText: {\n      type: String,\n      default: '修改'\n    },\n    /**\n     * 查看按钮文案\n     */\n    viewText: {\n      type: String,\n      default: '查看'\n    },\n    /**\n     * 某行数据是否可以删除, 返回true表示可以, 控制的是单选时单行的删除按钮\n     */\n    canDelete: {\n      type: Function,\n      default() {\n        return true\n      }\n    },\n    /**\n     * 点击新增按钮时的方法, 当默认新增方法不满足需求时使用, 需要返回promise\n     * 参数(data, row) data 是form表单的数据, row 是当前行的数据, 只有isTree为true时, 点击操作列的新增按钮才会有值\n     */\n    onNew: {\n      type: Function\n    },\n    /**\n     * 点击修改按钮时的方法, 当默认修改方法不满足需求时使用, 需要返回promise\n     * 参数(data, row) data 是form表单的数据, row 是当前行的数据\n     */\n    onEdit: {\n      type: Function\n    },\n    /**\n     * 点击删除按钮时的方法, 当默认删除方法不满足需求时使用, 需要返回promise\n     * 多选时, 参数为selected, 代表选中的行组成的数组; 非多选时参数为row, 代表单行的数据\n     */\n    onDelete: {\n      type: Function\n    },\n    /**\n     * 是否分页。如果不分页，则请求传参page=-1\n     */\n    hasPagination: {\n      type: Boolean,\n      default: true\n    },\n    /**\n     * 分页组件的子组件布局，子组件名用逗号分隔，对应element-ui pagination的layout属性\n     * @link https://element.eleme.cn/2.4/#/zh-CN/component/pagination\n     */\n    paginationLayout: {\n      type: String,\n      default: 'total, sizes, prev, pager, next, jumper'\n    },\n    /**\n     * 分页组件的每页显示个数选择器的选项设置，对应element-ui pagination的page-sizes属性\n     * @link https://element.eleme.cn/2.4/#/zh-CN/component/pagination\n     */\n    paginationSizes: {\n      type: Array,\n      default: () => [10, 20, 30, 40, 50]\n    },\n    /**\n     * 分页组件的每页显示个数选择器默认选项，对应element-ui pagination的page-size属性\n     * @link https://element.eleme.cn/2.4/#/zh-CN/component/pagination\n     */\n    paginationSize: {\n      type: Number,\n      default: 10\n    },\n    /**\n     * @deprecated\n     * 不分页时的size的大小(建议接口约定，不分页时传参page=-1，故一般不会用到此属性)\n     */\n    noPaginationSize: {\n      type: Number,\n      default: 999\n    },\n    /**\n     * 要渲染的数据是否是树形结构\n     */\n    isTree: {\n      type: Boolean,\n      default: false\n    },\n    /**\n     * 树形结构相关: 子节点的字段名\n     */\n    treeChildKey: {\n      type: String,\n      default: treeChildKey\n    },\n    /**\n     * 树形结构相关: 父节点的字段名\n     */\n    treeParentKey: {\n      type: String,\n      default: treeParentKey\n    },\n    /**\n     * 树形结构相关: 父节点字段值的来源字段。\n     * 新增/修改时会用到, 例如, 在id为2的节点新增子节点, 则子节点的parentId为2, 也即parentId的值来源于字段id, 故treeParentValue为id\n     */\n    treeParentValue: {\n      type: String,\n      default: treeParentValue\n    },\n    /**\n     * 树形结构相关: 是否展开所有节点\n     */\n    expandAll: {\n      type: Boolean,\n      default: false\n    },\n    /**\n     * element table 属性设置, 详情配置参考element-ui官网\n     * @link https://element.eleme.cn/2.4/#/zh-CN/component/table#table-attributes\n     */\n    tableAttrs: {\n      type: Object,\n      default() {\n        return {}\n      }\n    },\n    /**\n     * 操作列属性\n     * @link https://element.eleme.cn/2.4/#/zh-CN/component/table#table-column-attributes\n     */\n    operationAttrs: {\n      type: Object,\n      default() {\n        return {width: '', fixed: 'right'}\n      }\n    },\n    /**\n     * 是否有弹窗, 用于不需要弹窗时想减少DOM渲染的场景\n     */\n    hasDialog: {\n      type: Boolean,\n      default: true\n    },\n    /**\n     * 新增弹窗的标题，默认为newText的值\n     */\n    dialogNewTitle: {\n      type: String,\n      default() {\n        return this.newText\n      }\n    },\n    /**\n     * 修改弹窗的标题，默认为editText的值\n     */\n    dialogEditTitle: {\n      type: String,\n      default() {\n        return this.editText\n      }\n    },\n    /**\n     * 查看弹窗的标题，默认为viewText的值\n     */\n    dialogViewTitle: {\n      type: String,\n      default() {\n        return this.viewText\n      }\n    },\n    /**\n     * 弹窗表单, 用于新增与修改, 详情配置参考el-form-renderer\n     * @link https://femessage.github.io/el-form-renderer/\n     */\n    form: {\n      type: Array,\n      default() {\n        return []\n      }\n    },\n    /**\n     * 弹窗表单属性设置, 详情配置参考element-ui官网\n     * @link https://element.eleme.cn/2.4/#/zh-CN/component/form#form-attributes\n     */\n    formAttrs: {\n      type: Object,\n      default() {\n        return {}\n      }\n    },\n    /**\n     * 同extraBody\n     * @deprecated\n     */\n    extraParams: {\n      type: Object,\n      default() {\n        return undefined\n      }\n    },\n    /**\n     * 新增/修改提交时，请求体带上额外的参数。\n     */\n    extraBody: {\n      type: Object,\n      default() {\n        return undefined\n      }\n    },\n    /**\n     * 在新增/修改弹窗 点击确认时调用，返回Promise, 如果reject, 则不会发送新增/修改请求\n     * 参数: (data, isNew) data为表单数据, isNew true 表示是新增弹窗, false 为 编辑弹窗\n     */\n    beforeConfirm: {\n      type: Function,\n      default() {\n        return Promise.resolve()\n      }\n    },\n    /**\n     * 同extraQuery\n     * @deprecated\n     */\n    customQuery: {\n      type: Object,\n      default() {\n        return undefined\n      }\n    },\n    /**\n     * 向请求url添加的额外参数。\n     * 可用.sync修饰，此时点击重置按钮后该参数也会被重置\n     */\n    extraQuery: {\n      type: Object,\n      default() {\n        return undefined\n      }\n    },\n    /**\n     * 是否开启使用url保存query参数的功能\n     */\n    saveQuery: {\n      type: Boolean,\n      default: true\n    }\n  },\n  data() {\n    return {\n      data: [],\n      hasSelect: this.columns.length && this.columns[0].type == 'selection',\n      size: this.paginationSize || this.paginationSizes[0],\n      page: defaultFirstPage,\n      // https://github.com/ElemeFE/element/issues/1153\n      total: null,\n      loading: false,\n      // 多选项的数组\n      selected: [],\n\n      //弹窗\n      dialogTitle: this.dialogNewTitle,\n      dialogVisible: false,\n      isNew: true,\n      isEdit: false,\n      isView: false,\n      confirmLoading: false,\n      // 要修改的那一行\n      row: {},\n\n      // 初始的extraQuery值, 重置查询时, 会用到\n      // JSON.stringify是为了后面深拷贝作准备\n      initExtraQuery: JSON.stringify(this.extraQuery || this.customQuery || {}),\n      isSearchCollapse: false\n    }\n  },\n  computed: {\n    routerMode() {\n      return this.$router ? this.$router.mode : 'hash'\n    },\n    hasSearchForm() {\n      return this.searchForm.length || this.$slots.search\n    },\n    _extraBody() {\n      return this.extraBody || this.extraParams || {}\n    },\n    _extraQuery() {\n      return this.extraQuery || this.customQuery || {}\n    },\n    selectStrategy() {\n      return getSelectStrategy(this)\n    }\n  },\n  watch: {\n    url: function(val, old) {\n      this.page = defaultFirstPage\n      this.getList()\n    },\n    dialogVisible: function(val, old) {\n      if (!val) {\n        this.isNew = false\n        this.isEdit = false\n        this.isView = false\n        this.confirmLoading = false\n\n        this.$refs[dialogForm].resetFields()\n      }\n    },\n    selected(val) {\n      /**\n       * 多选项发生变化\n       * @property {array} rows - 已选中的行数据的数组\n       */\n      this.$emit('selection-change', val)\n    }\n  },\n  mounted() {\n    if (this.saveQuery) {\n      const query = queryUtil.get(location.href)\n      if (query) {\n        this.page = parseInt(query.page)\n        this.size = parseInt(query.size)\n        // 恢复查询条件，但对slot=search无效\n        if (this.$refs.searchForm) {\n          delete query.page\n          delete query.size\n          this.$refs.searchForm.updateForm(query)\n        }\n      }\n    }\n\n    this.$nextTick(() => {\n      this.getList()\n    })\n  },\n  methods: {\n    /**\n     * 手动刷新列表数据\n     * @public\n     * @param {boolean} saveQuery - 是否保存query到路由上\n     */\n    getList(saveQuery) {\n      const {url} = this\n\n      if (!url) {\n        console.warn('DataTable: url 为空, 不发送请求')\n        return\n      }\n\n      // 构造query对象\n      let query = {}\n      if (this.$refs.searchForm) {\n        Object.assign(query, this.$refs.searchForm.getFormValue())\n      }\n      Object.assign(query, this._extraQuery)\n\n      query.size = this.hasPagination ? this.size : this.noPaginationSize\n\n      // 根据偏移值计算接口正确的页数\n      const pageOffset = this.firstPage - defaultFirstPage\n      query.page = this.hasPagination ? this.page + pageOffset : -1\n\n      // 无效值过滤，注意0是有效值\n      query = Object.keys(query)\n        .filter(k => ['', undefined, null].indexOf(query[k]) === -1)\n        .reduce((obj, k) => {\n          obj[k] = query[k].toString().trim()\n          return obj\n        }, {})\n\n      const queryStr =\n        (url.indexOf('?') > -1 ? '&' : '?') +\n        queryUtil.stringify(query, '=', '&')\n\n      // 请求开始\n      this.loading = true\n\n      this.$axios\n        .get(url + queryStr)\n        .then(({data: resp}) => {\n          let data = []\n\n          // 不分页\n          if (!this.hasPagination) {\n            data =\n              _get(resp, this.dataPath) ||\n              _get(resp, noPaginationDataPath) ||\n              []\n          } else {\n            data = _get(resp, this.dataPath) || []\n            this.total = _get(resp, this.totalPath)\n          }\n\n          this.data = data\n\n          // 树形结构逻辑\n          if (this.isTree) {\n            this.data = this.tree2Array(data, this.expandAll)\n          }\n\n          this.loading = false\n          /**\n           * 请求返回, 数据更新后触发\n           * @property {object} data - table的数据\n           * @property {object} resp - 请求返回的完整response\n           */\n          this.$emit('update', data, resp)\n\n          // 开启persistSelection时，需要同步selected状态到el-table中\n          this.$nextTick(() => {\n            this.selectStrategy.updateElTableSelection()\n          })\n        })\n        .catch(err => {\n          /**\n           * 请求数据失败，返回err对象\n           * @event error\n           */\n          this.$emit('error', err)\n          this.loading = false\n        })\n\n      // 存储query记录, 便于后面恢复\n      if (saveQuery) {\n        // 存储的page是table的页码，无需偏移\n        query.page = this.page\n        const newUrl = queryUtil.set(location.href, query, this.routerMode)\n        history.pushState(history.state, 'el-data-table search', newUrl)\n      }\n    },\n    search() {\n      this.$refs.searchForm.validate(valid => {\n        if (!valid) return\n\n        this.beforeSearch()\n          .then(() => {\n            this.page = defaultFirstPage\n            this.getList(this.saveQuery)\n          })\n          .catch(err => {\n            this.$emit('error', err)\n          })\n      })\n    },\n    resetSearch() {\n      // reset后, form里的值会变成 undefined, 在下一次查询会赋值给query\n      this.$refs.searchForm.resetFields()\n      this.page = defaultFirstPage\n\n      // 重置\n      if (this.saveQuery) {\n        const newUrl = queryUtil.clear(location.href)\n        history.replaceState(history.state, '', newUrl)\n      }\n\n      this.$nextTick(() => {\n        this.getList()\n      })\n\n      /**\n       * 按下重置按钮后触发\n       */\n      this.$emit('reset')\n\n      this.$emit('update:customQuery', JSON.parse(this.initExtraQuery))\n      this.$emit('update:extraQuery', JSON.parse(this.initExtraQuery))\n    },\n    handleSizeChange(val) {\n      if (this.size === val) return\n\n      this.page = defaultFirstPage\n      this.size = val\n      this.getList(this.saveQuery)\n    },\n    handleCurrentChange(val) {\n      if (this.page === val) return\n\n      this.page = val\n      this.getList(this.saveQuery)\n    },\n    /**\n     * 切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否\n     *\n     * @public\n     * @param {object} row - 要更新的数据行\n     * @param {boolean} isSelected - 是否被勾选\n     */\n    toggleRowSelection(row, isSelected) {\n      return this.selectStrategy.toggleRowSelection(row, isSelected)\n    },\n    /**\n     * 清空多选项\n     *\n     * @public\n     */\n    clearSelection() {\n      return this.selectStrategy.clearSelection()\n    },\n    // 弹窗相关\n    // 除非树形结构在操作列点击新增, 否则 row 都是 undefined\n    onDefaultNew(row = {}) {\n      this.row = row\n      this.isNew = true\n      this.isEdit = false\n      this.isView = false\n      this.dialogTitle = this.dialogNewTitle\n      this.dialogVisible = true\n    },\n    onDefaultView(row) {\n      this.row = row\n      this.isView = true\n      this.isNew = false\n      this.isEdit = false\n      this.dialogTitle = this.dialogViewTitle\n      this.dialogVisible = true\n\n      // 给表单填充值\n      this.$nextTick(() => {\n        this.$refs[dialogForm].updateForm(row)\n      })\n    },\n    onDefaultEdit(row) {\n      this.row = row\n      this.isEdit = true\n      this.isNew = false\n      this.isView = false\n      this.dialogTitle = this.dialogEditTitle\n      this.dialogVisible = true\n\n      // 给表单填充值\n      this.$nextTick(() => {\n        this.$refs[dialogForm].updateForm(row)\n      })\n    },\n    cancel() {\n      this.dialogVisible = false\n    },\n    confirm() {\n      if (this.isView) {\n        this.cancel()\n        return\n      }\n\n      this.$refs[dialogForm].validate(valid => {\n        if (!valid) return false\n\n        let data = Object.assign(\n          {},\n          this.$refs[dialogForm].getFormValue(),\n          this._extraBody\n        )\n\n        if (this.isTree) {\n          if (this.isNew)\n            data[this.treeParentKey] = this.row[this.treeParentValue]\n          else data[this.treeParentKey] = this.row[this.treeParentKey]\n        }\n\n        this.beforeConfirm(data, this.isNew)\n          .then(resp => {\n            let condiction = 'isNew'\n            let customMethod = 'onNew'\n\n            if (this.isEdit) {\n              condiction = 'isEdit'\n              customMethod = 'onEdit'\n            }\n\n            if (this[condiction] && this[customMethod]) {\n              this[customMethod](data, this.row)\n                .then(resp => {\n                  this.getList()\n                  this.showMessage(true)\n                  this.cancel()\n                })\n                .catch(e => {})\n              return\n            }\n\n            // 默认新增/修改逻辑\n            let method = 'post'\n            let url = this.url + ''\n\n            if (this.isEdit) {\n              method = 'put'\n              url += `/${this.row[this.id]}`\n            }\n\n            this.confirmLoading = true\n\n            this.$axios[method](url, data)\n              .then(resp => {\n                this.getList()\n                this.showMessage(true)\n                this.cancel()\n              })\n              .catch(err => {\n                this.confirmLoading = false\n              })\n          })\n          .catch(e => {})\n      })\n    },\n    onDefaultDelete(row) {\n      this.$confirm('确认删除吗', '提示', {\n        type: 'warning',\n        confirmButtonClass: 'el-button--danger',\n        beforeClose: (action, instance, done) => {\n          if (action == 'confirm') {\n            instance.confirmButtonLoading = true\n\n            if (this.onDelete) {\n              this.onDelete(\n                this.hasSelect\n                  ? !this.single\n                    ? this.selected\n                    : this.selected[0]\n                  : row\n              )\n                .then(resp => {\n                  this.showMessage(true)\n                  done()\n                  this.clearSelection()\n                  this.getList()\n                })\n                .catch(e => {})\n                .finally(e => {\n                  instance.confirmButtonLoading = false\n                })\n              return\n            }\n\n            // 默认删除逻辑\n            // 单个删除\n            if (!this.hasSelect) {\n              this.$axios\n                .delete(this.url + '/' + row[this.id])\n                .then(resp => {\n                  instance.confirmButtonLoading = false\n                  done()\n                  this.showMessage(true)\n                  this.getList()\n                })\n                .catch(er => {\n                  instance.confirmButtonLoading = false\n                })\n            } else {\n              // 多选模式\n              this.$axios\n                .delete(\n                  this.url + '/' + this.selected.map(v => v[this.id]).toString()\n                )\n                .then(resp => {\n                  instance.confirmButtonLoading = false\n                  done()\n                  this.showMessage(true)\n                  this.clearSelection()\n                  this.getList()\n                })\n                .catch(er => {\n                  instance.confirmButtonLoading = false\n                })\n            }\n          } else done()\n        }\n      }).catch(er => {\n        /*取消*/\n      })\n    },\n    // 树形table相关\n    // https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable\n    tree2Array(data, expandAll, parent = null, level = null) {\n      let tmp = []\n      data.forEach(record => {\n        if (record._expanded === undefined) {\n          this.$set(record, '_expanded', expandAll)\n        }\n        let _level = 0\n        if (level !== undefined && level !== null) {\n          _level = level + 1\n        }\n        this.$set(record, '_level', _level)\n        // 如果有父元素\n        if (parent) {\n          this.$set(record, 'parent', parent)\n        }\n        tmp.push(record)\n\n        if (record[this.treeChildKey] && record[this.treeChildKey].length > 0) {\n          const children = this.tree2Array(\n            record[this.treeChildKey],\n            expandAll,\n            record,\n            _level\n          )\n          tmp = tmp.concat(children)\n        }\n      })\n      return tmp\n    },\n    showRow(row) {\n      const show = row.row.parent\n        ? row.row.parent._expanded && row.row.parent._show\n        : true\n      row.row._show = show\n      return show\n        ? 'animation:treeTableShow 1s-webkit-animation:treeTableShow 1s'\n        : 'display:none'\n    },\n    // 切换下级是否展开\n    toggleExpanded(trIndex) {\n      const record = this.data[trIndex]\n      record._expanded = !record._expanded\n    },\n    // 图标显示\n    iconShow(index, record) {\n      //      return index ===0 && record.children && record.children.length > 0;\n      return record[this.treeChildKey] && record[this.treeChildKey].length > 0\n    },\n    showMessage(isSuccess = true) {\n      if (isSuccess) {\n        this.$message({\n          type: 'success',\n          message: '操作成功'\n        })\n      } else {\n        this.$message({\n          type: 'error',\n          message: '操作失败'\n        })\n      }\n    }\n  }\n}\n</script>\n<style lang=\"stylus\">\n.el-data-table {\n  color-blue = #2196F3;\n  space-width = 18px;\n\n  .ms-tree-space {\n    position: relative;\n    top: 1px;\n    display: inline-block;\n    font-style: normal;\n    font-weight: 400;\n    line-height: 1;\n    width: space-width;\n    height: 14px;\n\n    &::before {\n      content: '';\n    }\n  }\n\n  .tree-ctrl {\n    position: relative;\n    cursor: pointer;\n    color: color-blue;\n  }\n\n  @keyframes treeTableShow {\n    from {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n}\n</style>\n",".el-data-table .ms-tree-space {\n  position: relative;\n  top: 1px;\n  display: inline-block;\n  font-style: normal;\n  font-weight: 400;\n  line-height: 1;\n  width: 18px;\n  height: 14px;\n}\n.el-data-table .ms-tree-space::before {\n  content: '';\n}\n.el-data-table .tree-ctrl {\n  position: relative;\n  cursor: pointer;\n  color: #2196f3;\n}\n@-moz-keyframes treeTableShow {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@-webkit-keyframes treeTableShow {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@-o-keyframes treeTableShow {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes treeTableShow {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var component = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    browser,
    undefined
  );

// Import vue component

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('ElDataTable', component);
} // Create module definition for Vue.use()

var plugin = {
  install: install
}; // To auto-install when vue is found

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
} // To allow use as module (npm/webpack/etc.) export component
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default component;
export { install };
