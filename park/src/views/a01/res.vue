<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form v-model="res">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            资源名称：
            <el-input v-model="res.name" placeholder="请输入资源名称" class="g_input" clearable @keyup.enter.native="handleSearch" />
          </el-col>

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            资源code：
            <el-input v-model="res.code" placeholder="请输入资源code" class="g_input" clearable @keyup.enter.native="handleSearch" />
          </el-col>

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            服务id：
            <el-select v-model="res.serviceId" clearable class="g_input" placeholder="请选择服务">
              <el-option v-for="item in serviceData" :key="item.id" :label="item.id" :value="item.id" />
            </el-select>
          </el-col>

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            对象类型：
            <el-input v-model="res.resType" placeholder="请输入对象类型" class="g_input" clearable @keyup.enter.native="handleSearch" />
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>

      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加</el-button>
    </div>
    <el-table
      :data="tableData"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" align="center" />
      <!-- 序号 -->
      <el-table-column label="序号" align="center" type="index" width="60px" />
      <!-- 资源id(hidden) -->
      <el-table-column label="资源id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 资源名称 -->
      <el-table-column label="资源名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!-- 资源code -->
      <el-table-column label="资源code" align="center">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <!-- 服务id -->
      <el-table-column label="服务id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.serviceId }}</span>
        </template>
      </el-table-column>
      <!--对象类型-->
      <el-table-column label="对象类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.resType }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;">
      <el-pagination
        :current-page.sync="res.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="res.rows"
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
      res: {
        id: '',
        name: '',
        code: '',
        serviceId: '',
        resType: '',
        page: 1,
        rows: 10
      },
      modifierCode: 'S001',
      modifierName: 'SuperAdmin',
      total: 0,
      serviceData: [],
      multipleTable: [],
      ids: [],
      tableData: [],
      rules: {
        time: [{
          type: 'string',
          required: true,
          message: 'time is required',
          trigger: 'change'
        }]
      }
    }
  },
  /* 向后台发送数据 */
  created() {
    this.handleSearch()
    this.selectService()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    selectService() {
      axios.get('/api/a01auth/service/findAllService').then((result) => {
        this.serviceData = result.data
      })
    },

    // 查询
    handleSearch() {
      axios.get('/api/a01auth/res/findResByCondition', {
        params: this.res
      }).then((result) => {
        this.tableData = result.data.resultData.rows
        this.total = result.data.resultData.total
      })
    },
    // 重置
    handleRefresh() {
      this.res = {
        name: '',
        code: '',
        serviceId: '',
        resType: '',
        page: 1,
        rows: 10
      }
      this.handleSearch()
    },
    // 开始删除
    readyDelete() {
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
            const obj = {
              id: select[i].id,
              version: select[i].version,
              modifierCode: this.modifierCode,
              modifierName: this.modifierName
            }
            listmap.push(obj)
          }
          axios.put('/api/a01auth/res/deleteRes', listmap).then((res) => {
            this.handleSearch()
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '删除成功!',
              position: 'bottom-right'
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
        })
      }
    },
    // 添加
    handleAdd() {
      this.$router.push('resAdd')
    },
    // 修改
    handleEdit() {
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
          name: 'resEdit',
          params: {
            res: this.multipleTable[0]
          }
        })
      }
    },
    handleSizeChange: function(val) {
      this.res.rows = val
      this.handleSearch()
    },
    handleCurrentChange: function(val) {
      this.res.page = val
      this.handleSearch()
    }
  }
}
</script>
