<template>
  <el-container v-loading="pageLoading" class="template-msg-container">
    <el-main class="template-msg">
      <el-row type="flex">
        <el-col>
          <el-form
            ref="form"
            label-width="100px"
            :disabled="mode === 'view'"
          >
            <el-form-item label="模版类型：">
              数字短信
            </el-form-item>
            <el-form-item label="模版主题：">
              <el-input type="text" maxlength="20" :show-word-limit="true"  ></el-input>
            </el-form-item>
            <el-form-item label="模版内容：">
              <div class="content">
                <image-drag
                  ref="fileList"
                  :list="fileList" 
                  :multiple="true"
                  :on-change="bannerPicChange"
                  @update="updateFile"
                  accept=".png,.gif,.jpg,.mp3,.mp4"
                  @updateFileList="updateFileList">
                </image-drag>
              </div>
              <p class="fileSize" :style="{color:fileSize>maxSize?'red':''}">{{showSize}}/1900K</p>
              <div class="tip">
                <div>
                  • 模板正文（文字部分）必须含有签名，以【】标识，放在文字最开始部分。
                </div>
                <div>
                  • 模板主题支持15字符，主题不要出现签名“【】”符号。
                </div>
                <div>
                  • 正文必须包含视频（图片）+文字，建议先放置图片，再放置文字。模板内(文本、视频、图片)不能提供任何个人手机号码、个人微信二维码等个人联系方式。
                </div>
                <div>
                  • 图片支持gif、jpg、png格式，音频支持mp3格式，视频支持mp4格式，目前只支持上传一个视频文件，拖动可调整素材顺序
                </div>
                <div>
                  • 查看运营商模版审核细则可前往：
                  <el-button type="text" @click="openUrl('https://help.aliyun.com/document_detail/64205.html')">https://help.aliyun.com/document_detail/64205.html</el-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="申请说明：">
              <el-input type="textarea" maxlength="100" :show-word-limit="true"></el-input>
              <div class="tip">
                <div>
                  • 预计一个工作日内完成审核
                </div>
                <div>
                  • 审核工作时间：周一到周五9:00－23：00（法定节日顺延）
                </div>
                <div>
                  • 审核成功后，模版内容有效期为12个月
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="iphone-x-container">
          <div class="device iphone-x">
            <!--    外部轮廓    -->
            <div class="frame">
              <div class="content">
                <div class="time">10:19</div>
                <div class="show">
                  <div v-for="(item,i) in fileList" :key="i">
                    <div v-if="item.content">
                      <p v-for="(val,index) in item.content.split('\n')" :key="index">{{val?val:'&nbsp;'}}</p>
                    </div>
                    <img class="media" v-if="item.raw && imgMap.indexOf(item.raw.type) > -1" :src="item.url"/>
                    <audio class="media" v-if="item.raw && item.raw.type === 'audio/mpeg'" :src="item.url" controls></audio>
                    <video class="media" v-if="item.raw && item.raw.type === 'video/mp4'" :src="item.url" controls></video>
                  </div>
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
            >
              提交审核
            </el-button>
            <el-button>{{
              mode === "view" ? "返回" : "取消"
            }}</el-button>
          </el-row>
    </el-main>
  </el-container>
</template>

<script>
import ImageDrag from "@/componentsMarketing/dragImport/index";
export default {
  components:{
    ImageDrag
  },
  data(){
    return {
      mode:'',
      pageLoading:false,
      fileList: [],
      fileArr:[],
      fileSize:0,
      maxSize:1945600,
      imgMap:["image/jpeg", "image/png", "image/gif"]
    }
  },
  methods:{
    bannerPicChange(file,fileList) {
      this.fileList = fileList
      console.log(fileList)
    },
    updateFile(val) {
      this.fileList = val;
    },
    updateFileList(val) {
      this.fileArr = val
      let size = 0
      val.forEach(item=>{
        size += item.size
      })
      this.fileSize = size
    },
    openUrl(url){
      window.open(url,'__self')
    }
  },
  computed:{
    showSize(){
      return (this.fileSize/1024).toFixed(3)
    }
  }
}
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

  .tip{
    line-height: 18px;
    font-size: 12px;
    color: #a9b0b4;
  }


  .show{
    margin: 10px;
    padding: 10px;
    background-color: antiquewhite;
    word-wrap:break-word;
  }

  .content{
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    width: 100%;
    padding: 10px 20px;
  }

  .fileSize{
    text-align: right;
  }

  .media{
    width: 100%;
  }
}
</style>
