<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form v-model="Drivers">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            车牌号：
            <el-input
              v-model.trim="Drivers.carNumber"
              placeholder="请输入内容"
              class="g_input"
              clearable
            />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="7" :xl="5">
            日期：
            <el-date-picker
              v-model="Drivers.beginDate"
              placeholder="请输入内容"
              style="width:70%;"
              clearable
            />
          </el-col>
          <el-col :xs="0.0625" :sm="0.125" :md="0.25" :lg="1" :xl="0.5">
            <el-form-item label="至" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-date-picker
              v-model="Drivers.endDate"
              placeholder="请输入内容"
              style="width:60%;"
              clearable
            />
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSerach()">查询</el-button>
      <el-button type="primary" plain icon="el-icon-upload" @click="handleExport()">导出</el-button>
    </div>

    <!-- @row-click="handleRowClick" -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      class="g_table"
      :row-key="getRowKeys"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" :reserve-selection="true" />
      <!-- 测试ID(hidden) -->
      <el-table-column v-if="show" label="ID">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column type="index" :index="table_index" label="序号" width="60px" align="center" />
      <el-table-column label="车牌号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.carNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type === 1?'入园':'出园' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.carTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="司机姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.driverName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template slot-scope="{row}">
          <span>{{ row.driverPhone }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="g_pagination">

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
import JsonExcel from 'vue-json-excel'
import Vue from 'vue'
Vue.component('downloadExcel', JsonExcel)
export default {
  name: 'TestTable',
  data() {
    return {
      Drivers: {
        carNumber: '',
        beginDate: null,
        endDate: null
      },
      options: [],
      value: '',
      show: false,
      currentPage: 1,
      total: 100,
      pageSize: 10,
      tableData: [],
      multipleTable: []
    }
  },
  created() {
    this.search()
    // axios.get('/api/b05lmszq/carAccess/selectCarAccessByCondition', { params: this.getTodayParam() }).then(response => {
    //   if (response.data.status === 1) {
    //     this.tableData = response.data.resultData // 用list接收这个数据
    //     this.total = 10
    //   } else if (response.data.msg === 'EC00004') {
    //     if (this.notifyInstance) {
    //       this.notifyInstance.close()
    //     }
    //     this.notifyInstance = this.$notify({
    //       title: '错误信息',
    //       message: '后台查询出错',
    //       type: 'error',
    //       position: 'bottom-right'
    //     })
    //   }
    // })
  },
  methods: {
    search: function() {
      axios
        .get('/api/b05lms/carAccess/selectCarAccessByCondition', { params: this.getParamMap() })
        .then(response => {
          if (response.data.status === 1) {
            this.tableData = response.data.resultData.rows // 用list接收这个数据
            this.total = response.data.resultData.total
          } else if (response.data.msg === 'EC00004') {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: '后台查询出错',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
    },
    getParamMap: function() {
      return {
        page: this.currentPage,
        rows: this.pageSize,
        carNumber: this.Drivers.carNumber,
        beginDate: this.Drivers.beginDate,
        endDate: this.Drivers.endDate
      }
    },
    // getTodayParam: function() {
    //   return {
    //     page: this.currentPage,
    //     rows: this.pageSize
    //   }
    // },
    getRowKeys: function(row) {
      return row.id
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
    table_index(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    // 查询
    handleFilter: function() {
      this.search()
    },
    // 导出
    handleExport: function() {
      // const data = []
      // for (var i = 0; i < this.multipleTable.length; i++) {
      //   const map = {}
      //   map.id = this.multipleTable[i].id
      //   map.carNumber = this.multipleTable[i].carNumber
      //   map.type = this.multipleTable[i].type
      //   map.time = this.multipleTable[i].time
      //   map.driverName = this.multipleTable[i].driverName
      //   map.driverPhone = this.multipleTable[i].driverPhone
      //   data.push(map)
      // }
      let param = ''
      for (const key in this.getParamMap()) {
        if (this.getParamMap()[key]) {
          if (!param) {
            param += `${key}=${this.getParamMap()[key]}`
          } else {
            param += `&${key}=${this.getParamMap()[key]}`
          }
        }
      }
      window.location.href = '/api/b05lms/carAccess/exportDeviceModelMsg?' + param
      // axios({
      //   method: 'post',
      //   url: '/api/b05lmszq/carAccess/exportDeviceModelMsg',
      //   data: data,
      //   responseType: 'blob'
      // }).then(response => {
      //   if (!data) {
      //     return
      //   }
      //   const url = window.URL.createObjectURL(new Blob([data]))
      //   const link = document.createElement('a')
      //   link.style.display = 'none'
      //   link.href = url
      //   link.setAttribute('download', '车辆出入记录.xlsx')

      //   document.body.appendChild(link)
      //   link.click()
      // })
      // axios.post('/api/b05lmszq/carAccess/exportDeviceModelMsg', data).then(response => {
      //   if (response.data === 1) {
      //     this.$notify({
      //       title: '提示信息',
      //       message: '打印成功',
      //       type: 'success',
      //       position: 'bottom-right'
      //     })
      //   } else {
      //     this.$notify({
      //       title: '错误信息',
      //       message: '的打印失败',
      //       type: 'error',
      //       position: 'bottom-right'
      //     })
      //   }
      // })
    },
    // handleRowClick(row, column, event) {
    //   this.$nextTick(function() {
    //     this.$refs.multipleTable.toggleRowSelection(row)
    //   })
    // },
    // 条件查询
    handleSerach: function() {
      axios.get('/api/b05lms/carAccess/selectCarAccessByCondition', { params: this.getParamMap() }).then(response => {
        if (response.data.status === 1) {
          this.tableData = response.data.resultData.rows // 用list接收这个数据
          this.total = response.data.resultData.total
        } else if (response.data.msg === 'EC00004') {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误',
            message: '后台查询出错',
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
    }
  }
}
</script>

<style>
.el-form-item__label {
    font-size: 16px;
    color: #606266;
    font-weight: normal;
}
</style>

