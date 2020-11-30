const navs = [
  // 管理平台路由
  {
    id: '1',
    path: 'dashboard-1',
    name: 'dashboard-1',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '1-1',
      path: 'dashboard-1',
      name: 'dashboard-1',
      keepAlive: true,
      file: 'platformitem/platmanage/dashboard/index',
      title: '首页',
      isAuth: true
    }]
  },
  {
    id: '5',
    path: 'config',
    name: 'config',
    file: 'enter/index',
    title: '配置中心',
    isAuth: true,
    children: [
      {
        id: '5-1',
        path: 'basicConfig',
        name: 'basicConfig',
        keepAlive: true,
        file: 'platformitem/cdpManage/webConfig/index',
        title: '网站配置',
        isAuth: true
      },
      {
        id: '5-4',
        path: 'integratedConfig',
        name: 'integratedConfig',
        keepAlive: true,
        file: 'platformitem/cdpManage/configure/index',
        title: '集成配置',
        isAuth: true
      }, {
        id: '5-5',
        path: 'integratedConfig/integratEdedit',
        name: 'integratEdedit',
        keepAlive: true,
        file: 'platformitem/cdpManage/configure/integratEdedit',
        title: '集成配置编辑',
        isAuth: true
      }
    ]
  },
  {
    id: '5',
    path: 'pageSetting',
    name: 'pageSetting',
    file: 'enter/index',
    title: '配置中心',
    isAuth: true,
    children: [
      {
        id: '6-3-1',
        path: 'platformManage',
        name: 'platformManage',
        keepAlive: true,
        file: 'platformitem/cdpManage/categoryManage/platformManage',
        title: '平台管理',
        cid: '63',
        isAuth: true
      },
      {
        id: '6-3-2',
        path: 'platformManage/platformManageDetailsIndex',
        name: 'platformManageDetailsIndex',
        keepAlive: true,
        file: 'platformitem/cdpManage/categoryManage/platformManageDetailsIndex',
        title: '创建平台',
        isAuth: true
      },
      {
        id: '6-4-1',
        path: 'categoryManage',
        name: 'categoryManage',
        keepAlive: true,
        file: 'platformitem/cdpManage/categoryManage/categoryManage',
        title: '菜单管理',
        isAuth: true
      },
      {
        id: '6-4-2',
        path: 'categoryManage/categoryManageDetail',
        name: 'categoryManageDetail',
        keepAlive: true,
        file: 'platformitem/cdpManage/categoryManage/categoryManageDetail',
        title: '菜单编辑',
        isAuth: true
      },
      {
        id: '6-4-1',
        path: 'fieldManage',
        name: 'fieldManage',
        keepAlive: true,
        file: 'platformitem/cdpManage/categoryManage/fieldManage',
        title: '管理',
        isAuth: true
      },
      {
        id: '6-4-1',
        path: 'fieldManageDetail',
        name: 'fieldManageDetail',
        keepAlive: true,
        file: 'platformitem/cdpManage/categoryManage/fieldManageDetail',
        title: '管理',
        isAuth: true
      },
      {
        id: '6-4-2',
        path: 'operationManage',
        name: 'operationManage',
        keepAlive: true,
        file: 'platformitem/cdpManage/categoryManage/operationManage',
        title: '菜单编辑',
        isAuth: true
      },
      {
        id: '6-4-2',
        path: 'operationManageDetail',
        name: 'operationManageDetail',
        file: 'platformitem/cdpManage/categoryManage/operationManageDetail',
        title: '菜单编辑',
        isAuth: true
      }
    ]
  },
  {
    id: '6',
    path: 'account',
    name: 'account',
    file: 'enter/index',
    title: '账号中心',
    isAuth: true,
    children: [
      {
        id: '6-1-1',
        path: 'roleManagement',
        name: 'roleManagement',
        keepAlive: true,
        file: 'platformitem/cdpManage/account/index',
        title: '角色管理',
        cid: '56',
        isAuth: true
      },
      {
        id: '6-1-2',
        path: 'roleManagement/newRole',
        name: 'newRole',
        file: 'platformitem/cdpManage/account/newRole',
        title: '创建角色',
        isAuth: true
      }, {
        id: '6-1-3',
        path: 'roleManagement/jurisdiction',
        name: 'Jurisdiction',
        file: 'platformitem/cdpManage/account/jurisdiction',
        title: '设置权限',
        isAuth: true
      },
      {
        id: '6-2-1',
        path: 'employeeList',
        name: 'employeeList',
        file: 'platformitem/cdpManage/employ/index',
        title: '账号列表管理',
        cid: 33,
        keepAlive: true,
        isAuth: true,
        children: []
      },
      {
        id: '6-2-2',
        path: 'employeeList/employeeListDetailsIndex',
        name: 'employeeListDetailsIndex',
        file: 'platformitem/cdpManage/employ/details',
        title: '账号列表管理详情',
        isAuth: true,
        cid: 33,
        children: []
      }
    ]
  },
  {
    id: '7',
    path: 'downloadManage',
    name: 'downloadManage',
    file: 'enter/index',
    cid: '5',
    title: '下载管理',
    isAuth: true,
    children: [
      {
        id: '7-2-1',
        path: 'dataDownload',
        name: 'dataDownload',
        keepAlive: true,
        file: 'platformitem/cdpManage/downloadManage/index',
        title: '数据下载',
        isAuth: true
      },{
        id: '7-2-2',
        path: 'journalType',
        name: 'dataDownload/journalType',
        file: 'platformitem/cdpManage/downloadManage/journalType',
        title: '查看日志下载记录',
        isAuth: true
      }, {
        id: '7-2-3',
        path: 'logDownload',
        name: 'logDownload',
        file: 'platformitem/cdpManage/downloadManage/journal',
        title: '日志下载',
        isAuth: true
      }, {
        id: '7-2-4',
        path: 'logImport',
        name: 'logImport',
        file: 'platformitem/cdpManage/downloadManage/loadLog',
        title: '导入日志',
        isAuth: true
      },
    ]
  },
  {
    id: '8',
    path: 'masterData',
    name: 'masterData',
    file: 'enter/index',
    cid: '5',
    title: '主数据',
    isAuth: true,
    children: [
      {
        id: '8-2-1',
        path: 'brandManage',
        name: 'brandManage',
        keepAlive: true,
        file: 'platformitem/cdpManage/brandManage/brandManage/index',
        title: '品牌管理',
        isAuth: true
      },
      {
        id: '8-2-2',
        path: 'brandManage/brandManage/brandManageDetail',
        name: 'brandManageDetail',
        file: 'platformitem/cdpManage/brandManage/brandManage/detail',
        title: '品牌编辑',
        isAuth: true
      },
      {
        id: '8-1-5',
        path: 'brandStoreManage',
        name: 'brandStoreManage',
        keepAlive: true,
        file: 'platformitem/cdpManage/brandManage/brandStoreManage/index',
        title: '品牌店铺管理',
        isAuth: true
      },
      {
        id: '8-1-6',
        path: 'brandStoreManage/brandStoreManageDetail',
        name: 'brandStoreManageDetail',
        file: 'platformitem/cdpManage/brandManage/brandStoreManage/detail',
        title: '品牌店铺编辑',
        isAuth: true
      }
    ]
  },
  {
    id: '9',
    path: 'security',
    name: 'security',
    file: 'enter/index',
    title: '安全管理',
    isAuth: true,
    children: [
      {
        id: '9-1-1',
        path: 'securitySetting',
        name: 'securitySetting',
        file: 'platformitem/cdpManage/webConfig/security',
        title: '安全设置',
        isAuth: true,
      },{
        id: '9-1-2',
        path: 'securitySetting/information',
        name: 'information',
        file: 'platformitem/cdpManage/webConfig/component/information',
        title: '登录策略',
        isAuth: true
      },{
        id: '9-1-2',
        path: 'securitySetting/operation',
        name: 'operation',
        file: 'platformitem/cdpManage/webConfig/component/operation',
        title: '敏感操作',
        isAuth: true
      },{
        id: '9-1-2',
        path: 'securitySetting/visit',
        name: 'visit',
        file: 'platformitem/cdpManage/webConfig/component/visit',
        title: '访问控制',
        isAuth: true
      },{
        id: '9-1-2',
        path: 'LoginMonitoring',
        name: 'LoginMonitoring',
        file: 'platformitem/cdpManage/webConfig/loginMonitoring',
        title: '登录监控',
        isAuth: true
      }, {
        id: '9-1-3',
        path: 'OperationLog',
        name: 'OperationLog',
        file: 'platformitem/cdpManage/webConfig/operationLog',
        title: '操作日志',
        isAuth: true
      }
    ]
  },
  // 数据管理平台
  {
    id: '400',
    path: 'dashboard-4',
    name: 'dashboard-4',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '400-1',
      path: 'dashboard-4',
      name: 'dashboard-4',
      file: 'platformitem/cdpDataManage/dashboard/index',
      title: '首页',
      isAuth: true
    }]
  },
  {
    id: '2',
    path: 'system',
    name: 'system',
    file: 'enter/index',
    title: '条件库管理',
    isAuth: true,
    children: [
      {
        id: '2-1-1',
        path: 'conditionLibrary',
        name: 'conditionLibrary',
        keepAlive: true,
        file: 'platformitem/cdpDataManage/system/conditionLibrary/conditionLibrary',
        title: '标签数据集',
        keepAlive: true,
        isAuth: true
      },
      {
        id: '2-1-2',
        path: 'conditionLibrary/conditionLibraryMod',
        name: 'conditionLibraryMod',
        file: 'platformitem/cdpDataManage/system/conditionLibrary/conditionLibraryMod',
        title: '标签数据集编辑',
        keepAlive: true,
        isAuth: true
      },
      {
        id: '2-1-1',
        path: 'behaviorLibrary',
        name: 'behaviorLibrary',
        keepAlive: true,
        file: 'platformitem/cdpDataManage/system/behaviorLibrary/behaviorLibrary',
        title: '行为数据集',
        keepAlive: true,
        isAuth: true
      },
      {
        id: '2-1-2',
        path: 'behaviorLibrary/behaviorLibraryMod',
        name: 'behaviorLibraryMod',
        file: 'platformitem/cdpDataManage/system/behaviorLibrary/behaviorLibraryMod',
        title: '行为数据集编辑',
        keepAlive: true,
        isAuth: true
      },{
        id: '2-1-1',
        path: 'AnalysisLibrary',
        name: 'AnalysisLibrary',
        keepAlive: true,
        file: 'platformitem/cdpDataManage/system/AnalysisLibrary/AnalysisLibrary',
        title: '标签数据集',
        isAuth: true,
        keepAlive: true,
        cid:6051
      },
      {
        id: '2-1-2',
        path: 'AnalysisLibrary/AnalysisLibraryMod',
        name: 'AnalysisLibraryMod',
        file: 'platformitem/cdpDataManage/system/AnalysisLibrary/AnalysisLibraryMod',
        title: '标签数据集编辑',
        keepAlive: true,
        isAuth: true
      },{
        id: '2-1-1',
        path: 'DimensionLibrary',
        name: 'DimensionLibrary',
        keepAlive: true,
        file: 'platformitem/cdpDataManage/system/DimensionLibrary/DimensionLibrary',
        title: '标签数据集',
        isAuth: true
      },
      {
        id: '2-1-2',
        path: 'DimensionLibrary/DimensionLibraryMod',
        name: 'DimensionLibraryMod',
        file: 'platformitem/cdpDataManage/system/DimensionLibrary/DimensionLibraryMod',
        title: '标签数据集编辑',
        isAuth: true
      },
    ]
  },
  {
    id: '2',
    path: 'DataModel',
    name: 'DataModel',
    file: 'enter/index',
    title: '条件库管理',
    isAuth: true,
    children: [
      {
        id: '2-1-1',
        path: 'labelPool',
        name: 'labelPool',
        keepAlive: true,
        file: 'platformitem/cdpDataManage/DataModel/labelPool/labelPool',
        title: '标签工厂',
        isAuth: true
      },
      {
        id: '2-1-1',
        path: 'userModel',
        name: 'userModel',
        keepAlive: true,
        file: 'platformitem/cdpDataManage/DataModel/userModel/userModel',
        title: '标签数据集',
        isAuth: true
      },
      {
        id: '4-1-1',
        path: 'labelPool',
        name: 'labelPool',
        keepAlive: true,
        file: 'platformitem/cdpDataManage/DataModel/labelPool/labelPool',
        title: '标签池',
        isAuth: true
      },
      {
        id: '4-1-2',
        path: 'labelPool/attrLabelEdit',
        name: 'attrLabelEdits',
        file: 'platformitem/cdpDataManage/DataModel/labelPool/attrLabelAdd',
        title: '属性标签',
        isAuth: true
      }, {
        id: '4-1-3',
        path: 'labelPool/manualLabelAdd',
        name: 'manualLabelAdds',
        file: 'platformitem/cdpDataManage/DataModel/labelPool/manualLabelAdd',
        title: '手工标签新增',
        isAuth: true
      }, {
        id: '4-1-4',
        path: 'labelPool/manualLabelEdit',
        name: 'manualLabelEdits',
        file: 'platformitem/cdpDataManage/DataModel/labelPool/manualLabelAdd',
        title: '手工标签修改',
        isAuth: true
      }, {
        id: '4-1-5',
        path: 'labelPool/ruleLabelAdd',
        name: 'ruleLabelAdds',
        file: 'platformitem/cdpDataManage/DataModel/labelPool/ruleLabelAdd',
        title: '规则标签新增',
        isAuth: true
      }, {
        id: '4-1-6',
        path: 'labelPool/ruleLabelEdit',
        name: 'ruleLabelEdits',
        file: 'platformitem/cdpDataManage/DataModel/labelPool/ruleLabelAdd',
        title: '规则标签修改',
        isAuth: true
      }, {
        id: '4-1-7',
        path: 'labelPool/complexLabelAdd',
        name: 'complexLabelAdds',
        file: 'platformitem/cdpDataManage/DataModel/labelPool/complexLabelAdd',
        title: '复合标签新增',
        isAuth: true
      }, {
        id: '4-1-8',
        path: 'labelPool/complexLabelEdit',
        name: 'complexLabelEdits',
        file: 'platformitem/cdpDataManage/DataModel/labelPool/complexLabelAdd',
        title: '复合标签编辑',
        isAuth: true
      }, {
        id: '4-1-9',
        path: 'labelPool/rfmLabelEdit',
        name: 'rfmLabelEdits',
        file: 'platformitem/cdpDataManage/DataModel/labelPool/rfmLabelAdd',
        title: 'rmf模型标签编辑',
        isAuth: true
      }
    ]
  },
  {
    id: '3',
    path: 'meta',
    name: 'meta',
    file: 'enter/index',
    title: '元数据',
    isAuth: true,
    children: [{
      id: '3-3',
      path: 'marketEventAction',
      keepAlive: true,
      name: 'marketEventAction',
      file: 'platformitem/cdpDataManage/meta/marketEventAction/index',
      title: '营销动作定义',
      isAuth: true
    },{
      id: '3-2',
      path: 'marketEventList',
      name: 'marketEventList',
      keepAlive: true,
      file: 'platformitem/cdpDataManage/meta/marketEvent/marketEventList',
      title: '事件管理',
      isAuth: true
    },
    {
      id: '3-3',
      path: 'marketEventList/marketEventAdd',
      name: 'marketEventAdd',
      file: 'platformitem/cdpDataManage/meta/marketEvent/marketEventAdd',
      title: '营销事件定义编辑',
      isAuth: true
    },{
      id: '3-2',
      path: 'marketEventFieldList',
      name: 'marketEventFieldList',
      keepAlive: true,
      file: 'platformitem/cdpDataManage/meta/marketEventField/marketEventFieldList',
      title: '事件管理',
      isAuth: true
    },
    {
      id: '3-3',
      path: 'marketEventFieldList/marketEventFieldAdd',
      name: 'marketEventFieldAdd',
      file: 'platformitem/cdpDataManage/meta/marketEventField/marketEventFieldAdd',
      title: '营销事件定义编辑',
      isAuth: true
    },
    {
      id: '3-1',
      path: 'metaform',
      name: 'metaform',
      file: 'platformitem/cdpDataManage/meta/metaform/metaform',
      title: '元数据表',
      keepAlive: true,
      cid: 38,
      isAuth: true
    }, {
      id: '3-4',
      path: 'metafield',
      name: 'metafield',
      file: 'platformitem/cdpDataManage/meta/metafield/metafield',
      title: '元数据字段',
      keepAlive: true,
      cid: 38,
      isAuth: true
    }, {
      id: '3-5',
      path: 'metaenum',
      name: 'metaenum',
      file: 'platformitem/cdpDataManage/meta/metaenum/metaenum',
      title: '元数据枚举值',
      keepAlive: true,
      cid: 38,
      isAuth: true
    }]
  },
  {
    id: '4',
    path: 'memberLabel',
    name: 'memberLabel',
    file: 'enter/index',
    title: '条件库管理',
    isAuth: true,
    children: [{
      id: '4-1-1',
      path: 'conditionlPool',
      name: 'conditionlPool',
      keepAlive: true,
      file: 'platformitem/cdpDataManage/memberLabel/labelPool/labelPool',
      title: '标签池',
      isAuth: true
    },
    {
      id: '4-1-2',
      path: 'conditionlPool/attrLabelEdit',
      name: 'attrLabelEdit',
      file: 'platformitem/cdpDataManage/memberLabel/labelPool/attrLabelAdd',
      title: '属性标签',
      isAuth: true
    }, {
      id: '4-1-3',
      path: 'conditionlPool/manualLabelAdd',
      name: 'manualLabelAdd',
      file: 'platformitem/cdpDataManage/memberLabel/labelPool/manualLabelAdd',
      title: '手工标签新增',
      isAuth: true
    }, {
      id: '4-1-4',
      path: 'conditionlPool/manualLabelEdit',
      name: 'manualLabelEdit',
      file: 'platformitem/cdpDataManage/memberLabel/labelPool/manualLabelAdd',
      title: '手工标签修改',
      isAuth: true
    }, {
      id: '4-1-5',
      path: 'conditionlPool/ruleLabelAdd',
      name: 'ruleLabelAdd',
      file: 'platformitem/cdpDataManage/memberLabel/labelPool/ruleLabelAdd',
      title: '规则标签新增',
      isAuth: true
    }, {
      id: '4-1-6',
      path: 'conditionlPool/ruleLabelEdit',
      name: 'ruleLabelEdit',
      file: 'platformitem/cdpDataManage/memberLabel/labelPool/ruleLabelAdd',
      title: '规则标签修改',
      isAuth: true
    }, {
      id: '4-1-7',
      path: 'conditionlPool/complexLabelAdd',
      name: 'complexLabelAdd',
      file: 'platformitem/cdpDataManage/memberLabel/labelPool/complexLabelAdd',
      title: '复合标签新增',
      isAuth: true
    }, {
      id: '4-1-8',
      path: 'conditionlPool/complexLabelEdit',
      name: 'complexLabelEdit',
      file: 'platformitem/cdpDataManage/memberLabel/labelPool/complexLabelAdd',
      title: '复合标签编辑',
      isAuth: true
    }, {
      id: '4-1-9',
      path: 'conditionlPool/rfmLabelEdit',
      name: 'rfmLabelEdit',
      file: 'platformitem/cdpDataManage/memberLabel/labelPool/rfmLabelAdd',
      title: 'rmf模型标签编辑',
      isAuth: true
    },
    {
      id: '4-2-1',
      path: 'brandLabelPool',
      name: 'brandLabelPool',
      file: 'platformitem/cdpDataManage/memberLabel/brandLabelPool/brandLabelPool',
      title: '品牌标签池',
      isAuth: true
    },
    {
      id: '4-2-2',
      path: 'brandLabelPool/attrBrandLabelEdit',
      name: 'attrBrandLabelEdit',
      file: 'platformitem/cdpDataManage/memberLabel/brandLabelPool/attrBrandLabelAdd',
      title: '标签池属性标签编辑',
      isAuth: true
    }, {
      id: '4-2-3',
      path: 'brandLabelPool/manualBrandLabelEdit',
      name: 'manualBrandLabelEdit',
      file: 'platformitem/cdpDataManage/memberLabel/brandLabelPool/manualBrandLabelAdd',
      title: '标签池手工标签编辑',
      isAuth: true
    }, {
      id: '4-2-4',
      path: 'brandLabelPool/ruleBrandLabelEdit_f',
      name: 'ruleBrandLabelEdit_f',
      file: 'platformitem/cdpDataManage/memberLabel/brandLabelPool/ruleBrandLabelAdd-filter',
      title: '标签池规则标签编辑',
      isAuth: true
    }, {
      id: '4-2-5',
      path: 'brandLabelPool/ruleBrandLabelEdit_s',
      name: 'ruleBrandLabelEdit_s',
      file: 'platformitem/cdpDataManage/memberLabel/brandLabelPool/ruleBrandLabelAdd-sql',
      title: '标签池规则标签编辑',
      isAuth: true
    }, {
      id: '4-2-6',
      path: 'brandLabelPool/complexBrandLabelEdit',
      name: 'complexBrandLabelEdit',
      file: 'platformitem/cdpDataManage/memberLabel/brandLabelPool/complexBrandLabelAdd',
      title: '标签池复合标签编辑',
      isAuth: true
    }, {
      id: '4-2-7',
      path: 'brandLabelPool/rfmBrandLabelEdit',
      name: 'rfmBrandLabelEdit',
      file: 'platformitem/cdpDataManage/memberLabel/brandLabelPool/rfmBrandLabelAdd',
      title: '标签池rmf模型标签编辑',
      isAuth: true
    }
    ]
  },

  // 洞察平台菜单
  {
    id: '300',
    path: 'dashboard-3',
    name: 'dashboard-3',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '300-1',
      path: 'dashboard-3',
      name: 'dashboard-3',
      file: 'platformitem/insight/dashboard/index',
      title: '首页',
      isAuth: true
    }]
  },
  // 用户洞察
  {
    id: '300',
    path: 'user',
    name: 'user',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '300-1',
      path: 'Userbehavior',
      name: 'Userbehavior',
      file: 'platformitem/insight/user/Userbehavior',
      title: '首页',
      isAuth: true
    },
    {
      id: '300-1',
      path: 'Userlifecycle',
      name: 'Userlifecycle',
      file: 'platformitem/insight/user/Userlifecycle',
      title: '首页',
      isAuth: true
    },
    {
      id: '300-1',
      path: 'Userportrait',
      name: 'Userportrait',
      file: 'platformitem/insight/user/Userportrait',
      title: '首页',
      isAuth: true
    },
    {
      id: '300-1',
      path: 'Usersatisfaction',
      name: 'Usersatisfaction',
      file: 'platformitem/insight/user/Usersatisfaction',
      title: '首页',
      isAuth: true
    },
    {
      id: '300-1',
      path: 'Userstructure',
      name: 'Userstructure',
      file: 'platformitem/insight/user/Userstructure',
      title: '首页',
      isAuth: true
    },
    {
      id: '300-1',
      path: 'Uservalue',
      name: 'Uservalue',
      file: 'platformitem/insight/user/Uservalue',
      title: '首页',
      isAuth: true
    }]
  },
  // 商品洞察
  {
    id: '300',
    path: 'commodity',
    name: 'commodity',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '300-1',
      path: 'commodityassetmarket',
      name: 'commodityassetmarket',
      file: 'platformitem/insight/commodity/commodityassetmarket',
      title: '首页',
      isAuth: true
    },
    {
      id: '300-1',
      path: 'commodityevaluation',
      name: 'commodityevaluation',
      file: 'platformitem/insight/commodity/commodityevaluation',
      title: '首页',
      isAuth: true
    },
    {
      id: '300-1',
      path: 'itemtracking',
      name: 'itemtracking',
      file: 'platformitem/insight/commodity/itemtracking',
      title: '首页',
      isAuth: true
    },
    {
      id: '300-1',
      path: 'relatedsalesofgoods',
      name: 'relatedsalesofgoods',
      file: 'platformitem/insight/commodity/relatedsalesofgoods',
      title: '首页',
      isAuth: true
    }]
  },
