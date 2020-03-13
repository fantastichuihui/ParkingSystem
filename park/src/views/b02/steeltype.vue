<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          钢材类型名称：
          <el-select v-model="g_name" placeholder="所有">
            <el-option v-for="item in ops" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <br>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="searchbuttonclick()">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handclearsearch()">重置</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd()">添加</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>

    </div>
    <!-- 表格控件区 -->
    <el-table
      :data="tableData"
      border
      fit
      highlight-current-row
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40px" />
      <el-table-column v-if="false" prop="id" label="逻辑主键" align="center" />
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <el-table-column prop="name" label="类型名称" min-width="160px" align="center" />
      <el-table-column prop="createUserName" label="创建人" width="160px" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="160px" align="center" />
      <el-table-column prop="modifierName" label="更新人" width="160px" align="center" />
      <el-table-column prop="modifyTime" label="更新时间" width="160px" align="center" />
      <el-table-column prop="remark" label="备注信息" :show-overflow-tooltip="true" min-width="450px" align="center" />
      <el-table-column v-if="false" prop="version" label="版本" align="center" />
    </el-table>
    <br>
    <!-- 分页控件区 -->
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
    <el-dialog
      v-if="dialogAddVisible"
      class="g_form"
      :visible.sync="dialogAddVisible"
      :close-on-click-modal="false"
      title="添加钢材类型"
      @close="cancel()"
    >
      <el-form ref="dataForm" :model="temp" label-position="left">
        <!-- 钢材名称 -->
        <el-form-item
          label="钢材类型名称"
          prop="new_name"
          :rules="[{ required: true, message: '钢材类型名不能为空'},]"
        >
          <el-input v-model="temp.new_name" type="new_name" maxlength="100" @change="inputChage" />
        </el-form-item>
        <!-- 备注 -->
        <el-form-item label="备注" prop="new_remark">
          <el-input
            v-model="temp.new_remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-refresh" @click="cancel()">取消</el-button>
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
    <!--更改对话框-->
    <el-dialog
      v-if="dialogUpdateVisible"
      class="g_form"
      :visible.sync="dialogUpdateVisible"
      :close-on-click-modal="false"
      title="修改钢材类型"
      @close="cancel()"
    >
      <el-form ref="dataupdateForm" :model="temp" label-position="left">
        <!-- 钢材名称 -->
        <el-form-item
          label="钢材类型名称"
          prop="update_name"
          :rules="[{ required: true, message: '钢材类型名不能为空'},]"
        >
          <el-input
            v-model="temp.update_name"
            type="update_name"
            maxlength="100"
            @change="inputChage"
          />
        </el-form-item>
        <!-- 备注 -->
        <el-form-item label="备注">
          <el-input
            v-model="temp.update_remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入备注"
            maxlength="200"
            @change="inputChage"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh"
          @click="cancel()"
        >取消</el-button>
        <el-button type="primary" plain icon="el-icon-edit" :disabled="edit" @click="edityes()">修改</el-button>
      </div>
    </el-dialog>
    <!--删除对话框-->
    <el-dialog class="g_form" :visible.sync="dialogDelVisible" :close-on-click-modal="false">
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

