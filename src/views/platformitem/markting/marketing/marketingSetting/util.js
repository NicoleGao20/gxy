export function getPosition(ele) {
  var l = ele.offsetLeft
  var t = ele.offsetTop
  var p = ele.offsetParent
  while (p) {
    if (window.navigator.userAgent.indexOf('MSIE 8') > -1) {
      l += p.offsetLeft
      t += p.offsetTop
    } else {
      l += p.offsetLeft + p.clientLeft
      t += p.offsetTop + p.clientTop
    }
    p = p.offsetParent
  }
  return { left: l, top: t }
}

export const nodeItems = [
  {
    icon: '/static/market_icons/1.png',
    component: 'peopleFilter',
    name: 'peopleFilter',
    label: '人群选择',
    mulBranch: false // 多分支
  },
  {
    icon: '/static/market_icons/2.png',
    component: 'eventSelect',
    name: 'eventSelect',
    label: '事件选择',
    mulBranch: true
  },
  {
    icon: '/static/market_icons/3.png',
    component: 'abTest',
    name: 'abTest',
    label: 'AB测试',
    mulBranch: true
  },
  {
    icon: '/static/market_icons/4.png',
    component: 'eventJudge',
    name: 'eventJudge',
    label: '事件判断',
    mulBranch: true
  },
  {
    icon: '/static/market_icons/5.png',
    component: 'coupon',
    name: 'coupon',
    label: '优惠券',
    mulBranch: false
  },
  {
    icon: '/static/market_icons/7.png',
    component: 'wxTemplateMsg',
    name: 'wxTemplateMsg',
    label: '微信模版消息',
    mulBranch: false
  },
  {
    icon: '/static/market_icons/8.png',
    component: 'phoneSms',
    name: 'phoneSms',
    label: '短信',
    mulBranch: false
  },
  {
    icon: '/static/market_icons/mms.png',
    component: 'phoneMms',
    name: 'phoneMms',
    label: '数字短信',
    mulBranch: false
  },
  {
    icon: '/static/market_icons/email.png',
    component: 'email',
    name: 'email',
    label: '邮件',
    mulBranch: false
  },
  {
    icon: '/static/market_icons/9.png',
    component: 'wxNews',
    name: 'wxNews',
    label: '图文素材',
    mulBranch: false
  },
  {
    icon: '/static/market_icons/10.png',
    component: 'appPush',
    name: 'appPush',
    label: 'APP PUSH',
    mulBranch: false
  },
  {
    icon: '/static/market_icons/11.png',
    component: 'timePicker',
    name: 'timePicker',
    label: '时间选择',
    mulBranch: false
  },
  {
    icon: '/static/market_icons/12.png',
    component: 'delayTime',
    name: 'delayTime',
    label: '等待时间',
    mulBranch: false
  }
]
/**
 * 组件上下级关系 数组形式
*/
export const nodeItemsMapChildren = {
  peopleFilter: [
    {
      type: 'conditionDetermine',
      label: '条件控制',
      children: [
        { label: 'AB测试', name: 'abTest', component: 'abTest' }
      ]
    },
    {
      type: 'marketAction',
      label: '营销动作',
      children: [
        { label: '优惠券', name: 'coupon', component: 'coupon' },
        { label: '微信模版消息', name: 'wxTemplateMsg', component: 'wxTemplateMsg' },
        { label: '短信', name: 'phoneSms', component: 'phoneSms' },
        { label: '数字短信', name: 'phoneMms', component: 'phoneMms' },
        { label: '邮件', name: 'email', component: 'email' },
        { label: '图文素材', name: 'wxNews', component: 'wxNews' },
        { label: 'APP PUSH', name: 'appPush', component: 'appPush' }
      ]
    }
  ],
  eventSelect: [
    {
      type: 'peopleSetting',
      label: '人群圈定',
      children: [
        { label: '人群选择', name: 'peopleFilter', component: 'peopleFilter' }
      ]
    },
    {
      type: 'conditionDetermine',
      label: '条件控制',
      children: [
        { label: 'AB测试', name: 'abTest', component: 'abTest' }
      ]
    },
    {
      type: 'marketAction',
      label: '营销动作',
      children: [
        { label: '优惠券', name: 'coupon', component: 'coupon' },
        { label: '微信模版消息', name: 'wxTemplateMsg', component: 'wxTemplateMsg' },
        { label: '短信', name: 'phoneSms', component: 'phoneSms' },
        { label: '数字短信', name: 'phoneMms', component: 'phoneMms' },
        { label: '邮件', name: 'email', component: 'email' },
        { label: 'APP PUSH', name: 'appPush', component: 'appPush' }
      ]
    }
  ],
  abTest: [
    {
      type: 'marketAction',
      label: '营销动作',
      children: [
        { label: '优惠券', name: 'coupon', component: 'coupon' },
        { label: '微信模版消息', name: 'wxTemplateMsg', component: 'wxTemplateMsg' },
        { label: '短信', name: 'phoneSms', component: 'phoneSms' },
        { label: '数字短信', name: 'phoneMms', component: 'phoneMms' },
        { label: '邮件', name: 'email', component: 'email' },
        { label: '图文素材', name: 'wxNews', component: 'wxNews' },
        { label: 'APP PUSH', name: 'appPush', component: 'appPush' }
      ]
    }
  ],
  metric: [
    {
      label: '人群圈定',
      type: 'peopleSetting',
      children: [
        {
          icon: '/static/market_icons/2.png',
          component: 'eventSelect',
          name: 'eventSelect',
          label: '事件选择'
        }
      ]
    },
    {
      label: '条件控制',
      type: 'conditionDetermine',
      children: [
        {
          icon: '/static/market_icons/4.png',
          component: 'eventJudge',
          name: 'eventJudge',
          label: '事件判断'
        }
      ]
    },
    {
      label: '流程控制',
      type: 'guideControl',
      children: [
        {
          icon: '/static/market_icons/12.png',
          component: 'delayTime',
          name: 'delayTime',
          label: '等待时间'
        }
      ]
    }
  ],
  eventJudge: [
    {
      type: 'marketAction',
      label: '营销动作',
      children: [
        { label: '优惠券', name: 'coupon', component: 'coupon' },
        { label: '微信模版消息', name: 'wxTemplateMsg', component: 'wxTemplateMsg' },
        { label: '短信', name: 'phoneSms', component: 'phoneSms' },
        { label: '数字短信', name: 'phoneMms', component: 'phoneMms' },
        { label: '邮件', name: 'email', component: 'email' },
        { label: 'APP PUSH', name: 'appPush', component: 'appPush' }
      ]
    }
  ],
  coupon: [
    {
      type: 'conditionDetermine',
      label: '条件控制',
      children: [
        { label: '事件判断', name: 'eventJudge', component: 'eventJudge' }
      ]
    },
    {
      type: 'guideControl',
      label: '流程控制',
      children: [
        { label: '等待时间', name: 'delayTime', component: 'delayTime' }
      ]
    },
    {
      type: 'peopleSetting',
      label: '人群圈定',
      children: [
        { label: '事件选择', name: 'eventSelect', component: 'eventSelect' }
      ]
    },
    {
      type: 'marketAction',
      label: '营销动作',
      children: [
        { label: '微信模版消息', name: 'wxTemplateMsg', component: 'wxTemplateMsg' },
        { label: '短信', name: 'phoneSms', component: 'phoneSms' },
        { label: '数字短信', name: 'phoneMms', component: 'phoneMms' },
        { label: '邮件', name: 'email', component: 'email' },
      ]
    }
  ],
  crossCoupon: [

    {
      type: 'guideControl',
      label: '流程控制',
      children: [
        { label: '等待时间', name: 'delayTime', component: 'delayTime' }
      ]
    },
    {
      type: 'peopleSetting',
      label: '人群圈定',
      children: [
        { label: '事件选择', name: 'eventSelect', component: 'eventSelect' }
      ]
    },
    {
      type: 'marketAction',
      label: '营销动作',
      children: [
        { label: '微信模版消息', name: 'wxTemplateMsg', component: 'wxTemplateMsg' },
        { label: '短信', name: 'phoneSms', component: 'phoneSms' },
        { label: '数字短信', name: 'phoneMms', component: 'phoneMms' },
        { label: '邮件', name: 'email', component: 'email' },
      ]
    }
  ],
  wxTemplateMsg: [
    {
      type: 'conditionDetermine',
      label: '条件控制',
      children: [
        { label: '事件判断', name: 'eventJudge', component: 'eventJudge' }
      ]
    },
    {
      type: 'guideControl',
      label: '流程控制',
      children: [
        { label: '等待时间', name: 'delayTime', component: 'delayTime' }
      ]
    },
    {
      type: 'peopleSetting',
      label: '人群圈定',
      children: [
        { label: '事件选择', name: 'eventSelect', component: 'eventSelect' }
      ]
    }
  ],
  phoneSms: [
    {
      type: 'conditionDetermine',
      label: '条件控制',
      children: [
        { label: '事件判断', name: 'eventJudge', component: 'eventJudge' }
      ]
    },
    {
      type: 'guideControl',
      label: '流程控制',
      children: [
        { label: '等待时间', name: 'delayTime', component: 'delayTime' }
      ]
    },
    {
      type: 'peopleSetting',
      label: '人群圈定',
      children: [
        { label: '事件选择', name: 'eventSelect', component: 'eventSelect' }
      ]
    }
  ],
  phoneMms: [
    {
      type: 'conditionDetermine',
      label: '条件控制',
      children: [
        { label: '事件判断', name: 'eventJudge', component: 'eventJudge' }
      ]
    },
    {
      type: 'guideControl',
      label: '流程控制',
      children: [
        { label: '等待时间', name: 'delayTime', component: 'delayTime' }
      ]
    },
    {
      type: 'peopleSetting',
      label: '人群圈定',
      children: [
        { label: '事件选择', name: 'eventSelect', component: 'eventSelect' }
      ]
    }
  ],
  email: [
    {
      type: 'conditionDetermine',
      label: '条件控制',
      children: [
        { label: '事件判断', name: 'eventJudge', component: 'eventJudge' }
      ]
    },
    {
      type: 'guideControl',
      label: '流程控制',
      children: [
        { label: '等待时间', name: 'delayTime', component: 'delayTime' }
      ]
    },
    {
      type: 'peopleSetting',
      label: '人群圈定',
      children: [
        { label: '事件选择', name: 'eventSelect', component: 'eventSelect' }
      ]
    }
  ],
  wxNews: [
    {
      type: 'conditionDetermine',
      label: '条件控制',
      children: [
        { label: '事件判断', name: 'eventJudge', component: 'eventJudge' }
      ]
    },
    {
      type: 'guideControl',
      label: '流程控制',
      children: [
        { label: '等待时间', name: 'delayTime', component: 'delayTime' }
      ]
    },
    {
      type: 'peopleSetting',
      label: '人群圈定',
      children: [
        { label: '事件选择', name: 'eventSelect', component: 'eventSelect' }
      ]
    }
  ],
  appPush: [
    {
      type: 'conditionDetermine',
      label: '条件控制',
      children: [
        { label: '事件判断', name: 'eventJudge', component: 'eventJudge' }
      ]
    },
    {
      type: 'guideControl',
      label: '流程控制',
      children: [
        { label: '等待时间', name: 'delayTime', component: 'delayTime' }
      ]
    },
    {
      type: 'peopleSetting',
      label: '人群圈定',
      children: [
        { label: '事件选择', name: 'eventSelect', component: 'eventSelect' }
      ]
    }
  ],
  timePicker: [
    {
      type: 'peopleSetting',
      label: '人群圈定',
      children: [
        { label: '人群选择', name: 'peopleFilter', component: 'peopleFilter' }
      ]
    },
    {
      type: 'conditionDetermine',
      label: '条件控制',
      children: [
        { label: 'AB测试', name: 'abTest', component: 'abTest' }
      ]
    },
    {
      type: 'marketAction',
      label: '营销动作',
      children: [
        { label: '优惠券', name: 'coupon', component: 'coupon' },
        // { label: '异业券', name: 'crossCoupon', component: 'crossCoupon' },
        { label: '微信模版消息', name: 'wxTemplateMsg', component: 'wxTemplateMsg' },
        { label: '短信', name: 'phoneSms', component: 'phoneSms' },
        { label: '数字短信', name: 'phoneMms', component: 'phoneMms' },
        { label: '邮件', name: 'email', component: 'email' },
        { label: '图文素材', name: 'wxNews', component: 'wxNews' },
        { label: 'APP PUSH', name: 'appPush', component: 'appPush' }
      ]
    }
  ],
  delayTime: [
    {
      type: 'peopleSetting',
      label: '人群圈定',
      children: [
        { label: '事件选择', name: 'eventSelect', component: 'eventSelect' }
      ]
    },
    {
      type: 'marketAction',
      label: '营销动作',
      children: [
        { label: '优惠券', name: 'coupon', component: 'coupon' },
        // { label: '异业券', name: 'crossCoupon', component: 'crossCoupon' },
        { label: '微信模版消息', name: 'wxTemplateMsg', component: 'wxTemplateMsg' },
        { label: '短信', name: 'phoneSms', component: 'phoneSms' },
        { label: '数字短信', name: 'phoneMms', component: 'phoneMms' },
        { label: '邮件', name: 'email', component: 'email' },
        { label: '图文素材', name: 'wxNews', component: 'wxNews' },
        { label: 'APP PUSH', name: 'appPush', component: 'appPush' }
      ]
    }
  ]
}

