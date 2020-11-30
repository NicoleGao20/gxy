<template>
  <div class="com-image-drag">
    <div class="button-list">
      <el-button
        @click="openDrag"
        v-if="!drag_open"
        :disabled="banner_list.length <= 1"
        type="text"
        size="small"
        class="operation-success"
      >点击此处开启拖动调整素材顺序</el-button>
      <el-button
        @click="save"
        v-if="drag_open"
        type="text"
        size="small"
        class="operation-success"
      >保存</el-button>
      <el-button
        @click="cancle"
        v-if="drag_open"
        type="text"
        size="small"
        class="operation-error"
      >取消</el-button>
    </div>
    <div class="image-list">
      <!-- 拖拽层 -->
      <div class="list-wrap" v-show="drag_open">
        <draggable
          v-model="banner_list"
          :options="{
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'chosenClass',
            scroll: true,
            scrollSensitivity: 200
          }"
        >
          <div
            class="image-item"
            v-for="($item, $index) in banner_list"
            :key="$index"
            :style="$item.url ? { backgroundImage: `url(${$item.url})` } : ''"
          >
            <p class="fileName" v-if="$item.type !== 'text'">{{$item.name}}</p>
            <div v-if="$item.type === 'text'" class="viewText">
              {{$item.content}}
            </div>
          </div>
        </draggable>
      </div>
      <!-- 展示层 -->
      <div class="list-wrap" v-show="!drag_open">
        <div
          class="image-item"
          v-for="($item, $index) in banner_list"
          :key="$index"
          :style="$item.url ? { backgroundImage: `url(${$item.url})` } : ''"
          @mouseover.prevent="$item.is_hover = true"
          @mouseleave.prevent="$item.is_hover = false"
        >
          <el-input v-if="$item.type === 'text'" type="textarea" resize="none" class="content" v-model="banner_list[$index].content" @input="$emit('update', banner_list.map(item => item))"></el-input>
          <p class="fileName" v-else>{{$item.name}}</p>
          <div class="mask" v-show="$item.is_hover" @click="deleteImage($index)">
            <i class="el-icon-delete bin"></i>
          </div>
        </div>
        <el-upload
          ref="upload"
          v-show="false"
          list-type="picture-card"
          name="file"
          class="upload-machine"
          :disabled="drag_open"
          action=""
          :on-change="onChange"
          :accept="accept"
          :show-file-list="false"
          :multiple="multiple"
          :auto-upload="false"
          enctype="multipart/form-data"
          :file-list="list"
        ></el-upload>
        <div class="uploadBtn">
          <div class="center">
            <el-button type="text" @click="addText"><i class="icon el-icon-edit"></i></el-button>
            <el-button type="text" @click="addFile"><i class="icon el-icon-folder-add"></i></el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * @description 为了方便上传图片组件可拖拽排序，不改变饿了么插件的逻辑，只做视图层的展示
 * @param {Array} list 图片数组
 * @param {Number} limit 最多可上传几张图片
 * @param {Boolean} multiple 是否批量上传
 * @param {Function} beforeUpload 上传之前的回调，用于校验
 * @param {Function} onSuccess 上传成功的回调函数
 */
import draggable from "vuedraggable";
export default {
  name: "ComImageShow",
  components: {
    draggable
  },
  props: {
    list: {
      type: Array
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ''
    },
    onChange: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      banner_list: [], //拖拽插件不建议直接改变父组件的传值，所以另建一个新数组
      file_list: [], //保存开启拖拽之前排序的数组
      drag_open: false //拖拽开启开关
    };
  },
  methods: {
    // 删除图片
    deleteImage(i) {
      this.banner_list.splice(i, 1);
      this.$emit("update", this.banner_list.map(item => item));
    },
    // 开启拖拽
    openDrag() {
      this.file_list = JSON.parse(JSON.stringify(this.banner_list)); //数组深拷贝
      this.drag_open = true;
    },
    // 取消拖拽
    cancle() {
      this.banner_list = this.file_list;
      this.drag_open = false;
    },
    // 拖拽保存
    save() {
      this.$emit("update", this.banner_list.map(item => item));
      this.drag_open = false;
    },
    addFile(){
      this.$refs['upload'].$refs['upload-inner'].handleClick()
    },
    addText(){
      this.$emit("update", this.banner_list.concat({
        type:'text',
        content:'',
        is_hover: false
      }));
    }
  },
  mounted() {
    // 初始数组拷贝
    this.banner_list = this.list.map(item => {
      let obj = {
        ...item,
        is_hover: false
      };
      return obj;
    });
  },
  watch: {
    // 监听父组件传值改变
    list(arr) {
      this.banner_list = arr.map(item => {
        let obj = {
          ...item,
          is_hover: false
        };
        return obj;
      });
      this.$emit("updateFileList",this.banner_list.map((item,i)=>{
        if(item.type === 'text'){
          let FILE = new File([item.content],'file-'+ (i+1) + '.txt',{type: "text/plain"})
          return FILE
        }else{
          return item.raw
        }
      }))
    }
  }
};
</script>
<style lang="sass" scoped>
.com-image-drag
  &:after
      display: block
      clear: both
      content: ""
  .image-list
    float: left
    &:after
      display: block
      clear: both
      content: ""
    .list-wrap
     float: left
    .uploadBtn
      width: 148px
      height: 148px
      border: 1px solid #c0ccda
      border-radius: 6px
      float: left
      .center
        line-height: 148px
        text-align: center
        .icon
          font-size: 30px
    .image-item
      width: 148px
      height: 148px
      position: relative
      margin-right: 10px
      margin-bottom: 10px
      border: 1px solid #c0ccda
      background-size: 100% 100%
      border-radius: 6px
      float: left
      overflow: hidden
      .fileName
        word-wrap: break-word
      .mask
        cursor: pointer
        width: 148px
        height: 20px
        background-color: rgba(0, 0, 0, 0.5)
        position: absolute
        bottom: 0
        .bin
          display: block
          color: #FFFFFF
          font-size: 20px
          position: absolute
          left: 50%
          top: 50%
          transform: translateX(-50%) translateY(-50%)
      .content
        width: 100%
        height: 128px
        /deep/.el-textarea__inner
          height: 100%
          border: 0
      .viewText
        padding: 5px 15px;
        line-height: 1.5;
        font-size: 12px;
        color: #606266;
        font-family: sans-serif;
  .upload-machine
    float: left
</style>