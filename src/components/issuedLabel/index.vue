<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="下发标签"
      width="40%">
      <section>
        <el-form label-position="right" label-width="80px">
          <div class="transfer">
            <aside class="operating operating-left">
              <header>
                <el-checkbox v-model="selectBox" label="品牌列表" name="type" @change="handChange"/>
                <span>({{ checkList.length }}/{{ list.length }})</span>
              </header>
              <main>
                <el-input
                  v-model="leftSearch"
                  size="mini"
                  placeholder="查询内容"
                  prefix-icon="el-icon-search"
                  clearable/>
                <div class="scroll">
                  <el-checkbox-group v-model="checkList">
                    <template v-for="(item,index) in list" >
                      <!--                      <el-checkbox v-show="language === 'zh'?item.brandCName.includes(leftSearch):item.brandEName.includes(leftSearch)" :key="index" :label="language === 'zh'?item.brandCName:item.brandEName" name="type"/>-->
                      <el-checkbox v-show="item.brandName.includes(leftSearch)" :key="index" :label="item.brandName" name="type"/>
                    </template>
                  </el-checkbox-group>
                </div>
              </main>
            </aside>
            <aside class="operating operating-right">
              <header>
                <p>已选中品牌 ({{ submitArr.length }})</p>
                <span class="del-btn" @click="delAll">删除已选</span>
              </header>
              <main>
                <el-input
                  v-model="rightSearch"
                  size="mini"
                  placeholder="查询内容"
                  prefix-icon="el-icon-search"
                  clearable/>
                <div class="scroll">
                  <el-checkbox-group v-model="submitArr">
                    <template v-for="(item,index) in list" >
                      <el-checkbox v-show="item.brandName.includes(rightSearch)" v-if="checkList.includes(item.brandName) && language === 'zh'" :key="index" :label="item.brandName" name="type">
                        <template slot-scope="scope">
                          <span>{{ scope.row }}</span>
                          <i class="el-icon-delete" @click="delCurrent(item.brandName)"/>
                        </template>
                      </el-checkbox>
                      <el-checkbox v-show="item.brandName.includes(rightSearch)" v-if="checkList.includes(item.brandName) && language === 'en'" :key="index" :label="item.brandName" name="type">
                        <template slot-scope="scope">
                          <span>{{ scope.row }}</span>
                          <i class="el-icon-delete" @click="delCurrent(item.brandName)"/>
                        </template>
                      </el-checkbox>
                    </template>
                    <i class="el-icon-delete"/>
                  </el-checkbox-group>
                </div>
              </main>
            </aside>
          </div>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModel">取 消</el-button>
        <el-button type="primary" @click="updata">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { queryBrandList } from '@/api/employ'
export default {
  name: 'IssuedLabel',
  props: {
    dynamicTags: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      leftSearch: '',
      rightSearch: '',
      dialogVisible: true,
      value: '',
      selectBox: false,
      list: [],
      checkList: [],
      submitArr: [],
      language: ''
    }
  },
  watch: {
    checkList(val) {
      this.checkList.length === this.list.length ? this.selectBox = true : this.selectBox = false
      this.submitArr = val
    }
  },
  mounted() {
    this.init()
    this.language = this.$store.getters.language
    if (this.dynamicTags.length) {
      this.dynamicTags.forEach(ele => {
        // if (this.language === 'zh') {
        //   this.checkList.push(ele.brandCName)
        //   this.submitArr.push(ele.brandCName)
        // } else {
        //   this.checkList.push(ele.brandEName)
        //   this.submitArr.push(ele.brandEName)
        // }
        this.checkList.push(ele.brandName)
        this.submitArr.push(ele.brandName)
      })
    }
  },
  methods: {
    init() {
      queryBrandList({ params: {}}).then((res) => {
        if (res.code == 0) {
          this.list = res.body
        }
      })
    },
    handChange(val) {
      if (val) {
        this.checkList = []
        this.list.forEach(ele => {
          if (this.language === 'zh') {
            this.checkList.push(ele.brandName)
          } else {
            this.checkList.push(ele.brandEName)
          }
        })
      } else {
        this.checkList = []
      }
    },
    delAll() {
      if (this.submitArr.length === this.checkList.length) {
        this.submitArr = []
        this.checkList = []
      } else {
        this.submitArr.forEach(ele => {
          this.checkList.splice(this.checkList.indexOf(ele), 1)
        })
      }
    },
    delCurrent(current) {
      this.checkList.splice(this.checkList.indexOf(current), 1)
    },
    closeModel() {
      this.dialogVisible = false
      this.$emit('sendVisible', this.dialogVisible)
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$emit('sendVisible', this.dialogVisible)
      done()
    },
    updata() {
      const arr = []
      if (this.checkList.length) {
        this.checkList.forEach(check => {
          this.list.forEach(list => {
            if (this.language === 'zh') {
              if (check === list.brandName) {
                arr.push(list)
              }
            } else {
              if (check === list.brandName) {
                arr.push(list)
              }
            }
          })
        })
      }
      console.log(arr, 'arr')
      this.$emit('transferData', arr)
      this.closeModel()
    }
  }
}
</script>
<style lang="less" scoped>
  .transfer{
    display: flex;
    justify-content: space-between;
    .operating{
      width: 49%;
      box-sizing: border-box;

      header{
        height: 40px;
        padding: 0 14px;
        color: #434960;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background:#D8DCE6;
        .del-btn{
          padding: 4px 7px;
          color:rgba(67,90,130,1);
          font-weight:500;
          font-size: 12px;
          border:1px solid rgba(67,90,130,1);
          box-sizing: border-box;
          cursor: pointer;
          &:hover{
            color: white;
            background: rgba(67,90,130,1);
          }
        }
      }
      main{
        border:1px solid rgba(216,220,230,1);
        border-top: none;
        padding: 10px 14px;
        .scroll{
          display: block;
          margin-top: 10px;
          height: 160px;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }
        /deep/ .el-checkbox{
          display: block;
          line-height:30px;
          margin: 0;
          /deep/ .el-checkbox__label{
            /deep/ .el-icon-delete{
              position: absolute;
              top: 7px;
              right: 5px;
              &:hover{
                color: #E46C59;
              }
            }
          }
        }

      }
    }
  }

</style>
