const sideMarketMenus = [
  {
    label: '人群圈定',
    type: 'peopleSetting',
    children: [
      {
        icon: '/static/market_icons/1.png',
        component: 'peopleFilter',
        name: 'peopleFilter',
        label: '人群选择'
      },
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
        icon: '/static/market_icons/3.png',
        component: 'abTest',
        name: 'abTest',
        label: 'AB测试'
      },
      {
        icon: '/static/market_icons/4.png',
        component: 'eventJudge',
        name: 'eventJudge',
        label: '事件判断'
      }
    ]
  },
  {
    label: '营销动作',
    type: 'marketAction',
    children: [
      {
        icon: '/static/market_icons/5.png',
        component: 'coupon',
        name: 'coupon',
        label: '优惠券'
      },
      {
        icon: '/static/market_icons/6.png',
        component: 'crossCoupon',
        name: 'crossCoupon',
        label: '异业券'
      },
      {
        icon: '/static/market_icons/7.png',
        component: 'wxTemplateMsg',
        name: 'wxTemplateMsg',
        label: '微信模版消息'
      },
      {
        icon: '/static/market_icons/8.png',
        component: 'phoneSms',
        name: 'phoneSms',
        label: '短信'
      },
      {
        icon: '/static/market_icons/mms.png',
        component: 'phoneMms',
        name: 'phoneMms',
        label: '数字短信'
      },
      {
        icon: '/static/market_icons/email.png',
        component: 'email',
        name: 'email',
        label: '邮件'
      },
      {
        icon: '/static/market_icons/9.png',
        component: 'wxNews',
        name: 'wxNews',
        label: '图文素材'
      },
      {
        icon: '/static/market_icons/10.png',
        component: 'appPush',
        name: 'appPush',
        label: 'APP PUSH'
      }
    ]
  },
  {
    label: '流程控制',
    type: 'guideControl',
    children: [
      {
        icon: '/static/market_icons/11.png',
        component: 'timePicker',
        name: 'timePicker',
        label: '时间选择'
      },
      {
        icon: '/static/market_icons/12.png',
        component: 'delayTime',
        name: 'delayTime',
        label: '等待时间'
      }
    ]
  }
]

export const componentIconMap = {
  peopleFilter: '/static/market_icons/1.png',
  eventSelect: '/static/market_icons/2.png',
  abTest: '/static/market_icons/3.png',
  eventJudge: '/static/market_icons/4.png',
  coupon: '/static/market_icons/5.png',
  crossCoupon: '/static/market_icons/6.png',
  wxTemplateMsg: '/static/market_icons/7.png',
  phoneSms: '/static/market_icons/8.png',
  phoneMms: '/static/market_icons/mms.png',
  email: '/static/market_icons/email.png',
  wxNews: '/static/market_icons/9.png',
  appPush: '/static/market_icons/10.png',
  timePicker: '/static/market_icons/11.png',
  delayTime: '/static/market_icons/12.png'
}

const sideMenuMap = {
  sideMarketMenus: sideMarketMenus
}

const connectorPaintStyle = {
  strokeWidth: 2,
  stroke: '#61B7CF',
  joinstyle: 'round',
  // 鼠标移上链接线上时的外部轮廓
  outlineStroke: 'white',
  outlineWidth: 2
}
// .. and this is the hover style.
const connectorHoverStyle = {
  strokeWidth: 3,
  stroke: '#216477',
  outlineWidth: 5,
  outlineStroke: 'white'
}

const endpointHoverStyle = {
  fill: '#216477',
  stroke: '#216477'
}

export const flowConfig = {
  // jsPlumb Instance Config
  jsPlumbInsConfig: {
    // default drag options
    DragOptions: { cursor: 'pointer', zIndex: 2000 },
    // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
    // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
    ConnectionOverlays: [
      ['Arrow', {
        location: 1,
        visible: true,
        width: 10,
        length: 10,
        id: 'ARROW'
      }]
    ],
    Container: 'canvas'
  },
  jsPlumbConfig: {
    conn: {
      isDetachable: false
    }
  }
}

// the definition of source endpoints (the small blue ones)
export const sourceEndpoint = {
  endpoint: 'Dot',
  paintStyle: {
    stroke: '#7AB02C',
    fill: 'transparent',
    radius: 4,
    strokeWidth: 1
  },
  maxConnections: -1,
  isSource: true,
  connector: ['Flowchart', { gap: 10, cornerRadius: 1 }],
  connectorStyle: connectorPaintStyle,
  hoverPaintStyle: endpointHoverStyle,
  connectorHoverStyle: connectorHoverStyle,
  dragOptions: {},
  overlays: [
    ['Label', {
      location: [0.5, 1.5],
      label: 'Drag',
      cssClass: 'endpointSourceLabel',
      visible: false
    }]
  ]
}

// the definition of target endpoints (will appear when the user drags a connection)
export const targetEndpoint = {
  endpoint: 'Dot',
  paintStyle: { fill: '#7AB02C', radius: 4 },
  hoverPaintStyle: endpointHoverStyle,
  maxConnections: -1,
  dropOptions: { hoverClass: 'hover', activeClass: 'active' },
  isTarget: true,
  overlays: [
    ['Label', { location: [0.5, -0.5], label: 'Drop', cssClass: 'endpointTargetLabel', visible: false }]
  ]
}

export default sideMenuMap
