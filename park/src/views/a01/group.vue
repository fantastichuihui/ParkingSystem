<template>
  <div g_container>
    <div class="g_inputForm">
      <el-form v-model="group">
        <el-row style="margin-left:20px">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            用户组名称：
            <el-input
              v-model.trim="group.name"
              placeholder="请输入用户组名称"
              class="g_input"
              clearable
            />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            上级用户组名称：
            <el-input
              v-model.trim="group.pname"
              placeholder="请输入内容上级用户组名称"
              class="g_input"
              clearable
            />
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>

      <el-button
        type="primary"
        plain
        icon="el-icon-delete"
        @click="readyDelete()"
      >刪除</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-edit"
        @click="handleEdit()"
      >修改</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        @click="handleAdd()"
      >添加</el-button>
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
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <!-- 用户组ID(hidden) -->
      <el-table-column v-if="show" label="用户组ID">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 用户组父ID(hidden) -->
      <el-table-column v-if="show" label="用户组父ID">
        <template slot-scope="{row}">
          <span>{{ row.pid }}</span>
        </template>
      </el-table-column>
      <!-- 测试名称 -->
      <el-table-column label="用户组名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!--上级用户组名称-->
      <el-table-column label="上级用户组名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pname }}</span>
        </template>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="版本号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
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
  name: 'TestTable',
  data() {
    return {
      group: {
        Name: undefined,
        pname: undefined
      },
      multipleTable: [],
      tableData: [],
      currentPage: 1,
      total: 100,
      pageSize: 10,
      show: false
    }
  },
  created() {
    this.search()
  },
  methods: {
    search: function() {
      console.log(this.getParamMap())
      axios.get('/api/a01auth/usergroup/selectGroup', { params: this.getParamMap() }).then((res) => {
        console.log(res)
        if (res.data.status === 1) {
          this.tableData = res.data.resultData.rows /* /api/a01auth/usergroup/selectGroup */
          this.total = res.data.resultData.total
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
        name: this.group.name,
        pname: this.group.pname
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
      console.log(' xxxxx' + this)
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
      this.group = {
        Name: undefined,
        pname: undefined
      }
      this.search()
    },
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
          axios.post('/api/a01auth/usergroup/delGroup', listmap).then((res) => {
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
                this.open2('删除失败')
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
      this.$router.push('groupAdd')
    },
    handleEdit() {
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
        this.$router.push({ name: 'groupEdit', params: { group: this.multipleTable[0] }})
      }
    }
  }
}

</script>
