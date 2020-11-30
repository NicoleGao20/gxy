<template>
  <div class="no-child-content">
    <p>空轮播容器</p>
    <div>
      请至少在轮播容器中插入一帧。
    </div>
    <button @click="changeTemplatePop(2)">两帧</button>
    <button @click="changeTemplatePop(3)">三帧</button>
    <button @click="changeTemplatePop(4)">四帧</button>
    <button @click="changeTemplatePop(5)">五帧</button>
  </div>
</template>
<script>
import UUID from 'uuidjs'
export default {
  name: 'NoChild',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    changeTemplatePop(num) {
      for (let index = 0; index < num; index++) {
        this.data.content.push({
          width: 375,
          height: 200,
          children: [],
          id: UUID.generate(),
          backgroundImage: '',
          backgroundColor: 'transparent',
          backgroundPosition: 'auto',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          elementName: '帧',
          editor: {
            setInfo: {
              icon: 'icon-swiper',
              name: '帧',
              desc: '修改轮播的帧设置。',
              tab: [
                {
                  name: '基础',
                  id: '1',
                  slot: 'base'
                },
                {
                  name: '子元素',
                  id: '2',
                  slot: 'subelement'
                },
                {
                  name: '样式',
                  id: '3',
                  slot: 'style'
                }
              ]
            },
            base: [
              {
                type: 'input',
                pop: 'elementName',
                name: '元素名称'
              }
            ],
            data: [
              {
                type: 'childList',
                pop: 'elementName',
                name: '删除元素'
              }
            ],
            style: [
              {
                type: 'upload',
                pop: 'backgroundImage',
                name: '背景图片'
              },
              {
                type: 'color',
                pop: 'backgroundColor',
                name: '背景颜色'
              },
              {
                type: 'gridMode',
                pop: 'backgroundPosition',
                name: '背景位置',
                colNum: 3,
                options: [{
                  value: 'left top',
                  label: '左上'
                }, {
                  value: 'center top',
                  label: '中上'
                }, {
                  value: 'right top',
                  label: '右上'
                }, {
                  value: 'left center',
                  label: '左中'
                }, {
                  value: 'center',
                  label: '正中'
                }, {
                  value: 'right center',
                  label: '右中'
                }, {
                  value: 'left bottom',
                  label: '左下'
                }, {
                  value: 'center bottom',
                  label: '中下'
                }, {
                  value: 'right bottom',
                  label: '右下'
                }]
              },
              {
                type: 'select',
                pop: 'backgroundSize',
                name: '缩放模式',
                options: [{
                  value: 'auto',
                  label: '原始尺寸'
                }, {
                  value: 'cover',
                  label: '填充'
                }, {
                  value: 'contain',
                  label: '适应'
                }, {
                  value: '100% 100%',
                  label: '拉伸'
                }]
              },
              {
                type: 'select',
                pop: 'backgroundRepeat',
                name: '平铺模式',
                options: [{
                  value: 'no-repeat',
                  label: '不平铺'
                }, {
                  value: 'repeat',
                  label: '双向平铺'
                }, {
                  value: 'repeat-x',
                  label: '横向平铺'
                }, {
                  value: 'repeat-y',
                  label: '纵向平铺'
                }]
              }
            ]
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.no-child-content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  p {
    font-size:24px;
  }
  div {
    font-size: 14px;
    color: #58666e;
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
  }
  button {
    width: 60px;
    height: 29px;
    margin: 20px 10px 0 0;
    border: 1px solid #ddd;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      background-color: #f2f2f2;
      border-color: #ccc;
    }
  }
}
</style>
