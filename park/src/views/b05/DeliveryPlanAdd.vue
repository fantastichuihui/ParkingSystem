<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form class="deliveryPlanAdd_form">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="执行单号：" prop="execOrderNo">
              <el-select
                v-model.trim="execOrderNo"
                style="width:50%;"
                filterable
                placeholder="请选择执行单号"
              >
                <el-option
                  v-for="item in optionsExecNo"
                  :key="item.id"
                  :label="item.execOrderNo"
                  :value="item.execOrderNo"
                />
              </el-select>
            </el-form-item></el-col>

          <el-col :xs="2" :sm="4" :md="6" :lg="7" :xl="6">
            <el-form-item label="计划配送日期：" prop="highData">
              <el-date-picker
                v-model="highData"
                type="date"
                value-format="yyyy-MM-dd"
                style="width:60%;"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="0.0625" :sm="0.125" :md="0.25" :lg="1" :xl="0.5">
            <el-form-item label="至" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item prop="lowData">
              <el-date-picker
                v-model="lowData"
                type="date"
                value-format="yyyy-MM-dd"
                style="width:60%;"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="5">
            <el-form-item label="配送类型：" prop="delType">
              <el-select
                v-model.trim="delType"
                filterable
                style="width:50%;"
                placeholder="请选择配送类型"
              >
                <el-option
                  v-for="item in optionsType"
                  :key="item.delType"
                  :label="item.label"
                  :value="item.delType"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleFilter()">查询</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">编制</el-button>
      <el-button type="primary" plain icon="el-icon-back" @click="handleCancel()">取消</el-button>
    </div>

    <!-- 表格加载 -->
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
      <!-- ID(hidden) -->
      <el-table-column label="执行单ID">
        <template slot-scope="{row}">
          <span>{{ row.execOrderId }}</span>
        </template>
      </el-table-column>
      <!-- 执行单号 -->
      <el-table-column label="执行单号">
        <template slot-scope="{row}">
          <span>{{ row.execOrderNo }}</span>
        </template>
      </el-table-column>
      <!-- 配送类型 -->
      <el-table-column label="配送类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.delType }}</span>
        </template>
      </el-table-column>
      <!-- 计划开始执行日期 -->
      <el-table-column label="计划开始执行日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.planStartTime }}</span>
        </template>
      </el-table-column>
      <!-- 计划结束执行日期 -->
      <el-table-column label="计划结束执行日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.planFinishTime }}</span>
        </template>
      </el-table-column>
      <!-- 已配送物料数 -->
      <el-table-column label="已配送物料数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.finishmat }}</span>
        </template>
      </el-table-column>
      <!--  未配送物料数-->
      <el-table-column label="未配送物料数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.unfinishmat }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="g_pagination">
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
  </div>
</template>

<script>

import axios from 'axios'
// 抓到的后台错误编码
import { getError } from '@/utils/error'
import { delSelect, open2 } from '@/utils/systemTips'

export default {
  name: 'DeliveryPlanAdd',
  data() {
    return {
      /* 执行单号 */
      optionsExecNo: this.getOptionsExecNo(),
      execOrderNo: '',
      /* 配送类型 */
      optionsType: [{
        delType: 0,
        label: '自提'
      }, {
        delType: 1,
        label: '配送'
      }],
      delType: undefined,
      // value: undefined,
      highData: '',
      lowData: '',
      // 表格数据
      tableData: [],
      // 分页
      currentPage: 1,
      pageSize: 10,
      total: 100,
      // 选中的
      multipleTable: []

    }
  },
  computed: {
    useInfo() {
      return this.$store.state.userInfo
    }
  },
  // 页面加载时，加载出表格内容
  created() {
    this.search()
  },

  methods: {
  // 勾选中的数据
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 分页
    handleSizeChange: function(val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
    },
    // 从后台拿数据 执行单号
    getOptionsExecNo: function() {
      axios.get('/api/b05lms/DeliveryPlan/selectbycompanyno', { params: { companyNo: this.$store.state.userInfo.orgCode }}).then(res => {
        if (res.data.status === 1) {
          this.optionsExecNo = res.data.resultData
        // console.log(this.optionsExecNo)
        } else {
          this.msg = res.data.msg
          if (this.msg === 'EC00011') {
            open2(getError().EC00011)
          }
        }
      })
    },
    getParamMap: function() {
      return {
        // 登陆时拿到的配送单位编码
        companyNo: this.$store.state.userInfo.orgCode,
        execOrderNo: this.execOrderNo,
        delType: this.delType,
        highData: this.highData,
        lowData: this.lowData,
        page: this.currentPage,
        rows: this.pageSize
      }
    },
    // 查
    search: function() {
      console.log(this.getParamMap())
      axios.get('/api/b05lms/DeliveryPlan/selectbycompany', { params: this.getParamMap() }).then((res) => {
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
          // console.log(this.tableData)
        } else {
          this.msg = res.data.msg
          if (this.msg === 'EC00010') {
            open2(getError().EC00010)
          }
        }
      })
    },
    handleFilter: function() {
      this.search()
    },
    // 跳主页面
    handleCancel() {
      this.$router.push('DeliveryPlan')
    },
    // 跳编制页面
    handleEdit() {
      if (this.multipleTable.length === 0) {
        delSelect()
      } else {
        console.log(this.multipleTable)
        this.$router.push({
          name: 'DeliveryPlanCompile',
          params: { DeliveryPlanCompile: this.multipleTable }
        })
      }
    }
  }
}
</script>
