<template>
  <div :class="{'closedScreen':!showScreen}" class="screen">
    <div class="input-parent">
      <template>
        <el-form ref="ruleForm" :model="screenValue" size="small">
          <el-collapse-transition>
            <div v-show="showScreen">
              <el-row :gutter="20">
                <template v-for="item in screenList">
                  <el-col 
                  v-if="item.type=='diyInputRange'"
                  :sm="12"
                  :lg="6"
                  :xl="4" 
                  :key="item.key">
                    <el-form-item :prop="item.key">
                      <div  class="demonstration">&nbsp;</div>
                      <div style="width:40%;float:left">
                        <el-select v-model="screenValue.diyInputRangeType" placeholder="请选择">
                        <el-option
                          v-for="selectItem in item.option"
                          :key="selectItem.value"
                          :label="selectItem.label"
                          :value="selectItem.val">
                        </el-option>
                      </el-select>
                      
                      </div>
                      <input-range style="width:58%;float:right" v-model="screenValue[item.key]" size="large" />
                    </el-form-item>
                  </el-col>
                  <el-col v-if="item.type=='dateRange'" :sm="12" :lg="12" :xl="8" :key="item.key">
                    <el-form-item :prop="item.key">
                      <div class="demonstration">{{ item.label }}</div>
                      <el-date-picker
                        :editable="editable"
                        v-model="screenValue[item.key]"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-if="item.type=='dateRangeOptions'"
                    :sm="12"
                    :lg="12"
                    :xl="8"
                    :key="item.key"
                  >
                    <el-form-item :prop="item.key">
                      <div class="demonstration">{{ item.label }}</div>
                      <el-date-picker
                        :editable="editable"
                        v-model="screenValue[item.key]"
                        :default-time="['00:00:00','24:00:00']"
                        :picker-options="pickerOptions"
                        type="datetimerange"
                        unlink-panels
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col v-else-if="item.type=='text'" :sm="12" :lg="6" :xl="4" :key="item.key">
                    <el-form-item :prop="item.key">
                      <div class="demonstration">{{ item.label }}</div>
                      <el-input
                        v-model="screenValue[item.key]"
                        :placeholder="item.placeholder"
                        clearable
                        @keyup.enter.native="activeSelect"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-else-if="item.type=='hidden'"
                    :sm="12"
                    :lg="6"
                    :xl="4"
                    :key="item.key"
                    style="display:none;"
                  >
                    <el-form-item :prop="item.key">
                      <div class="demonstration">{{ item.label }}</div>
                      <el-input
                        v-model="screenValue[item.key]"
                        :placeholder="item.placeholder"
                        readonly
                        clearable
                        @keyup.enter.native="activeSelect"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-else-if="item.type=='textClick'"
                    :sm="12"
                    :lg="6"
                    :xl="4"
                    :key="item.key"
                  >
                    <el-form-item :prop="item.key">
                      <div class="demonstration">{{ item.label }}</div>
                      <el-form-item :prop="item.value">
                        <el-input
                          v-model="item.value"
                          :placeholder="item.placeholder"
                          readonly
                          @keyup.enter.native="activeSelect"
                          @click.native="showProductsDialog()"
                        >
                          <el-button slot="append" icon="el-icon-search" />
                        </el-input>
                      </el-form-item>
                    </el-form-item>
                  </el-col>
                  <el-col v-else-if="item.type=='select'" :sm="12" :lg="6" :xl="4" :key="item.key">
                    <el-form-item :prop="item.key">
                      <div class="demonstration">{{ item.label }}</div>
                      <el-tooltip
                        v-if="item.filterable"
                        content="可输入关键字搜索"
                        placement="bottom"
                        effect="light"
                      >
                        <el-select
                          :disabled="screenValue[item.status]"
                          v-model="screenValue[item.key]"
                          :placeholder="item.placeholder"
                          filterable
                        >
                          <el-option
                            v-for="selectItem in item.option"
                            :key="selectItem.value"
                            :label="selectItem.label"
                            :value="selectItem.val"
                          />
                        </el-select>
                      </el-tooltip>
                      <el-select
                        v-else
                        v-model="screenValue[item.key]"
                        :placeholder="item.placeholder"
                      >
                        <el-option
                          v-for="selectItem in item.option"
                          :key="selectItem.value"
                          :label="selectItem.label"
                          :value="selectItem.val"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-else-if="item.type=='select_next'"
                    :sm="12"
                    :lg="6"
                    :xl="4"
                    :key="item.key"
                  >
                    <el-form-item :prop="item.key">
                      <div class="demonstration">{{ item.label }}</div>
                      <el-tooltip
                        v-if="item.filterable"
                        content="可输入关键字搜索"
                        placement="bottom"
                        effect="light"
                      >
                        <el-select v-model="screenValue[item.key]" filterable placeholder="请选择">
                          <el-option
                            v-for="selectItem in item.option"
                            :key="selectItem.value"
                            :label="selectItem.label"
                            :value="selectItem.val"
                          />
                        </el-select>
                      </el-tooltip>
                      <el-select
                        v-loadmore="loadmore"
                        v-else
                        v-model="screenValue[item.key]"
                        :remote-method="remoteMethod"
                        :placeholder="item.placeholder"
                        filterable
                        remote
                        @change="change"
                      >
                        <el-option
                          v-for="selectItem in item.option"
                          :key="selectItem.value"
                          :label="selectItem.label"
                          :value="selectItem.val"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-else-if="item.type=='select_more'"
                    :sm="12"
                    :lg="6"
                    :xl="4"
                    :key="item.key"
                  >
                    <el-form-item :prop="item.key">
                      <div class="demonstration">{{ item.label }}</div>
                      <!-- <el-tooltip v-if="item.filterable" content="可输入关键字搜索" placement="bottom" effect="light"> -->
                      <el-select
                        v-if="item.filterable"
                        v-model="screenValue[item.key]"
                        reserve-keyword
                        multiple
                        filterable
                        collapse-tags
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="selectItem in item.option"
                          :key="selectItem.value"
                          :label="selectItem.label"
                          :value="selectItem.val"
                        />
                      </el-select>
                      <!-- </el-tooltip> -->
                      <el-select v-else v-model="screenValue[item.key]" placeholder="请选择">
                        <el-option
                          v-for="selectItem in item.option"
                          :key="selectItem.value"
                          :label="selectItem.label"
                          :value="selectItem.val"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-else-if="item.type=='inputRange'"
                    :sm="12"
                    :lg="6"
                    :xl="4"
                    :key="item.key"
                  >
                    <el-form-item :prop="item.key">
                      <div class="demonstration">{{ item.label }}</div>
                      <input-range v-model="screenValue[item.key]" size="large" />
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-else-if="item.type=='inputRanges'"
                    :sm="24"
                    :lg="24"
                    :xl="24"
                    :key="item.key"
                  >
                    <el-form-item :prop="item.key">
                      <div class="demonstration">{{ item.label }}</div>
                      <input-ranges
                        ref="inputrange"
                        v-model="screenValue[item.key]"
                        :prompt-values="item.value"
                        :unit="item.unit"
                        :tab-position="item.tabPanel"
                        :pre-placeholder="item.prePlaceholder"
                        :append-placeholder="item.appendPlaceholder"
                        size="large"
                        connect-text="至"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-else-if="item.type=='cascader'"
                    :sm="12"
                    :lg="6"
                    :xl="4"
                    :key="item.key"
                  >
                    <el-form-item :prop="item.key">
                      <div class="demonstration">{{ item.label }}</div>
                      <el-cascader
                        :placeholder="item.placeholder"
                        :options="options"
                        v-model="screenValue[item.key]"
                        :props="props"
                        expand-trigger="hover"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-else-if="item.type=='selectSwitch'"
                    :sm="24"
                    :lg="12"
                    :xl="4"
                    :key="item.key"
                  >
                    <el-row :gutter="20">
                      <el-col
                        :sm="12"
                        :lg="screenValue[item.key]=='1'?6:screenValue[item.key]==2?6:12"
                        :xl="screenValue[item.key]=='1'?6:screenValue[item.key]==2?6:12"
                        :key="item.key"
                      >
                        <el-form-item :prop="item.key">
                          <div class="demonstration">{{ item.label }}</div>
                          <el-tooltip
                            v-if="item.filterable"
                            content="可输入关键字搜索"
                            placement="bottom"
                            effect="light"
                          >
                            <el-select
                              v-model="screenValue[item.key]"
                              :placeholder="item.placeholder"
                              filterable
                            >
                              <el-option
                                v-for="selectItem in item.option"
                                :key="selectItem.value"
                                :label="selectItem.label"
                                :value="selectItem.val"
                              />
                            </el-select>
                          </el-tooltip>
                          <el-select
                            v-else
                            v-model="screenValue[item.key]"
                            :placeholder="item.placeholder"
                          >
                            <el-option
                              v-for="selectItem in item.option"
                              :key="selectItem.value"
                              :label="selectItem.label"
                              :value="selectItem.val"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col
                        v-if="screenValue[item.key]=='1'"
                        :sm="12"
                        :lg="18"
                        :xl="18"
                        :key="item.key"
                      >
                        <el-form-item :prop="item.key">
                          <div class="demonstration" />
                          <el-date-picker
                            :editable="editable"
                            v-model="screenValue[item.child[0]]"
                            type="datetimerange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col
                        v-if="screenValue[item.key]=='2'"
                        :sm="12"
                        :lg="18"
                        :xl="18"
                        :key="item.key"
                      >
                        <el-form-item :prop="item.key">
                          <div class="demonstration" />
                          <el-date-picker
                            :editable="editable"
                            v-model="screenValue[item.child[1]]"
                            type="datetimerange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </template>
              </el-row>
            </div>
          </el-collapse-transition>
          <el-form-item v-if="showBtn">
            <div class="btn">
              <el-button type="primary" class="btn-s" @click="sendmsg" icon="el-icon-search">查询</el-button>
              <el-button class="btn-s" @click="resetForm('ruleForm')" icon="el-icon-refresh-left">重置</el-button>
              <template v-if="showShowScreenBtn">
              <el-button v-show="showScreen" class="btn-s" @click="showScreen = !showScreen">收起筛选</el-button>
              <el-button v-show="!showScreen" class="btn-s" @click="showScreen = !showScreen">展开筛选</el-button>
              </template>
            </div>
          </el-form-item>
        </el-form>
      </template>
    </div>
  </div>
