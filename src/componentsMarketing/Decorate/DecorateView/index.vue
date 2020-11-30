<template>
  <div class="decorate-editarea-panel dc-view-page">
    <i id="decorate-arrow-up" class="el-icon-arrow-up"/>
    <i id="decorate-arrow-down" class="el-icon-arrow-down"/>
    <ul class="silder" >
      <li v-show="savebtn" title="另存到模版市场" @click="onsave(seletedId)" >
        <i class=" iconfont icon-73"/>
        另存
      </li>
      <li v-show="deleteShow" @click="deleted(seletedId)">
        <i class="el-icon-delete"/>
        删除
      </li>
    </ul>
    <draggable
      :list="list"
      :options="options"
      class="decorate-editarea-container decorate-show-content"
      @start="start"
      @end="end"
      @add="add">
      <div
        v-for="(element, index) in list"
        :key="element.id"
        class="dc-view-content"
      >
        <div id="ignore-element" class="header ignore-element"> + </div>
        <div :class="{ 'board-item': true, 'selected-style': element.id == seletedId}" @click="selected(element.id)">
          <div v-if="element.id == seletedId" class="handle" @click="onContainer($event,element)"/>
          <div class="line" />
          <viewComponts :item="element" :save="save" />
        </div>
        <div
          v-if="list.length === index
          + 1"
          id="ignore-element"
          class="header ignore-element"> + </div>
      </div>
    </draggable>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="新增"
      width="50%">
      <el-form-renderer ref="ruleForm" :content="form" label-width="100px"/>
      <div>
        <div class="form-name"><span>*</span>模版图片</div>
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
          action="/system/file/upload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onsaveYes()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import draggable from 'vuedraggable'
