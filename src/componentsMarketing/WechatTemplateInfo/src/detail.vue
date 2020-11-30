<template>
  <div class="phone-template-container">
    <template v-for="item in templateEditBeanList">
      <div v-if="item.isBefore" :key="`${item.valueParamKey}${item.template_id}`" :style="{color: item.color}"><span class="param-value">{{ item | generateBeforeValue }}</span><span class="ml10">{{ `${item.labelName}：` }}</span><span class="param-value">{{ item | generateItemValue }}</span></div>
      <div v-else :key="`${item.valueParamKey}${item.template_id}`" :style="{color: item.color}"><span>{{ `${item.labelName}：` }}</span><span class="param-value">{{ item | generateItemValue }}</span></div>
    </template>
    <!--    <el-divider/>-->
    <!--    <div class="template-footer"><span>详情</span> <span> > </span></div>-->
  </div>
</template>

<script>
import { convertValueToName, getParamKey } from '../utils'

export default {
  name: 'Detail',
  filters: {
    generateBeforeValue(item) {
      if (item.isBefore && item.before) {
        if (item.before.valueParamValue) return item.before.valueParamValue
        else return item.before.placeholder
      } else return ''
    },
    generateItemValue(item) {
      if (item.valueParamValue) return item.valueParamValue
      else return item.placeholder
    }
  },
  props: {
    template: {
      type: Object,
      default: function() {
        return {}
      }
    },
    send_content: {
      type: String,
      default: ''
    },
    paramList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      convertedTemplate: {},
      templateEditBeanList: []
    }
  },
  mounted() {
    this.convertTemplate(this.template)
  },
  methods: {
    convertTemplate(template) {
      const content = template.content
      let templateEditBeanList = []
      const contentArr = content.split('\n').filter(x => !!x)
      contentArr.map(key => {
        key = key.trim().replace(/：/g, ':')
        let item = {}
        if (key === '{{first.DATA}}') {
          item = {
            labelName: 'first',
            valueParamKey: 'first',
            placeholder: '{{first.DATA}}',
            isBefore: false
          }
        } else if (key === '{{remark.DATA}}') {
          item = {
            labelName: 'remark',
            valueParamKey: 'remark',
            placeholder: '{{remark.DATA}}',
            isBefore: false
          }
        } else if (key.includes(':')) {
          const _arr = key.split(':')
          _arr.forEach((x, i) => { _arr[i] = x.trim() })
          if (_arr && _arr.length === 2) {
            if (_arr[0].startsWith('{{')) {
              const label = _arr[0].substring(_arr[0].lastIndexOf('}') + 1, _arr[0].length)
              const before = _arr[0].substring(0, _arr[0].lastIndexOf('}') + 1)
              const itemBefore = {
                labelName: getParamKey(before),
                valueParamKey: getParamKey(before),
                valueParamValue: '',
                placeholder: before,
                isBefore: false,
                before: getParamKey(_arr[1])
              }
              item = {
                labelName: label,
                valueParamKey: getParamKey(_arr[1]),
                isBefore: true,
                placeholder: _arr[1],
                before: itemBefore
              }
            } else {
              item = {
                labelName: _arr[0],
                valueParamKey: getParamKey(_arr[1]),
                placeholder: _arr[1],
                isBefore: false
              }
            }
          }
        } else {
          item = {
            labelName: getParamKey(key),
            valueParamKey: getParamKey(key),
            placeholder: key,
            isBefore: false
          }
        }
        templateEditBeanList.push({ ...item, valueParamValue: '', color: '#606266' })
      })
      if (this.send_content) {
        templateEditBeanList = this.addValueParamValueAndColor(templateEditBeanList)
      }
      this.templateEditBeanList = templateEditBeanList
    },
    addValueParamValueAndColor(list) {
      const templateFormData = JSON.parse(this.send_content.replace(/\\"/g, '"'))
      list.forEach(x => {
        if (templateFormData[x.valueParamKey]) {
          x.valueParamValue = convertValueToName(templateFormData[x.valueParamKey].value, this.paramList)
          x.color = templateFormData[x.valueParamKey].color
          if (x.isBefore && x.before) {
            x.before.valueParamValue = convertValueToName(templateFormData[x.before.valueParamKey].value, this.paramList)
            x.color = templateFormData[x.valueParamKey].color
          }
        }
      })
      return list
    }
  }
}
</script>

<style lang="less" scoped>
.phone-template-container {
  background-color: #fff;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgb(220, 223, 230);
  border-radius: 2px;
  line-height: 2;

  span {
    display: inline-block;
  }

  /deep/ .el-divider--horizontal {
    margin: 0;
  }

  .template-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .param-value {
    word-break: break-word;
  }
}
</style>