export default {
  name: 'SteelGradeTable',
  data: () => {
    return {
      tableData: [],
      addTemp: undefined,
      ops: [],
      number: undefined,
      id: undefined,
      name: undefined,
      remark: undefined,
      createUserName: undefined,
      createTime: undefined,
      modifierName: undefined,
      modifyTime: undefined,
      version: undefined,
      page: 1,
      rows: 10,
      resultlength: 10,
      g_name: undefined,
      update_name: undefined,
      new_name: undefined,
      temp: {
        id: undefined,
        new_name: undefined,
        new_remark: undefined,
        update_name: undefined,
        update_remark: undefined,
        version: undefined,
        name: undefined
      },
      add: true,
      edit: true,
      dialogAddVisible: false,
      dialogDelVisible: false,
      dialogUpdateVisible: false,
      multipleTable: [] // 更新数据数据
    }
  },
  created() {
    this.search()
  },
  methods: {
    inputChage() {
      if (
        !this.temp.new_name) {
        this.add = true
      } else {
        this.add = false
      }
      if (this.multipleTable[0]) {
        if (!this.temp.update_name) {
          this.edit = true
        } else if (this.temp.update_name === this.multipleTable[0].name &&
        this.temp.update_remark === this.multipleTable[0].remark) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    disableButton() {
      if (
        !this.temp.new_name) {
        this.add = true
      } else {
        this.add = false
      }
      if (this.multipleTable[0]) {
        if (!this.temp.update_name) {
          this.edit = true
        } else if (this.temp.update_name === this.multipleTable[0].name &&
        this.temp.update_remark === this.multipleTable[0].remark) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    search: function() {
      axios.get('/api/b02pdm/steeltype/findnames').then(res => {
        this.ops = res.data.resultData
      })
      axios.post('/api/b02pdm/steeltype/find', this.getParam()).then(res => {
        this.tableData = res.data.resultData.total
        this.resultlength = res.data.resultData.rows
      })
    },
    // 获取表格选中值
    handleSelectionChange(val) {
      this.multipleTable = val
      // console.log(this.multipleTable)
    },
    // 删除框提醒
    readyDelete() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          position: 'bottom-right',
          type: 'warning'
        })
        this.dialogDelVisible = false
      } else {
        this.dialogDelVisible = true
      }
    },
    // 删除事件
    handleDelete() {
      this.dialogDelVisible = false
      const selectLength = this.multipleTable.length
      var data = {}
      data.delList = []
      for (let i = 0; i < selectLength; i++) {
        var choice = {}
        choice.id = this.multipleTable[i].id
        choice.version = this.multipleTable[i].version
        data.delList.push(choice)
      }
      data.modifierName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/steeltype/drop', data)
        .then(response => {
          if (response.data.status === 1) {
            // 后台语句执行正确
            if (response.data.resultData > 0) {
              // 成功删除
              this.$notify({
                title: '提示信息',
                position: 'bottom-right',
                message: '操作成功',
                type: 'success'
              })
              this.search()
            } else if (response.data.resultData === 0) {
              // 删除失败
              this.$notify({
                title: '错误信息',
                position: 'bottom-right',
                message: '后台删除失败',
                type: 'error'
              })
            }
          } else if (response.data.status === 0) {
            // 后台执行sql语句异常
            this.$notify({
              title: '错误信息',
              position: 'bottom-right',
              message: '后台删除异常',
              type: 'error'
            })
          }
        })
        .catch(() => {
          // 前台异常
          this.$notify({
            title: '错误信息',
            position: 'bottom-right',
            message: '前台删除异常',
            type: 'error'
          })
        })
    },
    // 更新框事件
    handleEdit() {
      if (this.multipleTable.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '最多只能选择一行数据进行修改',
          position: 'bottom-right',
          type: 'warning'
        })
      } else if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择一行要修改的数据',
          position: 'bottom-right',
          type: 'warning'
        })
      } else {
        this.addTemp = Object.assign({}, this.multipleTable[0])
        this.temp.version = this.addTemp.version
        // this.temp.remark = this.addTemp.remark;
        this.temp.id = this.addTemp.id
        // this.temp.name = this.addTemp.name;
        this.temp.update_name = this.addTemp.name
        this.temp.update_remark = this.addTemp.remark
        // if (!this.temp.update_name) {
        //   this.edit = true
        // } else {
        //   this.edit = false
        // }
        this.disableButton()
        this.dialogUpdateVisible = true
      }
    },
    edityes() {
      // 向后台传输的数据
      var data = {}
      data.id = this.temp.id
      data.version = this.temp.version
      data.name = this.temp.update_name
      data.remark = this.temp.update_remark
      data.modifierName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code

      axios
        .post('/api/b02pdm/steeltype/update', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.status === 0) {
            this.$notify({
              title: '错误信息',
              message: '后台更新异常',
              position: 'bottom-right',
              type: 'error'
            })
          } else if (response.data.status === 1) {
            // 后台语句执行正常
            if (response.data.resultData === 1) {
              // 成功添加
              this.$notify({
                title: '提示信息',
                message: '操作成功',
                position: 'bottom-right',
                type: 'success'
              })
              setTimeout(() => {
                this.dialogUpdateVisible = false
                this.search()
              }, 1000)
            } else if (response.data.resultData === 0) {
              // 添加失败
              this.$notify({
                title: '错误信息',
                message: '后台添加失败',
                position: 'bottom-right',
                type: 'error'
              })
            }
          }
        })
        .catch(() => {
          // 前台异常
          this.$notify({
            title: '错误信息',
            position: 'bottom-right',
            message: '前台添加失败',
            type: 'error'
          })
        })
    },
    // 添加框事件
    handleAdd() {
      this.temp.new_remark = ''
      this.temp.new_name = ''
      if (
        !this.temp.new_name) {
        this.add = true
      } else {
        this.add = false
      }
      this.dialogAddVisible = true
    },
    // 添加事件
    addSure() {
      var data = {}
      data.name = this.temp.new_name
      data.remark = this.temp.new_remark
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/steeltype/insert', data)
        .then(response => {
          // 返回值为0后台操作出现异常
          if (response.data.status === 0) {
            this.$notify({
              title: '错误信息',
              message: '后台添加异常',
              position: 'bottom-right',
              type: 'error'
            })
          } else if (response.data.status === 1) {
            // 后台语句执行成功
            if (response.data.resultData === 1) {
              // 后台成功添加
              this.$notify({
                title: '提示信息',
                message: '操作成功',
                position: 'bottom-right',
                type: 'success'
              })
              setTimeout(() => {
                this.dialogAddVisible = false
                this.$refs['dataForm'].resetFields()
              }, 1000)
              this.search()
            } else if (response.data.resultData === 0) {
              this.$notify({
                title: '提示信息',
                message: '后台添加失败',
                position: 'bottom-right',
                type: 'error'
              })
            }
          }
        })
        .catch(() => {
          this.$notify({
            // 前台异常
            title: '错误信息',
            message: '前台添加异常',
            position: 'bottom-right',
            type: 'error'
          })
        })
    },
    // 添加并继续
    addSureAgain() {
      var data = {}
      data.name = this.temp.new_name
      data.remark = this.temp.new_remark
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/steeltype/insert', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.status === 0) {
            this.$notify({
              title: '错误信息',
              message: '后台添加异常',
              position: 'bottom-right',
              type: 'error'
            })
          } else if (response.data.status === 1) {
            // 后台语句成功执行
            if (response.data.resultData === 1) {
              this.$notify({
                title: '提示信息',
                message: '操作成功',
                position: 'bottom-right',
                type: 'success'
              })
              setTimeout(() => {
                // 清空表单
                this.$refs['dataForm'].resetFields()
                this.resetTemp()
                if (
                  !this.temp.new_name) {
                  this.add = true
                } else {
                  this.add = false
                }
                this.search()
              }, 1000)
            } else if (response.data.resultData === 0) {
              this.$notify({
                title: '提示信息',
                message: '后台添加失败',
                position: 'bottom-right',
                type: 'error'
              })
            }
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误信息',
            message: '操作失败',
            position: 'bottom-right',
            type: 'error'
          })
        })
    },
    cancel() {
      this.dialogAddVisible = false
      this.dialogUpdateVisible = false
      // this.$refs['dataForm'].resetFields()
      this.resetTemp()
      this.search()
    },
    // 搜索框
    searchbuttonclick() {
      const g_name = g_name
      this.search()
    },
    // 重置搜索框
    handclearsearch() {
      this.g_name = undefined
      this.search()
    },
    handleSizeChange: function(size) {
      this.rows = size
      this.search()
    },
    handleCurrentChange: function(page) {
      this.page = page
      this.search()
    },
    getParam: function() {
      if (!this.g_name) {
        this.g_name = undefined
      }
      return {
        page: this.page,
        rows: this.rows,
        name: this.g_name
      }
    },
    resetTemp() {
      this.temp.id = undefined
      this.temp.new_name = undefined
      this.temp.new_remark = undefined
      this.temp.update_name = undefined
      this.temp.version = undefined
      this.temp.update_remark = undefined
      this.temp.name = undefined
    }
  }
}
</script>
