<template>
  <div>
    <el-form-item
      :label="conf.column_name_show"
      style="display: inline-block;"
      label-width="90px">
      <belle-choose-brand-member-level v-model="column_value" :config="config" :brand-code="brandCode" @input="changeSpecItemColumnValue"/>
    </el-form-item>
  </div>
</template>
<script>
import belleChooseBrandMemberLevel from '@/privatemodules/belle-choose-brand-member-level'
import { getToken } from '@/utils/auth'

export default {
  name: 'ChooseBrandMemberLevel',
  components: {
    belleChooseBrandMemberLevel
  },
  props: {
    specItem: {
      type: Object,
      default() {
        return {}
      }
    },
    conf: {
      type: Object,
      default() {
        return {}
      }
    },
    onlyRead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var column_value
    if (this.conf.is_multiple === 'Y') {
      if (this.specItem.column_value) {
        column_value = this.specItem.column_value.split(',').map((item) => {
          return Number(item)
        })
      } else {
        column_value = []
      }
    } else {
      if (this.specItem.column_value) {
        column_value = this.specItem.column_value
      } else {
        column_value = ''
      }
    }

    return {
      brandCode: getToken('brandCode'),
      column_value: column_value,
      config: {
        multiple: this.conf.is_multiple === 'Y',
        disabled: this.onlyRead,
        collapseTags: this.conf.is_multiple === 'Y'
      }
    }
  },
  methods: {
    changeSpecItemColumnValue() {
      if (this.conf.is_multiple === 'Y') {
        this.specItem.column_value = this.column_value.join(',')
      } else {
        this.specItem.column_value = this.column_value
      }
    }
  }
}
</script>
