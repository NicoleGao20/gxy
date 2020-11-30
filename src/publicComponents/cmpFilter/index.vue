<template>
  <div
    class="cmp-filter-container"
    v-if="subFuncs.functionQueryFields.length > 0"
  >
    <el-row :gutter="20">
      <template
        v-for="(rowItem, index) in subFuncs.functionQueryFields.slice(
          0,
          sepNum
        )"
      >
        <el-col :span="rowItem.fieldType == 'time' ? 12 : 6" :key="index">
          <div class="mb-8 mt-8">{{ rowItem.showName }}</div>
          <template
            v-if="rowItem.fieldType == 'text' || rowItem.fieldType == 'number'"
          >
            <el-input
              size="small"
              :key="rowItem.id"
              v-if="rowItem.showName == '活动编号'"
              :type="rowItem.fieldType"
              @keyup.enter.native="getData"
              v-model="filterForm[rowItem.name]"
              :placeholder="`请输入${rowItem.showName}，只支持精确匹配`"
            ></el-input>
            <!--菜单发布明细-发布计划id： publishPlanId  filterForm[rowItem.name]-->
             <el-input
              size="small"
              :key="rowItem.id"
              v-else-if="rowItem.showName == '发布计划id'"
              :type="rowItem.fieldType"
              @keyup.enter.native="getData"
              v-model="filterForm[rowItem.name]"
              :placeholder="`请输入${rowItem.showName}`"
            ></el-input>
            <el-input
              size="small"
              v-else
              :key="rowItem.id"
              @keyup.enter.native="getData"
              :type="rowItem.fieldType"
              v-model="filterForm[rowItem.name]"
              :placeholder="`请输入${rowItem.showName}`"
            ></el-input>
          </template>
          <template v-else-if="rowItem.fieldType == 'time'">
            <el-date-picker
              v-model="filterForm[rowItem.name]"
              :key="rowItem.id"
              :type="
                JSON.parse(rowItem.attribute).format == 'yyyy-MM-dd'
                  ? 'daterange'
                  : 'datetimerange'
              "
              class="full-width"
              size="small"
              :value-format="JSON.parse(rowItem.attribute).format"
              range-separator="至"
              :clearable="!JSON.parse(rowItem.attribute).default"
              :default-time="['00:00:00', '23:59:59']"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </template>
          <template v-else-if="rowItem.fieldType == 'select'">
            <template v-if="rowItem.name == 'storeCode'">
              <el-select
                :key="rowItem.id"
                class="full-width"
                size="small"
                filterable
                v-model="filterForm[rowItem.name]"
                :placeholder="`请选择${rowItem.showName}`"
              >
                <el-option
                  v-for="item in tableCom.storeList"
                  :key="item.storeCode"
                  :label="item.storeName"
                  :value="item.storeCode"
                ></el-option>
              </el-select>
            </template>
            <template v-else-if="rowItem.name == 'priceTierCode'">
              <el-select
                :key="rowItem.id"
                class="full-width"
                clearable
                size="small"
                filterable
                v-model="filterForm[rowItem.name]"
                :placeholder="`请选择${rowItem.showName}`"
              >
                <el-option
                  v-for="item in tableCom.priceTierList"
                  :key="item.id"
                  :label="item.tierName"
                  :value="item.tierCode"
                ></el-option>
              </el-select>
            </template>
            <template v-else-if="rowItem.name == 'categoryId'">
              <el-cascader
                :key="rowItem.id"
                clearable
                class="full-width"
                size="small"
                separator=">"
                placeholder="请选择商品分类"
                v-model="filterForm[rowItem.name]"
                :options="tableCom.categoryList"
                :props="{
                  checkStrictly: true,
                  label: 'categoryName',
                  value: 'id',
                  children: 'categoryList',
                }"
              ></el-cascader>
            </template>
            <template v-else-if="rowItem.name == 'region'">
              <el-cascader
                :key="rowItem.id"
                clearable
                class="full-width"
                size="small"
                ref="addressSelect"
                v-model="filterForm[rowItem.name]"
                placeholder="请选择省市区"
                @change="addressChange"
                :props="{
                  checkStrictly: true,
                  lazy: true,
                  lazyLoad: getRegionsList,
                }"
              ></el-cascader>
            </template>
            <template v-else-if="rowItem.name == 'couponName'">
              <el-input
                :key="rowItem.id"
                size="small"
                clearable
                suffix-icon="el-icon-search"
                type="text"
                v-model="filterForm[rowItem.name]"
                :placeholder="`请选择${rowItem.showName}`"
                @focus="showDialog('couponName')"
              ></el-input>
            </template>
            <!--菜单发布明细：状态-4发布失败 filterForm[rowItem.name]：status class="full-width"-->
            <template v-else-if="rowItem.name == 'status'">
             <el-select
                :key="rowItem.id"
                clearable
                class="full-width"
                size="small"
                filterable
                v-model="filterForm[rowItem.name]"
                :placeholder="`请选择${rowItem.showName}`"
              >
                <el-option
                  v-for=" (item,index) in tableCom.getFuncFilter(subFuncs.functionQueryFields,rowItem.name,(params = 'name'))"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template v-else>
              <el-select
                :key="rowItem.id"
                class="full-width"
                clearable
                size="small"
                filterable
                v-model="filterForm[rowItem.name]"
                :placeholder="`请选择${rowItem.showName}`"
              >
                <el-option
                  v-for="item in tableCom.getFuncFilter(
                    subFuncs.functionQueryFields,
                    rowItem.name,
                    (params = 'name')
                  )"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">{{ item.text }}
                </el-option>
              </el-select>
            </template>
          </template>
        </el-col>
      </template>
      <el-col class="mt-36" :span="6">
        <el-button type="primary" size="mini" @click="getData">查询</el-button>
        <el-button class="ml-20" size="mini" @click="tableCom.resetSearch"
          >清空筛选</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="isShowAllFilter">
      <template
        v-for="(rowItem, index) in subFuncs.functionQueryFields.slice(sepNum)"
      >
        <el-col :span="rowItem.fieldType == 'time' ? 12 : 6" :key="index">
          <div class="mb-8 mt-8">{{ rowItem.showName }}</div>
          <template
            v-if="rowItem.fieldType == 'text' || rowItem.fieldType == 'number'"
          >
            <el-input
              :key="rowItem.id"
              size="small"
              v-if="rowItem.showName == '活动编号'"
              :type="rowItem.fieldType"
              @keyup.enter.native="getData"
              v-model="filterForm[rowItem.name]"
              :placeholder="`请输入${rowItem.showName}，只支持精确匹配`"
            ></el-input>
            <!--菜单发布明细-发布计划id： publishPlanId-->
            <!-- <el-input
              size="small"
              :key="rowItem.id"
              v-else-if="rowItem.showName == '发布计划id'"
              :type="rowItem.fieldType"
              @keyup.enter.native="getData"
              v-model="id"
              :placeholder="`请输入${rowItem.showName}`"
            ></el-input> -->
            <el-input
              :key="rowItem.id"
              size="small"
              v-else
              @keyup.enter.native="getData"
              :type="rowItem.fieldType"
              v-model="filterForm[rowItem.name]"
              :placeholder="`请输入${rowItem.showName}`"
            ></el-input>
          </template>
          <template v-else-if="rowItem.fieldType == 'time'">
            <el-date-picker
              :key="rowItem.id"
              v-model="filterForm[rowItem.name]"
              :type="
                JSON.parse(rowItem.attribute).format == 'yyyy-MM-dd'
                  ? 'daterange'
                  : 'datetimerange'
              "
              class="full-width"
              size="small"
              :value-format="JSON.parse(rowItem.attribute).format"
              range-separator="至"
              :default-time="['00:00:00', '23:59:59']"
              :clearable="!JSON.parse(rowItem.attribute).default"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </template>
          <template v-else-if="rowItem.fieldType == 'select'">
            <template v-if="rowItem.name == 'storeCode'">
              <el-select
                :key="rowItem.id"
                class="full-width"
                clearable
                size="small"
                v-model="filterForm[rowItem.name]"
                :placeholder="`请选择${rowItem.showName}`"
              >
                <el-option
                  v-for="item in tableCom.storeList"
                  :key="item.storeCode"
                  :label="item.storeName"
                  :value="item.storeCode"
                ></el-option>
              </el-select>
            </template>
            <template v-else-if="rowItem.name == 'priceTierCode'">
              <el-select
                :key="rowItem.id"
                class="full-width"
                clearable
                size="small"
                filterable
                v-model="filterForm[rowItem.name]"
                :placeholder="`请选择${rowItem.showName}`"
              >
                <el-option
                  v-for="item in tableCom.priceTierList"
                  :key="item.id"
                  :label="item.tierName"
                  :value="item.tierCode"
                ></el-option>
              </el-select>
            </template>

            <template v-else-if="rowItem.name == 'categoryId'">
              <el-cascader
                :key="rowItem.id"
                clearable
                class="full-width"
                size="small"
                separator=">"
                placeholder="请选择商品分类"
                v-model="filterForm[rowItem.name]"
                :options="tableCom.categoryList"
                :props="{
                  checkStrictly: true,
                  label: 'categoryName',
                  value: 'id',
                  children: 'categoryList',
                }"
              ></el-cascader>
            </template>
            <template v-else-if="rowItem.name == 'region'">
              <el-cascader
                :key="rowItem.id"
                clearable
                class="full-width"
                size="small"
                v-model="filterForm[rowItem.name]"
                placeholder="请选择省市区"
                @change="addressChange"
                ref="addressSelect"
                :props="{
                  checkStrictly: true,
                  lazy: true,
                  lazyLoad: getRegionsList,
                }"
              ></el-cascader>
            </template>
            <template v-else-if="rowItem.name == 'userId'">
              <el-input
                :key="rowItem.id"
                size="small"
                suffix-icon="el-icon-search"
                type="text"
                v-model="filterForm['userName']"
                :placeholder="`请选择${rowItem.showName}`"
                @focus="showDialog('userId')"
              ></el-input>
            </template>
            <template v-else-if="rowItem.name == 'couponName'">
              <el-input
                :key="rowItem.id"
                size="small"
                clearable
                suffix-icon="el-icon-search"
                type="text"
                v-model="filterForm[rowItem.name]"
                :placeholder="`请选择${rowItem.showName}`"
                @focus="showDialog('couponName')"
              ></el-input>
            </template>
             <!--菜单发布明细：状态-4发布失败 filterForm[rowItem.name]：status class="full-width"-->
            <!-- <template v-else-if="rowItem.name == 'status'">
             <el-select
                :key="rowItem.id"
                size="small"
                clearable
                v-model="status"
                :placeholder="`请选择${rowItem.showName}`"
              >
                <el-option
                  v-for=" (item,index) in tableCom.getFuncFilter(subFuncs.functionQueryFields,rowItem.name,(params = 'name'))"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>-->
            <template v-else>
              <el-select
                :key="rowItem.id"
                class="full-width"
                clearable
                size="small"
                filterable
                v-model="filterForm[rowItem.name]"
                :placeholder="`请选择${rowItem.showName}`"
              >
                <el-option
                  v-for="item in tableCom.getFuncFilter(
                    subFuncs.functionQueryFields,
                    rowItem.name,
                    (params = 'name')
                  )"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </template>
        </el-col>
      </template>
    </el-row>

    <div class="filter-line-container">
      <div class="line"></div>
      <template v-if="subFuncs.functionQueryFields.length > sepNum">
        <div class="filter-text" @click="changeFilter" v-if="isShowAllFilter">
          收起筛选
          <i class="icon-Popeyes-fonticon-08 fs-24"></i>
        </div>
        <div class="filter-text" @click="changeFilter" v-else>
          展开筛选
          <i class="icon-Popeyes-fonticon-09 fs-24"></i>
        </div>
      </template>
      <div class="line"></div>
    </div>

    <!-- --- 选择角色弹窗 --- -->
    <neo-add-dialog
      :showType="showType"
      :dialogType="2"
      :dialogShow.sync="selectDialogShow"
      @save="saveIsSelect"
    ></neo-add-dialog>
  </div>
</template>

<script src="./index.js"></script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
