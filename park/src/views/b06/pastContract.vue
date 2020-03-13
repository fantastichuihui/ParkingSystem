<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form v-model="pastContract">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="7" :xl="6">
            <el-form-item label="合同编号：" prop="contractNumber">

              <el-input
                v-model="pastContract.contractNumber"
                placeholder="请输入内容"
                style="width:50%;"
                clearable
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="7" :xl="6">
            <el-form-item label="合同到期日：" prop="value1">
              <el-date-picker
                v-model="pastContract.value1"
                type="date"
                style="width:60%;"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="0.0625" :sm="0.125" :md="0.25" :lg="1" :xl="0.5">
            <el-form-item label="至" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="7" :xl="5">
            <el-form-item prop="value2">
              <el-date-picker
                v-model="pastContract.value2"
                type="date"
                style="width:80%;"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="0.0625" :sm="0.125" :md="0.25" :lg="1" :xl="2">
            <el-button type="primary" plain icon="el-icon-search" @click="handleFilter">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
    >

      <el-table-column label="序号" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.order }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同编号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.contractNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.customerPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货单位" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货单位电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.receivePhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同到期日" align="center">
        <template slot-scope="{row}">
          <span>{{ row.expireDate }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'PastContract',
  data() {
    return {
      pastContract: {
        contractNumber: '', // 合同号
        value1: '',
        value2: ''
      },
      tableData: []
    }
  },
  created() {
    this.search()
  },
  methods: {
    search: function() {
      axios.post('/api/s02/s02/findCom',
        { contractNumber: this.pastContract.contractNumber,
          value1: this.pastContract.value1,
          value2: this.pastContract.value2 }).then((response) => {
        // console.log(response.data)
        this.tableData = response.data.resultData
        // 用list接收这个数据;
      }).catch((error) => { // 接收错误
        console.log(error)
      })
    },
    handleFilter: function() {
      this.search()
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
