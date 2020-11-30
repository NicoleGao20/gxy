<template>
  <div class="event-branch" style="position: relative;">
    <el-input v-model="branchItem.branch_name" :disabled="onlyRead" placeholder="请输入名称">
      <template slot="append">
        <el-button icon="el-icon-arrow-down" @click="showCollapse=!showCollapse"/>
      </template>
    </el-input>

    <el-collapse-transition>
      <div v-show="showCollapse">
        <div style="height: 15px;"/>
        <div v-for="(conditionItem, index) in branchConditions" :key="index">
          <component v-if="conditionItem.component_type && hasRegistComponent(conditionItem.component_type)" :is="conditionItem.component_type" :key="uuid" :conf="conditionItem" :spec-item="branchItem.event[index]" :only-read="onlyRead" @validateError="validateErrorHandler"/>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>

import dateComponent from '../eventFieldComs/dateComponent'
import judgeValueComponent from '../eventFieldComs/judgeValueComponent'
import enumComponent from '../eventFieldComs/enumComponent'
import wechatMenuComponent from '../eventFieldComs/wechatMenuComponent'
import inputComponent from '../eventFieldComs/inputComponent'
import enumSelectComponent from '../eventFieldComs/enumSelectComponent'
import chooseCity from '../eventFieldComs/chooseCity'
import chooseStore from '../eventFieldComs/chooseStore'
import chooseBrandMemberLevel from '../eventFieldComs/chooseBrandMemberLevel'
import chooseOrganLevel from '../eventFieldComs/chooseOrganLevel'

export default {
  name: 'EventBranch',
  components: {
    dateComponent,
    judgeValueComponent,
    enumComponent,
    wechatMenuComponent,
    inputComponent,
    enumSelectComponent,
    chooseCity,
    chooseStore,
    chooseBrandMemberLevel,
    chooseOrganLevel
  },
  props: {
    branchItem: {
      type: Object,
      default() {
        return {}
      }
    },
    branchConditions: {
      type: Array,
      default() {
        return {}
      }
    },
    branchIndex: {
      type: Number,
      default() {
        return 0
      }
    },
    onlyRead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showCollapse: false,
      uuid: this.getUuid()
    }
  },
  methods: {
    validateErrorHandler() {
      this.showCollapse = true
    },
    hasRegistComponent(componentType) {
      var newComponentType = componentType.replace(/(\w)(\w+)/, function() {
        return arguments[1].toLowerCase() + '' + arguments[2]
      })

      if (this.$options.components[newComponentType] || this.$options.components[componentType]) {
        return true
      } else {
        console.log(`component is not exist ${componentType}`)
        return false
      }
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
.event-branch .el-popover {
  width: 100%;
}
</style>
