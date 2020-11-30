<template>
  <div class="dec-config-option-component">
    <el-dialog
      :visible.sync="editpop"
      :before-close="handleClose"
      :title="name"
      width="500px">
      <ul>
        <li>
          <div class="item">
            应用类型：
            <el-select v-model="editList.type" placeholder="请选择" @change="ontypeChange">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </div>
          <div v-if="editList.type === 'radio'" class="item">
            单选数据：
            <section>
              <div v-for="(item,index) in editList.option" :key="index" class="optionData">
                <div>
                  名称: <el-input v-model="item.name" style="width:100px" placeholder="请输入内容"/>
                </div>
                <div>
                  值: <el-input v-model="item.value" style="width:100px" placeholder="请输入内容"/>
                </div>
                <el-button type="danger" icon="el-icon-delete" @click="ondelete(index)"/>
              </div>
              <footer>
                <el-button @click="onaddOption()">+</el-button>
              </footer>
            </section>
          </div>
          <div class="item">
            配置名称：
            <el-input v-model="editList.name" style="width:200px;" placeholder="请输入内容"/>
          </div>
          <div class="item">
            配置字段：
            <el-input v-model="editList.pop" style="width:200px;" placeholder="请输入内容"/>
          </div>
          <div class="item" title="子元素组件序号">
            组件序号：
            <el-input v-model="editList.index" style="width:100px;" placeholder="例：1"/>
          </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="onIsOk">确 定</el-button>
      </span>
    </el-dialog>
    <footer>
      <el-button
        plain
        @click="onadd()"> +
      </el-button>
    </footer>
  </div>
</template>
<script>
import ComTitle from '@/components/Decorate/DecorateEditor/editorChildComponent/comTitle'
import { mapState } from 'vuex'
export default {
  name: 'ConfigOption',
  components: {
    ComTitle
  },
  data() {
    return {
      name: '编辑',
      option: [{
        name: '',
        value: ''
      }],
      typeList: [
        { label: '输入框', value: 'input' },
        { label: '数字输入框', value: 'inputNumber' },
        { label: '颜色选择', value: 'color' },
        { label: '上传图片', value: 'upload' },
        { label: '单选', value: 'radio' }
      ]
    }
  },
  computed: {
    ...mapState({
      editList: state => state.decorateComponents.editList,
      editpop: state => state.decorateComponents.editpop
    })
  },
  mounted() {
  },
  methods: {
    onaddOption() {
      this.$store.dispatch('setEditListOption', 'add')
    },
    ondelete(index) {
      console.log(index)
      this.$store.dispatch('setEditListOption', index)
    },
    ontypeChange(data) {
      if (this.editList.type === 'radio') {
        this.$store.dispatch('setEditListOption')
      }
    },
    onadd() {
      this.name = '添加'
      this.$store.dispatch('setEditList', 1)
    },
    handleClose(done) {
      this.name = '编辑'
      this.$store.dispatch('setEditList', '')
    },
    onIsOk(data) {
      this.name = '编辑'
      this.$store.dispatch('setEditListOk')
    }
  }
}
</script>
<style lang="less" scoped>
  .dec-config-option-component {
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    .optionData {
      display: flex;
      margin-top: 10px;
      div {
        margin-right:10px;
      }
    }
    li {
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      padding-top: 0;
      margin-top: 10px;
      border-radius: 4px;
      .item {
        width: 100%;
        margin-top: 10px;
        &>section {
          margin-left: 50px;
        }
      }
    }
    footer {
      display: flex;
      margin-top: 10px;
      justify-content: flex-end;
    }
  }
</style>