</template>
<script>
import { cityData2 } from "@/assets/js/province"
import InputRange from '@/componentsMarketing/rangeInput/input-ranger'
import InputRanges from '@/componentsMarketing/rangeInput/input-rangers'
export default {
  components:{
    InputRange,
    InputRanges
  },
  props: {
    btnPosition:{
      type: Boolean,
      default: true
    },
    showShowScreenBtn:{
      type: Boolean,
      default: false
    },
    showSelectBtn: {
      type: Boolean,
      default: true
    },
    screenValue: {
      type: Object,
      default: () => {
        return {};
      }
    },
    screenList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
              );
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
              );
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              start.setTime(start.getTime() - 24 * 60 * 60 * 1000);
              end.setTime(end.getTime() - 24 * 60 * 60 * 1000);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
              );
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
              );
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      showScreen: true,
      showBtn: this.showSelectBtn == undefined ? true : this.showSelectBtn,
      editable: false,
      options: cityData2,
      props: {
        value: "label",
        label: "label"
      }
    };
  },
  methods: {
    activeSelect() {
      event.target.blur();
      this.sendmsg();
    },
    showProductsDialog() {
      this.$emit("productsDialog", "resetForm"); // 子组件向父组件传参
    },
    remoteMethod(val) {
      this.$emit("search", val);
    },
    loadmore() {
      this.$emit("store");
    },
    change() {
      this.$emit("storeId");
    },
    sendmsg() {
      this.$emit("selected", "screen"); // 子组件向父组件传参
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (this.$refs.inputrange) {
        this.$refs.inputrange.map(el => {
          el.tabPosition = "all";
        });
      }
      this.$emit("selected", "resetForm"); // 子组件向父组件传参
      this.$emit("storeId");
    }
  }
};
</script>

<style scoped>
.screen {
  padding: 20px;
  background-color: #fff;
}
.screen .el-form-item {
  margin-bottom: 0;
}
.screen .el-date-editor--datetimerange.el-input,
.screen .el-date-editor--datetimerange.el-input__inner,
.screen .el-select,
.screen .el-cascader {
  width: 100% !important;
}
.screen .demonstration {
  color: #504e54;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
}
.screen .btnDown {
  margin-top: 15px;
}
.closedScreen .btn {
  margin-top: 0;
}
.screen .btn-s {
  min-width: 100px;
}
.btn{
  margin-top: 15px;
}
</style>