// 店铺洞察
{
  id: '300',
  path: 'store',
  name: 'store',
  file: 'enter/index',
  title: '首页',
  isAuth: true,
  children: [{
    id: '300-1',
    path: 'commodityassetmarket',
    name: 'commodityassetmarket',
    file: 'platformitem/insight/store/commodityassetmarket',
    title: '首页',
    isAuth: true
  },
  {
    id: '300-1',
    path: 'storemarket',
    name: 'storemarket',
    file: 'platformitem/insight/store/storemarket',
    title: '首页',
    isAuth: true
  },
  {
    id: '300-1',
    path: 'singlestoreoverview',
    name: 'singlestoreoverview',
    file: 'platformitem/insight/store/singlestoreoverview',
    title: '首页',
    isAuth: true
  },
  {
    id: '300-1',
    path: 'storeusers',
    name: 'storeusers',
    file: 'platformitem/insight/store/storeusers',
    title: '首页',
    isAuth: true
  },
  {
    id: '300-1',
    path: 'shopmerchandise',
    name: 'shopmerchandise',
    file: 'platformitem/insight/store/shopmerchandise',
    title: '首页',
    isAuth: true
  },
  {
    id: '300-1',
    path: 'storeactivities',
    name: 'storeactivities',
    file: 'platformitem/insight/store/storeactivities',
    title: '首页',
    isAuth: true
  }]
},// 营销洞察
{
  id: '300',
  path: 'marketing',
  name: 'marketing',
  file: 'enter/index',
  title: '首页',
  isAuth: true,
  children: [{
    id: '300-1',
    path: 'marketingoverview',
    name: 'marketingoverview',
    file: 'platformitem/insight/marketing/marketingoverview',
    title: '首页',
    isAuth: true
  },
  {
    id: '300-1',
    path: 'activityinsight',
    name: 'activityinsight',
    file: 'platformitem/insight/marketing/activityinsight',
    title: '首页',
    isAuth: true
  },
  {
    id: '300-1',
    path: 'onsitepromotion',
    name: 'onsitepromotion',
    file: 'platformitem/insight/marketing/onsitepromotion',
    title: '首页',
    isAuth: true
  },
  {
    id: '300-1',
    path: 'brandpromotion',
    name: 'brandpromotion',
    file: 'platformitem/insight/marketing/brandpromotion',
    title: '首页',
    isAuth: true
  }]
},
  // 驾驶舱
  {
    id: '300',
    path: 'cockpit',
    name: 'cockpit',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '300-1',
      path: 'Businessmarket',
      name: 'Businessmarket',
      file: 'platformitem/insight/cockpit/Businessmarket',
      title: '首页',
      isAuth: true
    },
    {
      id: '300-1',
      path: 'Brandmarket',
      name: 'Brandmarket',
      file: 'platformitem/insight/cockpit/Brandmarket',
      title: '首页',
      isAuth: true
    },
    {
      id: '300-1',
      path: 'Usermarket',
      name: 'Usermarket',
      file: 'platformitem/insight/cockpit/Usermarket',
      title: '首页',
      isAuth: true
    },
    {
      id: '300-1',
      path: 'Combatroom',
      name: 'Combatroom',
      file: 'platformitem/insight/cockpit/Combatroom',
      title: '首页',
      isAuth: true
    },
    {
      id: '300-1',
      path: 'Storemarket',
      name: 'Storemarket',
      file: 'platformitem/insight/cockpit/Storemarket',
      title: '首页',
      isAuth: true
    }]
  },
  // 互动平台菜单
  {
    id: '600',
    path: 'dashboard-6',
    name: 'dashboard-6',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '600-1',
      path: 'dashboard-6',
      name: 'dashboard-6',
      file: 'platformitem/interact/dashboard/index',
      title: '首页',
      isAuth: true
    }]
  },
  {
    id: '600',
    path: 'wechat',
    name: 'wechat',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '600-1',
      path: 'wxMenus',
      name: 'wxMenus',
      file: 'platformitem/interact/wxAccount/wxMenus',
      title: '首页',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wxReplyfollow',
      name: 'wxReplyfollow',
      file: 'platformitem/interact/wxAccount/reply/follow/index',
      title: '首页',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wxReplykeyword',
      name: 'wxReplykeyword',
      file: 'platformitem/interact/wxAccount/reply/keyword/index',
      title: '首页',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wxReplyreplyIndex',
      name: 'wxReplyreplyIndex',
      file: 'platformitem/interact/wxAccount/reply/index',
      title: '首页',
      isAuth: true
    }]
  },
  // 营销平台菜单
  {
    id: '300',
    path: 'dashboard-2',
    name: 'dashboard-2',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '600-1',
      path: 'dashboard-2',
      name: 'dashboard-2',
      file: 'platformitem/markting/dashboard/index',
      title: '首页',
      isAuth: true
    }]
  },
  // 标签受众
  {
    id: '300',
    path: 'vipinsight',
    name: 'vipinsight',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '600-1',
      path: 'taglist',
      name: 'taglist',
      file: 'platformitem/markting/vipinsight/taglist/index',
      isAuth: true
    }, {
      id: '600-1-1',
      path: 'groupList',
      name: 'groupList',
      file: 'platformitem/markting/vipinsight/group/groupList/index',
      isAuth: true
    }, {
      id: '600-1-2',
      path: 'groupList/editImportGroup',
      name: 'editImportGroup',
      file: 'platformitem/markting/vipinsight/group/newGroup/editImportGroup',
      isAuth: true
    }, {
      id: '600-1-1',
      path: 'groupList/importGroup',
      name: 'importGroup',
      file: 'platformitem/markting/vipinsight/group/newGroup/importGroup',
      isAuth: true
    },{
      id: '600-1-3',
      path: 'groupList/normalGroup',
      name: 'normalGroup',
      file: 'platformitem/markting/vipinsight/group/newGroup/normalGroup',
      isAuth: true
    }, {
      id: '600-1',
      path: 'advancedGroup',
      name: 'advancedGroup',
      file: 'platformitem/markting/vipinsight/group/newGroup/advancedGroup',
      isAuth: true
    }, {
      id: '600-1-1',
      path: 'groupTemplate',
      name: 'groupTemplate',
      file: 'platformitem/markting/vipinsight/groupTemplate/index',
      isAuth: true
    },  {
      id: '600-1-2',
      path: 'groupTemplate/ruleTemplateView',
      name: 'ruleTemplateView',
      file: 'platformitem/markting/vipinsight/groupTemplate/ruleTemplate',
      isAuth: true
    }, {
      id: '600-1-3',
      path: 'groupTemplate/modelTemplate',
      name: 'modelTemplate',
      file: 'platformitem/markting/vipinsight/groupTemplate/modelTemplate',
      isAuth: true
    },{
      id: '600-1',
      path: 'ruleTemplate',
      name: 'ruleTemplate',
      file: 'platformitem/markting/vipinsight/groupTemplate/ruleTemplate',
      isAuth: true
    }, {
      id: '600-1',
      path: 'ruleTemplateEdit',
      name: 'ruleTemplateEdit',
      file: 'platformitem/markting/vipinsight/groupTemplate/ruleTemplate',
      isAuth: true
    }]
  },
  // 私有营销
  {
    id: '300',
    path: 'Privatemarketing',
    name: 'Privatemarketing',
    file: 'enter/index',
    title: '首页',
    keepAlive:true,
    isAuth: true,
    children: [{
      id: '600-1',
      path: 'emailMange',
      name: 'emailMange',
      file: 'platformitem/markting/email/emailMange',
      keepAlive:true,
      isAuth: true
    },
    {
      id: '600-1',
      path: 'smsMange',
      name: 'smsMange',
      keepAlive:true,
      file: 'platformitem/markting/sms/smsMange',
      isAuth: true
    },{
      id: '600-1',
      path: 'emailGroupSendsAdd',
      name: 'emailGroupSendsAdd',
      file: 'platformitem/markting/email/emailGroupSendsAdd',
      keepAlive:true,
      isAuth: true
    }, {
      id: '600-1',
      path: 'weiboSends',
      name: 'weiboSends',
      keepAlive:true,
      file: 'platformitem/markting/weibo/weiboSends',
      isAuth: true
    }, {
      id: '600-1',
      path: 'weiboMange',
      name: 'weiboMange',
      keepAlive:true,
      file: 'platformitem/markting/weibo/weiboMange',
      isAuth: true
    },  {
      id: '600-1',
      path: 'weiboSends/weiboSendsAdd',
      name: 'weiboSendsAdd',
      keepAlive:true,
      file: 'platformitem/markting/weibo/weiboSendsAdd',
      isAuth: true
    },{
      id: '600-1',
      path: 'weibosendlog',
      name: 'weibosendlog',
      keepAlive:true,
      file: 'platformitem/markting/weibo/weibosendlog',
      isAuth: true
    },{
      id: '600-1',
      path: 'douyinMange',
      name: 'douyinMange',
      keepAlive:true,
      file: 'platformitem/markting/douyin/douyinMange',
      isAuth: true
    }, {
      id: '600-1',
      path: 'douyinSends',
      name: 'douyinSends',
      keepAlive:true,
      file: 'platformitem/markting/douyin/douyinSends',
      isAuth: true
    }, {
      id: '600-1',
      path: 'douyinsendlog',
      name: 'douyinsendlog',
      keepAlive:true,
      file: 'platformitem/markting/douyin/douyinsendlog',
      isAuth: true
    }, {
      id: '600-1',
      path: 'douyinSends/douyinSendsAdd',
      name: 'douyinSendsAdd',
      keepAlive:true,
      file: 'platformitem/markting/douyin/douyinSendsAdd',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wechatGroupMessage',
      name: 'wechatGroupMessage',
      keepAlive:true,
      file: 'platformitem/markting/wechat/wechatGroupMessage',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wechatMange/newWechatGroupMessage',
      name: 'newWechatGroupMessage',
      keepAlive:true,
      file: 'platformitem/markting/wechat/wechatGroupMsgForm',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wechatMange/viewWechatGroupMessage',
      name: 'viewWechatGroupMessage',
      keepAlive:true,
      file: 'platformitem/markting/wechat/wechatGroupMsgForm',
      isAuth: true
    },
    {
      id: '600-1',
      path: 'wechatMange',
      name: 'wechatMange',
      file: 'platformitem/markting/wechat/wechatMange',
      isAuth: true
    },{
      id: '600-1',
      path: 'wechatMange/editWechatGroupMessage',
      name: 'editWechatGroupMessage',
      file: 'platformitem/markting/wechat/wechatGroupMsgForm',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wechatMange/wechatGroupMessageLog',
      name: 'wechatGroupMessageLog',
      keepAlive:true,
      file: 'platformitem/markting/wechat/wechatGroupMsgLog',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wechatTempMessage',
      name: 'wechatTempMessage',
      keepAlive:true,
      file: 'platformitem/markting/wechat/wechatTempMessage',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wechatMange/newWechatTemplateMessage',
      name: 'newWechatTemplateMessage',
      keepAlive:true,
      file: 'platformitem/markting/wechat/wechatTemplateMsgForm',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wechatMange/viewWechatTemplateMessage',
      name: 'viewWechatTemplateMessage',
      keepAlive:true,
      file: 'platformitem/markting/wechat/wechatTemplateMsgForm',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wechatMange/editWechatTemplateMessage',
      name: 'editWechatTemplateMessage',
      keepAlive:true,
      file: 'platformitem/markting/wechat/wechatTemplateMsgForm',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wechatMange/wechatTemplateMessageLog',
      name: 'wechatTemplateMessageLog',
      keepAlive:true,
      file: 'platformitem/markting/wechat/wechatTemplateMsgLog',
      isAuth: true
    }, {
      id: '600-1',
      path: 'smsMange/SMSGroupTemplate',
      name: 'SMSGroupTemplate',
      keepAlive:true,
      file: 'platformitem/markting/sms/SMSGroupTemplate',
      isAuth: true
    }, {
      id: '600-1',
      path: 'smsMange/newSmsSignature',
      name: 'newSmsSignature',
      keepAlive:true,
      file: 'platformitem/markting/sms/newSmsSignature',
      isAuth: true
    }, {
      id: '600-1',
      path: 'mmsMange',
      name: 'mmsMange',
      keepAlive:true,
      file: 'platformitem/markting/mms/mmsMange',
      isAuth: true
    }]
  },
  // 广告管理
  {
    id: '300',
    path: 'Advertising',
    name: 'Advertising',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '600-1',
      path: 'jingdongShufang',
      name: 'jingdongShufang',
      keepAlive:true,
      file: 'platformitem/markting/marketing/marketingManage/jingdongShufang',
      isAuth: true
    }, {
      id: '600-1',
      path: 'jingdongShufang/newJingdongShufang',
      name: 'newJingdongShufang',
      file: 'platformitem/markting/marketing/marketingManage/jingdongShufangForm',
      isAuth: true
    }, {
      id: '600-1',
      path: 'jingdongShufang/viewJingdongShufang',
      name: 'viewJingdongShufang',
      file: 'platformitem/markting/marketing/marketingManage/jingdongShufangForm',
      isAuth: true
    }, {
      id: '600-1',
      path: 'jingdongShufang/editJingdongShufang',
      name: 'editJingdongShufang',
      file: 'platformitem/markting/marketing/marketingManage/jingdongShufangForm',
      isAuth: true
    }, {
      id: '600-1',
      path: 'pinyou',
      name: 'pinyou',
      keepAlive:true,
      file: 'platformitem/markting/marketing/marketingManage/pinyou',
      isAuth: true
    }, {
      id: '600-1',
      path: 'pinyou/newpinyou',
      name: 'newpinyou',
      file: 'platformitem/markting/marketing/marketingManage/pinyouForm',
      isAuth: true
    }, {
      id: '600-1',
      path: 'pinyou/viewpinyou',
      name: 'viewpinyou',
      file: 'platformitem/markting/marketing/marketingManage/pinyouForm',
      isAuth: true
    }, {
      id: '600-1',
      path: 'pinyou/editpinyou',
      name: 'editpinyou',
      file: 'platformitem/markting/marketing/marketingManage/pinyouForm',
      isAuth: true
    },  {
      id: '600-1',
      path: 'tencentad',
      name: 'tencentad',
      file: 'platformitem/markting/marketing/marketingManage/tencentad',
      isAuth: true
    }, {
      id: '600-1',
      path: 'oceanengine',
      name: 'oceanengine',
      file: 'platformitem/markting/marketing/marketingManage/oceanengine',
      isAuth: true
    }]
  },
  // 营销自动化
  {
    id: '300',
    path: 'marketing',
    name: 'marketing',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '600-1',
      path: 'marketingList',
      name: 'marketingList',
      file: 'platformitem/markting/marketing/marketingList/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'marketingModule',
      name: 'marketingModule',
      file: 'platformitem/markting/marketing/marketingModule/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'marketingReport',
      name: 'marketingReport',
      file: 'platformitem/markting/marketing/marketingList/report',
      isAuth: true
    }, {
      id: '600-1',
      path: 'marketingSetting',
      name: 'marketingSetting',
      file: 'platformitem/markting/marketing/marketingSetting/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'marketingTemplateSetting',
      name: 'marketingTemplateSetting',
      file: 'platformitem/markting/marketing/marketingSetting/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'marketingList/marketingSettingAdd',
      name: 'marketingSettingAdd',
      file: 'platformitem/markting/marketing/marketingSetting/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'marketingList/marketingSettingView',
      name: 'marketingSettingView',
      file: 'platformitem/markting/marketing/marketingSetting/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'marketingList/marketingSettingEdit',
      name: 'marketingSettingEdit',
      file: 'platformitem/markting/marketing/marketingSetting/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'marketingModule/marketingTemplateSettingAdd',
      name: 'marketingTemplateSettingAdd',
      file: 'platformitem/markting/marketing/marketingSetting/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'marketingModule/marketingTemplateSettingView',
      name: 'marketingTemplateSettingView',
      file: 'platformitem/markting/marketing/marketingSetting/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'marketingModule/marketingTemplateSettingEdit',
      name: 'marketingTemplateSettingEdit',
      file: 'platformitem/markting/marketing/marketingSetting/index',
      isAuth: true
    }]
  },
  // 用户管理
  {
    id: '300',
    path: 'usermanage',
    name: 'usermanage',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '600-1',
      path: 'userManage',
      name: 'userManage',
      file: 'platformitem/markting/user/userManage',
      isAuth: true
    }, {
      id: '600-1',
      path: 'FansMange',
      name: 'FansMange',
      file: 'platformitem/markting/user/FansMange',
      isAuth: true
    }, {
      id: '600-1',
      path: 'AccountMange',
      name: 'AccountMange',
      file: 'platformitem/markting/user/AccountMange',
      isAuth: true
    }, {
      id: '600-1',
      path: 'crmArchivesList',
      name: 'crmArchivesList',
      file: 'platformitem/markting/user/crmArchivesList/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'taobaoaAccountList',
      name: 'taobaoaAccountList',
      file: 'platformitem/markting/user/taobaoaAccountList',
      isAuth: true
    }, {
      id: '600-1',
      path: 'jingdongAccountList',
      name: 'jingdongAccountList',
      file: 'platformitem/markting/user/jingdongAccountList',
      isAuth: true
    }, {
      id: '600-1',
      path: 'wechatFanList',
      name: 'wechatFanList',
      file: 'platformitem/markting/user/wechat/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'douyinFanList',
      name: 'douyinFanList',
      file: 'platformitem/markting/user/douyinFanList',
      isAuth: true
    }, {
      id: '600-1',
      path: 'weiboFanList',
      name: 'weiboFanList',
      file: 'platformitem/markting/user/weiboFanList',
      isAuth: true
    }, {
      id: '600-1',
      path: 'crmArchivesList/crmArchivesPortrait',
      name: 'crmArchivesPortrait',
      file: 'platformitem/markting/user/crmArchivesPortrait/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'userManage/userArchivesPortrait',
      name: 'userArchivesPortrait',
      file: 'platformitem/markting/user/crmArchivesPortrait/index',
      isAuth: true
    }]
  },
  // 营销库
  {
    id: '300',
    path: 'MarketingLibrary',
    name: 'MarketingLibrary',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '600-1',
      path: 'MarketingCalendar',
      name: 'MarketingCalendar',
      file: 'platformitem/markting/MarketingLibrary/MarketingCalendar',
      isAuth: true
    }, {
      id: '600-1',
      path: 'MarketingPlan',
      name: 'MarketingPlan',
      file: 'platformitem/markting/MarketingLibrary/MarketingPlan',
      isAuth: true
    }, {
      id: '600-1',
      path: 'MarketingPlan/MarketingPlanForm',
      name: 'MarketingPlanForm',
      file: 'platformitem/markting/MarketingLibrary/MarketingPlanForm',
      isAuth: true
    }]
  },
  // 优惠券管理
  {
    id: '300',
    path: 'coupon',
    name: 'coupon',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '600-1',
      path: 'couponlist',
      name: 'couponlist',
      file: 'platformitem/markting/coupon/list/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'couponlist/creatCoupon',
      name: 'creatCoupon',
      file: 'platformitem/markting/coupon/list/save',
      isAuth: true
    }, {
      id: '600-1',
      path: 'couponrecord',
      name: 'couponrecord',
      file: 'platformitem/markting/coupon/record/index',
      isAuth: true
    }]
  },
  // 内容管理
  {
    id: '300',
    path: 'Contentmanage',
    name: 'Contentmanage',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [
      {
        id: '600-1',
        path: 'smsmaterial',
        name: 'smsmaterial',
        file: 'platformitem/markting/marketing/Contentmanage/smsmaterial',
        isAuth: true
      },{
        id: '600-1',
        path: 'wechatmaterial',
        name: 'wechatmaterial',
        file: 'platformitem/markting/marketing/Contentmanage/wechatmaterial',
        isAuth: true
      },{
        id: '600-1',
        path: 'weibomaterial',
        name: 'weibomaterial',
        file: 'platformitem/markting/marketing/Contentmanage/weibomaterial',
        isAuth: true
      },{
        id: '600-1',
        path: 'douyinmaterial',
        name: 'douyinmaterial',
        file: 'platformitem/markting/marketing/Contentmanage/douyinmaterial',
        isAuth: true
      },{
        id: '600-1',
        path: 'Contentmanage',
        name: 'Contentmanage',
        file: 'platformitem/markting/marketing/Contentmanage/Contentmanage',
        isAuth: true
      },{
      id: '600-1',
      path: 'marketingRestriction',
      name: 'marketingRestriction',
      file: 'platformitem/markting/marketingRestriction/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'smsmaterial/newSMSTemplate',
      name: 'newSMSTemplate',
      file: 'platformitem/markting/sms/newSMSTemplate',
      isAuth: true
    }, {
      id: '600-1',
      path: 'smsmaterial/newMMSTemplate',
      name: 'newMMSTemplate',
      file: 'platformitem/markting/mms/newMMSTemplate',
      isAuth: true
    }]
  },
  // 等级管理
  {
    id: '300',
    path: 'levelManage',
    name: 'levelManage',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '600-1',
      path: 'levelRules',
      name: 'levelRules',
      file: 'platformitem/markting/loyalty/levelManagement/levelRules',
      isAuth: true
    }, {
      id: '600-1',
      path: 'levelPublish',
      name: 'levelPublish',
      file: 'platformitem/markting/loyalty/levelManagement/levelPublish',
      isAuth: true
    }, {
      id: '600-1',
      path: 'levelChange',
      name: 'levelChange',
      file: 'platformitem/markting/loyalty/levelManagement/levelAdjustment',
      isAuth: true
    }, {
      id: '600-1',
      path: 'levelChangeLog',
      name: 'levelChangeLog',
      file: 'platformitem/markting/loyalty/levelManagement/levelChangeLog',
      isAuth: true
    }]
  },
  // 积分管理
  {
    id: '300',
    path: 'pointManage',
    name: 'pointManage',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '600-1',
      path: 'pointType',
      name: 'pointType',
      file: 'platformitem/markting/pointManage/pointType/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'rePoint',
      name: 'rePoint',
      file: 'platformitem/markting/pointManage/rePoint/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'pointslog',
      name: 'pointslog',
      file: 'platformitem/markting/pointManage/pointLog/index',
      isAuth: true
    }, {
      id: '600-1',
      path: 'pointType/newPointRule',
      name: 'newPointRule',
      file: 'platformitem/markting/pointManage/pointType/newPointRule',
      isAuth: true
    }]
  },
  // 主数据管理
  {
    id: '200',
    path: 'masterData',
    name: 'commodityData',
    file: 'enter/index',
    title: '首页',
    isAuth: true,
    children: [{
      id: '200-1',
      path: 'commodityArchives',
      name: 'commodityArchives',
      file: 'platformitem/markting/user/commodity/commodityArchives',
      isAuth: true
    },
    {
      id: '200-1',
      path: 'commodityList',
      name: 'commodityList',
      file: 'platformitem/markting/user/commodity/commodityList',
      isAuth: true
    }, {
      id: '200-1',
      path: 'commodityList/commodityEdit',
      name: 'commodityEdit',
      file: 'platformitem/markting/user/commodity/commodityEdit',
      isAuth: true
    }
    ,
    {
      id: '200-1',
      path: 'commComparisonList',
      name: 'commComparisonList',
      file: 'platformitem/markting/user/commodity/commodityTable',
      isAuth: true
    },{
      id: '200-1',
      path: 'commComparisonList/commodityTableFerenceEdit',
      name: 'commodityTableFerenceEdit',
      file: 'platformitem/markting/user/commodity/commodityTableFerenceEdit',
      isAuth: true
    },
    {
      id: '200-1',
      path: 'commodityTableCode',
      name: 'commodityTableCode',
      file: 'platformitem/markting/user/commodity/commodityTableCode',
      isAuth: true
    },
    {
      id: '200-1',
      path: 'commodityTableCode/commodityTableCodeEdit',
      name: 'commodityTableCodeEdit',
      file: 'platformitem/markting/user/commodity/commodityTableCodeEdit',
      isAuth: true
    },
    {
      id: '200-1',
      path: 'storeArchive',
      name: 'storeArchive',
      file: 'platformitem/markting/masterData/storeArchive',
      isAuth: true
    },
    {
      id: '200-1',
      path: 'evaluate',
      name: 'evaluate',
      file: 'platformitem/markting/masterData/evaluate',
      isAuth: true
    },
    {
      id: '200-1',
      path: 'order',
      name: 'order',
      file: 'platformitem/markting/masterData/order',
      isAuth: true
    }, {
      id: '200-1',
      path: 'addStore',
      name: 'addStore',
      file: 'platformitem/markting/masterData/addStore',
      isAuth: true
    }]
  }
]

export default navs
