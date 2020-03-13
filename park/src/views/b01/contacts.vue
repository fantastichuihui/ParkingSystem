<template>
  <div g_container>
    <div class="g_inputForm">
      <el-row style="margin-left:20px">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          客户名称：
          <el-select v-model="searchCname" class="g_input" placeholder="请选择客户名称">
            <el-option v-for="item in customerData" :key="item.id" :label="item.name" :value="item.customer_name" />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系人姓名：
          <el-select v-model="searchName" class="g_input" placeholder="请选择联系人姓名">
            <el-option v-for="item in contactsData" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
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
      @selection-change="handleSelectionActionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <el-table-column type="index" align="center" label="序号" width="60px" />
      <!-- ID(hidden) -->
      <el-table-column v-if="showing" label="id">
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
      <!--联系人姓名-->
      <el-table-column label="联系人姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!--联系电话-->
      <el-table-column label="联系电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.telephone }}</span>
        </template>
      </el-table-column>
      <!-- 邮箱地址 -->
      <el-table-column label="邮箱地址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <!-- 邮编 -->
      <el-table-column label="邮编" align="center">
        <template slot-scope="{row}">
          <span>{{ row.post }}</span>
        </template>
      </el-table-column>
      <!-- 所属客户 -->
      <el-table-column v-if="showing" label="所属客户" align="center">
        <template slot-scope="{row}">
          <span>{{ row.customer_id }}</span>
        </template>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
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
      EC00004: '联系人表查询出错（后台错误）！',
      EC00002: '联系人表删除出错（后台错误）！',
      showing: false,
      searchCname: '',
      customerData: [],
      searchName: '',
      contactsData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      id: undefined,
      name: '',
      telephone: '',
      email: '',
      post: '',
      remark: '',
      customer_id: '',
      modifierCode: new Date(),
      modifierName: '',
      modifyTime: '',
      createUserCode: new Date(),
      createUserName: '',
      createTime: new Date(),
      version: undefined,
      isDel: undefined,
      actionData: [], // 表格数据
      multipleTable: []
    }
  },
  created() {
    this.search()
    this.getcustomerData()
    this.getcontactsData()
  },
  methods: {
    search: function() {
      axios.post('/api/b01crm/contact/selectContact', this.getParamMap()).then((contacts) => {
        if (contacts.data.status === 1) {
          this.actionData = contacts.data.resultData.rows
          this.total = contacts.data.resultData.total
        } else {
          this.actionData = contacts.data.resultData
          this.msg = contacts.data.msg
          if (this.msg === 'EC00004') {
            this.open2(this.EC00004)
          }
        }
      })
    },
    getParamMap1: function() {
      return {
        page: 1,
        rows: 100,
        customer_name: '',
        province_name: '',
        city_name: '',
        is_lock: false
      }
    },
    getcustomerData() {
      axios.post('/api/b01crm/customer/selectcustomer', this.getParamMap1()).then((customer) => {
        this.customerData = customer.data.resultData.rows
      })
    },
    getcontactsData() {
      axios.post('/api/b01crm/contact/selectContact', this.getParamMap()).then((customer) => {
        this.contactsData = customer.data.resultData.rows
      })
    },
    getParamMap: function() {
      return {
        page: this.currentPage,
        rows: this.pageSize,
        customer_name: this.searchCname,
        name: this.searchName
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
    handleSelectionActionChange(val) {
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
          axios.post('/api/b01crm/contact/deletecontact', listmap).then((contacts) => {
            this.search()
            if (contacts.data.status === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '删除成功',
                position: 'bottom-right'
              })
            } else {
              this.msg = contacts.data.msg
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
    // 跳转添加页面
    actionAdd() {
      if (this.multipleTable.length === 0) {
        this.$router.push({ name: 'contactsAdd1', params: { customer: this.multipleTable[0] }})
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
        this.$router.push({ name: 'contactsAdd', params: { customer: this.multipleTable[0] }})
      }
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
        this.$router.push({ name: 'contactsUpdate', params: { customer: this.multipleTable[0] }})
      }
    },
    // 搜索框
    handleSearch() {
      this.search()
    },
    // 重置搜索框
    handleRefresh() {
      this.searchCname = undefined
      this.searchName = undefined
      this.search()
    }
  }
}
</script>
