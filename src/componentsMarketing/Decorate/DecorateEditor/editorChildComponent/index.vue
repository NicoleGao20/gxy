<template>
  <section>
    <div v-for="(nv, key) in list" :key="key" class="decorate-set-obj">
      <InputNumber v-if="nv.type === 'inputNumber'" :setdata="nv" :data="item"/>
      <SetInput v-if="nv.type === 'input'" :setdata="nv" :data="item"/>
      <Color v-if="nv.type === 'color'" :setdata="nv" :data="item"/>
      <ChildListDom v-if="nv.type === 'childList'" :setdata="nv" :data="item"/>
      <Slider v-if="nv.type === 'slider'" :setdata="nv" :data="item"/>
      <Upload v-if="nv.type === 'upload'" :setdata="nv" :data="item"/>
      <ImageMode v-if="nv.type === 'imageMode'" :setdata="nv" :data="item"/>
      <SetLink v-if="nv.type === 'link'" :setdata="nv" :data="item" />
      <Radio v-if="nv.type === 'radio'" :setdata="nv" :data="item" />
      <Select v-if="nv.type === 'select'" :setdata="nv" :data="item" />
      <GridMode v-if="nv.type === 'gridMode'" :setdata="nv" :data="item" />
      <BtnSwitch v-if="nv.type === 'switch'" :setdata="nv" :data="item" />
      <InteractiveComponent v-if="nv.type === 'initeractive'" :setdata="nv" :data="item" />
      <DataTypeSelect v-if="nv.type === 'dataTypeSelect'" :setdata="nv" :data="item" />
      <ImageListSelect v-if="nv.type === 'imageListSelect' && item.dataType!=='custom'" :setdata="nv" :data="item" />
    </div>
  </section>
</template>
<script type="text/javascript">
import SetInput from './input.vue'
import InputNumber from './inputNumber.vue'
import Color from './color.vue'
import ChildListDom from './childListDom.vue'
import Slider from './slider.vue'
import Upload from './upload.vue'
import ImageMode from './imageMode.vue'
import SetLink from './link.vue'
import Radio from './radio.vue'
import Select from './select.vue'
import GridMode from './gridMode.vue'
import BtnSwitch from './switch.vue'
import InteractiveComponent from './interactive'
import DataTypeSelect from './dataTypeSelect'
import ImageListSelect from './imageListSelect'
export default {
  name: 'EditorChildComponent',
  components: {
    SetInput,
    InputNumber,
    Color,
    ChildListDom,
    BtnSwitch,
    Slider,
    Upload,
    ImageMode,
    SetLink,
    Radio,
    Select,
    GridMode,
    InteractiveComponent,
    DataTypeSelect,
    ImageListSelect
  },
  props: {
    list: {
      type: Array,
      default() {
        return {}
      }
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
	.decorate-set-obj {
    padding: 10px;
	}
</style>
