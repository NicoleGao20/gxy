<template>
  <div class="system-container">
    <div class="system-text">{{ $t('metadata.title') }}</div>
    <el-row :gutter="20">
      <el-col :span="10">
        <!-- <div class="toolbar">
          <el-button
            :title="$t('metadata.newDirectory')"
            class="top"
            icon="el-icon-folder-add"
            @click="add(0)"
          />
          <el-button
            :title="$t('metadata.newNode')"
            class="top"
            icon="el-icon-document-add"
            @click="add(1)"
          />
        </div> -->
        <el-tree
          ref="tree"
          :data="tree"
          :default-expanded-keys="expanded"
          :expand-on-click-node="false"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          node-key="id"
          draggable
          @node-click="edit"
          @node-expand="handleNodeExpand"
          @node-collapse="handleNodeCollapse"
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
        >
          <span
            slot-scope="{ node, data }"
            :class="{ disabled: !data.isEnabled }"
            class="custom-tree-node"
          >
            <i :class="data.isLeaf === 0 ? 'el-icon-folder' : 'el-icon-document'" />
            <span class="label el-tree-node__label" @click.stop="edit(data)">{{ data.name }}</span>
            <span class="node-tools">
              <template v-if="data.isLeaf === 0">
                <el-button
                  :title="$t('metadata.newDirectory')"
                  type="text"
                  icon="el-icon-folder-add"
                  @click.stop="() => add(0, data.id)"
                />
                <el-button
                  :title="$t('metadata.newNode')"
                  type="text"
                  icon="el-icon-document-add"
                  @click.stop="() => add(1, data.id)"
                />
              </template>
              <el-button
                :title="$t('metadata.editLabel')"
                type="text"
                icon="el-icon-edit"
                @click.stop="($event) => editLabel(node, data, $event)"
              />
              <el-button
                v-if="data.isLeaf === 1 || !data.children.length"
                :title="$t('metadata.remove')"
                type="text"
                icon="el-icon-delete"
                @click.stop="() => remove(node, data)"
              />
            </span>
          </span>
        </el-tree>
        <input
          v-show="showLabel"
          id="label"
          ref="label"
          v-model="label"
          type="text"
          @keydown="handleKeyDown"
        >
      </el-col>
      <el-col :span="14" class="form-wrapper">
        <el-form
          v-show="showForm"
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item :label="$t('metadata.label')" prop="label">
            <p>{{ form.name }}</p>
          </el-form-item>
          <el-form-item :label="$t('metadata.type')">
            <p>{{ form.type === 1 ? $t('metadata.directory') : $t('metadata.node') }}</p>
          </el-form-item>
          <el-form-item :label="$t('metadata.value')" prop="value">
            <el-input v-model="form.value" />
          </el-form-item>
          <el-form-item :label="$t('metadata.status')">
            <el-switch
              v-model="form.isEnabled"
              :active-value="1"
              :inactive-value="0"
              :active-text="form.isEnabled ? $t('metadata.enabled') : $t('metadata.disabled')"
            />
          </el-form-item>
          <el-form-item :label="$t('metadata.description')">
            <el-input v-model="form.description" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              native-type="submit"
              @click.prevent="submit"
            >{{ $t('metadata.save') }}</el-button>
            <el-button @click="cancel">{{ $t('metadata.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getDictionaryList,
  createDictionary,
  saveDictionary,
  delDictionary,
  sortDictionary
} from '@/api/metadata'

const initialForm = {
  name: '',
  value: '',
  isEnabled: 1,
  description: ''
}

export default {
  name: 'Metadata',
  data() {
    return {
      loading: false,
      showLabel: false,
      label: '',
      current: '',
      showForm: false,
      form: {
        ...initialForm
      },
      rules: {
        value: [
          { required: true, message: this.$t('metadata.valueRequired') }
        ]
      },
      list: [],
      expanded: []
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),
    tree() {
      const list = JSON.parse(JSON.stringify(this.list))
      const top = []
      const arrObj = {}
      list.forEach((item) => {
        const { id, pid } = item
        if (pid === '#') {
          top.push(item)
        }
        item.children = []
        const own = arrObj[id]
        if (own) {
          Object.keys(own).forEach((key) => {
            item[key] = own[key]
          })
        }
        arrObj[id] = item

        let parent = arrObj[pid]
        if (!parent) {
          parent = { id: pid, children: [] }
          arrObj[pid] = parent
        }
        parent.children.push(item)
      })
      return top
    }
  },
  watch: {
    showLabel(val) {
      if (val) {
        document.body.addEventListener('click', this.saveLabel, true)
      } else {
        document.body.removeEventListener('click', this.saveLabel, true)
      }
    }
  },
  created() {
    getDictionaryList().then(res => {
      if (res.code === 1) {
        this.list = res.data.list
      }
    })
  },
  methods: {
    add(isLeaf, pid = '#') {
      this.handleNodeExpand({ id: pid })
      const { childNodes } = this.$refs.tree.getNode(pid)
      // 调接口增加目录或节点
      createDictionary({
        ...initialForm,
        name: isLeaf === 0 ? this.$t('metadata.directory') : this.$t('metadata.node'),
        isLeaf,
        pid,
        levelNo: childNodes.length ? childNodes[childNodes.length - 1].data.levelNo + 1 : 0
      }).then(res => {
        if (res.code === 1) {
          this.list.push(res.data)
        }
      })
    },
    edit(data) {
      this.$refs.form.clearValidate()
      this.showForm = true
      this.form = { ...data }
      delete this.form.children
    },
    remove(node, data) {
      this.$confirm(`${this.$t('metadata.removeConfirm')} ${data.name}`, {
        confirmButtonText: this.$t('metadata.ok'),
        cancelButtonText: this.$t('metadata.cancel'),
        type: 'warning'
      }).then(() => {
        const index = this.list.findIndex(item => item.id === data.id)
        if (~index) {
          this.list.splice(index, 1)
          delDictionary(data.id).then(res => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: this.$t('metadata.removeCompleted')
              })
            }
          })
        }
      }).catch(() => {})
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.form.id) {
            const index = this.list.findIndex(item => item.id === this.form.id)
            if (~index) {
              this.$set(this.list, index, { ...this.form })
            }
            saveDictionary({ ...this.form }).then(res => {
              if (res.code === 1) {
                this.$message({
                  type: 'success',
                  message: this.$t('metadata.updateCompleted')
                })
              }
            })
          }
          this.loading = false
        }
      })
    },
    cancel() {
      this.showForm = this.loading = false
    },
    handleNodeExpand({ id }) {
      if (!~this.expanded.indexOf(id)) {
        this.expanded.push(id)
      }
    },
    handleNodeCollapse({ id }) {
      const index = this.expanded.indexOf(id)
      if (~index) {
        this.expanded.splice(index, 1)
      }
    },
    editLabel(node, data, e) {
      const {
        offsetWidth,
        offsetHeight,
        offsetTop,
        offsetLeft
      } = e.target.parentNode.parentNode.parentNode.querySelector('.label')
      this.showLabel = true
      this.label = data.name
      this.current = data.id
      const { label } = this.$refs
      label.style.width = offsetWidth + 80 + 'px'
      label.style.height = offsetHeight + 4 + 'px'
      label.style.top = offsetTop - 2 + 'px'
      label.style.left = offsetLeft + 8 + 'px'
      setTimeout(() => {
        label.select()
      })
    },
    hideLabel() {
      this.label = false
    },
    saveLabel(e) {
      if (e && e.target === this.$refs.label) {
        return
      }
      const current = this.list.findIndex(item => item.id === this.current)
      if (~current) {
        this.list[current].name = this.label
        this.list[current].name = this.list[current].name.trim()
        this.$set(this.list, current, this.list[current])
        saveDictionary(this.list[current]).then(res => {
          if (res.code === 1) {
            console.log('saving completed!')
          }
        })
      }
      this.showLabel = false
    },
    handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.saveLabel()
      }
    },
    handleDragStart(node, ev) {
      // console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      // console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      // console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drag end: ', draggingNode, dropNode, dropType, ev)
      if (dropType !== 'none') {
        const { childNodes } = this.$refs.tree.getNode(draggingNode.data.pid)
        const params = childNodes.map(({ data: { id, ver }}, index) => ({ id, ver, levelNo: index }))
        sortDictionary(params)
      }
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop(draggingNode, dropNode, type) {
      return type !== 'inner' && draggingNode.data.pid === dropNode.data.pid
    },
    allowDrag() {
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.system {
  &-container {
    margin: 30px;
    max-width: 1100px;
  }
  &-text {
    margin-bottom: 20px;
    font-size: 20px;
    line-height: 36px;
  }
}
.custom-tree-node {
  display: flex;
  align-items: center;
  width: 100%;
  &.disabled {
    color: #a7a7a7;
  }
}
.label {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50%;
  margin: 0 20px 0 4px;
  word-break: keep-all;
}
.form-wrapper {
  position: sticky;
  top: 86px;
}
#label {
  position: absolute;
  font-family: inherit;
  font-size: 14px;
}
</style>

<style lang="less">
.el-tree-node__expand-icon {
  &.expanded + .custom-tree-node {
    .el-icon-folder::before {
      content: "\e784";
    }
  }
}
.toolbar {
  margin-bottom: 20px;
  i {
    font-size: 16px;
  }
}
.node-tools {
  opacity: 0;
  i {
    font-size: 16px;
  }
}
.el-tree-node__content {
  overflow: hidden;
  &:hover {
    .node-tools {
      opacity: 1;
    }
  }
}
</style>

