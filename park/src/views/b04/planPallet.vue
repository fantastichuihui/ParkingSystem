<template>
  <div g_container>
    <div class="g_inputForm">
      <el-form v-model="planPallet">
        <div style="float: left;width: 20%">
          <el-form-item label="计划名称" style="width: 80%;float: left;">
            <el-input v-model="planPallet.name" placeholder="请输入资源名称" clearable @keyup.enter.native="handleSearch" />
          </el-form-item>
        </div>

        <div style="float: left;width: 20%">
          <el-form-item label="计划状态" style="width: 80%;float: left;">
            <el-select v-model="planPallet.status" style="width: 100%" placeholder="请选择计划状态">
              <el-option v-for="item in outPlanData" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>

        <div style="float: left;width: 40%">
          <el-form-item label="计划日期" style="width: 45%;float: left;">
            <el-date-picker
              v-model="planPallet.daterange"
              type="datetimerange"
              range-separator="---"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="计划开始时间"
              end-placeholder="计划结束时间"
            />
          </el-form-item>
        </div>
        <div style="float: left;width: 20%">
          <el-form-item label="计划托盘" style="width: 80%;float: left;">
            <el-select v-model="planPallet.palletId" style="width: 100%" placeholder="请选择">
              <el-option v-for="item in planPalletData" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>
        <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">查询</el-button>
      </el-form>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="returnOutPlan">返回</el-button>
      <el-button type="primary" plain icon="el-icon-search" @click="intoDisposeMateriel">配置物料</el-button>
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
        <!-- 序号 -->
        <el-table-column label="序号" type="index" align="center" width="60px" />
        <!-- 角色名称 -->
        <el-table-column label="托盘id" align="center">
          <template slot-scope="{row}">
            <span>{{ row.palletId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="托盘状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.palletState ==1 ? '待提货' : row.palletState==2 ? '提货中' : '提货完成' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="托盘启用时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.palletStartTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="托盘结束时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.palletEndTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.status ==1 ? '未执行' : row.status== 2 ? '执行中' : row.status == 3 ? '执行完毕' : '已取消' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划开始时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.planStartTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划结束时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.planEndTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="float: right;">
      <el-pagination
        :current-page.sync="planPallet.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="planPallet.rows"
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
      planPallet: {
        id: '',
        palletId: '',
        planId: '',
        name: '',
        status: '',
        planStartTime: '',
        planEndTime: '',
        page: 1,
        rows: 10,
        daterange: []
      },
      outPlanData: [{
        id: 1,
        value: '未执行'
      },
      {
        id: 2,
        value: '执行中'
      },
      {
        id: 3,
        value: '执行完毕'
      },
      {
        id: 4,
        value: '已取消'
      }
      ],
      modifierCode: this.$store.state.userInfo.code,
      modifierName: this.$store.state.userInfo.name,
      total: 0,
      multipleTable: [],
      ids: [],
      planPalletData: [],
      tableData: [],
      rules: {}
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
      this.planPallet.planId = this.$route.params.planId
      this.planPallet.planStartTime = this.planPallet.daterange[0]
      this.planPallet.planEndTime = this.planPallet.daterange[1]
      axios.get('/api/b04wms/planPallet/selectPlanPalletByPage', {
        params: this.planPallet
      }).then((result) => {
        this.tableData = result.data.resultData.rows
        this.total = result.data.resultData.total
      })
    },
    // 跳转
    returnOutPlan() {
      this.$router.push('outPlan')
    },
    intoDisposeMateriel() {
      this.$router.push('disposeMateriel')
    },
    handleSizeChange: function(val) {
      this.planPallet.rows = val
      this.handleSearch()
    },
    handleCurrentChange: function(val) {
      this.planPallet.page = val
      this.handleSearch()
    }
  }
}
</script>
