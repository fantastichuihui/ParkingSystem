<template>
  <div g_container>
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          接口方法：
          <el-input
            v-model.trim="searchApiMethod"
            placeholder="请输入接口方法"
            class="g_input"
            clearable
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          接口名称：
          <el-input
            v-model.trim="searchApiName"
            placeholder="请输入接口名称"
            class="g_input"
            clearable
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          接口路径：
          <el-input
            v-model.trim="searchApiPath"
            placeholder="请输入接口路径"
            class="g_input"
            clearable
          /><br>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          资源名称：
          <el-input
            v-model.trim="searchResName"
            placeholder="请输入资源名称"
            class="g_input"
            clearable
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          资源编码：
          <el-input
            v-model.trim="searchResCode"
            placeholder="请输入资源编码"
            class="g_input"
            clearable
          />
        </el-col>
      </el-row>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch()">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh()">重置</el-button>

      <el-button
        type="primary"
        plain
        icon="el-icon-delete"
        @click="handleDelete()"
      >刪除</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-edit"
        @click="apiEditRouter()"
      >修改</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        @click="apiAddRouter"
      >添加</el-button>
    </div>
    <el-table
      :data="apiData"
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
      <el-table-column v-if="showing" prop="apiId" label="接口id" />
      <!--资源ID-->
      <el-table-column v-if="showing" prop="resId" label="资源ID" align="center" />
      <!--接口方法-->
      <el-table-column prop="aMethod" label="接口方法" align="center" />
      <!--接口名称-->
      <el-table-column prop="aName" label="接口名称" align="center" />
      <!--接口路径-->
      <el-table-column prop="aPath" label="接口路径" align="center" />
      <!-- 更改人编码 -->
      <el-table-column v-if="showing" prop="aModCode" label="更改人编码" align="center" />
      <!-- 更改人名称 -->
      <el-table-column v-if="showing" prop="aMoName" label="更改人名称" align="center" />
      <!-- 更改时间 -->
      <el-table-column v-if="showing" prop="aMoTime" label="更改时间" align="center" />
      <!-- 创建人编码 -->
      <el-table-column v-if="showing" prop="aCreaCode" label="创建人编码" align="center" />
      <!-- 创建人名称 -->
      <el-table-column v-if="showing" prop="aCreaName" label="创建人名称" align="center" />
      <!-- 创建时间 -->
      <el-table-column v-if="showing" prop="aCreaTime" label="创建时间" align="center" />
      <!-- 乐观锁 -->
      <el-table-column v-if="showing" prop="aVersion" label="乐观锁" align="center" />
      <!-- 是否删除(hidden) -->
      <el-table-column v-if="showing" prop="aIsDel" label="是否删除" />
      <!-- 资源名称 -->
      <el-table-column prop="rName" label="资源名称" align="center" />
      <!-- 资源编码 -->
      <el-table-column prop="rCode" label="资源编码" align="center" />
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
import { getUserInfo } from '@/utils/userInfo'
export default {
  name: 'ApiTable',
  data() {
    return {
      msg: '',
      EC00004: '接口表查询出错（后台错误）！',
      EC00002: '接口表表删除出错（后台错误）！',
      showing: false,
      searchApiMethod: undefined,
      searchApiName: undefined,
      searchApiPath: undefined,
      searchResName: undefined,
      searchResCode: undefined,
      currentPage: 1,
      pageSize: 10,
      total: 100,
      temp: {
        apiId: undefined,
        resId: undefined,
        aMethod: '',
        aName: '',
        aPath: '',
        aModCode: '',
        aMoName: '',
        aMoTime: new Date(),
        aCreaCode: '',
        aCreaName: '',
        aCreaTime: new Date(),
        aVersion: undefined,
        aIsDel: undefined,
        rName: '',
        rCode: ''
      },
      apiData: [], // 表格数据
      multipleTable: []
    }
  },
  created() {
    this.search()
  },
  methods: {
    search: function() {
      axios.get('api/a01auth/api/selectApiByCon', { params: this.getParam() }).then((res) => {
        if (res.data.status === 1) {
          this.apiData = res.data.resultData.rows /* /api/a01auth/api/selectApiByCon */
          this.total = res.data.resultData.total
        } else {
          this.apiData = res.data.resultData
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
        aMethod: this.searchApiMethod,
        aName: this.searchApiName,
        aPath: this.searchApiPath,
        rName: this.searchResName,
        rCode: this.searchResCode
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
          const map = {}
          const listmap = []
          const select = this.multipleTable
          for (let i = 0; i < selectLength; i++) {
            const ids = {}
            ids.id = select[i].apiId
            listmap[i] = ids
          }
          map.list = listmap
          map.modifierCode = getUserInfo().usercode
          map.modifierName = getUserInfo().username

          axios.post('api/a01auth/api/logicDeleteApi', map).then((res) => {
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
    apiAddRouter() {
      this.$router.push('apiAdd')
    },
    apiEditRouter() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择修改数据',
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
        this.$router.push({ name: 'apiEdit', params: { api: this.multipleTable[0] }})
      }
    },
    // 搜索框
    handleSearch() {
      this.search()
    },
    // 重置搜索框
    handleRefresh() {
      this.searchApiMethod = undefined
      this.searchApiName = undefined
      this.searchApiPath = undefined
      this.searchResName = undefined
      this.searchResCode = undefined
      this.search()
    }
  }
}
</script>
