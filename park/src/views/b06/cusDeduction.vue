<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form v-model="cusdeduction">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="7" :xl="6">
            <el-form-item label="客户名称：" prop="customerName">
              <el-input
                v-model="cusdeduction.customerName"
                style="width:50%;"
                placeholder="请输入内容"
                clearable
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="7" :xl="6">
            <el-form-item label="重量区间：" prop="weight1">
              <el-input
                v-model="cusdeduction.weight1"
                style="width:60%;"
                placeholder="请输入重量"
                clearable
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="0.0625" :sm="0.125" :md="0.25" :lg="1" :xl="0.5">
            <el-form-item label="至" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="7" :xl="5">
            <el-form-item prop="weight2">
              <el-input
                v-model="cusdeduction.weight2"
                style="width:80%;"
                placeholder="请输入重量"
                clearable
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="0.0625" :sm="0.125" :md="0.25" :lg="1" :xl="2">
            <el-button id="searchCus" type="primary" plain icon="el-icon-search" @click="handleFilter">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div id="main" style="width: 800px;height: 500px;margin-top:7%;" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  name: 'Cusdeduction',
  data() {
    return {
      cusdeduction: {
        customerName: '',
        weight1: '',
        weight2: ''
      },
      chartsOptions: {
        title: {
          text: '客户发货',
          subtext: '客户发货报表'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: [0, 100]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: []
        },
        series: [
          {
            name: '吨数',
            type: 'bar',
            data: []
          }
        ]
      }
    }
  },
  created() {
    this.search()
  },
  mounted() {
    this.$nextTick(function() {
      this.drawBar('main')
    })
  },
  methods: {
    drawBar(id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption(this.chartsOptions)
    },
    refreshCharts(data) {
      const xData = []
      const yData = []
      data.forEach((item, index) => {
        xData.push(item.customerName)
        yData.push(item.weight)
      })
      this.chartsOptions.yAxis.data = xData
      this.chartsOptions.series[0].data = yData
      this.charts.setOption(this.chartsOptions)
    },
    search: function() {
      axios.get('/api/b06report/CustomerDeduction/select', {
        params: {
          customerName: this.cusdeduction.customerName,
          weight1: this.cusdeduction.weight1,
          weight2: this.cusdeduction.weight2
        }
      }).then((response) => {
        // console.log(response.data)
        this.refreshCharts(response.data)
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
