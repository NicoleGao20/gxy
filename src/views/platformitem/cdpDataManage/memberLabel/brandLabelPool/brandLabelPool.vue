<template>
  <div class="page-container-scroll">
    <div class="searchWrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="品牌">
              <el-select v-model="searchForm.brand_code"   style="width: 100%;" filterable placeholder="请选择" @change="changeBrandCode">
                <el-option
                  v-for="(item, k) in brand_list"
                  :key="k"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="条件名称">
              <el-input v-model="searchForm.label_name" maxlength="50" clearable @keyup.enter.native="filterData('search')"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分配状态">
              <el-select v-model="searchForm.isOrNot" style="width: 100%;" clearable >
                <el-option v-for="(labelAttribute, index) in allocationStatus" :key="index" :label="labelAttribute.label" :value="labelAttribute.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="条件类型">
              <el-select v-model="searchForm.label_type" style="width: 100%;" clearable >
                <el-option v-for="(labelType, index) in labelTypes" :key="index" :label="labelType.label" :value="labelType.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="创建人"  width="120" >
              <el-input v-model="searchForm.create_user" clearable @keyup.enter.native="filterData('search')"/>
            </el-form-item>
          </el-col>
          <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="修改人" width="120" >
              <el-input v-model="searchForm.update_user" clearable @keyup.enter.native="filterData('search')"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align:center;">
            <!-- <el-form-item style="white-space:nowrap;"> -->
            <el-button class="search-common" type="primary" @click="filterData('search')">查询</el-button>
            <el-button v-show="!isMoreinquiries" @click="searchMore">更多筛选</el-button>
            <el-button v-show="isMoreinquiries" type="primary" class="search-collapse" @click="searchMore">收起<i class="el-icon-d-arrow-right"/> </el-button>
            <!-- </el-form-item> -->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="brand-label-pool-wrap">
      <div>
        <el-scrollbar ref="scrollWrap" class="label-category">
          <div style="padding: 10px;">
            <el-tree
              ref="eltree"
              :highlight-current="true"
              :current-node-key="searchForm.treeClickNode"
              :data="treeNodes"
              :props="defaultProps"
              :allow-drop="allowDrop"
              :expand-on-click-node="false"
              :default-expanded-keys="expandedList"
              default-expand-all
              node-key="id"
              draggable
              icon-class="node"
              @node-expand="nodeExpand"
              @node-collapse="nodeCollapse"
              @node-click="nodeClick"
              @node-drop="handleDrop">
              <span slot-scope="{ node, data }" class="el-tree-node__label custom-tree-node">
                <span :title="node.label" class="node-label">{{ node.label }}
                  <input
                    v-if="node.id === editNodeId"
                    id="edit-name"
                    :ref="node.id === editNodeId ? 'activeInput':''"
                    v-model="data.label"
                    autofocus
                    class="edit-node-name"
                    maxlength="10"
                    @click="(e) => e.stopPropagation()"
                    @keydown="(e) =>handleKeyDown(node,e,data.label)"
                    @blur="(e) =>handleKeyDown(node,e,data.label,'blur')">
                </span>
                <span class="node-action-wrap">
                  <span
                    v-if="node.level < 3 && !node.data.has_label && !isAppendClassTree"
                    class="el-icon-plus"
                    @click="(e) => append(node,data, e)"/>
                  <span
                    v-if="node.level < 3 && !node.data.has_label && isAppendClassTree"
                    class="el-icon-loading"/>
                  <span
                    v-if="!node.data.count && node.level > 1 && !isRemoveClassTree"
                    class="el-icon-minus"
                    @click="(e) => removeClassTree(node, data, e)"/>
                  <span
                    v-if="!node.data.count && node.level > 1 && isRemoveClassTree"
                    class="el-icon-loading"/>
                  <span
                    v-if="node.level > 1"
                    class="el-icon-edit"
                    @mousedown="(e) => editNode(node, data, e)"/>
                </span>
              </span>
            </el-tree>
          </div>
        </el-scrollbar>
      </div>
      <div class="brand-label-table-wrap">
        <el-button style="width:90px;" type="primary" :disabled="this.multipleSelection&&this.multipleSelection.length<1" @click="openDistributeModal">分配类目</el-button>
        <el-table
          v-loading="loading"
          :max-height="tableHeight"
          :data="list"
          row-key="id"
          style="margin-top: 10px;"
          highlight-current-row
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"/>
          <el-table-column label="序号" fixed="left"  width="50">
            <template slot-scope="scope"><span>{{ (scope.$index+1) }}</span></template>
          </el-table-column>
          <!-- <el-table-column label="品牌" prop="brand_code" width="120">
            <template slot-scope="scope">
              {{ getLabelByValue(scope.row.brand_code, brand_list) }}
            </template>
          </el-table-column> -->
          <el-table-column label="条件名称" fixed="left" prop="label_name" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="bottom">
                <p style="max-width: 120px;">{{ scope.row.label_name }} </p>
                <div slot="reference" class="marketing-list-page-name-wrapper">
                  {{ scope.row.label_name }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="条件类目" prop="label_class_def_id" width="100"/>
          <el-table-column label="分配状态" prop="label_class_def_id">
            <template slot-scope="scope">
               <el-tag
          :type="scope.row.label_class_def_id === '' ? 'warning' : 'success'"
          disable-transitions>
              {{ scope.row.label_class_def_id ? '已分配':'未分配' }}
               </el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column label="条件属性" prop="label_attribute">
            <template slot-scope="scope">
              {{ getLabelByValue(scope.row.label_attribute, labelAttributes) }}
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="条件类型" prop="label_type">
            <template slot-scope="scope">
              {{ getLabelByValue(scope.row.label_type, labelTypes) }}
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="创建类型" prop="create_type">
            <template slot-scope="scope">
              {{ getLabelByValue(scope.row.create_type, createTypes) }}
            </template>
          </el-table-column> -->
          <el-table-column label="启动状态" prop="status">
            <template slot-scope="scope">
              <el-tag
          :type="scope.row.status === 'started' ? 'success' : 'warning'"
          disable-transitions>
              {{ getLabelByValue(scope.row.status, status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="上架状态" prop="on_status">
            <template slot-scope="scope">
              <el-tag
          :type="scope.row.on_status === 'on' ? 'success' : 'warning'"
          disable-transitions>
              {{ getLabelByValue(scope.row.on_status, onStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="更新频次" prop="update_frequency">
            <template slot-scope="scope">
              <el-tag
          :type="scope.row.update_frequency === 'realtime' ? 'success' : 'info'"
          disable-transitions>
              {{ getLabelByValue(scope.row.update_frequency, updateFrequencys) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="数据更新时间" prop="data_update_time" width="140"/>
          <el-table-column label="创建人" prop="create_user"  width="140">
            <template slot-scope="scope">
              <human-info :num="scope.row.create_user_code">{{ scope.row.create_user }}</human-info>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="create_time" width="140"/>
          <el-table-column label="修改人" prop="update_user"  width="140">
            <template slot-scope="scope">
              <human-info :num="scope.row.update_user_code">{{ scope.row.update_user }}</human-info>
            </template>
          </el-table-column>
          <el-table-column label="最新修改时间" prop="last_modify_time" width="140"/>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="view(scope.row,'view')">查看</el-button>
              <!-- 预计更新时间 -pre  数据采集时间  -->
              <!-- create_type -->
              <!-- <el-button v-if="scope.row.status == 'stopped' && scope.row.label_attribute == 'special' && !scope.row.is_marketing_dependence" type="text" @click="edit(scope.row)">编辑</el-button> -->
              <!-- <el-button type="text" @click="edit(scope.row)">编辑</el-button> -->
              <el-button  class="deleteFontColor" v-if="scope.row.status == 'stopped' && !scope.row.is_marketing_dependence" type="text"  @click="del(scope.row)">删除</el-button>
              <el-button class="updateoffStatus" v-if="scope.row.status == 'started' && scope.row.on_status == 'off'" type="text" @click="updateShelfStatus(scope.row)">上架</el-button>
              <el-button class="updateonStatus" v-if="scope.row.status == 'started' && scope.row.on_status == 'on'" type="text" @click="updateShelfStatus(scope.row)">下架</el-button>
              <el-button class="updateoffStatus" v-if="scope.row.status == 'started'" type="text" @click="updateLabelStatus(scope.row)">停用</el-button>
              <el-button class="updateonStatus" v-if="scope.row.status == 'stopped'" type="text" @click="updateLabelStatus(scope.row)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <base-pagination
        class="bottomPagination"
          v-model="params.current"
          :page-size.sync="params.page_size"
          :total="total"
          style="height:32px;"
          @loadData="loadData"
        />
      </div>
    </div>
    <el-dialog
      :visible.sync="distributeModalVisible"
      title="编辑类目"
      width="40%"
    >
      <div class="distribution">
        <el-tree
          ref="setTree"
          :data="treeNodes"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          show-checkbox
          check-strictly
          @check="getCheck"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributeModalVisible = false;$refs.setTree.setCheckedKeys([])">取 消</el-button>
        <el-button type="primary" @click="distributionTree">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
import { mixinDel } from '@/utils/index'
import { queryBrandList } from '@/api/employ'
import { getBrandLabelList, updateLabelStatus, updateShelfStatus, getClassTree, deleteBrandLabel, addClass, deleteClass, sortClass, editClass, distributeClass } from '@/api/brandLabelPool'
import cacheCondition from '@/utils/cacheCondition'

export default {
  name: 'BrandLabelPool',
  mixins: [mixinDel, cacheCondition],
  data() {
    return {
      id: 100,
      loading: false,
      isMoreinquiries: false, // 更多查询
      editNodeId: '', // 更改元素节点id
      activeClass: '',
      params: {
        current: 1,
        page_size: 10
      },
      total: 0,
      list: [],
      expandedList: [],
      searchForm: {
        treeClickNode: '', // 侧边点击node 节点id
        brand_code: '',
        isOrNot: '',
        label_name: '',
        create_user: '',
        update_user: ''
      },
      brand_list: [],
      createTypes: [
        { label: '手工', value: 'manual' },
        { label: '自定义sql', value: 'sql' },
        { label: '筛选器', value: 'filter' },
        { label: '属性', value: 'attribute' },
        { label: '算法', value: 'algorithm' }
      ],
      labelTypes: [
        // { label: '手工条件', value: 'manual' },
        // { label: '规则条件', value: 'rule' },
        // { label: '复合条件', value: 'complex' },
        { label: '属性条件', value: 'attribute' },
        // { label: '模型条件', value: 'model' }
      ],
      // 是否存在类目ID  label_class_def_id
      allocationStatus: [
        { label: '已分配', value: 'Y' },
        { label: '未分配', value: 'N' }
      ],
      onStatus: [
        { label: '上架', value: 'on' },
        { label: '下架', value: 'off' }
      ],
      status: [
        { label: '启用', value: 'started' },
        { label: '停用', value: 'stopped' }
      ],
      updateFrequencys: [
        { label: '实时', value: 'realtime' },
        { label: '每天', value: 't_1' }
      ],
      labelAttributes: [
        { label: '通用', value: 'common' },
        { label: '个性', value: 'special' }
      ],
      actionRouteMap: {
        manual_edit: 'manualBrandLabelEdit',
        rule_filter_edit: 'ruleBrandLabelEdit_f',
        rule_sql_edit: 'ruleBrandLabelEdit_s',
        complex_edit: 'complexBrandLabelEdit',
        attribute_edit: 'attrBrandLabelEdit',
        model_edit: 'rfmBrandLabelEdit'
      },
      treeNodes: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      distributeModalVisible: false,
      distributionNode: '',
      multipleSelection: [],
      disabledArr: [], // 是否可分配
      count: 1, // 类目后缀编号
      isRemoveClassTree: false,
      isAppendClassTree: false,
      isClassTree: false,
      tableHeight: 450,
      editIng:false
    }
  },
  watch: {
    distributeModalVisible(val) {
      if (!val) {
        this.$refs.setTree.setCheckedKeys([])
      }
    }
  },
  mounted() {
    this.queryBrandList()
    // this.init();
    // this.getClassTree()
    // this.rowDrop() // 表格拖拽
    this.$refs['scrollWrap'].update()
    window.addEventListener('resize', this.getHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getHeight)
  },
  methods: {
    getHeight() {
      const appHeight = document.getElementsByClassName('page-container-scroll')[0].offsetHeight
      const otherHeight = document.getElementsByClassName('search-wrap')[0].offsetHeight + 105
      this.tableHeight = appHeight - otherHeight
    },
    queryBrandList() {
      queryBrandList({ params: {}}).then(res => {
        if (res.body.length) {
          // if (!this.searchForm.brand_code) {
          //   this.searchForm.brand_code = 'durex'
          // }
          // if (this.$store.getters.language === 'zh') {
          //   res.body.forEach((ele, index) => {
          //     this.brand_list.push({ label: ele.brandCName, value: ele.brandCode })
          //   })
          // } else {
          //   res.body.forEach((ele, index) => {
          //     this.brand_list.push({ label: ele.brandEName, value: ele.brandCode })
          //   })
          // }
          res.body.forEach((ele, index) => {
            this.brand_list.push({ label: ele.brandName, value: ele.brandCode })
          })
          if(this.brand_list&&this.brand_list.length>0){
            this.searchForm.brand_code = this.brand_list[0].value||'durex'
          }
        }
        this.getClassTree()
      })
    },
    init() {
      this.loadData()
    },
    changeBrandCode(val) {
      this.getClassTree(val)
    },
    getClassTree() {
      getClassTree({ brand_code: this.searchForm.brand_code }).then(res => {
        this.count = 1
        if (res.data.length) {
          res.data.forEach(ele => {
            ele.brand = this.getLabelByValue(ele.brand_code, this.brand_list)
            this.$set(ele, 'label', ele.brand)
            this.$set(ele, 'disabled', true)
            if (ele.children.length) {
              // ele.children = ele.children.sort(this.sortArr)
              ele.children = ele.children.filter(x => !!x)
              ele.children.forEach(child => {
                this.$set(child, 'brand_code', ele.brand_code)
                this.$set(child, 'label', child.class_name)
                if (child.class_name.slice(0, 4) === '默认类目') {
                  this.count <= Number(child.class_name.slice(4)) ? this.count = Number(child.class_name.slice(4)) + 1 : this.count
                }
                var count2 = 0
                if (child.children.length) {
                  this.$set(child, 'disabled', true)
                  // child.children = child.children.sort(this.sortArr)
                  child.children = child.children.filter(x => !!x)
                  child.children.forEach(last => {
                    this.$set(last, 'brand_code', ele.brand_code)
                    this.$set(last, 'label', last.class_name)
                    delete last.children
                    this.$set(last, 'count', last.has_label)
                    if (last.class_name.slice(0, 4) === '默认类目') {
                      this.count <= Number(last.class_name.slice(4)) ? this.count = Number(last.class_name.slice(4)) + 1 : this.count
                    }
                    if (last.has_label) count2 += last.has_label
                  })
                }
                this.$set(child, 'count', count2 + child.has_label)
              })
            }
          })
          this.treeNodes = res.data
          if (this.isClassTree) {
            this.isClassTree = false
            this.isRemoveClassTree = false
            this.isAppendClassTree = false
          }
        }
        this.init()
      })
    },
    sortArr(a, b) {
      return b.seq_no - a.seq_no
    },
    filterData(type) {
      if (type === 'search') {
        this.searchForm.treeClickNode = ''
        this.$refs.eltree.setCurrentKey()
      }
      this.params.current = 1
      this.loadData()
    },
    loadData() {
      var params
      if (!this.searchForm.treeClickNode) {
        params = {
          current: this.params.current,
          page_size: this.params.page_size,
          ...this.searchForm
        }
      } else {
        params = {
          current: this.params.current,
          page_size: this.params.page_size,
          id: this.searchForm.treeClickNode
        }
      }
      for (var attr in params) {
        if (!params[attr]) delete params[attr]
      }
      this.loading = true
      getBrandLabelList(params).then(res => {
        this.loading = false
        if (res.data) {
          this.list = res.data.list || []
          if (this.params.current > 1) {
            if (!res.data.list || !res.data.list.length) {
              this.params.current -= 1
              // 列表数据的切换，无需重载类目树
              this.loadData()
            }
          }
          this.list.forEach(li => {
            this.treeNodes.forEach(tree => {
              tree.children.forEach(child => {
                if (li.label_class_def_id === child.id) {
                  li.label_class_def_id = child.class_name
                } else {
                  child.children.forEach(last => {
                    if (li.label_class_def_id === last.id) {
                      li.label_class_def_id = last.class_name
                    }
                  })
                }
              })
            })
          })
          this.params.current = res.data.pagination.current || 1
          this.params.page_size = res.data.pagination.page_size
          this.total = res.data.pagination.total || 0
          // 动态计算表格高度
          if (this.tableHeight === 200) {
            setTimeout(() => {
              this.getHeight()
            })
          }
        }
      })
    },
    searchMore() {
      this.isMoreinquiries = !this.isMoreinquiries
      // 动态计算表格高度
      setTimeout(() => {
        this.getHeight()
      })
    },
    del(row) {
      this.openDeleteModal((closeModal) => {
        deleteBrandLabel({ id: row.id, label_type: row.label_type, create_type: row.create_type }).then((res) => {
          this.$message.success('删除成功')
          closeModal()
          this.getClassTree()
        })
      })
    },
    updateShelfStatus(row) {
      this.$msgbox({
        title: '确认消息',
        message: `确定将此条件${row.on_status === 'on' ? '下架' : '上架'}`,
        showClose: true,
        distinguishCancelAndClose: true,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            setTimeout(() => {
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }, 1000)
          } else {
            done()
          }
        }
      }).then(() => {
        updateShelfStatus({ id: row.id, on_status: row.on_status === 'on' ? 'off' : 'on' }).then(res => {
          this.$alert(`${row.on_status === 'on' ? '下架' : '上架'}成功`, '提示', {
            confirmButtonText: '确定',
            type: 'success',
            callback: action => {
              this.loadData()
            }
          })
        })
      }).catch()
    },
    updateLabelStatus(row) {
      this.$msgbox({
        title: '确认消息',
        message: `确定将此条件${row.status === 'started' ? '停用' : '启用'}`,
        showClose: true,
        distinguishCancelAndClose: true,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            setTimeout(() => {
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }, 1000)
          } else {
            done()
          }
        }
      }).then((res) => {
        updateLabelStatus({ id: row.id, status: row.status === 'started' ? 'stopped' : 'started', label_type: row.label_type, create_type: row.create_type }).then(res => {
          if (res.code === '1' || res.code === 1) {
            this.$alert(`${row.status === 'started' ? '停用' : '启用'}成功`, '提示', {
              confirmButtonText: '确定',
              type: 'success',
              callback: action => {
                this.loadData()
              }
            })
          }
        })
      }).catch()
    },
    append(node, data, e) {
      this.isClassTree = true // 数据重载来源
      this.isAppendClassTree = true
      if (node.level < 3) {
        e.stopPropagation()
        // console.log(node,data,'tata')
        let seq = ''
        // if (node.data.children.length) {
        //   seq = node.data.children[0].seq_no + 1
        // } else {
        //   seq = node.data.children.length + 1
        // }
        if(data.children&&data.children.length){
          const arr =[]
          data.children.forEach((res)=>{
            arr.push(res.seq_no)
          })
          const maxNum = Math.max.apply(null,arr)
          console.log(maxNum)
          seq = maxNum + 1
        }else{
          seq =   1
        }

        const params = {
          'brand_code': node.data.brand_code,
          'class_name': '默认类目' + this.count++,
          'class_level': node.level,
          'parent_id': node.data.id,
          'seq_no': seq
        }
        addClass(params).then(res => {
          this.getClassTree()
        }).catch(() => {
          this.isAppendClassTree = false
        })
      }
    },
    remove(node, data, e) {
      e.stopPropagation()
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    view(row, info) {
      if (row.create_type && row.id) {
        let routerName
        if (row.label_type === 'rule') {
          routerName = this.actionRouteMap[row.label_type + '_' + row.create_type + '_edit']
        } else {
          routerName = this.actionRouteMap[row.label_type + '_edit']
        }
        this.$router.push({
          name: routerName,
          query: {
            id: row.id,
            create_type: row.create_type,
            view: true
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '缺少参数id或create_type'
        })
      }
    },
    edit(row) {
      if (row.create_type && row.id) {
        let routerName
        if (row.label_type === 'rule') {
          routerName = this.actionRouteMap[row.label_type + '_' + row.create_type + '_edit']
        } else {
          routerName = this.actionRouteMap[row.label_type + '_edit']
        }
        this.$router.push({
          name: routerName,
          query: {
            id: row.id,
            create_type: row.create_type
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '缺少参数id或create_type'
        })
      }
    },
    removeClassTree(node, date, e) {
      this.isClassTree = true // 数据重载来源
      this.isRemoveClassTree = true
      e.stopPropagation()
      deleteClass({ id: node.data.id }).then(res => {
        this.getClassTree()
      }).catch(() => {
        this.isRemoveClassTree = false
      })
    },
    allowDrop(draggingNode, dropNode, type) { // 目标节点能否放置
      if (dropNode.data.has_label && type === 'inner') { // 存在条件不可进去
        return false
      } else if ((draggingNode.level === 2 && draggingNode.childNodes.length && dropNode.level > 2) || (dropNode.level > 2 && type === 'inner')) { // 不可新增第三级元素
        return false
      } else if (dropNode.level === 1) { // 不可与根元素同级
        return false
      } else if ((draggingNode.level === 2 && draggingNode.childNodes.length) && dropNode.level !== 1 && type !== 'prev') { // 一级类目含有二级 不可inner after
        if ((draggingNode.level === 2 && draggingNode.childNodes.length) && (dropNode.level === 2 && !dropNode.childNodes.length) && type !== 'inner') { // 二级无元素，可拖拽上下
          return true
        }
        return false
      } else {
        return true
      }
    },
    editNode(node, date, e) { // 修改节点名称
      e.stopPropagation()
        this.editNodeId = node.id
        setTimeout(() => {
          document.getElementsByClassName('edit-node-name')[0].focus()
        })
    },
    nodeExpand(data, node, e) {
      this.expandedList.push(node.data.id)
      node.childNodes.forEach((item) => {
        if (item.level < 3 && item.childNodes.length) {
          item.expanded = true
          this.expandedList.push(item.data.id)
        }
      })
    },
    nodeCollapse(data, node) {
      this.expandedList.splice(this.expandedList.indexOf(node.data.id), 1) // 收起时删除数组里对应选项
    },
    flatArr(data) {
      let confirm = ''
      const firstArr = this.treeNodes[0]
      if (data === firstArr.brand) {
        confirm = 'error'
      } else {
        firstArr.children.forEach(ele => {
          if (data === ele.class_name) {
            if (this.editNodeId !== ele.$treeNodeId) {
              confirm = 'error'
            }
          } else {
            if (ele.children.length) {
              ele.children.forEach(child => {
                if (data === child.class_name) {
                  if (this.editNodeId !== child.$treeNodeId) {
                    confirm = 'error'
                  }
                }
              })
            }
          }
        })
      }
      return confirm
    },
    handleKeyDown(node, e, data, type) {
      if ((e.keyCode === 13 && data) || (type && data)) {
        if (this.editNodeId) {
          if (this.flatArr(data) !== 'error') {
            editClass({ id: node.data.id, class_name: data }).then(res => {
              this.editNodeId = ''
              this.getClassTree()
            })
          } else {
            this.$message({
              message: '类目名称不可重复',
              type: 'error'
            })
          }
        }
      } else {
        if ((!data && e.keyCode === 13) || (!data && type)) {
          this.$message({
            message: '类目名称不可为空',
            type: 'error'
          })
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      val.forEach(ele => {
        this.multipleSelection.push(ele.id)
      })
    },
    distributionTree() {
      var params = {
        class_id: this.distributionNode,
        label_id_list: this.multipleSelection
      }
      distributeClass(params).then(res => {
        this.$message({
          message: '分配成功',
          type: 'success'
        })
        this.$refs.setTree.setCheckedKeys([])
        this.getClassTree()
        this.distributionNode = ''
        this.distributeModalVisible = false
      })
    },
    openDistributeModal() {
      if (this.multipleSelection&&this.multipleSelection.length<1) {
           console.log(this.multipleSelection,'multipleSelection')
          this.$message({
          message: '请先选中分配条件',
          type: 'error'
        })
      }
      else{
        this.distributeModalVisible = true
        this.distributionNode = ''
      }
    },
    nodeClick(e, node) {
      this.searchForm.treeClickNode = node.data.id
      this.searchForm.isOrNot = ''
      this.searchForm.label_name = ''
      this.searchForm.create_user = ''
      this.searchForm.update_user = ''
      this.filterData()
    },
    handleDrop(draggingNode, dropNode, dropType, ev) { // 拖拽完成  发送排序
      const level = dropType === 'inner' ? dropNode.data.class_level + 1 : dropNode.data.class_level
      var params = {
        parent_id: '', // 拖入 dropNode.id  拖拽 根据同级元素 取父节点id
        class_level: level,
        children: []
      }
      if (dropType === 'before' || dropType === 'after') {
        if (dropNode.id === 0) {
          this.treeNodes.forEach(tree => {
            tree.children.forEach(child => {
              params.children.push({ id: child.data.id, seq_no: child.data.seq_no })
            })
          })
        } else {
          let resultArr = []
          this.treeNodes.forEach(tree => {
            tree.children.forEach(child => {
              if (child.id === dropNode.data.id) {
                resultArr = tree
              } else {
                if (child.children) {
                  child.children.forEach(last => {
                    if (last.id === dropNode.data.id) {
                      resultArr = child
                    }
                  })
                }
              }
            })
          })
          params.parent_id = resultArr.id ? resultArr.id : 0
          resultArr.children.forEach(result => {
            params.children.push({ id: result.id, seq_no: result.seq_no })
          })
        }
      } else {
        if (dropNode.childNodes.length) {
          params.parent_id = dropNode.data.id
          dropNode.childNodes.forEach(ele => {
            params.children.push({ id: ele.data.id, seq_no: ele.data.seq_no })
          })
        }
      }
      sortClass(params).then(res => {
        this.getClassTree()
      })
    },
    getCheck(a, b) {
      if (b.checkedKeys.length > 0) {
        this.$refs.setTree.setCheckedKeys([a.id])
        this.distributionNode = a.id
      }else{
        this.$refs.setTree.setCheckedKeys([])
        this.distributionNode =""
      }
    },
    rowDrop() { // 表格拖拽
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.list.splice(oldIndex, 1)[0]
          _this.list.splice(newIndex, 0, currRow)
        }
      })
    },
    getLabelByValue(value, list, opts) {
      if (!list || list.length === 0) return ''

      opts = opts || { valueKey: 'value', labelKey: 'label' }
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i][opts.valueKey] === value) {
          return list[i][opts.labelKey]
        }
      }
      return '-'
    }
  }
}
</script>
<style lang="less">
.page-container-scroll{
  // padding: 15px;
  height: 100%;
  // overflow: hidden;
  // background: white;
  display: flex;
  flex-direction: column;
  word-break: break-all;
}
.brand-label-pool-wrap {
  width: 100%;
  flex: 1;
  padding: 15px;
  margin-top: 10px;
  background: white;
  // overflow: auto;
  overflow: hidden;
  position: relative;
}
.label-category {
  width: 260px;
  position: absolute;
  top: 15px;
  left: 15px;
  min-height: 400px;
  height: calc(100% - 30px);
  // height: 100%;
  border: 1px solid #edeef4;
}
.brand-label-table-wrap {
  // flex: 1;
  // display: flex;
  // flex-direction: column;
  margin-left: 270px;
}
.el-tree-node__expand-icon {
  font-family: element-icons!important;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  font-size: 16px;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.el-tree-node__expand-icon.node::before {
  content: "\e723";
}
.expanded.el-tree-node__expand-icon {
  transform: none;
}
.expanded.el-tree-node__expand-icon.node::before {
  content: "\e722";
}
.el-tree-node__content .node-action-wrap{
  display: none;
}
.el-tree-node__content:hover .node-action-wrap {
  display: inline;
}
.node-label{
  display: inline-block;
  position: relative;
  min-height: 18px;
  min-width: 100px;
}
.edit-node-name{
    border: 1px solid #DCDFE6;
    // box-sizing: border-box;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 126px;
    height: 18px;
    font-size: 14px;
    color: #606266;
}

/deep/ .el-table{
  height: 100px;
}
/deep/ .el-dialog__body{
  background-color: #F5F7FA;
}
.distribution{
  min-height: 200px;
  max-height: 300px;
  overflow: auto;
  /deep/ .el-tree-node{
    line-height: 40px;
    /deep/ .el-tree-node__children{
      line-height: 40px;
    }
  }
}
.node-label{
  vertical-align: middle;
  width: 126px;
  overflow: hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}
.marketing-list-page-name-wrapper {
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  max-height: 50px;
}
</style>
