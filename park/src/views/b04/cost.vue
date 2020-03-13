<template>
  <div g_container>
    <div class="g_inputForm">
      <el-form ref="cost" :model="cost" label-width="100px" class="demo-ruleForm">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            品类id：
            <el-input
              v-model="cost.categoryId"
              type="categoryId"
              autocomplete="off"
              placeholder="请输入品类id"
              class="g_input"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-col>
        </el-row>

      </el-form>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">查询</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="onAddDialog">添加</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
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

      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="60px" />

      <!-- 费用标准名称 -->
      <el-table-column label="费用标准名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.costName }}</span>
        </template>
      </el-table-column>
      <!-- 品类 -->
      <el-table-column label="品类" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <!-- 免费存储期限 -->
      <el-table-column label="免费存储期限" align="center">
        <template slot-scope="{row}">
          <span>{{ row.freeTerm }}</span>
        </template>
      </el-table-column>

      <!-- 存储费用 -->
      <el-table-column label="存储费用" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cost }}</span>
        </template>
      </el-table-column>

      <!-- 更新人编码 -->
      <el-table-column label="更新人编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifierCode }}</span>
        </template>
      </el-table-column>

      <!-- 更新人名称 -->
      <el-table-column label="更新人名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifierName }}</span>
        </template>
      </el-table-column>

      <!-- 更新时间 -->
      <el-table-column label="更新时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifyTime }}</span>
        </template>
      </el-table-column>

      <!-- 创建人编码 -->
      <el-table-column label="创建人编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserCode }}</span>
        </template>
      </el-table-column>

      <!-- 创建人名称 -->
      <el-table-column label="创建人名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserName }}</span>
        </template>
      </el-table-column>

      <!-- 创建时间 -->
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>

    </el-table>
    <div style="float: right;">
      <el-pagination
        :current-page.sync="cost.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="cost.rows"
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加 -->
    <el-dialog
      class="customWidthAdd"
      title="添加费用标准"
      :visible.sync="dialogAddFormVisible"
      :close-on-click-modal="false"
      @close="offAddDialog"
    >
      <!-- 添加的表单 -->
      <el-form ref="paramList" class="person_form" :rules="rules" :label-position="labelPosition" :model="paramList" label-width="150px" style="width: 50%">
        <el-row style="margin-right:150px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="费用标准名称：" prop="costName" style="width:460px">
              <el-input v-model="paramList.costName" placeholder="请输入费用标准名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-right:150px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="品类：" prop="categoryId" style="width: 200px">
              <el-select v-model.trim="paramList.categoryId" placeholder="请选择品类" class="g_elFormSelect" style="width:311px">
                <el-option
                  v-for="item in options"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-right:150px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="免费存储期限：" prop="freeTerm" style="width:460px">
              <el-input v-model.number="paramList.freeTerm" placeholder="请输入免费存储期" maxlength="3" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-right:150px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="存储费用：" prop="cost" style="width:460px">
              <el-input v-model.number="paramList.cost" placeholder="请输入存储费用" maxlength="7" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button @click="dialogAddFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      class="customWidthEdit"
      title="修改费用标准"
      :visible.sync="dialogEditFormVisible"
      :close-on-click-modal="false"
      @close="offEditDialog"
    >
      <!-- 修改的表单 -->
      <el-form ref="paramList" class="person_form" :rules="rules" :label-position="labelPosition" :model="paramList" label-width="150px" style="width: 50%">
        <el-row style="margin-right:150px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="费用标准名称：" prop="costName" style="width:460px">
              <el-input v-model="paramList.costName" placeholder="请输入费用标准名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-right:150px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="品类：" prop="paramList.categoryId" style="width: 200px">
              <el-select v-model.trim="paramList.categoryId" placeholder="请选择品类" class="g_elFormSelect" style="width:311px">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-right:150px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="免费存储期限：" prop="freeTerm" style="width:460px">
              <el-input v-model.number="paramList.freeTerm" placeholder="请输入免费存储期" maxlength="3" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-right:150px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="存储费用：" prop="cost" style="width:460px">
              <el-input v-model.number="paramList.cost" placeholder="请输入存储费用" maxlength="7" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button @click="dialogEditFormVisible = false">取消</el-button>
          <el-button type="primary" @click="edit()">修改</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      // name: '',
      // value: '',
      // label: '',
      rules: {},
      labelPosition: 'right',
      options: [],
      options1: {},
      cost: {
        categoryId: '',

        page: 1,
        rows: 10
      },

      total: 0,
      costData: [],

      modifierCode: this.$store.state.userInfo.code,
      modifierName: this.$store.state.userInfo.name,

      // 删除选中的
      multipleTable: [],
      ids: [],

      // 表格数据
      tableData: [],
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,

      paramList: {
        id: '',
        categoryId: '',
        freeTerm: '',
        cost: '',
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        version: 1,
        isDel: 0
      },

      msg: '',
      showing: false,

      // 抓到的后台错误编码
      EC00003: '执行单表查询出错（后台错误）！',
      EC00004: '执行单表删除出错（后台错误）！',
      EC00002: '执行单修改出错（后台错误）！',
      EC00001: '执行单添加出错（后台错误）！'
    }
  },

  /* 向后台发送数据 */
  // 页面加载时加载出表格内容
  created() {
    this.handleTypeName()
    this.getcategory()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleTable = val
    },

    getcategory() {
      axios.get('/api/b02pdm/type/findalltype').then((result) => {
        this.options = result.data.resultData
      })
      // console.log(this.options)
    },

    // 从后台拿品类名称
    handleTypeName() {
      axios.get('/api/b02pdm/type/findalltype').then((result) => {
        this.options1 = {}
        result.data.resultData.forEach((item) => {
          this.options1[item.value] = item.label
        })
        this.handleSearch()
      })
    },

    // 查询
    handleSearch() {
      // console.log(this.options1)
      axios.get('/api/b04wms/cost/selectCostByPage', {
        params: this.cost
      }).then((result) => {
        if (result.data.status === 1) {
          for (const row of result.data.resultData.rows) {
            row['name'] = this.options1[row.categoryId]
          }
          // console.log(this.tableData)
          this.tableData = result.data.resultData.rows
          this.total = result.data.resultData.total
        } else {
          this.costData = result.data.resultData
          this.msg = result.data.msg
          if (this.msg === 'EC00003') {
            this.open1(this.EC00003)
          }
        }
      })
    },

    // 错误信息过滤
    open1: function(msg) {
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

    // 删除
    readyDelete() {
      if (this.multipleTable.length === 0) {
        this.$notify({
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
              modifierCode: this.$store.state.userInfo.code,
              modifierName: this.$store.state.userInfo.name
            }
            // console.log(select[i].id)
            // console.log(select[i].version)
            listmap.push(obj)
          }
          // console.log(listmap)
          axios.put('/api/b04wms/cost/deleteCost', listmap).then((result) => {
            this.handleSearch()
            if (result.data.status === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '删除成功',
                position: 'bottom-right'
              })
            } else {
              // 如果后台错误，则弹出提示
              this.msg = result.data.msg
              if (this.msg === 'EC00004') {
                this.open1(this.EC00004)
              }
            }
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
    onAddDialog() {
      this.dialogAddFormVisible = true
      this.paramList = {
        id: '',
        categoryId: '',
        freeTerm: '',
        cost: '',
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        version: 1,
        isDel: 0
      }
    },
    offAddDialog() {
      this.dialogAddFormVisible = false
    },
    handleAdd() {
      axios.post('/api/b04wms/cost/insertCost', this.paramList).then((result) => {
        this.handleSearch()
        if (result.data.status === 1) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'success',
            message: '添加成功',
            position: 'bottom-right'
          })
        } else {
          // 如果后台错误，则弹出提示
          this.msg = result.data.msg
          if (this.msg === 'EC00001') {
            this.open1(this.EC00001)
          }
        }
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
      this.offAddDialog()
    },

    // 修改
    onEditDialog() {
      this.dialogEditFormVisible = true
    },
    offEditDialog() {
      this.dialogEditFormVisible = false
    },
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
      } else {
        this.onEditDialog()
        this.paramList = this.multipleTable[0]
      }
    },
    edit() {
      this.paramList.modifierCode = this.$store.state.userInfo.code
      this.paramList.modifierName = this.$store.state.userInfo.name
      axios.put('/api/b04wms/cost/updateCost', this.paramList).then((result) => {
        this.handleSearch()
        if (result.data.status === 1) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'success',
            message: '修改成功',
            position: 'bottom-right'
          })
        } else {
          // 如果后台错误，则弹出提示
          this.msg = result.data.msg
          if (this.msg === 'EC00002') {
            this.open1(this.EC00002)
          }
        }
      }).catch(() => {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          type: 'info',
          message: '已取消修改',
          position: 'bottom-right'
        })
      })
      this.offEditDialog()
    },

    // 分页
    handleSizeChange: function(val) {
      this.cost.rows = val
      this.handleSearch()
    },
    handleCurrentChange: function(val) {
      this.cost.page = val
      this.handleSearch()
    }
  }
}
</script>

<style>
  .customWidthAdd {
    width: 100%
  }

  .customWidthEdit {
    width: 100%
  }
</style>
