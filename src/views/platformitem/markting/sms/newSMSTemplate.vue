<template>
  <el-container v-loading="pageLoading" class="template-msg-container">
    <el-main class="template-msg">
      <el-row type="flex">
        <el-col>
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="100px"
            :disabled="mode === 'view'"
          >
            <el-form-item label="模版名称：" prop="name">
              <el-input type="text" placeholder="请输入模版名称" maxlength="30" v-model="form.name" :show-word-limit="true"></el-input>
            </el-form-item>
            <el-form-item label="短信类型：" prop="type">
              <el-select  v-model="form.type">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模版类型：" prop="smsType">
              <el-select  v-model="form.smsType">
                <el-option
                  v-for="item in smsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模版内容：" prop="content">
              <div ref="editDiv" :contenteditable="mode !== 'view'" style="width:100%;height:150px;border:1px solid #DCDFE6;border-radius: 4px;overflow:auto;line-height:20px;word-wrap:break-word;padding:10px" @focus="editContent = true" @blur="editContent = false" @input="parseContent"></div>
              <template v-if="form.smsType === 0">
                <el-cascader
                  v-model="selectingParams"
                  :options="paramsOptions"
                  :props="{ expandTrigger: 'hover' }"
                  :show-all-levels="false">
                </el-cascader>
                <el-button type="primary" @mousedown.native="stopDefault" @click="insertAtCaret">插入</el-button>
              </template>
            </el-form-item>
            <el-form-item label="申请说明：" prop="explain">
              <el-input type="textarea" maxlength="100" v-model="form.explain" :show-word-limit="true"></el-input>
              <div class="warn">
                <i class="el-icon-warning-outline"></i>
                短信字数含"签名+模版内容+变量内容”，短信70个字数含以内，按1条短信计费；超出70个字为长短信，按照67个字数记为1条短信费用。
              </div>
            </el-form-item>
          </el-form>
          
          <el-row>
            <div class="tip">
              <p>预计两小时完成审核</p>
              <p>审核工作时间: 周一至周日9:00-23:00（法定节日顺延）</p>
            </div>
          </el-row>
        </el-col>
        <el-col class="iphone-x-container">
          <div class="device iphone-x">
            <!--    外部轮廓    -->
            <div class="frame">
              <div class="content">
                <div class="time">10:19</div>
                <div class="show">
                  {{form.content}}
                </div>
              </div>
            </div>

            <!--    天线    -->
            <div class="stripe" />

            <!--    听筒孔    -->
            <div class="header">
              <div class="sensors" />
            </div>

            <!--    按键    -->
            <div class="btns" />
            <div class="power" />
          </div>
        </el-col>
      </el-row>
      <el-row class="form_footer">
            <el-button
              v-if="mode !== 'view'"
              type="primary"
              @click="handleSubmit"
            >
              提交审核
            </el-button>
            <el-button @click="handleCancel">{{
              mode === "view" ? "返回" : "取消"
            }}</el-button>
          </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { queryTemplateById, addTemplate, editTemplate, queryParam } from "@/api/markting/SMSFunction"
