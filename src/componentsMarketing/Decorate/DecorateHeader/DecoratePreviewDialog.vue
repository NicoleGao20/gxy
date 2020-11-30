<template>
  <div class="decorate-preview">
    <el-button size="medium" @click="handleSave">保存</el-button>
    <!-- <el-button v-if="$route.meta.title !== 'layoutTemplateEdit'" size="medium" type="success" @click="handlePreview">预览</el-button> -->
    <el-button v-if="$route.meta.title !== 'layoutTemplateEdit'" size="medium" type="primary" @click="handlePublish">发布</el-button>
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :top="'8vh'"
      width="800px"
      title="预览"
    >
      <div class="mobile-list">
        <a v-for="(mobileItem, mobileIndex) in mobileList" :class="{ active: mobileItem.mobile === currentMobile }" :key="mobileIndex" @click="mobileChange(mobileItem.mobile)">{{ mobileItem.name }}</a>
      </div>
      <div
        :style="{
          paddingLeft: `${getMobileItem().paddingLeft}px`,
          backgroundImage: `url(${getMobileItem().backgroundImage})`,
        }"
        class="decorate-preview-content-wrapper"
      >
        <div class="decorate-preview-content">
          <iframe
            :src="`//${host}/#/decorate-preview/${$route.params.id}?zoom=${getMobileItem().zoom}&isFrame=1`"
            :style="{
              width: `${getMobileItem().width}px`,
              height: `${getMobileItem().height}px`,
              borderRadius: `0 0 ${getMobileItem().borderRadius}px ${getMobileItem().borderRadius}px`
            }"
            class="preview-frame"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'DecoratePreviewDialog',
  props: {
    onSave: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },
  data() {
    return {
      host: window.location.host,
      mobileList: [
        { mobile: 'iphonex', name: 'iphone X', width: 239, height: 482, borderRadius: 26, zoom: 0.64, backgroundImage: '/static/decorate/iphonex.png' },
        { mobile: 'huawei', name: '华为', width: 242, height: 461, borderRadius: 10, zoom: 0.643, backgroundImage: '/static/decorate/huawei.png' },
        { mobile: 'xiaomi', name: '小米', width: 256, height: 468, borderRadius: 10, zoom: 0.68, backgroundImage: '/static/decorate/xiaomi.png' },
        { mobile: 'sanxing', name: '三星', width: 251, height: 476, paddingLeft: 1, borderRadius: 23, zoom: 0.67, backgroundImage: '/static/decorate/sanxing.png' }
      ],
      currentMobile: 'iphonex',
      dialogVisible: false
    }
  },
  computed: mapState({
    list: state => state.decorate.list
  }),
  methods: {
    handleClose(done) {
      done()
    },
    handleSave() {
      this.onSave()
    },
    handlePreview() {
      const callback = () => {
        this.dialogVisible = true
      }
      this.onSave({ callback: callback() })
    },
    handlePublish() {
      this.onSave({ params: { status: 2 }})
    },
    mobileChange(mobile) {
      this.currentMobile = mobile
    },
    getMobileItem() {
      const mobileIndex = this.mobileList.findIndex(item => item.mobile === this.currentMobile)
      return this.mobileList[mobileIndex]
    }
  }
}
</script>
<style lang="less" scoped>
.decorate-preview {
  margin: 0 8px 0 16px;
}
.mobile-list {
  padding-bottom: 20px;
  text-align: center;
  a {
    margin-right: 16px;
    :last-child {
      margin-right: 0;
    }
    &:hover {
      color: #66b1ff;
    }
    &.active {
      background-color: transparent;
      color: #66b1ff;
    }
  }
}
.decorate-preview-content-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  width: 400px;
  height: 550px;
  margin: 0 auto;
  padding-top: 52px;

    background-position: center top;
    background-repeat: no-repeat;
    background-size: contain;

  .decorate-preview-content {

    .preview-frame {
      margin: 0 auto;
      border: none;
      border-radius: 0 0 26px 26px;
    }
  }
}
</style>
<style lang="less">
.el-carousel {
  height: auto;
}
</style>
