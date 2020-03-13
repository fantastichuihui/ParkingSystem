<template>
  <div g_container>
    <el-table
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="60px" />
      <!-- 执行单号 -->
      <el-table-column label="执行单号">
        <template slot-scope="{row}">
          <span>{{ row.execOrderNo }}</span>
        </template>
      </el-table-column>
      <!-- 子项号 -->
      <el-table-column label="子项号">
        <template slot-scope="{row}">
          <span>{{ row.contractItemId }}</span>
        </template>
      </el-table-column>
      <!-- 物料号 -->
      <el-table-column label="物料号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.matNo }}</span>
        </template>
      </el-table-column>
      <!--钢牌号-->
      <el-table-column label="钢牌号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.gNo }}</span>
        </template>
      </el-table-column>
      <!--产品名称-->
      <el-table-column label="产品名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!--所属钢种-->
      <el-table-column label="所属钢种" align="center">
        <template slot-scope="{row}">
          <span>{{ row.gp }}</span>
        </template>
      </el-table-column>

    </el-table>
    <div style="float: right;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-button type="primary" plain icon="el-icon-back" @click="handleBack()">取消</el-button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      execOrdersNo: [],
      execDatas: this.$route.params.executionOrders,
      EC00005: '执行单表和关联关系表查询出错（后台错误）！',
      tableData: [],
      currentPage: 1,
      pageSize: 10
    }
  },
  created() {
    this.search()
  },
  methods: {
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
    search: function() {
      for (let i = 0; i < this.execDatas.length; i++) {
        this.execOrdersNo[i] = { id: this.execDatas[i].id, execOrderNo: this.execDatas[i].execOrderNo }
      }
      axios.post('/api/s01/matNoToFind', this.execOrdersNo).then((res) => {
        if (res.data.status === 1) {
          this.tableData = res.data.resultData
          if (this.tableData.length === 0) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '该条件下无数据!',
              position: 'bottom-right'
            })
          }
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 当前页显示多少条，
    handleSizeChange: function(val) {
      this.pageSize = val
    },
    // 当前第几页
    handleCurrentChange: function(val) {
      this.currentPage = val
    },
    // 返回主界面
    handleBack() {
      this.$router.push('executionOrder')
    }
  }
}
</script>
