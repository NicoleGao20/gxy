<template>
  <div>
    <el-form v-if="templateMode === 'form'" ref="form" :model="form" label-width="110px" class="template-detail">
      <template v-for="item in list">
        <template-item v-if="!item.isBefore" :key="`${item.valueParamKey}${item.template_id}`" :item-info.sync="item" :is-before="item.isBefore" v-bind="$attrs"/>
        <template-item v-else :key="`${item.valueParamKey}${item.template_id}`" :item-info.sync="item" :before-info.sync="item.before" :is-before="item.isBefore" v-bind="$attrs"/>
      </template>
    </el-form>
    <div v-if="templateMode === 'mobile'">
      <div class="phone-template-container">
        <template v-for="item in list">
          <div v-if="item.isBefore" :key="`${item.valueParamKey}${item.template_id}`"><span :style="{color: item.color}" class="param-value">{{ item | generateBeforeValue }}</span><span class="ml10">{{ `${item.labelName}：` }}</span><span :style="{color: item.color}" class="param-value">{{ item | generateItemValue }}</span></div>
          <div v-else :key="`${item.valueParamKey}${item.template_id}`"><span>{{ `${item.labelName}：` }}</span><span :style="{color: item.color}" class="param-value">{{ item | generateItemValue }}</span></div>
        </template>
        <el-divider/>
        <div class="template-footer"><span>详情</span> <span> > </span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryParam } from '@/api/markting/SMSFunction'
import templateItem from '../components/templateItem'
import Cookies from 'js-cookie'
import { getParamKey, convertValueToName, convertNameToValue } from '../utils'
export default {
  name: 'Index',
  components: { templateItem },
  provide() {
    return {
      tempIndex: this
    }
  },
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
    fatherForm: {
      type: Object,
      default: function() {
        return {}
      }
    },
    list: {
      type: Array,
      default: function() {
        return []
      }
    },
    template: {
      type: Object,
      default: function() {
        return {}
      }
    },
    templateMode: {
      type: String,
      default: 'form'
    }
  },
  data() {
    return {
      form: {},
      convertedTemplate: {},
      paramList: [],
      paramsOptions: [],
      isFetchData: false
    }
  },
  watch: {
    template: {
      handler: function(newVal) {
        if (newVal && newVal.content) {
          if (!this.isFetchData) {
            this.getParamsList().then(res => {
              if (res) {
                this.convertTemplate(newVal)
              }
            })
          } else {
            this.convertTemplate(newVal)
          }
        }
      },
      deep: true
    },
    list: {
      handler: function(newVal) {
        this.$emit('update:list', newVal)
      },
      deep: true
    }
  },
  created() {
    this.getParamsList()
  },
  methods: {

    convertTemplate(template) {
      const content = template.content
      const template_id = template.template_id
      const templateName = template.title
      const brandCode = Cookies.get('brandCode')
      const _template = {
        id: template_id,
        brandCode: brandCode,
        templateName: templateName,
        templateContent: template.content
      }
      let templateEditBeanList = []
      this.$emit('update:list', [])
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
        templateEditBeanList.push({ template_id, ...item, valueParamValue: '', color: '#606266' })
      })
      if (!this.isNew && this.fatherForm.send_content) {
        templateEditBeanList = this.addValueParamValueAndColor(templateEditBeanList)
      }
      _template.templateEditBeanList = templateEditBeanList
      this.convertedTemplate = _template
      console.log('template edit bean list', templateEditBeanList)
      this.$emit('update:list', templateEditBeanList)
    },
    generateTemplateStr() {
      const _content = {}
      this.list.map(x => {
        if (x.isBefore) {
          _content[x.before.valueParamKey] = { color: x.color, value: convertNameToValue(x.before.valueParamValue, this.paramList) }
        }
        _content[x.valueParamKey] = { color: x.color, value: convertNameToValue(x.valueParamValue, this.paramList) }
      })
      return JSON.stringify(_content).replace(/"/g, '\\"')
    },
    generateTemplateEditBeanValueList() {
      const templateEditBeanValueList = JSON.parse(JSON.stringify(this.list))
      templateEditBeanValueList.forEach(
        x => {
          if (x.isBefore) {
            x.before.valueParamValue = convertNameToValue(x.before.valueParamValue, this.paramList)
          }
          x.valueParamValue = convertNameToValue(x.valueParamValue, this.paramList)
        }
      )
      return templateEditBeanValueList
    },

    getParamsList() {
      if (!this.isFetchData) {
        return new Promise(resolve => {
          queryParam().then(({ data }) => {
            data.list = data.list.filter(x => x.code !== 'tao_short_chain')
            let eventList = []
            const buyerList = []
            data.list.forEach(item => {
              eventList.push(item.event_type)
              if (buyerList.indexOf(item.buyer_type) === -1) {
                buyerList.push(item.buyer_type)
                this.paramList.push({
                  paramKey: `{${item.buyer_type}}`,
                  code: `\{{${item.code}}}`
                })
              }
            })
            eventList = [...new Set(eventList)]
            this.paramsOptions = eventList.map(val => {
              return {
                label: val,
                children: data.list.filter(item => {
                  return item.event_type === val
                }).map(item => {
                  return {
                    label: item.buyer_type,
                    value: `{${item.buyer_type}}`,
                    code: `\{{${item.code}}}`
                  }
                })
              }
            })
            resolve(true)
            this.isFetchData = true
          })
        })
      }
    },
    addValueParamValueAndColor(list) {
      const templateFormData = JSON.parse(this.fatherForm.send_content.replace(/\\"/g, '"'))
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
.ml10{
  margin-left: 10px;
}
.template-detail {
  padding: 15px 15px 15px 0;
  background: rgb(244, 246, 250);
  border: 1px solid rgb(216, 220, 230);
}

.phone-template-container {
  background-color: #fff;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  margin: 20px 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
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