import viewComponts from './viewComponts'
import { mapState } from 'vuex'
import { getDataDictionaries, addSamplePlate } from '@/api/decorate'
import UUID from 'uuidjs'
export default {
  name: 'DecorateShow',
  components: {
    draggable,
    viewComponts
  },
  props: {
    type: {
      type: String,
      default: 'try'
    }
  },
  data() {
    return {
      form: [],
      imageUrl: '',
      dialogVisible: false,
      deleteShow: false, // 删除按钮
      savebtn: false, // 保存按钮
      options: {
        group: { name: 'decorate', revertClone: false, put: ['decorate', 'decorateBase', 'decorateChildren', 'decorateCustom', 'decorateSystem'] },
        sort: true,
        scroll: true,
        scrollSensitivity: 100,
        handle: '.handle',
        filter: '.ignore-element',
        swapThreshold: 1,
        emptyInsertThreshold: 35
      },
      newList: [],
      ismove: false,
      y: 0
    }
  },
  computed: mapState({
    list: state => {
      return state.decorate.list
    },
    iconList: state => {
      return state.decorate.iconList
    },
    seletedId: state => {
      return state.decorate.seletedId
    },
    manyId: state => {
      return state.decorate.manyId
    },
    roles: state => {
      return state.user.roles
    }
  }),
  watch: {
    seletedId(val, oldval) {
      const newDatalist = this.list.find(res => res.id === val) // 查找选中组件数据
      if (newDatalist) {
        if (newDatalist.controlDelete) { // 判断是否有删除权限
          if (this.roles.find(res => res.no === 'A0010')) {
            this.deleteShow = true
          } else {
            this.deleteShow = false
          }
        } else {
          this.deleteShow = true
        }
        if (this.$route.meta.title === 'layoutTemplateEdit') {
          this.deleteShow = false
        } else {
          this.deleteShow = true
        }
        if (newDatalist.type === 'blank') {
          this.savebtn = true
        } else {
          this.savebtn = false
        }
      }
    }
  },
  async created() {
    await getDataDictionaries('DECORATE_TEMPLATE').then(res => {
      this.typelist = res.data.list
      this.form = [
        {
          $type: 'select',
          $id: 'typeName',
          label: '模版类型',
          rules: [
            {
              required: true,
              message: '请模版类型',
              trigger: 'blur',
              transform: v => {
                return v && v.trim()
              }
            }
          ],
          inputFormat: (data) => {
            this.imageUrl = data.effectPic
            return data.type
          },
          $options: this.typelist.map(f => ({ label: f.name, value: f.value })),
          $el: {
            placeholder: '请选择'
          }
        },
        {
          $type: 'input',
          $id: 'name',
          label: '模版名称',
          rules: [
            {
              required: true,
              message: '请输入模版名称',
              trigger: 'blur',
              transform: v => {
                return v && v.trim()
              }
            }
          ],
          $el: {
            style: 'width:300px',
            placeholder: '请输入模版名称'
          }
        }
      ]
    })
  },
  mounted() {
    this.newList = Array.isArray(this.list) ? this.list : JSON.parse(JSON.stringify(this.list))
    this.save()
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const format = ['image/jpeg', 'image/png']
      const isJPG = format.find(res => res === file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片支持png或jpg!')
      }
      if (!isLt2M) {
        this.$message.error('上传头图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    onsave() {
      this.dialogVisible = true
    },
    onsaveYes() {
      this.$confirm('确认保存？')
        .then(_ => {
          const content = this.list.find(res => res.id === this.seletedId)
          const ruleFormValue = this.$refs.ruleForm.value
          const obj = {
            'content': JSON.stringify(content),
            'effectPic': this.imageUrl,
            'name': ruleFormValue.name,
            'type': ruleFormValue.typeName,
            'ver': 2
          }
          this.imageUrl = ''
          addSamplePlate(obj).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.dialogVisible = false
          })
        })
        .catch(_ => {})
    },
    handleClose(done) {
      done()
    },
    onContainer(event, data) {
      event.stopPropagation()
      // if (data.editor) {
      //   this.$store.dispatch('setID', data.id)
      //   this.$store.dispatch('setContentId', '')
      //   this.$store.dispatch('setManyId', '')
      // } else {
      const manyId = this.manyId || data.content[0].id
      this.$store.dispatch('setID', data.id)
      this.$store.dispatch('setContentId', '')
      this.$store.dispatch('setManyId', manyId)
      // }
    },
    start(evt) {
      document.getElementById('decorate-arrow-up').style.display = 'block'
      document.getElementById('decorate-arrow-down').style.display = 'block'
    },
    end(evt) {
      const dom = document.getElementsByClassName('ignore-element')
      for (let index = 0; index < dom.length; index++) {
        dom[index].style.display = 'none'
      }
      document.getElementById('decorate-arrow-up').style.display = 'none'
      document.getElementById('decorate-arrow-down').style.display = 'none'
    },
    add(evt) {
      const uuid = UUID.generate() // 获取唯一id
      this.newList = JSON.parse(JSON.stringify(this.list)) // 复制对象
      this.newList[evt.newIndex].id = uuid // 设置放进来的组件的id
      console.log(uuid, 999999000000000)
      if (this.roles.find(res => res.no === 'A0010')) {
        this.newList[evt.newIndex].controlDelete = true
      }
      const result = this.iconList.find(res => res.type === 'decorate') // 寻找内容组件
      // 找到空白容器组件数据
      let oneListdata = result ? result.list.find(res => res.type === 'blank') : ''
      oneListdata = JSON.parse(JSON.stringify(oneListdata))
      for (var i = 0; i < this.newList.length; i++) {
        if (this.newList[i].isContent && this.newList[i]) {
          this.newList[i].top = 0
          this.newList[i].left = 0
          const arr = []

          arr.push(this.newList[i])
          this.newList[i] = oneListdata
          const listId = UUID.generate()
          this.newList[i].id = listId

          const contentId = UUID.generate()
          this.newList[i].content[0].id = contentId
          this.newList[i].content[0].children = arr

          this.save()
          this.$store.dispatch('setID', listId)
          this.$store.dispatch('setManyId', contentId)
          return
        } else {
          if (this.newList[i].content[0] && !this.newList[i].content[0].id) {
            this.newList[i].content[0].id = UUID.generate()
          }
        }
      }
      this.save()
    },
    save() {
      this.$store.dispatch('merge', this.newList)
    },
    selected(id) {
      console.log(id, 19)
      const item = this.list.find(res => res.id === id)
      this.$store.dispatch('setID', id)
      this.$store.dispatch('setContentId', '')
      if (item.content.length === 0) {
        return
      }
      this.$store.dispatch('setManyId', item.content[0].id)
    },
    deleted(id) {
      this.newList = JSON.parse(JSON.stringify(this.list))
      const index = this.newList.findIndex(res => res.id === id)
      this.newList.splice(index, 1)
      this.$store.dispatch('merge', this.newList)
      this.$store.dispatch('setID', 0)
    }
  }
}
</script>
<style lang="less" scoped>
  .decorate-editarea-panel {
    position: relative;
    width: 375px;
    height: 100%;
    max-height: 667px;
    background: #f4f4f4;
    user-select: none;
    box-shadow:  0 0 5px 2px #ddd;
    .form-name {
      width: 15%;
      text-align: right;
      span {
        margin-right: 5px;
        color:#F56C6C;
      }
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      font-weight: 700;
    }
    /deep/.avatar-uploader {
      padding-left: 15%;
    }
    /deep/.avatar-uploader .el-upload {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 178px;
      height: 178px;
      border: 1px dashed #d9d9d9;
    }
    .el-icon-arrow-up {
      display: none;
      z-index: 2;
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translate(-50%);
      color: #0989e8;
    }
    .el-icon-arrow-down {
      display: none;
      z-index: 2;
      position: absolute;
      bottom: 0px;
      left: 50%;
      transform: translate(-50%);
      color: #0989e8;
    }
    .decorate-editarea-container {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        position: absolute;
        right: 0;
        top:0;
        width: 0px;
        background-color: #F5F5F5;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color:rgba(0,0,0,.1);
      }
      &::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: transparent;
      }
      .board-item {
        position: relative;
        width: 100%;
        &:hover {
          .handle {
            display: block;
          }
        }
      }
    }
    .other {
      width: 100%;
      height: 100%;
      text-align: center;
      border: 1px solid #ddd;
    }
    .ignore-element {
      z-index: 900000;
      display: none;
      width: 100%;
      height: 30px;
      color: #fff;
      text-align: center;
      font-size: 30px;
      background: #72b6f0;
      line-height: 30px;
    }
    .silder {
      position: absolute;
      top: 60px;
      right: -70px;
      width: 60px;
      height: 60px;
      z-index: 1;
      li {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 60px;
        font-size: 12px;
        margin-bottom:5px;
        background: #fff;
        &:hover {
          background: #609ee9;
            color: #fff;
            .el-icon-delete {
              &:before {
                color: #fff;
              }
            }
        }
        .el-icon-delete {
          &:before {
            color: #000;
            font-size: 20px;
          }
        }
      }
    }
    .selected-style {
      z-index:1000;
      &:before, &:after {
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 100%;
        content:'';
        z-index:999;
        border-left: 1px solid #67b1f0;
      }
      &:after {
        left: auto;
        right: 0;
      }
      .line {
        &:before, &:after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          z-index:999;
          content:'';
          border-bottom: 1px solid #67b1f0;
        }
        &:after {
          top: auto;
          bottom: 0;
        }
      }
    }
    .handle {
      display: none;
      position: absolute;
      top: 0;
      left: 50%;
      width: 30px;
      height: 20px;
      z-index: 9999999;
      background: #ddd url('/static/decorate/drag-header.png') 0 0 no-repeat;
      transform: translateX(-50%);
      z-index: 100;
      cursor: pointer;
      background-size: 100%;
    }
    .size-footer {
      position: absolute;
      bottom: -10px;
      left: 50%;
      margin-left: -10px;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 2px;
      box-shadow: 0 0 5px 2px #ddd;
    }
  }
</style>
<style lang="less">
.dc-view-page {
  .decorate-show-content {
      .draggable-icon {
        z-index: 1000;
        width: 0px;
        height: 0px;
        opacity: 0;
      }
 }
}
</style>