export const hideComponentsMap = {
  metric: {
    icon: '/static/market_icons/metric.png',
    component: 'metric',
    name: 'metric',
    label: '考核指标'
  }
}
/**
 * 组件上下级关系 对象映射形式  暂不使用
*/

export const lineStartEndLinkMap = {
  peopleFilter: {
    // marketAction: ['coupon', 'crossCoupon', 'wxTemplateMsg', 'phoneSms', 'wxNews', 'appPush'],
    marketAction: ['wxTemplateMsg', 'phoneSms','phoneMms','email', 'wxNews','coupon','appPush'],
    conditionDetermine: ['abTest'],
    guideControl: ['timePicker']
  },
  eventSelect: {
    peopleSetting: ['peopleFilter'],
    conditionDetermine: ['abTest'],
    // marketAction: ['coupon', 'crossCoupon', 'wxTemplateMsg', 'phoneSms', 'wxNews', 'appPush']
    marketAction: ['wxTemplateMsg', 'phoneSms', 'phoneMms','email', 'wxNews' ,'coupon','appPush']
  },
  abTest: {
    // marketAction: ['coupon', 'crossCoupon', 'wxTemplateMsg', 'phoneSms', 'wxNews', 'appPush']
    marketAction: [ 'wxTemplateMsg', 'phoneSms', 'phoneMms','email', 'wxNews','coupon','appPush']
  },
  eventJudge: {
    // marketAction: ['coupon', 'crossCoupon', 'wxTemplateMsg', 'phoneSms', 'wxNews', 'appPush']
    marketAction: ['wxTemplateMsg', 'phoneSms', 'phoneMms','email', 'wxNews','coupon','appPush' ]
  },
  coupon: {
    marketAction: ['wxTemplateMsg', 'phoneSms','phoneMms','email'],
    conditionDetermine: ['eventJudge'],
    guideControl: ['delayTime']
  },
  crossCoupon: {
    marketAction: ['wxTemplateMsg', 'phoneSms','phoneMms','email',],
    conditionDetermine: ['eventJudge'],
    guideControl: ['delayTime']
  },
  wxTemplateMsg: {
    conditionDetermine: ['eventJudge'],
    guideControl: ['delayTime']
  },
  phoneSms: {
    conditionDetermine: ['eventJudge'],
    guideControl: ['delayTime']
  },
  phoneMms: {
    conditionDetermine: ['eventJudge'],
    guideControl: ['delayTime']
  },
  email: {
    conditionDetermine: ['eventJudge'],
    guideControl: ['delayTime']
  },
  wxNews: {
    conditionDetermine: ['eventJudge'],
    guideControl: ['delayTime']
  },
  appPush: {
    conditionDetermine: ['eventJudge'],
    guideControl: ['delayTime']
  },
  timePicker: {
    conditionDetermine: ['abTest'],
    // marketAction: ['coupon', 'crossCoupon', 'wxTemplateMsg', 'phoneSms', 'wxNews', 'appPush']
    marketAction: [ 'wxTemplateMsg', 'phoneSms', 'phoneMms','email', 'wxNews']
  },
  delayTime: {
    // marketAction: ['coupon', 'crossCoupon', 'wxTemplateMsg', 'phoneSms', 'wxNews', 'appPush']
    marketAction: [ 'coupon', 'wxTemplateMsg', 'phoneSms','phoneMms','email',  'wxNews','appPush']
  }
}

