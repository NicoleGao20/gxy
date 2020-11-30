<template>
  <div class="filter-group-wrap">
    <el-form ref="filterForm" :model="filterJson" v-if="loadedCascaderItems">
      <div class="and-or-wrap" style="border: 1px solid #edeef4;">
        <div class="head clearfix">
          <span class="pull-left">筛选条件</span><span v-if="!hiddenPeopleCounts" class="pull-right">总人数{{peopleCounts}}人</span>
        </div>
        <div class="body">
          <div style="text-align: left;">
            <el-button v-if="!onlyRead" type="primary" plain icon="el-icon-circle-plus-outline" @click="addGroup(filterJson.join.data)">
              添加条件组
            </el-button>
          </div>
          <div class="group-item">
            <div v-if="filterJson.join.data.length>=2" class="group-left">
              <inline-switch v-model="filterJson.join.type" :disabled="onlyRead" inactive-text="且" active-text="或" active-value="intersect" inactive-value="union" active-color="#67C23A"/>
            </div>
            <div class="group-right">
              <div v-for="(groupItem, index) in filterJson.join.data" :key="index" class="group-item-wrap" >
                <div class="action-head">
                  <span v-if="!onlyRead"  class="add-group-item" @click="addGroupItem(groupItem.data)"><i style="position:relative; top: 2px;margin-right: 4px;" class="el-icon el-icon-circle-plus-outline" />添加</span>
                  <span v-if="!onlyRead" class="action-remove-group-item el-icon-close" @click="removeGroupItem(filterJson.join.data, index)"/>
                </div>
                <div class="group-item">
                  <div v-if="groupItem.data.length>1" class="group-left">
                    <inline-switch v-model="groupItem.type" :disabled="onlyRead" inactive-text="且" active-text="或" active-value="intersect" inactive-value="union" active-color="#67C23A"/>
                  </div>
                  <div class="group-right">
                    <div v-for="(specItem, specItemIndex) in groupItem.data" :key="specItemIndex" class="spec-item-wrap">
                      <div class="spec-item">
                        <filter-component-wrap :key="specItem.webKey" :prefix-prop="'join.data.'+index+'.data.'+specItemIndex" :spec-item.sync="groupItem.data[specItemIndex]" :type="applicationType"/>
                        <span v-if="!onlyRead" class="action-remove-group-item el-icon-close inner" @click="removeGroupItem(groupItem.data, specItemIndex)"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="and-or-wrap" style="border: 1px solid #edeef4; margin-top: 20px;">
        <div class="head">
          去除以下条件
        </div>
        <div class="body">
          <div style="text-align: left;">
            <el-button v-if="!onlyRead" type="primary" plain icon="el-icon-circle-plus-outline" @click="addGroup(filterJson.fork.data)">
              添加条件组
            </el-button>
          </div>
          <div class="group-item">
            <div v-if="filterJson.fork.data.length>=2" class="group-left">
              <inline-switch v-model="filterJson.fork.type" :disabled="onlyRead" inactive-text="且" active-text="或" active-value="intersect" inactive-value="union" active-color="#67C23A"/>
            </div>
            <div class="group-right">
                <div v-for="(groupItem, index) in filterJson.fork.data" :key="index" class="group-item-wrap" >
                  <div class="action-head">
                    <span v-if="!onlyRead" class="add-group-item" @click="addGroupItem(groupItem.data)"><i style="position:relative; top: 2px;margin-right: 4px;color:green;" class="el-icon el-icon-circle-plus-outline" />添加</span>
                    <span v-if="!onlyRead" class="action-remove-group-item el-icon-close" @click="removeGroupItem(filterJson.fork.data, index)"/>
                  </div>
                  <div class="group-item">
                    <div v-if="groupItem.data.length>1" class="group-left">
                      <inline-switch v-model="groupItem.type" :disabled="onlyRead" inactive-text="且" active-text="或" active-value="intersect" inactive-value="union" active-color="#67C23A"/>
                    </div>
                    <div class="group-right">
                      <div v-for="(specItem, specItemIndex) in groupItem.data" :key="specItemIndex" class="spec-item-wrap">
                        <div class="spec-item">
                          <filter-component-wrap :key="specItem.webKey" :prefix-prop="'fork.data.'+index+'.data.'+specItemIndex" :spec-item.sync="groupItem.data[specItemIndex]" :type="applicationType"/>
                          <span  v-if="!onlyRead" class="action-remove-group-item el-icon-close inner" @click="removeGroupItem(groupItem.data, specItemIndex)"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import InlineSwitch from './inline-switch'
import FilterComponentWrap from './filterComponentWrap'
import './coms'

