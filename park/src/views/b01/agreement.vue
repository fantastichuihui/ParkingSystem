<template>
  <div g_container>
    <div class="g_inputForm">
      <el-form>
        <el-row style="margin-left:20px">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            合同名称：
            <el-select v-model="seachName" class="g_input" placeholder="请选择服务">
              <el-option v-for="(item,index) in contractName" :key="index" :label="item.name" :value="item.contractName" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            线索名称：
            <el-select v-model="seachLeadsname" class="g_input" placeholder="请选择服务">
              <el-option v-for="(item,index) in leadsName" :key="index" :label="item.leadsName" :value="item.leads_id" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            客户名称：
            <el-select v-model="seachCustomername" class="g_input" placeholder="请选择服务">
              <el-option v-for="item in allData" :key="item.customerId" :label="item.customerName" :value="item.customerName" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            审核状态：
            <el-switch
              v-model="value1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >1</el-switch>
            是否配送：
            <el-switch
              v-model="value2"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-search" @click="handleRefresh">重置</el-button>
      <el-button v-if="showing1" type="primary" plain icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button v-if="showing2" type="primary" plain icon="el-icon-edit" @click="handleEdit">修改</el-button>
      <el-button v-if="showing3" type="primary" plain icon="el-icon-edit-outline" @click="handleAud">审核</el-button>
      <el-button v-if="showing6" type="primary" plain icon="el-icon-goods" @click="handlePay">回款</el-button>
      <el-button v-if="showing4" type="primary" plain icon="el-icon-document" @click="handleSon">子项</el-button>
      <el-button v-if="showing5" type="primary" plain icon="el-icon-delete" @click="readyDelete">刪除</el-button>
    </div>
    <el-table
      :data="tableData"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px', color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <el-table-column label="序号" align="center" type="index" width="60px" />
      <el-table-column label="客户名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.customer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="线索名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.leads_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划开始时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.plan_start_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际开始时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.plan_start_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.plan_end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同金额" align="center">
        <template slot-scope="{row}">
          <span>{{ row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配送方式" align="center">
        <template slot-scope="{row}">
          <span>{{ row.types }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="{row}">
          <span>{{ row.payment_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同附件" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isValid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划回款期数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.objId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已回款期数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalHaveReturned }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showing" label="附件" align="center">
        <template slot-scope="{row}">
          <span>{{ row.confiles }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showing" label="子项" align="center">
        <template slot-scope="{row}">
          <span>{{ row.item }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.checkStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新添加" align="center">
        <template slot-scope="{row}">
          <span>{{ row.newcolumn }}</span>
        </template>
      </el-table-column>
    </el-table>
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
  data() {
    return {
      showing: false,
      showing1: false,
      showing2: false,
      showing3: false,
      showing4: false,
      showing5: false,
      showing6: false,
      disabled: false,
      seachName: '',
      seachLeadsname: '',
      seachCustomername: '',
      contractName: [],
      leadsName: [],
      EC00004: '接口表查询出错（后台错误）！',
      EC00002: '接口表表删除出错（后台错误）！',
      multipleTable: [],
      tableData: [],
      total: 100,
      currentPage: 1,
      pageSize: 10,
      show: false,
      modifierCode: '',
      modifierName: '',
      allData: [],
      permissionData: [],
      ids: [],
      rules: {
      },
      value1: false,
      value2: true,
      checkStatus: '',
      sendType: ''
    }
  },
  /* 向后台发送数据 */
  created() {
    this.handleSearch()
    this.handleSearch1()
    this.getName()
  },
  methods: {
    /* 分页序号自增*/
    table_index(index) {
      return (this.currentPage - 1) * this.total + index + 1
    },
    getName() {
      if (this.$store.state.roleInfo.name === '超级管理员') {
        this.showing1 = true
        this.showing2 = true
        this.showing3 = true
        this.showing4 = true
        this.showing5 = true
        this.showing6 = true
      } else if (this.$store.state.roleInfo.name === '客户') {
        this.showing1 = true
        this.showing2 = true
        this.showing3 = false
        this.showing4 = true
        this.showing5 = true
        this.showing6 = true
      } else if (this.$store.state.roleInfo.name === '员工') {
        this.showing1 = false
        this.showing2 = false
        this.showing3 = true
        this.showing4 = false
        this.showing5 = false
        this.showing6 = true
      }
    },
    getparams() {
      if (this.value1 === false) {
        this.checkStatus = 0
      } else {
        this.checkStatus = 1
      }
      if (this.value2 === false) {
        this.sendType = 0
      } else {
        this.sendType = 1
      }
      return {
        name: this.seachName,
        bussinessId: this.seachLeadsname,
        customerName: this.seachCustomername,
        checkStatus: this.checkStatus,
        sendType: this.sendType,
        page: this.currentPage,
        rows: this.pageSize
      }
    },
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 查询
    handleSearch() {
      // 查询所有
      axios.post('/api/b01crm/contract/findContracts', this.getparams()).then((result) => {
        for (let i = 0; i < result.data.resultData.rows.length; i++) {
          if (result.data.resultData.rows[i].checkStatus === 0) {
            result.data.resultData.rows[i].checkStatus = '未通过'
          } else {
            result.data.resultData.rows[i].checkStatus = '通过'
          }
          if (result.data.resultData.rows[i].types === 0) {
            result.data.resultData.rows[i].types = '自提'
          } else {
            result.data.resultData.rows[i].types = '配送'
          }
          if (result.data.resultData.rows[i].isValid === false) {
            result.data.resultData.rows[i].isValid = '无'
          } else {
            result.data.resultData.rows[i].isValid = '有'
          }
        }
        this.tableData = result.data.resultData.rows
        this.total = result.data.resultData.total
      })
    },
    handleSearch1() {
      axios.get('/api/b01crm/contract/getBnameCusnameAndContractName').then((result) => {
        this.allData = result.data
        for (let i = 0; i < result.data.length; i++) {
          for (let j = 0; j < result.data[i].contractNames.length; j++) {
            this.contractName.push(result.data[i].contractNames[j])
          }
          for (let f = 0; f < result.data[i].leadsName.length; f++) {
            this.leadsName.push(result.data[i].leadsName[f])
          }
        }
      })
    },
    // 重置
    handleRefresh() {
      this.seachCustomername = ''
      this.seachLeadsname = ''
      this.seachName = ''
      this.handleSearch()
    },
    // 开始删除
    readyDelete() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else if (this.checkStatus === 1) {
        this.$notify({
          title: '警告信息',
          message: '审核状态无法修改',
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
          const listmap = {}
          listmap.idAndVersion = []
          listmap.modifierCode = this.$store.state.userInfo.code
          listmap.modifierName = this.$store.state.userInfo.name
          const select = this.multipleTable
          for (let i = 0; i < selectLength; i++) {
            const ids = {}
            ids.id = select[i].contractId
            ids.version = select[i].version
            listmap.idAndVersion.push(ids)
          }
          axios.post('/api/b01crm/contract/deleteContractByLogical', listmap).then((res) => {
            this.handleSearch()
            if (res.data.status === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '删除成功',
                position: 'bottom-right'
              })
            } else {
              this.msg = res.data.msg
              if (this.msg === 'EC00002') {
                this.open2(this.EC00002)
              }
            }
          })
        }).catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'info',
            message: '取消删除',
            position: 'bottom-right'
          })
        })
      }
    },
    // 添加
    handleAdd() {
      this.$router.push('agreementAdd')
    },
    // 修改
    handleEdit() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length > 1) {
        this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'error',
          position: 'bottom-right'
        })
      } else if (this.checkStatus === 0) {
        this.$router.push({
          name: 'agreementEdit',
          params: {
            permission: this.multipleTable[0]
          }
        })
      } else {
        this.$notify({
          title: '警告信息',
          message: '审核状态无法修改',
          type: 'error',
          position: 'bottom-right'
        })
      }
    },
    // 子项
    handleSon() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length > 1) {
        this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'error'
        })
      } else if (this.checkStatus === 0) {
        this.$router.push({
          name: 'agreementSon',
          params: {
            permission: this.multipleTable[0]
          }
        })
      } else {
        this.$notify({
          title: '警告信息',
          message: '审核状态无法修改',
          type: 'error',
          position: 'bottom-right'
        })
      }
    },
    handleAud() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length > 1) {
        this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'error',
          position: 'bottom-right'
        })
      } else if (this.checkStatus === 0) {
        this.$router.push({
          name: 'auditing',
          params: {
            permission: this.multipleTable[0]
          }
        })
      } else {
        this.$notify({
          title: '警告信息',
          message: '审核状态无法修改',
          type: 'error',
          position: 'bottom-right'
        })
      }
    },
    handlePay() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length > 1) {
        this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.$router.push({
          name: 'payment',
          params: {
            permission: this.multipleTable[0]
          }
        })
      }
    },
    handleSizeChange: function(val) {
      this.pageSize = val
      this.handleSearch()
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.handleSearch()
    }
  }
}
</script>