/**
 *  获取某个节点的父节点
 * @param {*} curNodeItem
 * @param {*} plumbNodes
 */
export function getParentNodeData(curNodeItem, plumbNodes) {
  for (var i = 0; i < plumbNodes.length; i++) {
    if (curNodeItem.parentId.indexOf(plumbNodes[i].id) > -1) {
      return plumbNodes[i]
    }
  }
}

// 获取节点数据
export function getNodeData(curNodeName) {
  for (var i = 0; i < nodeItems.length; i++) {
    if (nodeItems[i].name === curNodeName) {
      return nodeItems[i]
    }
  }
  // 没匹配到要检查
  return []
}

// 获取节点级联数据
export function getNodeChildrenData(curNodeName) {
  if (!curNodeName) return []
  if (nodeItemsMapChildren[curNodeName]) {
    // 强制复制，防止被修改
    return JSON.parse(JSON.stringify(nodeItemsMapChildren[curNodeName]))
  }

  // 没匹配到要检查curNodeName, nodeItemsMapChildren 映射关系
  return []
}

// 删除画布节点
export function removePlumbNode(curNodeId, plumbNodes) {
  if (curNodeId) {
    for (var i = 0; i < plumbNodes.length; i++) {
      if (plumbNodes[i].id === curNodeId) {
        plumbNodes.splice(i, 1)
        return
      }
    }
  }
}

