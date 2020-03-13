<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form>
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="执行单号:" prop="execOrderNo">
              <el-select v-model="execOrderNo" placeholder="请选择">
                <el-option
                  v-for="item in execOrderNos"
                  :key="item.id"
                  :label="item.execOrderNo"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="子项号：" prop="itemNo">
              <el-select v-model="itemNo" placeholder="请选择">
                <el-option
                  v-for="item in itemNos"
                  :key="item.contractItemId"
                  :label="item.conNoItem"
                  :value="item.contractItemId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="g_button">
      <el-button
        type="primary"
        plain
        icon="el-icon-search"
        @click="handleSearch()"
      >查找</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh()">重置</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-back"
        @click="handleCannel()"
      >取消</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        @click="handleAdd()"
      >添加</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-check"
        @click="handleSure()"
      >确定</el-button>
    </div>
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
          <span>{{ row.itemId }}</span>
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
    </div><br><br>
  </div>
</template>

<script>
import axios from 'axios'

export default {

  data() {
    return {
      itemNos: [],
      tableData: [],
      execOrderNo: '',
      execOrderNos: [],
      itemNo: '',
      currentPage: 1,
      multipleTable: [],
      /* total: 100, */
      pageSize: 10,
      show: false,
      matNo: this.matNo,
      conItem: ''
    }
  },
  computed: {
    useInfo() {
      return this.$store.state.userInfo
    }
  },
  watch: {
    itemNo: function() {
      for (var i = 0; i < this.itemNos.length; i++) {
        if (this.itemNo === this.itemNos[i].contractItemId) {
          this.conItem = this.itemNos[i].conNoItem
          break
        }
      }
    }
    /*     execOrderNo: function() {
      for (var i = 0; i < this.execOrderNos.length; i++) {
        if (this.execOrderNo === this.execOrderNos[i].id) {
          this.execOrderNo = this.execOrderNos[i].execOrderNo
          break
        }
      }
    } */

  },
  created() {
    // 查找所有执行单
    axios.get('/api/b05lms/ExecutionOrder/findAllExeOrderName').then((res) => {
      this.execOrderNos = res.data.resultData
    })

    axios.get('/api/b01crm/childItem/getConNoItemNo').then((res) => {
      this.itemNos = res.data.resultData
    })
  },
  methods: {
    handleSizeChange: function(val) {
      this.pageSize = val
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
    },
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    handleRefresh() {
      this.execOrderNo = ''
      this.itemNo = ''
      this.tableData = []
    },
    handleSearch() {
      if (this.execOrderNo !== '' && this.itemNo === '') {
        var list = []
        var map = {}
        map.id = this.execOrderNo
        list[0] = map
        axios.post('/api/s01/MatNOTofind', list).then((res) => {
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
        })
      } else if (this.execOrderNo === '' && this.itemNo !== '') {
        const map = {}
        map.contractItemId = this.itemNo
        map.itemId = this.conItem
        console.log(map)
        axios.post('/api/s01/ItemTofind', map).then((res) => {
          this.tableData = res.data
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
        })
      } else if (this.itemNo !== '' && this.execOrderNo !== '') {
        const bigmap = {}
        const list = []
        const map = {}
        map.id = this.execOrderNo
        list[0] = map
        bigmap.execOrderNo = list
        bigmap.contractItemId = this.itemNo // 子项id
        bigmap.itemId = this.conItem // 合同号-子项号

        console.log(bigmap)
        axios.post('/api/s01/ItemAndMatTofind', bigmap).then((res) => {
          this.tableData = res.data
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
        })
      } else {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请输入搜索条件',
          type: 'error',
          position: 'bottom-right'
        })
      }
    },
    handleCannel() {
      this.$router.push('DeliveryPlan')
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
    // 点击添加,向执行单与物料对照关系表中插入数据
    handleAdd(val) {
      console.log(this.multipleTable[0].matNo)
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择您需要添加的物料',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('添加这些物料到该配车计划, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {}
          const list = []
          for (var i = 0; i < this.multipleTable.length; i++) {
            param.delPlanId = this.$route.params.delPlanId
            param.modifierCode = this.$store.state.userInfo.code
            param.modifierName = this.$store.state.userInfo.name
            list[i] = this.multipleTable[i].matNo
            param.list = list
          }
          console.log(param.list)
          axios.post('/api/b05lms/DeliveryPlan/addMatToPlan', param).then((res) => {
            if (res.data.status === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '添加成功!',
                position: 'bottom-right'
              })
              this.$router.push('DeliveryPlan')
            } else {
              this.msg = res.data.msg
              if (this.msg === 'EC000012') {
                this.open2(this.EC000012)
              }
            }
          })
        }).catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'info',
            message: '已取消添加',
            position: 'bottom-right'
          })
        })
      }
    },
    handleSure() {
      this.$router.push('DeliveryPlan')
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

