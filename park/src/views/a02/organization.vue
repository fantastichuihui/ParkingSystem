<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            机构名称：
            <el-input v-model.trim="organization.name" placeholder="请输入内容" class="g_input" clearable @keyup.enter.native="handleFilter" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            机构编码：
            <el-input v-model.trim="organization.code" placeholder="请输入内容" class="g_input" clearable @keyup.enter.native="handleFilter" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            附属机构：
            <el-select v-model.trim="organization.pcode" placeholder="请选择内容" class="g_input" clearable @keyup.enter.native="handleFilter">
              <el-option v-for="item in porgList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-picture-outline" @click="handleTree">组织机构图</el-button>
      <el-button type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>

      <el-button type="primary" plain icon="el-icon-delete" @click="handleDelete()">刪除</el-button>
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
      <el-table-column class="g_tableSelection" type="selection" />
      <el-table-column label="序号" type="index" align="center" width="60px" />
      <!-- 测试ID(hidden) -->
      <el-table-column v-if="showId" label="测试ID">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 测试名称 -->
      <el-table-column label="组织机构名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column label="附属机构名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pname }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="组织机构编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="附属机构编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pcode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织机构级别" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orgLevel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织机构排序" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" class="g_form" :visible.sync="dialogFormVisible">
      <el-form ref="dataFormEdit" :model="organization" label-position="left" label-width="70px">
        <el-form-item label="组织机构编码" prop="code">
          <el-input v-model="organization.code" />
        </el-form-item>
        <el-form-item label="组织机构名称" prop="name">
          <el-input v-model="organization.name" />
        </el-form-item>
        <el-form-item label="附属机构编码" prop="pcode">
          <el-input v-model="organization.pcode" :disabled="true" />
        </el-form-item>
        <el-select v-model="organization.pname" placeholder="请选择" class="g_select">
          <el-option />
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="edityes">确认修改</el-button>
      </div>
    </el-dialog>
    <!--删除对话框-->
    <el-dialog :title="textMap[dialogStatus]" class="g_form" :visible.sync="dialogDelVisible">
      <div>删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import * as systemTips from '@/utils/systemTips.js'
export default {
  name: 'TestTable',
  data() {
    return {
      porgList: [],
      organization: {
        name: '',
        code: '',
        pcode: ''
      },
      showId: false,
      show: true,
      name: '',
      code: '',
      pname: '',
      pcode: '',
      dialogDelVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogAddFormVisible: false,
      dialogaddVisible: false,
      textMap: {
        edit: '修改',
        create: '添加'
      },
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 10,
      multipleTable: [],
      resultlength: 10,
      ids: [] // 批量删除id
    }
  },
  created() {
    axios.get('/api/a02person/organization/findAllPCode').then(response => {
      this.porgList = response.data.resultData
    });
    this.search()
  },
  methods: {
    search: function() {
      axios.get('/api/a02person/organization/findbypage', {
        params: {
          page: this.currentPage,
          rows: this.pageSize,
          pcode: this.organization.pcode,
          name: this.organization.name,
          code: this.organization.code
        }
      }).then((response) => {
        this.tableData = response.data.rows
        this.total = response.data.total
        // 用list接收这个数据;
      }).catch((error) => { // 接收错误
        systemTips.error('查询失败')
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
    handleRefresh: function() {
      this.organization = {}
    },
    /* handleSizeChange: function(size) {
      this.rows = size
      this.search()
    }, */
    readyDelete() {
      if (this.multipleTable.length === 0) {
        systemTips.warning('请选择至少一条数据')
        this.dialogDelVisible = false
      } else {
        this.dialogDelVisible = true
      }
    },
    handleFilter: function() {
      this.search()
    },
    handleDelete() {
      if (this.multipleTable.length === 0) {
        systemTips.warning('请选择至少一条数据')
      } else {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          position: 'bottom-right'
        }).then(() => {
          const selectLength = this.multipleTable.length
          const listmap = []
          const select = this.multipleTable
          for (let i = 0; i < selectLength; i++) {
            const ids = {}
            ids.id = select[i].id
            listmap[i] = ids
          }
          axios.post('/api/a02person/organization/logdelorg', listmap).then((res) => {
            this.search()
          })
          systemTips.success('删除成功!')
        }).catch(() => {
          systemTips.info('已取消删除')
        })
      }
    },
    handleEdit: function() {
      if (this.multipleTable.length === 0) {
        systemTips.warning('请选择至少一条数据')
      } else if (this.multipleTable.length > 1) {
        systemTips.warning('最多只能选择一条数据进行操作')
      } else {
        this.$router.push({
          name: 'organizationEdit',
          params: {
            organization: this.multipleTable[0]
          }
        })
      }
    },
    edityes() {
      /* const tempDataa = Object.assign({}, this.organization) */
      // eslint-disable-next-line no-extend-native

      const index = this.row.indexOf(this.organization) + 1
      this.row.splice(index, 1, this.organization)
      this.dialogFormVisible = false
    },
    sure2(tableData, organization) {
      /*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/
      Date.prototype.toLocaleString = function() {
        return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate() + ' ' + this.getHours() +
            ':' + this.getMinutes() + ':' + this.getSeconds()
      }
      /* const tempData = Object.assign({}, organization) */
      this.tableData.unshift(this.organization)
      this.dialogaddVisible = false
      this.dialogAddFormVisible = false
    },
    handleAdd: function() {
      if (this.multipleTable.length === 0) {
        // this.$notify({
        //   title: '警告信息',
        //   message: '请选择一条数据作为父组织',
        //   type: 'error',
        //   position: 'bottom-right'
        // })
        systemTips.warning('请选择一条数据作为父组织')
      } else if (this.multipleTable.length > 1) {
        systemTips.warning('最多只能选择一条数据作为父组织')
      } else {
        this.$router.push({
          name: 'organizationAdd',
          params: {
            organization: this.multipleTable[0]
          }
        })
      }
    },
    handleTree: function() {
      this.$router.push('organizationTree')
    }
  }
}
</script>

<style>
  .block {
    float: right;
  }
</style>
