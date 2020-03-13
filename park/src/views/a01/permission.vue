<template>
  <div g_container>
    <div class="g_inputForm">
      <el-form v-model="permission">
        <el-row style="margin-left:20px">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            权限来源：
            <el-select v-model="permission.createUserCode" class="g_input" placeholder="请选择权限来源">
              <el-option v-for="item in permissionData" :key="item" :label="item" :value="item" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            权限对象：
            <el-select v-model="permission.objId" class="g_input" placeholder="请选择权限对象">
              <el-option v-for="item in resData" :key="item.id" :label="item.id" :value="item.id" />
            </el-select>
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
      <el-table-column label="权限id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限来源" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限对象" align="center">
        <template slot-scope="{row}">
          <span>{{ row.objId }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;">
      <el-pagination
        :current-page.sync="permission.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="permission.rows"
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
      permission: {
        id: '',
        name: '',
        createUserCode: '',
        objId: '',
        page: 1,
        rows: 10
      },
      modifierCode: new Date(),
      modifierName: '',
      total: 0,
      resData: [],
      permissionData: [],
      multipleTable: [],
      ids: [],
      tableData: [],
      rules: {
      }
    }
  },
  /* 向后台发送数据 */
  created() {
    this.handleSearch()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 查询
    handleSearch() {
      axios.get('/api/a01auth/permission/findPermissionByCondition', {
        params: this.permission
      }).then((result) => {
        this.tableData = result.data.resultData.rows
        this.total = result.data.resultData.total
      })
      axios.get('/api/a01auth/res/findAllRes').then((result) => {
        this.resData = result.data
      })
      axios.get('/api/a01auth/role/findAllPermission').then((result) => {
        const array = new Set()
        result.data.forEach((item, index) => {
          array.add(item.createUserCode)
        })
        this.permissionData = array
      })
    },
    // 重置
    handleRefresh() {
      this.permission.createUserCode = ''
      this.permission.objId = ''
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
              modifierCode: select[i].modifierCode,
              modifierName: select[i].modifierName
            }
            listmap.push(obj)
          }
          axios.put('/api/a01auth/permission/dropPermission', listmap).then((res) => {
            this.handleSearch()
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            })
          })
        }).catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            message: '已取消删除',
            type: 'info',
            position: 'bottom-right'
          })
        })
      }
    },
    // 添加
    handleAdd() {
      this.$router.push('permissionAdd')
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
          name: 'permissionEdit',
          params: {
            permission: this.multipleTable[0]
          }
        })
      }
    },
    handleSizeChange: function(val) {
      this.permission.rows = val
      this.handleSearch()
    },
    handleCurrentChange: function(val) {
      this.permission.page = val
      this.handleSearch()
    }
  }
}
</script>
