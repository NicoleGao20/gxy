<template>
  <div class="platform">
    <div class="content">
      <div class="labelStyle">
        <div class="title">基本信息</div>
        <div class="storeFooter-header">
          <!-- <el-button class="top-operate-btn ml-20" type="primary" @click="openModifyPasswordModal">修改密码</el-button> -->
        </div>
      </div>
      <el-form ref="form" :model="info" :rules="rules" label-width="130px" class="demo-ruleForm">
        <el-row class="mt-10">
          <el-col :span="12" class="pr-20"><!-- :offset="6" 水平居中样式 -->
            <el-form-item :disabled="disableStatus" label="平台名称" prop="platformName">
              <el-input v-model="info.platformName" maxlength="100" size="small" placeholder="请输入平台名称"/>
            </el-form-item>
            <el-form-item label="平台地址" prop="platformLink">
              <el-input v-model="info.platformLink" size="small" maxlength="200" placeholder="请输入平台地址" />
            </el-form-item>
            <el-form-item label="平台描述">
              <el-input v-model="info.description"  
                :rows="2" maxlength="200"
                show-word-limit size="small" 
                type="textarea"
                placeholder="请输入平台描述"/>
            </el-form-item>
            <el-form-item label="平台图标" >
              <el-upload
                :action="uploadOss"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                accept=".jpg,.png"
                class="avatar-uploader">
                <img v-if="info.uri" :src="info.uri" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
               <span class="uploadImgTip">建议上传图片格式为.png ,.jpg的图片 ，大小不超过1M</span>
            </el-form-item>
          </el-col>
          <el-col :span="12"/>
        </el-row>
      </el-form>
    </div>
    <div class="storeFooter">
      <div class="labelStyle">
        <div class="title">关联角色</div>
        <div class="storeFooter-header">
          <el-button class="top-operate-btn ml-20" type="primary" @click="setRoles">设置角色</el-button>
        </div>
      </div>

      <template >
        <el-table
          :data="roleArr"
          style="width: 100%"
          max-height="340">
          <el-table-column
            fixed
            prop="name"
            label="角色名称"
            width="1400px"/>
          <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <div class="operation">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="deleteRow(scope.$index, roleArr, 'jurisdiction')">
                  查看权限
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="deleteRow(scope.$index, roleArr, 'delete')">
                  移除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="btns">
      <el-button class="top-operate-btn" @click="$router.back()">
        <i class="el-icon-arrow-left"/> 返回
      </el-button>
      <el-button class="top-operate-btn ml-20" type="primary" @click="save">保存</el-button>
    </div>
    <neo-add-dialog
      :show-type="13"
      :dialog-type="1"
      :source="roleArr"
      :dialog-show.sync="roleChange"
      @save="saveIsSelectChoice"
    />
    <el-dialog
      :visible.sync="jurisdiction"
      :width="'1000px'"
      :height="'1000px'"
      :close-on-click-modal="false"
      title="查看权限"
      @close="jurisdiction = false"
    >
      <el-row class="mt-10">
        <div class="titleIcon">菜单权限</div>
        <el-container class="container">
          <el-aside width="300px" class="aside-left">
            <el-tree
              :data="menuTree"
              :props="defaultProps"
              :default-expanded-keys="expanded_keys"
              @node-click="handleNodeClick"
            />
          </el-aside>
          <el-main v-if="cities.length != 0 || actioncities.length != 0 || tableData3.length != 0">
            <el-col :span="24">
              <div class="main-header">查询条件</div>
            </el-col>
            <el-col :span="24">
              <div v-if="cities.length !== 0" class="main-check">
                <el-checkbox-group v-model="checkedCities">
                  <el-checkbox
                    v-for="city in cities"
                    :label="city.id"
                    :key="city.id"
                    disabled
                  >{{ city.name }}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-else class="main-check">无</div>
            </el-col>
            <el-col :span="24">
              <div class="main-header">动作权限</div>
            </el-col>
            <el-col :span="24">
              <div v-if="actioncities.length !==0" class="main-check">
                <el-checkbox-group v-model="actionCities">
                  <el-checkbox
                    v-for="city in actioncities"
                    :label="city.id"
                    :key="city.id"
                    disabled
                  >{{ city.name }}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-else class="main-check">无</div>
            </el-col>
            <el-col :span="24">
              <div class="main-header">
                字段权限
                <span>*如果当前角色设置了“新增/导入”操作，*必填字段默认“读写”</span>
              </div>
            </el-col>
            <el-table
              ref="multipleTable"
              :data="tableData3"
              :header-cell-style="{background:'#F5F7FA'}"
              tooltip-effect="dark"
              style="width: 100%;text-align: center;"
            >
              <el-table-column prop="name" label="字段名称" width="120"/>
              <el-table-column
                :selectable="checkboxSelect"
                prop="radio2"
                type="selection"
                width="30"
                disabled="true"
              />
              <el-table-column label="可见" show-overflow-tooltip/>
            </el-table>
          </el-main>
          <el-main v-else class="irrelevant">
            <div>*当前选中一级／二级菜单，勾选当前菜单，默认选中下级菜单所有权限，</div>
            <div>若需要单独设置，请点击具体菜单进行设置</div>
          </el-main>
        </el-container>
      </el-row>
      <!-- <el-row class="mt-10">
        <div class="titleIcon">数据权限</div>
        <el-col :span="24" class="rule">
          <el-col :span="4">规则名称</el-col>
          <el-col :span="8">规则类型</el-col>
          <el-col :span="8">规则条件</el-col>
        </el-col>
        <el-col v-if="permission" :span="24" class="rule">
          <el-col :span="4">{{ dataFilterParamIdName }}</el-col>
          <el-col :span="8">
            <el-input :placeholder="placeholder" :disabled="true" style="width: 180px" size="small"/>
          </el-col>
          <el-col :span="10">
            <el-row>
              <el-input
                :placeholder="deplaceholder"
                :disabled="true"
                style="width: 180px"
                size="small"
              />
            </el-row>
          </el-col>
        </el-col>
      </el-row> -->
    </el-dialog>
  </div>
