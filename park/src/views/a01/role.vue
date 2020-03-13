<template>
  <div g_container>
    <div class="g_inputForm">
      <el-form v-model="role">
        <el-row style="margin-left:20px">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            角色名称：
            <el-input v-model="role.name" placeholder="请输入角色名称" class="g_input" clearable @keyup.enter.native="handleSearch" />
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>

      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加</el-button>
    </div>
    <div>
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
        <!-- 角色id(hidden) -->
        <el-table-column v-if="shows" label="角色id" align="center">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <!-- 角色名称 -->
        <el-table-column label="角色名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <!-- 创建人编码 -->
        <el-table-column label="创建人编码" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createUserCode }}</span>
          </template>
        </el-table-column>
        <!--创建人名称-->
        <el-table-column label="创建人名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createUserName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="float: right;">
      <el-pagination
        :current-page.sync="role.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="role.rows"
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
      role: {
        id: '',
        name: '',
        code: '',
        remark: '',
        desribtion: '',
        page: 1,
        rows: 10
      },
      total: 100,
      multipleTable: [],
      ids: [],
      tableData: [],
      rules: {},
      shows: false
    }
  },
  computed: {
    useInfo() {
      return this.$store.state.userInfo
    }
  },
  // 向后台发送数据
  created() {
    this.handleSearch()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 查询
    handleSearch() {
      axios.get('/api/a01auth/role/findRoleByPage', {
        params: this.role
      }).then((result) => {
        // console.log(this.tableData)
        this.tableData = result.data.resultData.rows
        this.total = result.data.resultData.total
      })
    },
    // 重置
    handleRefresh() {
      this.role.name = ''
      this.handleSearch()
    },
    // 开始删除
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
            const obj = {
              id: select[i].id,
              version: select[i].version,
              modifierCode: this.$store.state.userInfo.code,
              modifierName: this.$store.state.userInfo.name
            }
            // console.log(select[i].id)
            // console.log(select[i].version)
            listmap.push(obj)
          }
          axios.put('/api/a01auth/role/deleteRole', listmap).then((res) => {
            // console.log(res.data)
            this.handleSearch()
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '删除成功',
              position: 'bottom-right'
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
        })
      }
    },
    // 添加
    handleAdd() {
      this.$router.push('roleAdd')
    },
    // 修改
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
        this.$router.push({
          name: 'roleEdit',
          params: {
            role: this.multipleTable[0]
          }
        })
      }
    },
    handleSizeChange: function(val) {
      this.role.rows = val
      this.handleSearch()
    },
    handleCurrentChange: function(val) {
      this.role.page = val
      this.handleSearch()
    }
  }
}
</script>
