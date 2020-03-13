<template>
  <div g_container>
    <div style="height: 700px;">
      <organization-chart :datasource="ds" style="height: 600px;" />
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-back" @click="handleBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import OrganizationChart from 'vue-organization-chart'
import 'vue-organization-chart/dist/orgchart.css'
import axios from 'axios'
import * as systemTips from '@/utils/systemTips.js'
export default {
  components: {
    OrganizationChart
  },
  data() {
    return {
      ds: {
      }
    }
  },
  created() {
    this.mkTree()
  },
  methods: {
    mkTree: function() {
      axios.get('/api/a02person/organization/getOrgTree', {
      }).then((response) => {
        this.ds = response.data
        /* 用list接收这个数据; */
      }).catch((error) => { /* 接收错误 */
        systemTips.error('查询失败')
      })
    },
    handleBack: function() {
      this.$router.push('organization')
    }
  }
}
</script>