import extractText from '@/utils/extractText'
export default {
  mounted(){
    queryParam().then(({data})=>{
      let eventList = []
      let buyerList = []
      data.list.forEach(item=>{
        eventList.push(item.event_type)
      })
      eventList = Array.from(new Set(eventList))
      data.list.forEach(item=>{
        if(buyerList.indexOf(item.buyer_type) === -1){
          buyerList.push(item.buyer_type)
          this.parameter.push({
            paramKey:item.buyer_type,
            code:item.code
          })
        }
      })
      this.paramsOptions = eventList.map(val=>{
        return {
          label:val,
          children:data.list.filter(item=>{
            return item.event_type === val
          }).map(item=>{
            return {
              label:item.buyer_type,
              value:`{${item.buyer_type}}`,
              code:item.code
            }
          })
        }
      })
    })
    if(this.$route.query.mode){
      this.pageLoading = true
      this.mode = this.$route.query.mode
      queryTemplateById({id:this.$route.query.id}).then(({data})=>{
        this.pageLoading = false
        this.form.name = data.template_name
        this.form.type = data.template_type
        this.form.explain = data.remark
        this.id = data.id
        this.code = data.template_code
        this.form.smsType = data.type*1
        setTimeout(()=>{
          this.form.content = data.template_content_cn
          var editableTextarea = this.form.content.replace('\n', '<br>')
          editableTextarea = editableTextarea.replace(/{([^{}]+)}/g, (match, p1) => `<input value="{${p1}}" style="display:inline-block;border:none;color:#0a8ddf;width:${this.textWidth('{'+p1+'}')}px;text-align:center" readonly/>`)
          this.$refs.editDiv.innerHTML = editableTextarea
        })
      })
    }
  },
  data() {
    return {
      pageLoading:false,
      mode:'',
      id:'',
      code:'',
      editContent:false,
      options: [
        {
          label: "验证码",
          value: 0
        },
        {
          label: "短信通知",
          value: 1
        },
        {
          label: "推广短信",
          value: 2
        },
        {
          label: "国际/港澳台消息",
          value: 3
        }
      ],
      smsOptions:[
        {
          label: "动态模版",
          value: 0
        },
        {
          label: "静态模版",
          value: 1
        }
      ],
      paramsOptions:[],
      form: {
        name: "",
        type: "",
        smsType:"",
        content: "",
        explain: "",
        parseContent:""
      },
      rules:{
          name:[{ required: true, message: '请输入模版名称', trigger: 'blur' }],
          type:[{ required: true, message: '请选择模版类型', trigger: 'change' }],
          smsType:[{ required: true, message: '请选择短信类型', trigger: 'change' }],
          content:[{ required: true, message: '请输入模版内容', trigger: 'blur' }],
          explain:[{ required: true, message: '请输入申请说明', trigger: 'blur' }]
      },
      selectingParams:null,
      templateParamList:[],
      parameter:[]
    };
  },
  methods:{
      handleSubmit(){
          this.$refs.form.validate((valid) => {
          if (valid) {
            this.pageLoading = true
            let obj = {}
            if(this.templateParamList.length) obj.template_params = this.templateParamList
            let formData = new FormData()
            let formObj = {
              dx_status:'sms',
              template_name:this.form.name,
              template_type:this.form.type,
              template_content:this.form.parseContent,
              remark:this.form.explain,
              type:this.form.smsType,
              template_content_cn:this.form.content,
              remark:this.form.explain,
              ...obj
            }
            for(let i in formObj){
              formData.append(i,formObj[i])
            }
            if(this.mode === 'edit'){
              formData.append('id',this.id)
              formData.append('template_code',this.code)
              editTemplate(formData).then(()=>{
                this.$message.success('添加成功')
                setTimeout(()=>{
                  this.handleCancel()
                },2000)
              }).catch(()=>{
                this.pageLoading = false
              })
            }else if(!this.mode){
              addTemplate(formData).then(()=>{
                this.$message.success('添加成功')
                setTimeout(()=>{
                  this.handleCancel()
                },2000)
              }).catch(()=>{
                this.pageLoading = false
              })
            }
          } else {
            return false;
          }
        });
      },
      handleCancel(){
        if(this.$route.query.before){
          this.$router.push({name:this.$route.query.before})
        }else{
          this.$router.push({name:'smsmaterial'})
        }
      },
      //短信模板
      insertAtCaret(){
        if(this.selectingParams){
          let value = this.selectingParams[1]
          if(this.editContent){
            let html = `<input value="${value}" style="display:inline-block;border:none;color:#0a8ddf;width:${this.textWidth(value)+10}px;text-align:center" readonly/>`
            var sel, range
            if (window.getSelection) {
              // IE9 and non-IE
              sel = window.getSelection()
              if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0)
                range.deleteContents()
                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement('div')
                el.innerHTML = html
                var frag = document.createDocumentFragment(); var node; var lastNode
                while ((node = el.firstChild)) {
                  lastNode = frag.appendChild(node)
                }
                range.insertNode(frag)
                // Preserve the selection
                if (lastNode) {
                  range = range.cloneRange()
                  range.setStartAfter(lastNode)
                  range.collapse(true)
                  sel.removeAllRanges()
                  sel.addRange(range)
                }
              }
            } else if (document.selection && document.selection.type !== 'Control') {
              // IE < 9
              document.selection.createRange().pasteHTML(html)
            }
            this.parseContent()
          }else{
            this.$message('请点击模版内容中想插入的位置')
          }
        }else{
          this.$message('请选择参数')
        }
    },
    stopDefault(e){
      if ( e && e.preventDefault ) 
        e.preventDefault(); 
        //IE阻止默认事件
      else 
        window.event.returnValue = false; 
      return false;
    },
    textWidth(text){
      // 创建节点
      var sbox = document.createElement('span')

      // 设置节点id
      sbox.id = 'lswtColse'

      // 设置节点属性
      sbox.style.top = '-100000px'
      sbox.style.right = '0px'
      sbox.style.fontSize = '12px'
      sbox.style.position = 'absolute'
      sbox.innerHTML = `{ ${text} }`
      document.body.appendChild(sbox)
      return sbox.offsetWidth
    },
    parseContent(){
      this.form.content = extractText(this.$refs.editDiv)
      var regex3 = /\{(.+?)\}/g
      this.form.content.replace(regex3,(match,p1)=>{
        console.log(p1)
      })
    }
  },
  watch:{
    'form.smsType':{
      handler(){
        this.form.content = ''
        this.$refs.editDiv.innerHTML = ''
      }
    },
    'form.content' (newV, oldV) {
      var reg = /{([^{}]+)}/g
      var tempArr = []
      var matched
      this.dynamicItems = []
      this.templateParamList = []
      this.form.parseContent = newV.replace(reg,(match,p1)=>{
        let key = ''
        for (var i = 0; i < this.parameter.length; i++) {
          if(this.parameter[i].paramKey === p1){
            key = this.parameter[i].code
          }
        }
        return `\${${key}}`
      })
      while ((matched = reg.exec(newV))) {
        this.dynamicItems.push(matched[1])
      }
      this.dynamicItems.forEach(item=>{
        // 添加插入参数列表
        for (var i = 0; i < this.parameter.length; i++) {
          if(item === this.parameter[i].paramKey){
            tempArr.push(this.parameter[i].code)
          }
        }
      })
      this.templateParamList = tempArr
      //转换传给后端
      
    }
  }
};
</script>

<style lang="less" scoped>
.template-msg-container {
  padding: 20px;
  width: 100%;
  min-height: 100%;

  .template-msg {
    width: 100%;
    min-height: 100%;
    background-color: #fff;
  }

  .audience-number {
    padding: 0 0 0 10px;
    line-height: 30px;
    color: #606266;
  }

  .footer {
    margin-left: 100px;
  }

  .tip{
      padding: 20px 100px;
      color: #ccc;
  }

  .warn{
    line-height: 20px;
  }

  .show{
    margin: 10px;
    padding: 10px;
    background-color: antiquewhite;
  }
}
</style>
