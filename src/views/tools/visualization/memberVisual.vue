<template>
  <div class="container task-scheduler-list">
    <div class="server-info">
      <el-link :href="form[0].visualLink" target="_blank" type="primary">{{ form[0].visualName }}</el-link>
    </div>
    <br>
    <div>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1" @click="handleSelect('1')">服务器现状</el-menu-item>
        <el-menu-item index="2" @click="handleSelect('2')">业务现状</el-menu-item>
        <el-menu-item index="3" @click="handleSelect('3')">数据现状</el-menu-item>
      </el-menu>
    </div>
    <br>
    <div>
      <el-form ref="form" label-width="100px">
        <el-row v-for="(item,index) in dataList1[0]" :key="index" >
          <el-col :span="8" >
            <el-form-item >
              <div v-if="dataList1[0][index].id != '41d3f95462b9431487e57dc661654fd5'">
                <el-link :href="dataList1[0][index].visualLink" target="_blank" type="primary">{{ dataList1[0][index].visualName }}</el-link>
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover">
                  <p>{{ dataList1[0][index].tipContent }}</p>
                  <div v-if="dataList1[0][index].account != undefined">
                    <p>账号：{{ dataList1[0][index].account }}</p>
                    <p>密码：{{ dataList1[0][index].password }}</p>
                  </div>
                  <i slot="reference" class="el-icon-question"><span style="color: white;">.</span></i>
                </el-popover>
              </div>
              <!--堆栈项，特殊处理-->
              <div v-if="dataList1[0][index].id === '41d3f95462b9431487e57dc661654fd5'" class="block">
                <el-link :href="item.visualLink + machineIp[1]" target="_blank" type="primary">{{ item.visualName }}</el-link>
                <el-popover
                  :content="dataList1[0][index].tipContent"
                  placement="top-start"
                  width="300"
                  trigger="hover">
                  <i slot="reference" class="el-icon-question"><span style="color: white;">.</span></i>
                </el-popover>
                <el-cascader
                  v-model="machineIp"
                  :options="applicationOption"
                  placeholder="可搜索机器"
                  filterable/>
              </div>
            </el-form-item>
          </el-col>
          <el-col v-if="dataList1[1][index] != undefined && dataList1[1].length > 0" :span="8">
            <el-form-item >
              <el-link :href="dataList1[1][index].visualLink" target="_blank" type="primary">{{ dataList1[1][index].visualName }}</el-link>
              <el-popover
                placement="top-start"
                width="300"
                trigger="hover">
                <p>{{ dataList1[1][index].tipContent }}</p>
                <div v-if="dataList1[1][index].account != undefined">
                  <p>账号：{{ dataList1[1][index].account }}</p>
                  <p>密码：{{ dataList1[1][index].password }}</p>
                </div>
                <i slot="reference" class="el-icon-question"><span style="color: white;">.</span></i>
              </el-popover>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getMemberVisualList, getStackList } from '@/api/memberVisual'
import { mapGetters } from 'vuex'

export default {
  name: 'MemberVisual',
  components: {
  },
  data() {
    return {
      activeIndex: '1',
      form: [], // 说明文档
      dataForm: [], // 可视化项列表
      dataList1: [[], []], // 列1
      dataList2: [], // 列2
      stackList: [], // 堆栈列表
      machine: { // 机器
        value: '',
        label: ''
      },
      machineOption: [], // 机器选项
      application: { // 应用
        value: '',
        label: '',
        children: []
      },
      applicationOption: [], // 应用选项
      machineIp: '' // 机器ip，用于连级选择器
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    // 获取说明文档
    getMemberVisualList({ visualType: 4 }).then(res => {
      this.form = res && res.data && res.data.list
    })
  },
  mounted() {
    // 获取可视化列表
    getMemberVisualList({ visualType: this.activeIndex }).then(res => {
      this.dataForm = res && res.data && res.data.list
      this.dataList1 = [[], []]
      this.dataList1[0] = []
      this.dataList1[1] = []
      for (var i = 0; i < this.dataForm.length; i++) {
        if (i < this.dataForm.length / 2) {
          this.dataList1[0].push(this.dataForm[i])
        } else {
          this.dataList1[1].push(this.dataForm[i])
        }
      }
      this.handleGetStackList()
    })
  },
  methods: {
    handleSelect(key) {
      this.activeIndex = key
      getMemberVisualList({ visualType: this.activeIndex }).then(res => {
        this.dataForm = res && res.data && res.data.list
        this.dataList1 = [[], []]
        this.dataList1[0] = []
        this.dataList1[1] = []
        for (var i = 0; i < this.dataForm.length; i++) {
          if (i < this.dataForm.length / 2) {
            this.dataList1[0].push(this.dataForm[i])
          } else {
            this.dataList1[1].push(this.dataForm[i])
          }
        }
      })
      this.handleGetStackList()
    },
    handleGetStackList() {
      // 获取堆栈列表 -> 处理成连级搜索情况
      getStackList().then(res => {
        this.applicationOption = []
        const stackReturnForm = res && res.data && res.data.list
        stackReturnForm.map(applicationItem => {
          this.machineOption = []
          applicationItem.machineList.map(machineItem => {
            this.machine = { label: machineItem.machineName, value: machineItem.machineIp }
            this.machineOption.push(this.machine)
          })
          this.application = { label: applicationItem.applicationName, value: applicationItem.id, children: this.machineOption }
          this.applicationOption.push(this.application)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px 15px;
}
.demo-table-expand {
    font-size: 0;
}
.server-info {
  position: absolute;
  right: 15px;
  top: 20px;
  // z-index: -1;
  text-align: right;
  & > div {
    padding: 5px 0 0;
  }
}
.text-blue {
  color: #409EFF;
}
/deep/.el-form {
  padding-top: 30px;
  background: white;
}

</style>