</template>
<script>
import { apiObj } from '@/config/getUrl.js'
import Cookies from 'js-cookie'
import { getSingleMenuJurisdictionData } from '@/api/permissions'
import showAddDialog from '@/components/showAddDialog/index.vue'
import { getPlatformsDetail, updataPlatforms, addPlatforms } from '@/api/platform'
import { getFunction } from '@/api/permissions'
import { V2 } from '@/api/login'
export default {
  name: 'EmployeeListDetail',
  components: { // 挂载组件
    'neo-add-dialog': showAddDialog
  },
  data() {
    var isMobileNumber = (rule, value, callback) => {
      if (!value) {
        return new Error('请输入电话号码')
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        const isPhone = reg.test(value)
        value = Number(value) // 转换为数字
        if (typeof value === 'number' && !isNaN(value)) { // 判断是否为数字
          value = value.toString() // 转换成字符串
          if (value.length < 0 || value.length > 12 || !isPhone) { // 判断是否为11位手机号
            callback(new Error('手机号码格不正确！'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请输入电话号码'))
        }
      }
    }
    // var isMail = (rule, value, callback) => {
    //   var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    //   if (value != '' && !regEmail.test(value)) {
    //     callback(new Error('邮箱格式不对！'))
    //   }
    // }
    const validCode = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请输入员工编号'))
      } else {
        const reg = /^[0-9a-zA-Z]+$/
        if (!reg.test(value)) {
          callback(new Error('请输入数字或者字母'))
        } else {
          callback()
        }
      }
    }
    return {
      uploadOss: `${apiObj.uploadOss}/val`,
      passwordModal: false, // 修改密码弹框
      dataFilterParamIdName: '',
      placeholder: '',
      deplaceholder: '',
      permission: true,
      userId: '', // 查看权限id
      cities: [], // 查询数组
      checkedCities: [], // 查询选中
      actioncities: [], // 动作数组
      actioncities: [], // 动作选中
      tableData3: [], // 数组权限
      expanded_keys: [], // 节点点亮
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuTree: [], // 树
      jurisdiction: false, // 查看权限弹框
      formMenu: '', // 门店值
      formStore: '', // 区域值
      isSelectArr: [], // 门店数组
      source: [], // 区域已选数组
      regionChange: false, // 区域弹框
      storeChange: false, // 门店弹框
      roleArr: [], // 角色选择数组
      roleChange: false, // 角色选择弹框
      id: '',
      storeList: [],
      breadcrumbText: '',
      radio: '1',
      radio1: '1',
      info: {
        id: '',
        platformName: '',
        platformLink: '',
        uri: '',
        description: ''
      },
      disableStatus: false,
      sellType: [
        { value: 0, text: '不限' },
        { value: 1, text: '堂食' },
        { value: 2, text: '外卖' }
      ],
      rules: {
        platformLink: [
          { required: true, message: '请输入平台地址', trigger: 'blur' }
        ],
        platformName: [
          { required: true, message: '请输入平台名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.getData()
      this.breadcrumbText = '编辑员工信息'
    } else {
      this.breadcrumbText = '新增员工信息'
    }
    // this.getStores() // 门店数据
  },
  methods: {
    	// 点击树结构
    handleNodeClick(value) {
      this.actioncities = [] // 动作
      this.actionCities = [] // 动作（选中）
      this.checkedCities = [] // 名称字段
      this.cities = [] // 名称字段（选中）
      this.tableData3 = [] // 字段权限
      if ((value.functionType == 3 || value.functionType == 4) && value.hasOwnProperty('children') == false) {
        // axios.get(`${config.url}/permissions/role/${this.userId}/functionFile/${value.id}`).then(res => {
        // 	if (res.data.code == 0) {
        // 		this.getListData(res.data.body)
        // 	}
        // })
        getSingleMenuJurisdictionData(this.id, value.id).then((res) => {
          if (res.code == 0) {
            this.getListData(res.body)
          }
        })
      } else if (value.functionType == 4) {
        // axios.get(`${config.url}/permissions/role/${this.userId}/functionFile/${value.id}`).then(res => {
        // 	this.functionId = value.id
        // 	let data = res.data.body
        // 	this.getListData(data)
        // })
        getSingleMenuJurisdictionData(this.id, value.id).then((res) => {
          if (res.code == 0) {
            this.getListData(res.body)
          }
        })
      }
    },
    getListData(data) {
      for (let index = 0; index < data.functionFields.length; index++) { // (3)
        const query = {
          name: data.functionFields[index].showName,
          id: data.functionFields[index].id
        }
        this.tableData3.push(query)
        if (data.functionFields[index].checked == 'Y') {
          this.toggleSelection(index)
        }
      }
      data.functionOperations.forEach(element => { // (2)
        const query = {
          name: element.showName,
          id: element.id
        }
        this.actioncities.push(query)
        if (element.checked == 'Y') {
          this.actionCities.push(element.id)
        }
      })

      // (1)
      data.functionQueryFields.forEach(element => {
        const query = {
          name: element.showName,
          id: element.id,
          variation: false
        }
        this.cities.push(query)
        if (element.checked == 'Y') {
          this.checkedCities.push(element.id)
        }
      })
    },
    handleAvatarSuccess(response, file) {
      // console.log(res,file,9)
      this.info.uri = response.body.url
      console.log(this.info.uri)
    },
    beforeAvatarUpload(file) {
      if(file.name&&!this.isImgage(file.name)){
        this.$message.error('请上传格式为 JPG、PNG的图片');
        return false
      }
      const isLt2M = file.size / 1024 /1024 > 1;
      if (isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
        return  false;
      }
    },
    isImgage(name,type){
      var reg =/\.[jpg|png]/i ;
      console.log(name.match(reg))
      return name.match(reg)
    },
    sendEmail: function() {
      var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (this.info.email != '' && !regEmail.test(this.info.email)) {
        this.$message({
          message: '邮箱格式不正确',
          type: 'error'
        })
        this.info.email = ''
      }
    },
    getData() {
      // const that = this;
      getPlatformsDetail({
        id: this.id
      }).then((res) => {
        if (res.body.hasOwnProperty('roles')) {
          this.roleArr = res.body.roles
        }
        if (res.body.hasOwnProperty('organizations')) {
          this.source = res.body.organizations.body
        }
        this.info = res.body
        delete this.info.roles
        delete this.info.organizations
        // this.info.sex = this.info.sex.toString()
        // this.info.onJob = this.info.onJob.toString()
        // res.body.organizations.forEach(element => {
        // 	this.source.push(element.id)
        // });
        this.formStore = this.source.length > 0 ? '已选' + this.source.length : ''
      })
    },
    // 配置角色
    setRoles() {
      this.roleChange = true
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    saveIsSelectChoice(products) {
      this.roleArr = products
    },
    deleteRow(index, val, type) {
      if (type == 'jurisdiction') {
        this.jurisdiction = true
        this.getSee(val[index])
        this.getTree()
      } else if (type == 'delete') {
        this.$confirm('是否移除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.roleArr.splice(index, 1)
        }).catch(() => {})
      }
    },
    // 获取树结构
    getTree() {
      const platformCode = Cookies.get('platformCode')
      V2({}, platformCode).then((res) => {
        const object = res.body
        const TreeArr = []
        object.forEach(element => {
          const father = {
            id: element.id,
            name: element.showName,
            functionType: element.functionType,
            children: []
          }
          if (element.functionList && element.functionList.length > 0) {
            element.functionList.forEach(val => {
              const list = {
                id: val.id,
                name: val.showName,
                functionType: val.functionType
              }
              if (val.hasOwnProperty('subFunctionList')) {
                list.children = []
                val.subFunctionList.forEach(value => {
                  const level = {
                    id: value.id,
                    name: value.showName,
                    functionType: value.functionType
                  }
                  list.children.push(level)
                })
              }
              father.children.push(list)
            })
          }

          TreeArr.push(father)
        })
        this.menuTree = TreeArr
      })
    },
    getSee(item) {
      const platformCode = Cookies.get('platformCode')
      this.userId = item.id
      getFunction({
        id: item.id
      }, platformCode).then(res => {
        if (res.code == 0) {
          let object = res.body, Effective = []
          object.functionGroupList.forEach(item => {
            if (item.checked == 'Y') {
              Effective.push(item.id)
            }
            if (item.functionList && item.functionList.length > 0) {
              item.functionList.forEach(val => {
                if (val.hasOwnProperty('subFunctionList') && val.subFunctionList.length != 0) {
                  val.subFunctionList.forEach(value => {
                    if (value.checked == 'Y') {
                      Effective.push(value.id)
                    }
                  })
                } else {
                  if (val.checked == 'Y') {
                    Effective.push(val.id)
                  }
                }
              })
            }
          })
          if (object.filterList.length == 0) {
            this.permission = false
          }
          object.filterList.forEach(element => {
            if (element.type != 0) {
              this.permission = true
              this.dataFilterParamIdName = element.paramDescription
              if (element.type == 1) {
                this.placeholder = '规则匹配'
                this.deplaceholder = element.filterParams.storeCode.length > 0 ? '已选' + element.filterParams.storeCode.length : ''
              } else {
                this.placeholder = '指定值'
                this.deplaceholder = `= ${element.paramDescription}`
              }
            } else {
              this.permission = false
            }
          })
          this.NewfieldQueryList = Effective
          this.NewfieldQueryList.forEach(val => {
            this.$nextTick(() => {
              this.checked_keys.push(val)
              this.expanded_keys.push(val)
            })
          })
          this.checked_keys = []
        }
      })
    },
    submit() {
      let roleIds = [], organizationIds = []
      const subParam = JSON.parse(JSON.stringify(this.info))
      subParam.deleted = subParam.deleted ? 1 : 0
      // subParam.organizationIds = this.source
      if (this.source.length != 0) {
        this.source.forEach(element => {
          organizationIds.push(element.id)
        })
        subParam.organizationIds = organizationIds
      }
      if (this.roleArr.length != 0) {
        this.roleArr.forEach(element => {
          roleIds.push(element.id)
        })
        subParam.roleIds = roleIds
      } else {
        subParam.roleIds = roleIds
      }

      if (this.id) {
        updataPlatforms(subParam).then((res) => {
          if (res.code == 0) {
            this.$message.success('更新成功')
            this.$router.go(-1)
          }
        })
      } else {
        addPlatforms(subParam).then((res) => {
          if (res.code == 0) {
            this.$message.success('保存成功')
            this.$router.go(-1)
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .platform {
    margin-bottom: 50px;
    .top-operate-btn {
        width: 80px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        font-size: 13px;
    }
    .content {
        padding: 20px;
        min-height: 150px;
        max-height: calc(100vh - 175px);
        overflow-y: auto;
        background-color: #fff;
        .dialog-content {
            padding: 20px;
        }
        .ico-location {
            width: 12px;
        }
        .width130 {
            width: 130px;
        }
    }
    .search-input {
        width: 280px;
    }
    .datePicker{
        width: 100%;
    }
    .map-container {
        width: 100%;
        height: 230px;
        margin-top: 15px;
        background-color: #f7f7f7;
    }
    .store {
        padding: 10px;
        max-height: calc(100vh - 175px);
        overflow-y: auto;
        background-color: #fff;
        display: flex;
        margin-left: 48px;
        justify-content: left;
        .store-content {
            display: flex;
            justify-content: flex-start;
        }
        .store-span{
            line-height: 30px;
            margin-right: 20px;
        }
    }
    .labelStyle{
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title{
        font-size: 15px;
        color: #697b9b;
        border-left: 3px solid #697b9b;
        padding-left: 10px;
      }
    }
    .storeFooter {
        padding: 20px;
        max-height: calc(100vh - 175px);
        overflow-y: auto;
        background-color: #fff;
        margin-top: 20px;
    }
    .storeFooter-header{
        display: flex;
        justify-content: flex-end;
        float: right;
    }
    .operation{
        display: flex;
        justify-content: flex-start;
    }

}
.btns {
  position: fixed;
  bottom: 0;
  left: 200px;
  right: 0;
  line-height: 50px;
  // height: 50px;
  background: white;
  text-align: center;
    // display: flex;
    // justify-content: center;
}
.titleIcon{
    border-left: 3px solid #FF7D00;
    margin-bottom: 18px;
    position: relative;
    padding-left: 10px;
}

.container{
    height: 480px;
}

.main-header{
    padding:20px;
    font-size: 13px;
    color: #FF7D00;
    background: #FFF8F2;
    span{
        color: #909399;
        margin-left: 5px;
    }
}
.rule{
    border-top: 1px solid #EBEBEB;
    border-bottom: 1px solid #EBEBEB;
    padding:20px;
}

.main-check{
    padding: 20px;
    background: #FCFCFD;
}

.irrelevant{
    text-align: center;
    padding-top: 200px;
}
</style>
