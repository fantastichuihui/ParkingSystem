<template>
  <div class="g_container">
    <!--主页面-->
    <div class="g_inputForm">
      <el-form v-model="Nodes">
        <el-row style="margin-left:20px;">
          <el-col :span="8">
            <el-form-item label="节点名称：" prop="name">
              <el-select
                v-model="name"
                class="g_elFormSelect"
                placeholder="请选择节点"
                filterable
                clearable
              >
                <el-option
                  v-for="item in options"
                  :key="item.index"
                  :label="item.label"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--添加页面-->
    <el-dialog title="添加节点对话框" :visible.sync="dialogAddVisible" width="30%" top="10%" center :close-on-click-modal="false">
      <el-form ref="addForm" :model="Nodes" label-width="120px" :rules="rules">
        <el-form-item label="节点名称：" prop="name">
          <el-input
            v-model="Nodes.name"
            placeholder="请输入内容"
            clearable
            style="width: 80%;"
            @input="inputChange()"
          />
        </el-form-item>
        <el-form-item label="执行序号：" prop="orders">
          <el-input
            v-model="Nodes.orders"
            placeholder="请输入内容"
            style="width: 80%;"
            maxlength="11"
            clearable
            @input="inputChange()"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-back" @click="addHandleNo()">取消</el-button>
        <el-button type="primary" plain icon="el-icon-plus" :disabled="add" @click="addHandleYes()">确定</el-button>
      </div>
    </el-dialog>

    <!--修改页面-->
    <el-dialog :visible.sync="dialogUpdateVisible" width="30%" top="10%" :close-on-click-modal="false">
      <el-form ref="editForm" :model="Nodes" :rules="rules">
        <el-form-item label="节点名称：" prop="name">
          <el-input
            v-model="Nodes.name"
            placeholder="请输入内容"
            style="width: 80%;"
            clearable
            @input="inputChange()"
          />
        </el-form-item>
        <br>
        <el-form-item label="执行序号：" prop="orders">
          <el-input
            v-model="Nodes.orders"
            placeholder="请输入内容"
            style="width: 80%;"
            maxlength="11"
            clearable
            @input="inputChange()"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-back" @click="editHandleNo()">取消</el-button>
        <el-button type="primary" plain icon="el-icon-plus" :disabled="edit" @click="editHandleYes()">修改</el-button>
      </div>
    </el-dialog>

    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete">刪除</el-button>
    </div>

    <el-table
      ref="nodeTable"
      :data="tableData"
      :row-key="getRowKeys"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" :reserve-selection="true" />
      <!-- 测试ID(hidden) -->
      <el-table-column v-if="show" label="ID">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column type="index" :index="table_index" label="序号" width="60px" align="center" />
      <el-table-column label="节点名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实施顺序" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orders }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件区 -->
    <div class="g_pagination">
      <el-pagination
        style="float:right"
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
  name: 'TestTable',
  data() {
    // 正则验证name
    var inputName = (rule, value, callback) => {
      if (value) {
        value = value.replace(/\s+/g, '') // 去空格
      }
      if (!value) {
        callback(new Error('节点名称不能为空！'))
        this.nameMsg = 0
      } else {
        callback()
        this.nameMsg = 1
      }
      this.inputChange()
    }
    // 正则验证orders
    var inputOrders = (rule, value, callback) => {
      if (value) {
        value = value.toString().replace(/\s+/g, '') // 去空格
      }
      if (!value) {
        callback(new Error('执行序号不能为空！'))
        this.ordersMsg = 0
      } else {
        var orders = /^[1-9][0-9]*$/
        var isRight = orders.test(value)
        var status = isRight ? 1 : 0
        if (status === 1) {
          callback()
          this.ordersMsg = 1
        } else {
          callback(new Error('执行序号输入错误！请输入正自然数'))
          this.ordersMsg = 0
        }
      }
      this.inputChange()
    }
    return {
      Nodes: {
        name: '',
        orders: ''
      },
      rules: {
        name: [{ required: true, validator: inputName, trigger: 'change' }],
        orders: [{ required: true, validator: inputOrders, trigger: 'change' }]
      },
      options: [],
      name: '',
      id: '',
      version: '',
      show: false,
      currentPage: 1, // 分页当前页
      total: 100, // 查询的总条数
      pageSize: 10, // 每页显示的条数
      tableData: [], // 表格数据
      multipleTable: [], // 选中的表格数据
      nameMsg: 1, // 按钮禁用条件
      ordersMsg: 1, // 按钮禁用条件
      dialogAddVisible: false, // 添加对话框
      add: false, // 添加按钮禁用
      dialogUpdateVisible: false, // 修改对话框
      edit: false // 修改按钮禁用
    }
  },
  // computed: { userInfo() { return this.$store.state.userInfo } },
  created() {
    this.search()
    this.findNode()
  },
  methods: {
    search: function() {
      axios
        .get('/api/b05lms/StanderNode/selectby', { params: this.getParamMap() })
        .then(response => {
          if (response.data.status === 1) {
            this.tableData = response.data.resultData.rows // 用list接收这个数据
            this.total = response.data.resultData.total
          } else if (response.data.msg === 'EC00004') {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: '后台查询出错',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
    },
    findNode: function() {
      axios.get('/api/b05lms/StanderNode/selectNode').then(response => {
        if (response.data.status === 1) {
          this.options = response.data.resultData.allNodes // 用list接收这个数据
        } else if (response.data.msg === 'EC00004') {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误信息',
            message: '后台查询出错',
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
    },
    inputChange() {
      if (this.dialogAddVisible === true && this.dialogUpdateVisible === false) {
        if ((
          this.Nodes.name !== '' &&
          this.Nodes.orders !== ''
        ) && (this.nameMsg === 1 && this.ordersMsg === 1)) {
          this.add = false
        } else {
          this.add = true
        }
      } else if (this.dialogUpdateVisible === true && this.dialogAddVisible === false) {
        // console.log(this.Nodes.orders)
        // console.log(this.multipleTable[0].orders)
        if ((
          this.Nodes.name !== this.multipleTable[0].name ||
          String(this.Nodes.orders) !== String(this.multipleTable[0].orders)
        ) && (this.nameMsg === 1 && this.ordersMsg === 1)) {
          this.edit = false
        } else {
          this.edit = true
        }
      }
    },
    resetNodes() {
      this.Nodes.name = ''
      this.Nodes.orders = ''
    },
    getParamMap: function() {
      return {
        name: this.name,
        page: this.currentPage,
        rows: this.pageSize
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.search()
    },
    table_index(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    getRowKeys: function(row) {
      return row.id
    },
    // 添加框事件
    handleAdd: function() {
      // 清空添加表单数据
      this.resetNodes()
      this.add = true
      // 打开添加对话框
      this.dialogAddVisible = true
    },
    addHandleNo: function() {
      this.dialogAddVisible = false
      this.$refs['addForm'].resetFields()
    },
    addHandleYes: function() {
      var data = {}
      data.name = this.Nodes.name
      data.orders = this.Nodes.orders
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      data.modifierName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code
      axios.post('/api/b05lms/StanderNode/add', data).then(res => {
        if (res.data.status === 1) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '提示信息',
            message: '操作成功',
            type: 'success',
            position: 'bottom-right'
          })
          this.dialogAddVisible = false
          this.$refs['addForm'].resetFields()
          this.resetNodes()
          this.search()
        } else {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误信息',
            message: '后台添加出错',
            type: 'error',
            position: 'bottom-right'
          })
        }
      }).catch(() => {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '提示信息',
          message: '添加操作已取消',
          type: 'info',
          position: 'bottom-right'
        })
      })
    },
    handleEdit: function() {
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
        this.Nodes.name = this.multipleTable[0].name
        this.Nodes.orders = this.multipleTable[0].orders
        this.dialogUpdateVisible = true
        this.inputChange()
      }
    },
    editHandleNo: function() {
      this.dialogUpdateVisible = false
      this.$refs['editForm'].resetFields()
    },
    editHandleYes: function() {
      // 向后台传输的数据
      var data = {}
      data.id = this.multipleTable[0].id
      data.version = this.multipleTable[0].version
      data.name = this.Nodes.name
      data.orders = this.Nodes.orders
      data.modifierName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code
      axios
        .put('/api/b05lms/StanderNode/update', data)
        .then(res => {
          if (res.data.resultData === 1) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '提示信息',
              message: '操作成功',
              type: 'success',
              position: 'bottom-right'
            })
            this.dialogUpdateVisible = false
            this.$refs['editForm'].resetFields()
            this.$refs.nodeTable.clearSelection()
            this.resetNodes()
            this.multipleTable = []
            this.search()
          } else if (res.data.msg === 'EC00003') {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: '后台修改出错',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
        .catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '提示信息',
            message: '修改操作已取消',
            type: 'info',
            position: 'bottom-right'
          })
        })
    },
    // 删除
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
        })
          .then(() => {
            const listmap = []
            const resultMap = {}
            for (let i = 0; i < this.multipleTable.length; i++) {
              const ids = {}
              ids.id = this.multipleTable[i].id
              ids.version = this.multipleTable[i].version
              listmap[i] = ids
            }
            resultMap.list = listmap
            resultMap.modifierCode = this.$store.state.userInfo.code
            resultMap.modifierName = this.$store.state.userInfo.name
            axios
              .put('/api/b05lms/StanderNode/delete', resultMap)
              .then(res => {
                if (res.data.resultData > 0) {
                  if (this.notifyInstance) {
                    this.notifyInstance.close()
                  }
                  this.notifyInstance = this.$notify({
                    title: '提示信息',
                    type: 'success',
                    message: '删除成功!',
                    position: 'bottom-right'
                  })
                  this.multipleTable = []
                  this.$refs.nodeTable.clearSelection()
                  this.search()
                } else if (res.data.msg === 'EC00002') {
                  if (this.notifyInstance) {
                    this.notifyInstance.close()
                  }
                  this.notifyInstance = this.$notify({
                    title: '错误信息',
                    type: 'error',
                    message: '后台删除出错!',
                    position: 'bottom-right'
                  })
                }
              })
          })
          .catch(() => {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '提示信息',
              type: 'info',
              message: '删除操作已取消',
              position: 'bottom-right'
            })
          })
      }
    },
    // 查询
    handleFilter: function() {
      this.multipleTable = []
      this.search()
    },
    handleSelectionChange(val) {
      this.multipleTable = val
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
