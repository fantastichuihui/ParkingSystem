<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          服务名称:
          <el-input
            v-model.trim="searchServiceName"
            placeholder="请输入内容"
            class="g_input"
            clearable
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          服务编码:
          <el-input
            v-model.trim="searchServiceCode"
            placeholder="请输入内容"
            class="g_input"
            clearable
          />
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
        @click="serviceEditRouter"
      >修改</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        @click="serviceAddRouter"
      >添加</el-button>
    </div>
    <el-table
      :data="serviceData"
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
      <el-table-column v-if="showing" prop="id" label="id" />
      <!--服务名称-->
      <el-table-column prop="serviceName" label="服务名称" align="center" />
      <!--服务编码-->
      <el-table-column prop="serviceCode" label="服务编码" align="center" />
      <!-- 修改人编码 -->
      <el-table-column v-if="showing" prop="modifierCode" label="修改人编码" align="center" />
      <!-- 修改人姓名 -->
      <el-table-column v-if="showing" prop="modifierName" label="修改人姓名" align="center" />
      <!-- 修改时间 -->
      <el-table-column v-if="showing" prop="modifyTime" label="修改时间" align="center" />
      <!-- 创建人编码 -->
      <el-table-column v-if="showing" prop="createUserCode" label="创建人编码" align="center" />
      <!-- 创建人姓名 -->
      <el-table-column v-if="showing" prop="createUserName" label="创建人姓名" align="center" />
      <!-- 创建时间 -->v
      <el-table-column v-if="showing" prop="createTime" label="创建时间" align="center" />
      <!-- 乐观锁 -->
      <el-table-column v-if="showing" prop="version" label="乐观锁" align="center" />
      <!-- 是否删除(hidden) -->
      <el-table-column v-if="showing" prop="isDel" label="是否删除" />
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
<style>
.el-form-item__label {
    font-size: 16px;
    color: #606266;
    font-weight: normal;
}
</style>
<script>
import axios from 'axios'
export default {
  name: 'ServiceTable',
  data() {
    return {
      msg: '',
      EC00004: '服务表查询出错（后台错误）！',
      EC00002: '服务表删除出错（后台错误）！',
      showing: false,
      searchServiceCode: undefined,
      searchServiceName: undefined,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      id: undefined,
      serviceName: '',
      serviceCode: '',
      modifierCode: new Date(),
      modifierName: '',
      modifyTime: '',
      createUserCode: new Date(),
      createUserName: '',
      createTime: new Date(),
      version: undefined,
      isDel: undefined,
      serviceData: [], // 表格数据
      multipleTable: []
    }
  },
  computed: {
    useInfo() {
      return this.$store.state.userInfo
    }
  },
  created() {
    this.search()
  },
  methods: {
    search: function() {
      axios.get('/api/a01auth/service/findByCondition', { params: this.getParam() }).then((res) => {
        if (res.data.status === 1) {
          this.serviceData = res.data.resultData.rows /* /api/a01auth/service/findByCondition */
          this.total = res.data.resultData.total
        } else {
          this.serviceData = res.data.resultData
          this.msg = res.data.msg
          if (this.msg === 'EC00004') {
            this.open2(this.EC00004)
          }
        }
      })
    },
    getParam: function() {
      return {
        page: this.currentPage,
        rows: this.pageSize,
        serviceName: this.searchServiceName,
        serviceCode: this.searchServiceCode
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
            listmap[i] = ids
          }
          axios.post('/api/a01auth/service/logicDeleteService', { modifierCode: this.useInfo.code,
            modifierName: this.useInfo.name, list: listmap }).then((res) => {
            this.search()
            if (res.data.status === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '删除成功!',
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
            message: '已取消删除',
            position: 'bottom-right'
          })
        })
      }
    },
    serviceAddRouter() {
      this.$router.push('serviceAdd')
    },
    serviceEditRouter() {
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
        this.$router.push({ name: 'serviceEdit', params: { service: this.multipleTable[0] }})
      }
    },
    // 搜索框
    handleSearch() {
      this.search()
    },
    // 重置搜索框
    handleRefresh() {
      this.searchServiceName = undefined
      this.searchServiceCode = undefined
      this.search()
    }
  }
}
</script>