// 获取画布子节点的子节点
export function getCurNodeNextNodes(curNodeId, plumbNodes, judgeRemove) {
  var nextNodes = []
  if (curNodeId) {
    for (var i = 0; i < plumbNodes.length; i++) {
      if (judgeRemove === true) {
        if (plumbNodes[i].parentId === curNodeId) {
          nextNodes.push(plumbNodes[i])
        }
      } else {
        if (plumbNodes[i].parentId.indexOf(curNodeId) > -1) {
          nextNodes.push(plumbNodes[i])
        }
      }
    }
  }
  return nextNodes
}

// 通过节点id获取节点数据
export function getNodeInfoByNodeId(curNodeId, plumbNodes) {
  for (var i = 0; i < plumbNodes.length; i++) {
    if (curNodeId === plumbNodes[i].id) {
      return plumbNodes[i]
    }
  }
}

export const nodeGap = {
  x: 200,
  y: 180
}

export function generateNodeItemMap(nodeItems) {
  var nodeItemMap = {}

  for (var i = 0; i < nodeItems.length; i++) {
    nodeItemMap[nodeItems[i].id] = nodeItems[i]
  }
  return nodeItemMap
}

export function getNextChildNodeIds(nodeItem, linkItems) {
  var nextChildNodeIds = []
  for (var i = 0; i < linkItems.length; i++) {
    if (linkItems[i].sourceId === nodeItem.id) {
      nextChildNodeIds.push(linkItems[i].targetId)
    }
  }

  return nextChildNodeIds
}