export default {
  name: 'RuleFilter',
  components: {
    InlineSwitch,
    FilterComponentWrap
  },
  props: {
    brand_code: {
      type: String,
      default() {
        return ''
      }
    },
    ruleValue: {
      type: Object,
      default() {
        return {}
      }
    },
    applicationType: {
      type: String,
      default() {
        return 'rule_label'
      }
    },
    hiddenPeopleCounts: {
      type: Boolean,
      default: false
    },
    onlyRead: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      filterCombine: this
    }
  },
  watch: {
    ruleValue(newValue) {
      if(newValue && newValue.join) {
        this.filterJson.join = newValue.join
        this.filterJson.fork = newValue.fork
      }
    }
  },
  data() {
    var join = {
      type: 'intersect',
      level: 1,
      data: []
    }
    var fork = {
      type: 'intersect',
      level: 1,
      data: []
    }

    if (this.ruleValue) {
      if (this.ruleValue.application_type) {
        var ruleValue = JSON.parse(JSON.stringify(this.ruleValue))
        join = ruleValue.join
        fork = ruleValue.fork
      }
    }

    return {
      peopleCounts: '0',
      filterJson: {
        join: join,
        fork: fork,
      },
      sqlStr: '',
      ruleObjMap: {
        rule_label: {
          application_type: 'rule_label',
          filter_target: 'member_id'
        },
        // ...
        complex_label: {
          application_type: 'complex_label',
          filter_target: 'member_id'
        }
      },
      cascaderItems: [],
      loadedCascaderItems: false
    }
  },
  mounted() {
    var params = {
      application_type: this.applicationType
    }
    if(this.brand_code) {
      params.brand_code = this.brand_code
    }

    this.$request({
      url: '/filterView/getLabelList',
      method: 'get',
      params: params
    }).then((res) => {
      this.cascaderItems = res.data.list
      this.loadedCascaderItems = true
    })
  },
  methods: {
    addGroup(arr) {
      arr.push({
        type: 'intersect', // 且
        level: 2,
        data: []
      })
    },
    addGroupItem(groupItem) {
      groupItem.push({webKey: this.getUuid(), type: ''})
    },
    removeGroupItem(groupItems, index) {
      groupItems.splice(index, 1)
    },
    getFilterJson() {
      // ... 表单校验
      var ruleObj = Object.assign({}, this.ruleObjMap[this.applicationType])

      ruleObj.join = this.filterJson.join
      ruleObj.fork = this.filterJson.fork
      
      return ruleObj
    },
    validateRuleValue() {
      return new Promise((resolve, reject) => {
        if (!this.filterJson.join.data.length) {
          this.$message({ type: 'error', message: '请填写筛选条件 ' })
          reject()
          return
        }

        if(!this.filterJson.join.data[0].data.length) {
          reject()
          this.$message({ type: 'error', message: '请填写筛选条件 ' })
          return;
        }

        this.$refs['filterForm'].validate((valid, invalidFields) => {
          if (!valid) {
            reject()
          } else {
            resolve()
          }
        })
      })
    },
    clearCondtions() {
      this.filterJson.join.data = []
      this.filterJson.fork.data = []
    },
    runFilterCombineSql() {
      this.validateRuleValue().then(() => {
        var json_sql = this.getFilterJson()
        if(this.brand_code) {
          json_sql.params = {
            "brand_code": this.brand_code
          }
        }
        
        this.$request({
          url: '/filterView/getCounts',
          method: 'post',
          data: {
            json_sql: json_sql
          }
        }).then((res) => {
          if(res.bizCode === 20000 || res.bizCode === '20000') {
            if(res.data) { 
              this.$message({
                showClose: true,
                type: 'success',
                message: '计算人数执行成功'
              })
              this.peopleCounts = res.data.counts
            } else {
              this.$message({
                showClose: true,
                type: 'error',
                message: '计算人数执行失败'
              })
            }
          }
        })
      })
    },
    getUuid: function() {
      const s = []
      const hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
      s[8] = s[13] = s[18] = s[23] = '-'

      const uuid = s.join('')
      return uuid.replace(/-/g, '')
    }
  }
}
</script>

<style>

.filter-group-wrap .head {
  height: 40px;
  line-height: 40px;
  background: #e4e9f1;
  padding-left: 20px;
  padding-right: 20px;
}
.filter-group-wrap .body {
  padding: 10px;
}
.group-item {
  margin-top: 10px;
  display: flex;
}
.group-left {
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.group-left::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  background: #c0ffa1;
  height: 100%;
}
.group-right {
  flex: 1;
}
.group-item-wrap {
  border: 1px solid #edeef4;
  padding: 10px;
}
.group-right .group-item-wrap:not(:last-child) {
  margin-bottom: 10px;
}
.action-head {
  position: relative;
}
.action-remove-group-item {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #aaaaaa;
  font-size: 20px;
}
.action-remove-group-item:hover {
  color: #666;
}

.spec-item {
  position: relative;
  padding-right: 50px;
  margin-bottom: 15px;
}
.action-remove-group-item.inner {
  right: 25px;
  cursor: pointer;
}
.filter-group-wrap .el-icon::before {
  font-size: 16px;
}
.filter-group-wrap .el-icon {
  font-size: 14px;
}
.add-group-item {
  cursor: pointer;
}
.spec-item-wrap:not(:last-child) {
  margin-bottom: 15px;
}
.spec-item-wrap .el-form-item {
  margin-bottom: 0;
}
</style>
