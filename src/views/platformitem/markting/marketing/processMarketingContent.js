export default {
  methods: {
    processMarketingContent(marketingContent) {
      var i, j, k
      if (marketingContent) {
        var nodeItems = marketingContent.nodeItems || []
        for (i = 0; i < nodeItems.length; i++) {
          if (nodeItems[i].component === 'peopleFilter') {
            nodeItems[i].nodeConf = {
              node_desc: nodeItems[i].nodeConf.node_desc
            }
          } else if (nodeItems[i].component === 'eventSelect') {
            /* {
              node_desc: '',
              event_type: '',
              eventid: '',
              branches: [
                branch_name: '',
                id: '',
                branchid:'',
                event: [
                  {
                    column_name: '',
                    column_value: '',
                    column_value_type: 'field',
                    column_value_ext: {}
                  }
                ]
              ]
            } */
            // 分支保留 id  branchid 字段
            var nodeConf = nodeItems[i].nodeConf
            for (j = 0; j < nodeConf.branches.length; j++) {
              // nodeConf.branches[j].branch_name = ''
              var event = nodeConf.branches[j].event
              for (k = 0; k < event.length; k++) {
                event[k].column_value = ''
                event[k].column_value_type = 'field'
                delete event[k].column_value_ext
                event[k].web_value = ''
              }
            }
          } else if (nodeItems[i].component === 'abTest') {
            /**
            {
                node_desc: '',
                end_numb: '',
                end_time: '',
                wait_day: '',
                wait_hour: '',
                end_flow_status: 1,
                actions_ABtest: [
                  {
                    desc: '分支一',
                    percent: ''
                  },
                  {
                    desc: '分支二',
                    percent: ''
                  }
                ]
              }
             */
            nodeItems[i].nodeConf.end_numb = ''
            nodeItems[i].nodeConf.end_time = ''
            nodeItems[i].nodeConf.wait_day = ''
            nodeItems[i].nodeConf.wait_hour = ''
            nodeItems[i].nodeConf.end_flow_status = 1
            var actions_ABtest = nodeItems[i].nodeConf.actions_ABtest
            for (j = 0; j < actions_ABtest.length; j++) {
              // actions_ABtest[j].desc = ''
              actions_ABtest[j].percent = ''
              // 保留字段 id
            }
          } else if (nodeItems[i].component === 'eventJudge') {
            /*
            nodeConf = {
              node_desc: '',
              event_type: '',
              eventid: '',
              action_true_nodeId: this.curComConfig.nodeConf.action_true_nodeId,
              action_false_nodeId: this.curComConfig.nodeConf.action_false_nodeId,
              // ... 事件条件
              filterConditions: [
              ],
              // 执行等待时间
              wait_hour: '',
              wait_minute: ''
            }
            */

            // 保留字段 action_true_nodeId  action_false_nodeId
            nodeItems[i].nodeConf.wait_hour = ''
            nodeItems[i].nodeConf.wait_minute = ''
            nodeItems[i].nodeConf.wait_days = ''
            var filterConditions = nodeItems[i].nodeConf.filterConditions
            for (j = 0; j < filterConditions.length; j++) {
              filterConditions[j].column_value = ''
              filterConditions[j].column_value_type = 'field'
              filterConditions[j].web_value = ''
              delete filterConditions[j].column_value_ext
            }
          } else if (nodeItems[i].component === 'coupon') {
            nodeItems[i].nodeConf = { node_desc: nodeItems[i].nodeConf.node_desc }
          } else if (nodeItems[i].component === 'crossCoupon') {
            nodeItems[i].nodeConf = { node_desc: nodeItems[i].nodeConf.node_desc }
          } else if (nodeItems[i].component === 'wxTemplateMsg') {
            nodeItems[i].nodeConf = {
              node_desc: nodeItems[i].nodeConf.node_desc
            }
          } else if (nodeItems[i].component === 'phoneSms') {
            nodeItems[i].nodeConf = {
              node_desc: nodeItems[i].nodeConf.node_desc
            }
          } else if (nodeItems[i].component === 'wxNews') {
            nodeItems[i].nodeConf = {
              node_desc: nodeItems[i].nodeConf.node_desc
            }
          } else if (nodeItems[i].component === 'appPush') {
            nodeItems[i].nodeConf = {
              node_desc: nodeItems[i].nodeConf.node_desc
            }
          } else if (nodeItems[i].component === 'timePicker') {
            nodeItems[i].nodeConf = {
              node_desc: nodeItems[i].nodeConf.node_desc
            }
          } else if (nodeItems[i].component === 'delayTime') {
            nodeItems[i].nodeConf = {
              node_desc: nodeItems[i].nodeConf.node_desc
            }
          } else if (nodeItems[i].component === 'metric') {
            nodeItems[i].nodeConf = {
              node_desc: nodeItems[i].nodeConf.node_desc
            }
          }
        }
      }
      return JSON.stringify(marketingContent || {})
    }
  }
}
