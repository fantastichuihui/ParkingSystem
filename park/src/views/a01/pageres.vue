<template>
  <div g_container>
    <el-form v-model="pageres">
      <div class="g_inputForm">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            显示文本：
            <el-input
              v-model.trim="pageres.displayText"
              class="g_input"
              placeholder="请输入内容"
              clearable
            />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            提示文本：
            <el-input
              v-model.trim="pageres.tooltipText"
              class="g_input"
              placeholder="请输入内容"
              clearable
            />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            元素类型：
            <el-select v-model="pageres.type" class="g_input" placeholder="请输入内容">
              <el-option label="菜单" value="caidan" />
              <el-option label="按钮" value="anniu" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            是否启用：
            <el-select v-model="pageres.isEnable" class="g_input" placeholder="请输入内容">
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </el-col>
        </el-row>
      </div>

    </el-form>

    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>

      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd()">添加</el-button>
    </div>
    <el-table
      :data="tableData"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="60px" />
      <!-- 页面资源id(hidden) -->
      <el-table-column v-if="show" label="页面资源id">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 页面资源父id(hidden) -->
      <el-table-column v-if="show" label="页面资源父id">
        <template slot-scope="{row}">
          <span>{{ row.pid }}</span>
        </template>
      </el-table-column>
      <!-- 职能域id(hidden) -->
      <el-table-column v-if="show" label="职能域" align="center">
        <template slot-scope="{row}">
          <span>{{ row.funDomainId }}</span>
        </template>
      </el-table-column>
      <!--显示文本-->
      <el-table-column label="显示文本" align="center">
        <template slot-scope="{row}">
          <span>{{ row.displayText }}</span>
        </template>
      </el-table-column>
      <!--提示文本-->
      <el-table-column label="提示文本" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tooltipText }}</span>
        </template>
      </el-table-column>
      <!--访问url-->
      <el-table-column label="访问url" align="center">
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <!--元素类型-->
      <el-table-column label="元素类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <!--排序-->
      <el-table-column label="排序" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <!--是否启用-->
      <!-- <el-table-column prop="isEnable" label="是否启用" align="center" /> -->
      <el-table-column label="是否启用" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isEnable }}</span>
        </template>
      </el-table-column>
      <!--动作图标-->
      <el-table-column label="动作图标" align="center">
        <template slot-scope="{row}">
          <span>{{ row.icon }}</span>
        </template>
      </el-table-column>
      <!--动作样式-->
      <el-table-column label="动作样式" align="center">
        <template slot-scope="{row}">
          <span>{{ row.aClass }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      EC00004: '接口表查询出错（后台错误）！',
      EC00002: '接口表表删除出错（后台错误）！',
      currentPage: 1,
      pageres: {
        displayText: undefined,
        tooltipText: undefined,
        type: undefined,
        isEnable: undefined
      },
      multipleTable: [],

      tableData: [],
      total: 0,
      pageSize: 10,
      show: false

    }
  },
  computed: {
    useInfo() {
      return this.$store.state.userInfo
    }
  },
  created() {
    this.search()
  },
  methods: {

    /* /api/a01auth/pageres/findByCondition */
    search: function() {
      axios.get('api/a01auth/pageres/findByCondition', { params: this.getParamMap() }).then((res) => {
        if (res.data.status === 1) {
          this.tableData = res.data.resultData.rows
          this.total = res.data.resultData.total
          this.tableData.forEach((item) => {
            if (item.isEnable === 1) {
              item.isEnable = '启用'
            } else {
              item.isEnable = '禁用'
            }
          })
        } else {
          this.tableData = res.data.resultData.rows
          this.msg = res.data.msg
          if (this.msg === 'EC00004') {
            this.open2(this.EC00004)
          }
        }
      })
    },
    getParamMap: function() {
      return {
        page: this.currentPage,
        rows: this.pageSize,
        displayText: this.pageres.displayText,
        tooltipText: this.pageres.tooltipText,
        type: this.pageres.type,
        isEnable: this.pageres.isEnable
      }
    },
    // 错误消息过滤
    open2: function(msg) {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        title: '警告',
        message: msg,
        type: 'warning',
        position: 'bottom-right'
      })
    },
    handleSizeChange: function(val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.search()
    },
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    handleSearch() {
      this.search()
    },
    handleRefresh() {
      this.pageres = {
        displayText: undefined,
        tooltipText: undefined,
        type: undefined,
        isEnable: undefined
      }
      this.search()
    },
    // 删除
    readyDelete() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const selectLength = this.multipleTable.length
          const listmap = []
          const select = this.multipleTable
          for (let i = 0; i < selectLength; i++) {
            const ids = {}
            ids.id = select[i].id
            listmap[i] = ids
          }
          axios.post('/api/a01auth/pageres/dropPageres', { modifierCode: this.useInfo.code,
            modifierName: this.useInfo.name, list: listmap }).then((res) => {
            this.search()
            if (res.data.status === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '删除成功!',
                position: 'bottom-right'
              })
            } else {
              this.msg = res.data.msg
              if (this.msg === 'EC00002') {
                this.open2(this.EC00002)
              }
            }
          })
        }).catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'info',
            message: '已取消删除',
            position: 'bottom-right'
          })
        })
      }
    },

    handleAdd() {
      this.$router.push('pageresAdd')
    },
    handleEdit() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.$router.push({
          name: 'pageresEdit',
          params: {
            pageres: this.multipleTable[0]
          }
        })
      }
    }
  }
}
</script>
