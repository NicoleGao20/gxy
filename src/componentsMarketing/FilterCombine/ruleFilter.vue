<template>
  <div class="filter-group-wrap">
    <el-form ref="filterForm" :model="filterJson">
      <div class="and-or-wrap" style="border: 1px solid #edeef4;">
        <div class="head clearfix">
          <span class="pull-left">筛选条件</span><span v-if="!hiddenPeopleCounts" class="pull-right">总人数<span v-show="sqlRunning" class="el-icon-loading"/>{{ peopleCounts }}人</span>
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
                  <span v-if="!onlyRead" class="add-group-item" @click="addGroupItem(groupItem.data)"><i style="position:relative; top: 2px;margin-right: 4px; color:green;" class="el-icon el-icon-circle-plus-outline" />添加</span>
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
      <div class="and-or-wrap" style="border: 1px solid #edeef4; margin-top: 20px;" v-if="!hiddenRemoveBox">
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
    </el-form>
  </div>
</template>
<script>
import InlineSwitch from './inline-switch'
import FilterComponentWrap from './filterComponentWrap'
import './coms'
import { getToken } from '@/utils/auth'
import Cookies from 'js-cookie'
export default {
  name: 'RuleFilter',
  components: {
    InlineSwitch,
    FilterComponentWrap
  },
  props: {
    ruleValue: {
      type: Object,
      default() {
        return {}
      }
    },
    applicationType: {
      type: String,
      default() {
        return 'group'
      }
    },
    filter_target: {
      type: String,
      default() {
        return 'aid'
      }
    },
    hiddenPeopleCounts: {
      type: Boolean,
      default: false
    },
    onlyRead: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: null
    },
    hiddenRemoveBox:{
      type:Boolean,
      default: false
    }
  },
  provide() {
    return {
      filterCombine: this
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
      brandCode: getToken('brandCode'),
      peopleCounts: '',
      filterJson: {
        join: join,
        fork: fork
      },
      ruleObjMap: {
        rule_openid: {
          application_type: 'rule_openid',
          filter_target: this.filter_target
        },
        group: {
          application_type: 'group',
          filter_target: this.filter_target
        },
        complex_group: {
          application_type: 'complex_group',
          filter_target: this.filter_target
        },
        complex_advanced_group: {
          application_type: 'complex_advanced_group',
          filter_target: this.filter_target
        }
      },
      cascaderItems: [],
      loadedCascaderItems: false,
      sqlRunning: false
    }
  },
  watch: {
    ruleValue(newValue) {
      if (newValue && newValue.join) {
        this.filterJson.join = newValue.join
        this.filterJson.fork = newValue.fork
      }
    }
  },
  mounted() {
    this.$request2({
      url: '/group/filter/getLabelList',
      method: 'get',
      params: {
        application_type: this.applicationType,
        brand_code: this.brandCode
      }
    }).then((res) => {
      this.cascaderItems = res.data.list
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
      var i
      var conditionCount = 0
      var joinGroups = this.filterJson.join.data
      var forkGroups = this.filterJson.fork.data
      for (i = 0; i < joinGroups.length; i++) {
        conditionCount += joinGroups[i].data.length
      }
      for (i = 0; i < forkGroups.length; i++) {
        conditionCount += forkGroups[i].data.length
      }

      if (conditionCount >= 10) {
        this.$message({
          type: 'warning',
          message: '筛选器所有条件和不能大于10个'
        })
      } else {
        groupItem.push({ webKey: this.getUuid(), type: '' })
      }
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
    validateJoinAndFork() {
      return new Promise((resolve, reject) => {
        // join fork 同时不存在时也可以认为通过，会员洞察人群选择中
        if (!this.filterJson.join.data.length) {
          if (!this.filterJson.fork.data.length) {
            this.$refs['filterForm'].validate((valid, invalidFields) => {
              if (!valid) {
                reject()
              } else {
                resolve()
              }
            })
          } else {
            this.$message({
              type: 'error', message: '筛选器不能单独存在去除条件'
            })
          }
        } else {
          for (var i = 0; i < this.filterJson.join.data.length; i++) {
            if (!this.filterJson.join.data[i].data.length) {
              reject()
              this.$message({ type: 'error', message: '请添加筛选条件 ' })
              return
            }
          }

          for (var j = 0; j < this.filterJson.fork.data.length; j++) {
            if (!this.filterJson.fork.data[j].data.length) {
              reject()
              this.$message({ type: 'error', message: '请添加去除条件 ' })
              return
            }
          }

          this.$refs['filterForm'].validate((valid, invalidFields) => {
            if (!valid) {
              reject()
            } else {
              resolve()
            }
          })
        }
      })
    },
    validateRuleValue() {
      return new Promise((resolve, reject) => {
        if (!this.filterJson.join.data.length) {
          this.$message({ type: 'error', message: '请添加筛选条件 ' })
          reject()
          return
        }

        for (var i = 0; i < this.filterJson.join.data.length; i++) {
          if (!this.filterJson.join.data[i].data.length) {
            reject()
            this.$message({ type: 'error', message: '请添加筛选条件 ' })
            return
          }
        }

        for (var j = 0; j < this.filterJson.fork.data.length; j++) {
          if (!this.filterJson.fork.data[j].data.length) {
            reject()
            this.$message({ type: 'error', message: '请添加去除条件 ' })
            return
          }
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
      if (this.sqlRunning) return
      this.peopleCounts = ''
      this.validateRuleValue().then(() => {
        this.sqlRunning = true
        var params = {
          json_sql: this.getFilterJson(),
          brand_code:Cookies.get('brandCode')
        }

        if (this.id) {
          params.json_sql.id = this.id
        }
      //  const url='mocks'
       const url=''
      //  mocks
        this.$request2({
          url: url+'/group/filter/getCounts',
          method: 'post',
          data: params
        }).then((res) => {
          if (res.bizCode === 20000 || res.bizCode === '20000') {
            if (res.data) {
              this.$message({
                showClose: true,
                type: 'success',
                message: '计算人数执行成功'
              })
              this.sqlRunning = false
              this.peopleCounts = res.data.counts
            } else {
              this.sqlRunning = false
              this.$message({
                showClose: true,
                type: 'success',
                message: '计算人数执行失败'
              })
            }
          }
        }).catch(() => {
          this.sqlRunning = false
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
  color: #1550c7;
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
.filter-group-wrap .el-button--default, .filter-group-wrap .el-button--primary {
  width: auto;
}
</style>
