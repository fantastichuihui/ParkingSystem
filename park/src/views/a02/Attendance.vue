<template>
  <div>
    <el-row style="margin-left:20px;">
      <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
        <div class="g_inputForm">
          人员名称：
          <el-input
            v-model.trim="personName"
            maxlength="200px"
            placeholder="请输入内容"
            class="g_input"
            @keyup.enter.native="handleFilter"
          />
        </div>
      </el-col>
    </el-row>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>

      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">删除</el-button>
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
      <!-- ID(hidden) -->
      <el-table-column label="考勤号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 人员id -->
      <el-table-column label="人员名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.personName }} [{{ row.personId }}]</span>
        </template>
      </el-table-column>
      <!-- 考勤日期 -->
      <el-table-column label="考勤日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.attendDate }}</span>
        </template>
      </el-table-column>
      <!-- 考勤类型 -->
      <el-table-column label="考勤类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="版本号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float:right"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="resultlength"
      layout="sizes,prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'AttendanceTable',
  data() {
    return {
      personId: undefined,
      personName: '',
      modifierCode: '',
      modifierName: '',
      resultlength: 10,
      // 表格数据
      tableData: [],
      typetext: '',
      // 分页
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 删除选中的
      multipleTable: [],
      // 抓到的后台错误编码
      EC00001: '考勤信息表查询出错（后台错误）！',
      EC00002: '考勤信息表删除出错（后台错误）！',
      msg: ''
    }
  },
  // 页面加载时，加载出表格内容
  created() {
    this.modifierCode = this.$store.state.userInfo.code
    this.modifierName = this.$store.state.userInfo.name
    this.search()
  },
  methods: {
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
        message: '警告' + msg,
        type: 'warning',
        position: 'bottom-right'
      })
    },
    // 查
    search: function() {
      axios.post('/api/a02person/attendence/select', this.getParamMap()).then((res) => {
        if (res.data.status === 1) {
          this.tableData = res.data.resultData.rows
          this.resultlength = res.data.resultData.total
        } else {
          this.tableData = res.data.resultData
          this.msg = res.data.msg
          if (this.msg === 'EC00001') {
            this.open2(this.EC00001)
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
    handleRefresh() {
      this.personName = ''
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
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var data = {}
          data.ids = []
          for (let i = 0; i < this.multipleTable.length; i++) {
            var ids = {}
            ids.id = this.multipleTable[i].id
            ids.version = this.multipleTable[i].version
            data.ids.push(ids)
          }
          data.modifierCode = this.modifierCode
          data.modifierName = this.modifierName
          axios.post('/api/a02person/attendence/delete', data).then((response) => {
            if (response.data.status === 1) {
            // 后台成功执行语句
              if (response.data.resultData > 0) {
                this.$notify({
                  title: '提示信息',
                  message: '操作成功',
                  position: 'bottom-right',
                  type: 'success'
                })
                this.search()
              } else if (response.data.resultData === 0) {
                this.$notify({
                  title: '错误信息',
                  message: '后台删除失败',
                  position: 'bottom-right',
                  type: 'error'
                })
              }
            } else if (response.data.status === 0) {
              this.$notify({
                title: '错误信息',
                message: '后台删除异常',
                position: 'bottom-right',
                type: 'error'
              })
            }
          }
          )
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
    // 跳添加页面
    handleAdd() {
      this.$router.push('AttendanceAdd')
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
          type: 'warning',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$router.push({ name: 'AttendanceUpdate', params: { attendance: this.multipleTable[0] }})
      }
    }
  }
}
</script>
