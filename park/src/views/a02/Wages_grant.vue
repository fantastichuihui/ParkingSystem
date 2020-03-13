<template>
  <div g_container>
    <div class="g_inputForm">
      <!-- <el-form v-model="attendance"> -->
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          人员名称：
          <el-input
            v-model.trim="personName"
            placeholder="请输入内容"
            class="g_input"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-col>
      </el-row>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>

      <el-button
        type="primary"
        plain
        icon="el-icon-edit"
        @click="handleEdit()"
      >修改</el-button>

      <el-button
        type="primary"
        plain
        icon="el-icon-delete"
        @click="readyDelete()"
      >刪除</el-button>

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

      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="60px" />

      <!-- ID(hidden) -->
      <el-table-column label="主键ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <!-- 人员id -->
      <el-table-column label="人员id" align="center">
        <template slot-scope="{row}">
          <span>（personId:{{ row.personId }}）{{ row.personName }}</span>
        </template>
      </el-table-column>

      <!-- 归属日期 -->
      <el-table-column label="归属日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ascriptionDate }}</span>
        </template>
      </el-table-column>

      <!-- 发放日期 -->
      <el-table-column label="发放日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.grantDate }}</span>
        </template>
      </el-table-column>

      <!-- 基本工资 -->
      <el-table-column label="基本工资" align="center">
        <template slot-scope="{row}">
          <span>{{ row.basicWages }}</span>
        </template>
      </el-table-column>

      <!-- 养老保险扣除金额 -->
      <el-table-column label="养老保险扣除金额" align="center">
        <template slot-scope="{row}">
          <span>{{ row.eiMoney }}</span>
        </template>
      </el-table-column>

      <!-- 失业保险扣除金额 -->
      <el-table-column label="失业保险扣除金额" align="center">
        <template slot-scope="{row}">
          <span>{{ row.uiMoney }}</span>
        </template>
      </el-table-column>

      <!-- 医疗保险扣除金额 -->
      <el-table-column label="医疗保险扣除金额" align="center">
        <template slot-scope="{row}">
          <span>{{ row.miMoney }}</span>
        </template>
      </el-table-column>

      <!-- 住房公积金扣除金额 -->
      <el-table-column label="住房公积金扣除金额" align="center">
        <template slot-scope="{row}">
          <span>{{ row.hpfMoney }}</span>
        </template>
      </el-table-column>

      <!-- 奖惩金额合计 -->
      <el-table-column label="奖惩金额合计" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rpSum }}</span>
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
  name: 'WagesGrantTable',
  data() {
    return {
      personId: undefined,
      createUserCode: this.$store.state.userInfo.code,
      createUserName: this.$store.state.userInfo.name,
      modifierCode: this.$store.state.userInfo.code,
      modifierName: this.$store.state.userInfo.name,
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
      EG00001: '人员奖惩表查询出错（后台错误）！',
      EG00002: '人员奖惩表删除出错（后台错误）！',
      EG00003: '人员奖惩表修改出错（后台错误）！',
      EG00004: '人员奖惩表添加出错（后台错误）！',
      msg: ''
    }
  },
  // 页面加载时，加载出表格内容
  created() {
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
        message: msg,
        type: 'warning',
        position: 'bottom-right'
      })
    },
    // 查询
    search: function() {
      axios.post('/api/a02person/wages_grant/select', this.getParamMap()).then((res) => {
        if (res.data.status === 1) {
          this.tableData = res.data.resultData.rows
          this.total = res.data.resultData.total
        } else {
          this.tableData = res.data.resultData
          this.msg = res.data.msg
          if (this.msg === 'EG00001') {
            this.open2(this.EG00001)
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
            ids.version = select[i].version
            listmap[i] = ids
          }
          axios.post('/api/a02person/wages_grant/delete', listmap).then((res) => {
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
              if (this.msg === 'EG00002') {
                this.open2(this.EG00002)
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

    // 跳添加页面
    handleAdd() {
      this.$router.push('Wages_grantAdd')
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
        this.$router.push({ name: 'Wages_grantUpdate', params: { wages_grant: this.multipleTable[0] }})
      }
    }
  }
}
</script>
