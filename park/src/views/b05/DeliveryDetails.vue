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
      <!-- 子项号 -->
      <el-table-column label="子项号">
        <template slot-scope="{row}">
          <span>{{ row.contractIdAndItemNo }}</span>
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

    <div class="g_button">
      <el-button
        type="primary"
        plain
        icon="el-icon-cancel"
        @click="handleback()"
      >返回</el-button>
    </div>
  </div>
</template>

<script>
/* import axios from 'axios' */
export default {
  data() {
    return {
      currentPage: 1,
      multipleTable: [],
      tableData: this.$route.params.updateDeliveryPlan.listmaps,
      /*  total: 100, */
      pageSize: 10,
      show: false

    }
  },
  created() {

  },
  methods: {
    handleSizeChange: function(val) {
      this.pageSize = val
      /* this.search() */
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
      /* this.search() */
    },
    handleback() {
      this.$router.push('DeliveryPlan')
    },
    handleSelectionChange(val) {
      this.multipleTable = val
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
