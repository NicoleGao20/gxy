<template>
  <div class="no-child-content">
    <p>没有分栏</p>
    <div>
      请选择一种分栏布局。
    </div>
    <button @click="changeTemplatePop(1)">单列</button>
    <button @click="changeTemplatePop(2)">双列</button>
    <button @click="changeTemplatePop(3)">三列</button>
  </div>
</template>
<script>
import UUID from 'uuidjs'
export default {
  name: 'ColumnsNoChild',
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
          width: 375 / num,
          height: 100,
          maxWidth: 0,
          children: [],
          id: UUID.generate(),
          backgroundColor: '',
          'elementName': '容器',
          'editor': {
            'setInfo': {
              'icon': 'icon-columns',
              'name': '分栏容器',
              'desc': '这个是一个容器',
              'tab': [
                {
                  'name': '基础',
                  'id': '1',
                  'slot': 'base'
                },
                {
                  'name': '子元素',
                  'id': '2',
                  'slot': 'subelement'
                },
                {
                  'name': '样式',
                  'id': '3',
                  'slot': 'style'
                }
              ]
            },
            'base': [
              {
                'type': 'input',
                'pop': 'elementName',
                'name': '元素名称'
              }
            ],
            'data': [
              {
                'type': 'childList',
                'pop': 'elementName',
                'name': '删除元素'
              }
            ],
            'style': [
              {
                'type': 'color',
                'pop': 'backgroundColor',
                'name': '背景颜色'
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
    display: inline-block;
    width: 56px;
    height: 29px;
    margin-right: 10px;
    background: #FFF;
    color: #333;
    font-size: 12px;
    border: 1px solid #ddd;
  }
}
</style>
