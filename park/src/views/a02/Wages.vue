<template>
  <div>
    <div class="g_inputForm">
      <!-- <el-form v-model="attendance"> -->
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          人员名称：
          <el-input v-model.trim="personName" placeholder="请输入内容" class="g_input" clearable @keyup.enter.native="handleFilter" />
        </el-col>
      </el-row>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
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
      <el-table-column label="序号" align="center" type="index" :index="table_index" width="60px" />
      <!-- ID(hidden) -->
      <el-table-column label="工资ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 人员id -->
      <el-table-column label="人员(Id)名称" align="center">
        <template slot-scope="{row}">
          <!-- <span>（personId:{{ row.personId }}）{{ row.personName }}</span> -->
          <span>（id:{{ row.personId }}）{{ row.personName }}</span>
        </template>
      </el-table-column>
      <!-- 基本工资 税前-->
      <el-table-column label="基本工资(税前)" align="center">
        <template slot-scope="{row}">
          <span>{{ row.grossPay }}</span>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
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
  name: 'WagesTable',
  data() {
    return {
      personId: undefined,
      personName: '',
      // 表格数据
      tableData: [],
      // 分页
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 删除选中的
      multipleTable: [],
      // 抓到的后台错误编码
      EW00001: '人员工资表查询出错（后台错误）！',
      EW00002: '人员工资表删除出错（后台错误）！',
      EW00003: '人员工资表修改出错（后台错误）！',
      EW00004: '人员工资表添加出错（后台错误）！',
      msg: ''
    }
  },
  // 页面加载时，加载出表格内容
  created() {
    this.search()
  },
  methods: {
    /* 分页序号自增*/
    table_index(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    // 分页
    handleSizeChange: function(val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.search()
    },
    getParamMap: function() {
      if (this.personName !== '') {
        return {
          personName: this.personName,
          page: this.currentPage,
          rows: this.pageSize
        }
      } else {
        return {
          page: this.currentPage,
          rows: this.pageSize
        }
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
    // 查
    search: function() {
      axios.get('/api/a02person/wages/select', {
        params: this.getParamMap()
      }).then((res) => {
        if (res.data.status === 1) {
          this.tableData = res.data.resultData.rows /* /api/a02person/wages/select */
          this.total = res.data.resultData.total
        } else {
          this.tableData = res.data.resultData
          this.msg = res.data.msg
          if (this.msg === 'EW00001') {
            this.open2(this.EW00001)
          }
        }
      })
    },
    handleFilter: function() {
      this.search()
    },
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    /* 重置按钮 */
    handleRefresh() {
      /* this.personName = '' */
      this.search()
    },
    /* 删除 */
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
              id: select[i].id
              /* version: select[i].version,
                    modifierCode: this.modifierCode,
                    modifierName: this.modifierName */
            }
            // obj.id = select[i].id
            // obj.version = select[i].version
            listmap.push(obj)
          }
          /*    console.log(listmap) */
          axios.put('/api/a02person/wages/delete', listmap).then((res) => {
            this.search()
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '删除成功!',
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
    // 跳添加页面
    handleAdd() {
      this.$router.push('WagesAdd')
    },
    // 跳修改页面
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
          name: 'WagesUpdate',
          params: {
            wages: this.multipleTable[0]
          }
        })
      }
    }
  }
}
</script>