export function getPreviousEventNodesInfo(curNode, plumbNodes) {
  var previousEventNodes = []
  var eventIdMap = {}
  var idtype_group = []
  var main_idtype_group = []
  var count = 0

  function getParentEventNode(curNode) {
    count++
    if (curNode.parentId) {
      for (var i = 0; i < plumbNodes.length; i++) {
        if (curNode.parentId.indexOf(plumbNodes[i].id) > -1) {
          if (plumbNodes[i].name === 'eventSelect' || plumbNodes[i].name === 'eventJudge') {
            if (!eventIdMap[plumbNodes[i].id]) {
              eventIdMap[plumbNodes[i].id] = plumbNodes[i].id
              previousEventNodes.push(plumbNodes[i])
              if (plumbNodes[i].nodeConf.idMap && plumbNodes[i].nodeConf.idMap.idtype_group) {
                idtype_group = idtype_group.concat(plumbNodes[i].nodeConf.idMap.idtype_group)
                main_idtype_group.push(plumbNodes[i].nodeConf.idMap.main_idtype)
              }
            }
          }
          getParentEventNode(plumbNodes[i])
        }
      }
    }

    if (count > plumbNodes.length) {
      return
    }
  }

  getParentEventNode(curNode)

  return {
    previousEventNodes: previousEventNodes,
    idtype_group: idtype_group,
    main_idtype_group: main_idtype_group
  }
}

export function checkJsplumbNodesExistSameEvent(plumbNodes) {
  var eventMap = { }
  for (var i = 0; i < plumbNodes.length; i++) {
    if (plumbNodes[i].name === 'eventSelect' || plumbNodes[i].name === 'eventJudge') {
      if (!eventMap[plumbNodes[i].nodeConf.eventid]) {
        eventMap[plumbNodes[i].nodeConf.eventid] = []
      }
      eventMap[plumbNodes[i].nodeConf.eventid].push(plumbNodes[i])
    }
  }

  for (var attr in eventMap) {
    if (eventMap[attr].length >= 2) {
      return {
        existSameEvent: true,
        eventMap: eventMap
      }
    }
  }

  return {
    existSameEvent: false,
    eventMap: eventMap
  }
}

export function uniqe(arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  var array = []
  for (var i = 0; i < arr.length; i++) {
    if (!array.includes(arr[i])) { // includes 检测数组是否有某个值
      array.push(arr[i])
    }
  }
  return array
}

export function getGroupIds(groupIdMap, groupIds) {
  groupIds = uniqe(groupIds)

  var arr = []
  groupIds.forEach((item) => {
    if (groupIdMap[item]) {
      arr.push(groupIdMap[item])
    }
  })

  return arr.join(',')
}
