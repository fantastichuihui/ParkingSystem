<template>
  <div g_container>
    <div class="g_inputForm">
      <el-row style="margin-left:20px">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          客户名称：
          <el-select v-model="searchCname" class="g_input" placeholder="请选择资源名称" filterable>
            <el-option v-for="item in customerData" :key="item.id" :label="item.customer_name" :value="item.customer_name" />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          省份：
          <el-select v-model="searchProvince" class="g_input" placeholder="请选择省份">
            <el-option v-for="item in proviceData" :key="item.id" :label="item.cnValue" :value="item.cnValue" />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          城市：
          <el-select v-model="searchCity" class="g_input" placeholder="请选择城市">
            <el-option v-for="item in cityData" :key="item.id" :label="item.cnValue" :value="item.cnValue" />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          锁定状态：
          <el-switch v-model="switchValue">状态</el-switch>
        </el-col>
      </el-row>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
      <el-button type="primary" plain icon="el-icon-lock" @click="handleLock">锁定</el-button>
      <el-button type="primary" plain icon="el-icon-unlock" @click="handleUnlock">解锁</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-delete"
        @click="handleDelete"
      >刪除</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-edit"
        @click="actionEdit"
      >修改</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        @click="actionAdd"
      >添加</el-button>
    </div>
    <el-table
      :data="actionData"
      style="width: 98%"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px', color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <el-table-column type="index" align="center" label="序号" width="60px" />
      <!-- ID(hidden) -->
      <el-table-column v-if="showing" label="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!--客户名称-->
      <el-table-column label="客户名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.customer_name }}</span>
        </template>
      </el-table-column>
      <!--锁定状态-->
      <el-table-column label="锁定状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.is_lock }}</span>
        </template>
      </el-table-column>
      <!--联系电话-->
      <el-table-column label="联系电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.telephone }}</span>
        </template>
      </el-table-column>
      <!-- 网址 -->
      <el-table-column label="网址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.website }}</span>
        </template>
      </el-table-column>
      <!--省编码-->
      <el-table-column v-if="showing" label="省编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <!--省名称-->
      <el-table-column label="省名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.province_name }}</span>
        </template>
      </el-table-column>
      <!--市编码-->
      <el-table-column v-if="showing" label="市编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.city_code }}</span>
        </template>
      </el-table-column>
      <!--市名称-->
      <el-table-column label="市名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.city_name }}</span>
        </template>
      </el-table-column>
      <!-- 联系地址 -->
      <el-table-column label="联系地址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.detail_address }}</span>
        </template>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <!-- 地理位置经度 -->
      <el-table-column v-if="showing" label="地理位置经度" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lng }}</span>
        </template>
      </el-table-column>
      <!-- 地理位置维度 -->
      <el-table-column v-if="showing" label="地理位置维度" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lat }}</span>
        </template>
      </el-table-column>
      <!-- 修改人编码 -->
      <el-table-column v-if="showing" label="修改人编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifierCode }}</span>
        </template>
      </el-table-column>
      <!-- 修改人姓名 -->
      <el-table-column v-if="showing" label="修改人姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifierName }}</span>
        </template>
      </el-table-column>
      <!-- 修改时间 -->
      <el-table-column v-if="showing" label="修改时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifyTime }}</span>
        </template>
      </el-table-column>
      <!-- 创建人编码 -->
      <el-table-column v-if="showing" label="创建人编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserCode }}</span>
        </template>
      </el-table-column>
      <!-- 创建人姓名 -->
      <el-table-column v-if="showing" label="创建人姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserName }}</span>
        </template>
      </el-table-column>
      <!-- 创建时间 -->v
      <el-table-column v-if="showing" label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <!-- 乐观锁 -->
      <el-table-column v-if="showing" label="乐观锁" align="center">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <!-- 是否删除(hidden) -->
      <el-table-column v-if="showing" label="是否删除">
        <template slot-scope="{row}">
          <span>{{ row.isDel }}</span>
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
  name: 'ActionTable',
  data() {
    return {
      msg: '',
      EC00005: '客户表未锁定出错（后台错误）！',
      EC00004: '客户表查询出错（后台错误）！',
      EC00003: '客户表锁定出错（后台错误）！',
      EC00002: '客户表删除出错（后台错误）！',
      showing: false,
      switchValue: false,
      searchCname: '',
      customerData: [],
      searchProvince: '',
      proviceData: [],
      searchCity: '',
      cityData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      id: undefined,
      customer_name: '',
      is_lock: 0,
      telephone: '',
      website: '',
      remark: '',
      address: '',
      province_name: '',
      city_code: '',
      city_name: '',
      detail_address: '',
      lng: '',
      lat: '',
      modifierCode: new Date(),
      modifierName: '',
      modifyTime: '',
      createUserCode: new Date(),
      createUserName: '',
      createTime: new Date(),
      version: undefined,
      isDel: undefined,
      actionData: [],
      multipleTable: []
    }
  },
  watch: {
    searchProvince: function() {
      this.searchCity = ''
      this.cityData = ''
      this.proviceData.forEach((item, index) => {
        if (item.cnValue === this.searchProvince) {
          this.cityData = item.children
        }
      })
    }
  },
  created() {
    this.search()
    this.getcustomerData()
    this.getProvince()
  },
  methods: {
    search: function() {
      axios.post('/api/b01crm/customer/selectcustomer', this.getParamMap()).then((customer) => {
        if (customer.data.status === 1) {
          this.actionData = customer.data.resultData.rows
          this.total = customer.data.resultData.total
        } else {
          this.actionData = customer.data.resultData
          this.msg = customer.data.msg
          if (this.msg === 'EC00004') {
            this.open2(this.EC00004)
          }
        }
      })
    },
    getcustomerData() {
      axios.post('/api/b01crm/customer/selectcustomer', this.getParamMap()).then((customer) => {
        this.customerData = customer.data.resultData.rows
      })
    },
    getProvince() {
      axios.get('/api/a04ds/datastandard/findProviceTree').then((province) => {
        for (let i = 0; i < province.data.resultData.children.length; i++) {
          this.proviceData[i] = province.data.resultData.children[i]
          this.cityData = ''
        }
      })
    },
    getParamMap: function() {
      return {
        page: this.currentPage,
        rows: this.pageSize,
        customer_name: this.searchCname,
        province_name: this.searchProvince,
        city_name: this.searchCity,
        is_lock: this.switchValue
      }
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
    handleDelete() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
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
          const listmap = []
          const select = this.multipleTable
          for (let i = 0; i < selectLength; i++) {
            const ids = {}
            ids.id = select[i].id
            ids.version = select[i].version
            ids.modifierCode = select[i].modifierCode
            ids.modifierName = select[i].modifierName
            ids.modifyTime = select[i].modifyTime
            listmap[i] = ids
          }
          axios.post('/api/b01crm/customer/delectcustomer', listmap).then((customer) => {
            this.search()
            if (customer.data.status === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '删除成功',
                position: 'bottom-right'
              })
            } else {
              this.msg = customer.data.msg
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
    handleLock() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        const selectLength = this.multipleTable.length
        const listmap = []
        const select = this.multipleTable
        for (let i = 0; i < selectLength; i++) {
          const ids = {}
          ids.id = select[i].id
          listmap[i] = ids
        }
        axios.post('/api/b01crm/customer/updatelocktrue', listmap).then((customer) => {
          this.search()
          if (customer.data.status === 1) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '锁定成功',
              position: 'bottom-right'
            })
          } else {
            this.msg = customer.data.msg
            if (this.msg === 'EC00003') {
              this.open2(this.EC00003)
            }
          }
        })
      }
    },
    handleUnlock() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        const selectLength = this.multipleTable.length
        const listmap = []
        const select = this.multipleTable
        for (let i = 0; i < selectLength; i++) {
          const ids = {}
          ids.id = select[i].id
          listmap[i] = ids
        }
        axios.post('/api/b01crm/customer/updatelockfalse', listmap).then((customer) => {
          this.search()
          if (customer.data.status === 1) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '解锁成功',
              position: 'bottom-right'
            })
          } else {
            this.msg = customer.data.msg
            if (this.msg === 'EC00003') {
              this.open2(this.EC00003)
            }
          }
        })
      }
    },
    // 跳转添加页面
    actionAdd() {
      this.$router.push('customerAdd')
    },
    // 跳转修改页面
    actionEdit() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择编辑数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.$router.push({ name: 'customerUpdate', params: { customer: this.multipleTable[0] }})
      }
    },
    // 搜索框
    handleSearch() {
      this.search()
    },
    // 重置搜索框
    handleRefresh() {
      this.searchCname = undefined
      this.searchProvince = undefined
      this.searchCity = undefined
      this.search()
    }
  }
}
</script>
