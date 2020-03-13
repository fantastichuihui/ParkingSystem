<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="请选择" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
    />
    <br>
    <el-tooltip placement="right">
      <div slot="content">{{ text }}</div>
      <span>{{ text | ellipsis }}</span>
    </el-tooltip>
  </div>
</template>

<script>
export default {

  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 10) {
        return value.slice(0, 10) + '...'
      }
      return value
    }
  },

  data() {
    return {
      text: '这是一段很长很长很长很长很长很长的文本',
      filterText: '',
      data2: [{
        id: 1,
        label: 'Level one 1',
        children: [{
          id: 4,
          label: 'Level two 1-1',
          children: [{
            id: 9,
            label: 'Level three 1-1-1'
          }, {
            id: 10,
            label: 'Level three 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: 'Level one 2',
        children: [{
          id: 5,
          label: 'Level two 2-1'
        }, {
          id: 6,
          label: 'Level two 2-2'
        }]
      }, {
        id: 3,
        label: 'Level one 3',
        children: [{
          id: 7,
          label: 'Level two 3-1'
        }, {
          id: 8,
          label: 'Level two 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },

  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }

}
</script>

