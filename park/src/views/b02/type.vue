<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          钢材类型：
          <el-select v-model="steellTypeselect" placeholder="请选择钢材类型">
            <el-option
              v-for="item in steelTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          品名：
          <el-select v-model="typeSelect" placeholder="请选择品名">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <br>
      <div class="g_button">
        <el-button type="primary" plain icon="el-icon-search" @click="searchbuttonclick()">搜索</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" @click="handclearsearch()">重置</el-button>
        <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd()">添加</el-button>
        <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
        <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>
      </div>
    </div>

    <el-table
      :data="tableDate"
      border
      fit
      highlight-current-row
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column class="g_tableSelection" type="selection" />
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <el-table-column v-if="false" prop="id" label="逻辑主键" align="center" />
      <el-table-column prop="name" label="品名" align="center" />
      <el-table-column v-if="false" prop="steelTypeId" label="钢材类型id" align="center" />
      <el-table-column prop="steelTypeName" label="钢材类型" align="center" />
      <el-table-column prop="createUserName" label="创建人" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column prop="modifierName" label="更新人" align="center" />
      <el-table-column prop="modifyTime" label="更新时间" align="center" />
      <el-table-column v-if="false" prop="version" label="版本" align="center" />
    </el-table>
    <br>
    <el-pagination
      style="float:right"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="rows"
      :total="resultlength"
      layout="total,sizes,prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!--添加对话框-->
    <el-dialog v-if="dialogAddVisible" title="添加品类信息" class="g_form" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left">
        <!-- 钢材名称 -->
        <el-form-item label="品类名称" prop="name">
          <el-input v-model="temp.name" type="name" maxlength="100" @change="inputChage" />
        </el-form-item>
        <el-form-item label="钢材类型" prop="type">
          <el-select v-model="temp.steelType" placeholder="请选择" style="width: 370px; margin-left:0px;" :readonly="false" @change="inputChage">
            <el-option
              v-for="item in steelTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-refresh" @click="cancleYes">取消</el-button>
        <el-button type="primary" plain icon="el-icon-plus" :disabled="add" @click="addSure()">添加</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          :disabled="add"
          @click="addSureAgain()"
        >添加并继续</el-button>
      </div>
    </el-dialog>

    <!--添加取消确认框-->
    <!-- <el-dialog :visible.sync="dialogAddCancleVisible" modal:true :close-on-click-modal="false">
      <div>已填入数据将不被保存,确认取消添加？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogAddCancleVisible = false">取 消</el-button>
        <el-button type="primary" @click="cancleYes">确 定</el-button>
      </span>
    </el-dialog> -->

    <!--修改对话框-->
    <el-dialog v-if="dialogEditVisible" title="修改品类信息" class="g_form" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left">
        <el-form-item label="品类名称" prop="name">
          <el-input v-model="temp.name" type="name" maxlength="100" @change="inputChage" />
        </el-form-item>
        <el-form-item label="钢材类型" prop="type">
          <el-select v-model="temp.steelType" placeholder="请选择" style="width: 370px; margin-left:0px;" :readonly="false" @change="inputChage">
            <el-option
              v-for="item in steelTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-refresh" @click="cancleYes">取消</el-button>
        <el-button type="primary" plain icon="el-icon-plus" :disabled="edit" @click="edityes()">修改</el-button>
      </div>
    </el-dialog>

    <!--修改取消确认框-->
    <!-- <el-dialog :visible.sync="dialogEditCancleVisible" modal:true :close-on-click-modal="false">
      <div>已变更的数据将不被保存,确认取消修改？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogEditCancleVisible = false">取 消</el-button>
        <el-button type="primary" @click="cancleYes">确 定</el-button>
      </span>
    </el-dialog> -->
    <!--删除对话框-->
    <el-dialog class="g_form" :visible.sync="dialogDelVisible" :close-on-click-modal="false">
      <div>删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleYes">取 消</el-button>
        <el-button type="primary" @click="handleDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'TypeTable',
  data: () => {
    return {
      steellTypeselect: undefined, // 产品编号
      steelTypeOptions: [], // 编码数据
      typeSelect: undefined, // 品类
      typeOptions: [], // 品类数据
      tableDate: [], // 表格数据
      page: 1, // 分页当前页
      rows: 10, // 每页显示的条数
      resultlength: undefined, // 查询的总条数
      dialogAddVisible: false, // 添加对话框
      dialogAddCancleVisible: false, // 添加取消对话框
      temp: { // 添加表单数据
        name: undefined,
        steelType: undefined
      },
      add: true, // 添加按钮禁用
      multipleTable: [], // 选中的表格数据
      dialogEditVisible: false, // 修改对话框
      edit: true, // 修改禁用按钮
      dialogEditCancleVisible: false, // 修改确认取消框
      rules: {
        name: [
          { required: true, message: '品类名称不能为空' }
        ],
        steelType: [
          { required: true, message: '钢材类型不能为空' }
        ]
      },
      dialogDelVisible: false // 删除对话框
    }
  },
  created() {
    this.search()
  },
  methods: {
    search: function() {
      // 钢材类型下拉框填入数据
      axios.get('/api/b02pdm/type//findallsteeltype').then(res => {
        if (res.data.status === 1) {
          this.steelTypeOptions = res.data.resultData
        } else if (res.data.msg === 'EC00004') {
          this.$notify({
            title: '错误',
            message: '后台查询出错',
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
      // 品类下拉框数据填入
      axios.get('/api/b02pdm/type/findalltype').then(res => {
        if (res.data.status === 1) {
          this.typeOptions = res.data.resultData
        } else if (res.data.msg === 'EC00004') {
          this.$notify({
            title: '错误',
            message: '后台查询出错',
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
      axios
        .post('/api/b02pdm/type/findbyselect', this.getParam())
        .then(res => {
          if (res.data.status === 1) {
            this.tableDate = res.data.resultData.rows
            this.resultlength = res.data.resultData.total
          } else if (res.data.msg === 'EC00004') {
            this.$notify({
              title: '错误',
              message: '后台查询出错',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
    },
    getParam: function() {
      return {
        id: this.typeSelect,
        steelTypeId: this.steellTypeselect,
        page: this.page,
        rows: this.rows
      }
    },
    handleSizeChange: function(size) {
      this.rows = size
      this.search()
    },
    handleCurrentChange: function(page) {
      this.page = page
      this.search()
    },
    // 按条件搜索
    searchbuttonclick: function() {
      this.search()
    },
    // 重置搜索框
    handclearsearch() {
      this.typeSelect = undefined
      this.steellTypeselect = undefined
      this.search()
    },
    resetTemp() {
      this.temp.name = undefined
      this.temp.steelType = undefined
    },
    disableBuuton() {
      if (!this.temp.name || !this.temp.steelType
      ) {
        this.add = true
      } else {
        this.add = false
      }
      if (this.multipleTable[0]) {
        if (!this.temp.name || !this.temp.steelType
        ) {
          this.edit = true
        } else if (this.temp.name === this.multipleTable[0].name &&
        this.temp.steelType === this.multipleTable[0].steelTypeId) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    // 添加按钮
    handleAdd() {
      // 清空添加表单数据
      this.resetTemp()
      // 打开添加对话框
      this.dialogAddVisible = true
      if (!this.temp.name || !this.temp.steelType) {
        this.add = true
      } else {
        this.add = false
      }
      // this.$refs.dataForm.resetFields()
    },
    // 确认添加
    addSure() {
      var data = {}
      data.name = this.temp.name
      data.steelTypeId = this.temp.steelType
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      // data.modifierName = this.$store.state.userInfo.name
      // data.modifierCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/type/insertype', data)
        .then(res => {
          if (res.data.status === 1) {
            if (res.data.resultData > 0) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                position: 'bottom-right'
              })

              // 添加成功关闭对话框
              this.dialogAddVisible = false
              // 清空表单
              this.$refs['dataForm'].resetFields()
              this.resetTemp()
              // 刷新表格
              this.search()
            } else if (res.data.resultData === 0) {
              this.$notify({
                title: '错误',
                message: '后台添加出错',
                type: 'error',
                position: 'bottom-right'
              })
            }
          } else if (res.data.msg === 'EC00001') {
            this.$notify({
              title: '错误',
              message: '后台添加出错',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误',
            message: '前台添加请求出错',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    addSureAgain() {
      var data = {}
      data.name = this.temp.name
      data.steelTypeId = this.temp.steelType
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      // data.modifierName = this.$store.state.userInfo.name
      // data.modifierCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/type/insertype', data)
        .then(res => {
          if (res.data.status === 1) {
            if (res.data.resultData > 0) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                position: 'bottom-right'
              })
              // 添加成功清空对话框
              this.$refs['dataForm'].resetFields()
              this.resetTemp()
              this.disableBuuton()
              // 刷新表格
              this.search()
            } else if (res.data.resultData === 0) {
              this.$notify({
                title: '错误',
                message: '后台添加出错',
                type: 'error',
                position: 'bottom-right'
              })
            }
          } else if (res.data.msg === 'EC00001') {
            this.$notify({
              title: '错误',
              message: '后台添加出错',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误',
            message: '前台添加请求出错',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    cancleYes() {
      this.dialogAddCancleVisible = false
      this.dialogAddVisible = false
      this.dialogEditCancleVisible = false
      this.dialogEditVisible = false
      this.dialogDelVisible = false
      // this.$refs['dataForm'].resetFields()
      this.resetTemp()
      this.search()
    },
    inputChage() {
      if (!this.temp.name || !this.temp.steelType
      ) {
        this.add = true
      } else {
        this.add = false
      }

      if (this.multipleTable[0]) {
        if (!this.temp.name || !this.temp.steelType
        ) {
          this.edit = true
        } else if (this.temp.name === this.multipleTable[0].name &&
        this.temp.steelType === this.multipleTable[0].steelTypeId) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    // 获取表格中的选中值
    handleSelectionChange(val) {
      this.multipleTable = val
      // console.log(this.multipleTable)
    },
    // 修改按钮
    handleEdit() {
      if (this.multipleTable.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'warning',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.temp.name = this.multipleTable[0].name
        this.temp.steelType = this.multipleTable[0].steelTypeId
        this.disableBuuton()
        this.dialogEditVisible = true
      }
    },
    edityes() {
      var data = {}
      data.name = this.temp.name
      data.steelTypeId = this.temp.steelType
      data.id = this.multipleTable[0].id
      data.version = this.multipleTable[0].version
      data.modifierName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/type/updatetype', data)
        .then(res => {
          if (res.data.status === 1) {
            if (res.data.resultData > 0) {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                position: 'bottom-right'
              })
              this.dialogEditVisible = false
              this.$refs['dataForm'].resetFields()
              this.resetTemp()
              this.multipleTable = []
              this.search()
            } else if (res.data.resultData === 0) {
              this.$notify({
                title: '错误',
                message: '后台修改出错',
                type: 'error',
                position: 'bottom-right'
              })
            }
          } else if (res.data.msg === 'EC00003') {
            this.$notify({
              title: '错误',
              message: '后台修改出错',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误',
            message: '前台修改请求出错',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    // 删除按钮
    readyDelete() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少选择一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.dialogDelVisible = true
      }
    },
    handleDelete() {
      const data = []
      for (var i = 0; i < this.multipleTable.length; i++) {
        const map = {}
        map.id = this.multipleTable[i].id
        map.version = this.multipleTable[i].version
        map.modifierName = this.$store.state.userInfo.name
        map.modifierCode = this.$store.state.userInfo.code
        data.push(map)
      }
      axios
        .post('/api/b02pdm/type/deletetype', data
        )
        .then(res => {
          if (res.data.status === 1) {
            if (res.data.resultData > 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                position: 'bottom-right'
              })
              this.dialogDelVisible = false
              this.multipleTable = []
              this.search()
            } else if (res.data.resultData === 0) {
              this.$notify({
                title: '错误',
                message: '后台删除出错',
                type: 'error',
                position: 'bottom-right'
              })
            }
          } else if (res.data.msg === 'EC00002') {
            this.$notify({
              title: '错误',
              message: '后台删除出错',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误',
            message: '前台删除请求出错',
            type: 'error',
            position: 'bottom-right'
          })
        })
    }
  }
}
</script>
