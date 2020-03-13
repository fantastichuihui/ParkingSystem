<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          动作名称：
          <el-input
            v-model.trim="searchActName"
            placeholder="请输入内容"
            class="g_input"
            clearable
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          动作类型：
          <el-input
            v-model.trim="searchActType"
            placeholder="请输入内容"
            class="g_input"
            clearable
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          动作内容：
          <el-input v-model.trim="searchActContent" placeholder="请输入内容" class="g_input" clearable />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          动作图标：
          <el-input v-model.trim="searchActIcon" placeholder="请输入内容" class="g_input" clearable />
        </el-col>
      </el-row>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="handleDeleteAct">刪除</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="actionEditRouter">修改</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="actionAddRouter">添加</el-button>
    </div>
    <el-table
      :data="actionData"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionActionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" align="center" />
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="60px" />
      <!-- ID(hidden) -->
      <el-table-column v-if="showing" prop="id" label="id" />
      <!--动作名称-->
      <el-table-column prop="name" label="动作名称" align="center" />
      <!--动作类型-->
      <el-table-column prop="type" label="动作类型" align="center" />
      <!--动作内容-->
      <el-table-column prop="content" label="动作内容" align="center" />
      <!-- 动作图标 -->
      <el-table-column prop="icon" label="动作图标" align="center" />
      <!-- 动作样式 -->
      <el-table-column prop="aClass" label="动作样式" align="center" />
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

<script>
import axios from 'axios'
// 系统登陆人信息
import { getUserInfo } from '@/utils/userInfo'
export default {
  name: 'ActionTable',
  data() {
    return {
      msg: '',
      EC00004: '动作表查询出错（后台错误）！',
      EC00002: '动作表删除出错（后台错误）！',
      showing: false,
      searchActName: undefined,
      searchActType: undefined,
      searchActContent: undefined,
      searchActIcon: undefined,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      id: undefined,
      name: '',
      type: '',
      content: '',
      icon: '',
      aClass: '',
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
  },
  methods: {
    search: function() {
      axios.get('/api/a01auth/action/findByCondition', { params: this.getActParam() }).then((res) => {
        if (res.data.status === 1) {
          this.actionData = res.data.resultData.rows /* /api/a01auth/action/findByCondition */
          this.total = res.data.resultData.total
        } else {
          this.actionData = res.data.resultData
          this.msg = res.data.msg
          if (this.msg === 'EC00004') {
            this.open2(this.EC00004)
          }
        }
      })
    },
    getActParam: function() {
      return {
        page: this.currentPage,
        rows: this.pageSize,
        name: this.searchActName,
        type: this.searchActType,
        content: this.searchActContent,
        icon: this.searchActIcon
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
    handleDeleteAct() {
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
            ids.modifierCode = getUserInfo().usercode
            ids.modifierName = getUserInfo().username
            listmap[i] = ids
          }
          console.log(listmap)
          axios.put('/api/a01auth/action/logicDeleteAction', listmap).then((res) => {
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
            this.search()
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
    actionAddRouter() {
      this.$router.push('actionAdd')
    },
    // 跳转修改页面
    actionEditRouter() {
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
        this.$router.push({
          name: 'actionEdit',
          params: {
            action: this.multipleTable[0]
          }
        })
      }
    },
    // 搜索框
    handleSearch() {
      this.search()
    },
    // 重置搜索框
    handleRefresh() {
      this.searchActName = undefined
      this.searchActType = undefined
      this.searchActContent = undefined
      this.searchActIcon = undefined
      this.search()
    }
  }
}
</script>
