<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          钢牌名称：
          <el-select v-model="g_name" placeholder="所有">
            <el-option
              v-for="item in ops"
              :key="item.gb_number"
              :label="item.gb_number"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          参数名称：
          <el-input v-model.trim="g_paramname" prefix-icon="el-icon-search" class="g_input" />
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
      <el-table-column prop="parName" label="参数名" min-width="240px" align="center" />
      <el-table-column prop="parEName" label="参数英文名" min-width="240px" align="center" />
      <el-table-column
        v-if="false"
        prop="steelBrandNo"
        label="所属钢牌主键"
        min-width="240px"
        align="center"
      />
      <el-table-column prop="gb_number" label="所属钢牌" min-width="240px" align="center" />
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
      title="添加钢材标准参数"
    >
      <el-form ref="dataForm" :model="temp" label-position="left" :rules="rules" label-width="120px">
        <!-- 钢材名称 -->
        <el-form-item
          label="参数名称"
          prop="paramname"
        >
          <el-input v-model="temp.paramname" type="paramname" maxlength="50" @change="inputChage" />
        </el-form-item>
        <el-form-item label="参数英文名" prop="paramename">
          <el-input
            v-model="temp.paramename"
            type="paramename"
            maxlength="50"
            @change="inputChage"
          />
        </el-form-item>
        <el-form-item
          label="所属钢牌"
          :rules="[{ required: true, message: '所属钢牌不能为空'},]"
          prop="paramsteel"
        >
          <el-select v-model="temp.paramsteel" type="paramsteel" placeholder="请选择" style="width: 100%" @change="inputChage">
            <el-option
              v-for="items in option"
              :key="items.id"
              :label="items.gb_number"
              :value="items.id"
            />
          </el-select>
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
      title="修改钢材标准参数"
    >
      <el-form ref="dataupdateForm" :model="temp" label-position="left" :rules="rules" label-width="120px">
        <!-- 钢材名称 -->
        <el-form-item
          label="参数名称"
          prop="update_name"
          :rules="[{ required: true, message: '钢材标准参数名称不能为空'},]"
          @change="inputChage"
        >
          <el-input
            v-model="temp.update_name"
            type="update_name"
            maxlength="50"
            @change="inputChage"
          />
        </el-form-item>
        <el-form-item label="参数英文名" prop="update_ename">
          <el-input
            v-model="temp.update_ename"
            type="update_ename"
            maxlength="50"
            @change="inputChage"
          />
        </el-form-item>
        <el-form-item label="所属钢牌" :rules="[{ required: true, message: '所属钢牌不能为空'},]">
          <el-select v-model="temp.update_steel" placeholder="请选择" style="width: 100%" @change="inputChage">
            <el-option
              v-for="items in option"
              :key="items.id"
              :label="items.gb_number"
              :value="items.id"
            />
          </el-select>
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
  data() {
    function checkEnglish(rule, value, callback) {
      var englishinpuit = /^[a-zA-Z0-9_\s]*$/
      if (!englishinpuit.test(value)) {
        return callback(new Error('请输入英文值'))
      } else {
        return callback()
      }
    }
    return {
      tableData: [],
      rules: {
        paramename: [
          { required: true, validator: checkEnglish, trigger: 'blur', message: '请输入英文值，否则此英文名添加无效' }
        ],
        update_ename: [
          { required: true, validator: checkEnglish, trigger: 'blur' }
        ],
        paramname: [{ required: true, message: '钢材标准参数名不能为空' }]
      },
      steelchange: undefined,
      addTemp: undefined,
      ops: [],
      steelBrandNo: undefined,
      option: [],
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
      g_paramname: undefined,
      g_name: undefined,
      update_name: undefined,
      new_name: undefined,
      temp: {
        paramsteel: undefined,
        update_steel2: undefined,
        id: undefined,
        paramname: undefined,
        paramename: undefined,
        update_name: undefined,
        update_ename: undefined,
        update_steel: undefined,
        version: undefined,
        name: undefined
      },
      add: true,
      edit: true,
      dialogAddVisible: false,
      dialogDelVisible: false,
      dialogUpdateVisible: false,
      dialogSuccess: false,
      multipleTable: [] // 更新数据数据
    }
  },
  created() {
    this.search()
    axios.get('/api/b02pdm/steelparam/findsteelkinds').then(response => {
      if (response.data.status === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '错误',
          message: '后台查询出错',
          type: 'error',
          position: 'bottom-right'
        })
      } else if (response.data.status === 1) {
        this.ops = response.data.resultData
      }
    })
    axios.get('/api/b02pdm/steelparam/findsteelkind').then(res => {
      if (res.data.status === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '错误',
          message: '后台查询出错',
          type: 'error',
          position: 'bottom-right'
        })
      } else if (res.data.status === 1) {
        this.option = res.data.resultData
      }
    })
  },
  methods: {
    inputChage() {
      // 如钢材标准参数名或者所属钢牌为空则不允许添加
      if (
        !this.temp.paramname ||
        !this.temp.paramsteel
      ) {
        this.add = true
      } else {
        this.add = false
      }
      // 如钢材标准参数名为空则不允许修改
      if (this.multipleTable[0]) {
        if (!this.temp.update_name) {
          this.edit = true
        } else if (this.temp.update_name === this.multipleTable[0].parName &&
        this.temp.update_ename === this.multipleTable[0].parEName &&
        this.temp.update_steel === this.multipleTable[0].steelBrandNo
        ) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    disableButton() {
      if (
        !this.temp.paramname ||
        !this.temp.paramsteel
      ) {
        this.add = true
      } else {
        this.add = false
      }
      // 如钢材标准参数名为空则不允许修改
      if (this.multipleTable[0]) {
        if (!this.temp.update_name) {
          this.edit = true
        } else if (this.temp.update_name === this.multipleTable[0].parName &&
        this.temp.update_ename === this.multipleTable[0].parEName &&
        this.temp.update_steel === this.multipleTable[0].steelBrandNo
        ) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    resetTemp() {
      this.temp.paramsteel = undefined
      this.temp.update_steel2 = undefined
      this.temp.id = undefined
      this.temp.paramname = undefined
      this.temp.paramename = undefined
      this.temp.update_name = undefined
      this.temp.update_ename = undefined
      this.temp.update_steel = undefined
      this.temp.version = undefined
      this.temp.name = undefined
    },
    search: function() {
      axios.post('/api/b02pdm/steelparam/find', this.getParam()).then(res => {
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
        .post('/api/b02pdm/steelparam/drop', data)
        .then(response => {
          if (response.data.status === 1) {
            // 后台成功执行语句
            if (response.data.resultData > 0) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                title: '提示信息',
                message: '操作成功',
                position: 'bottom-right',
                type: 'success'
              })
              this.search()
            } else if (response.data.resultData === 0) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                title: '错误信息',
                message: '后台删除失败',
                position: 'bottom-right',
                type: 'error'
              })
            }
          } else if (response.data.status === 0) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: '后台删除异常',
              position: 'bottom-right',
              type: 'error'
            })
          }
        })
        .catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误信息',
            message: '前台删除',
            position: 'bottom-right',
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
        if (!this.temp.update_name) {
          this.edit = true
        } else {
          this.edit = false
        }
        this.addTemp = Object.assign({}, this.multipleTable[0])
        this.temp.id = this.addTemp.id
        this.temp.version = this.addTemp.version
        this.temp.update_name = this.addTemp.parName
        this.temp.update_ename = this.addTemp.parEName
        // this.temp.update_steel = this.addTemp.gb_number
        // this.temp.update_steel2 = this.addTemp.steelBrandNo
        // this.steelchange = this.temp.update_steel
        this.temp.update_steel = this.addTemp.steelBrandNo
        this.disableButton()
        this.dialogUpdateVisible = true
      }
    },
    edityes() {
      var englishinpuit = /^[a-zA-Z0-9_\s]*$/
      // 向后台传输的数据
      var data = {}
      data.id = this.temp.id
      data.version = this.temp.version
      data.parName = this.temp.update_name
      if (englishinpuit.test(this.temp.update_ename)) {
        data.parEName = this.temp.update_ename
      }
      data.steelBrandNo = this.temp.update_steel
      data.modifierName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code

      axios
        .post('/api/b02pdm/steelparam/update', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          if (response.data.status === 0) {
            if (response.data.msg === 'E0008') {
              this.notifyInstance = this.$notify({
                title: '警告信息',
                message: '此钢牌已存在该参数，修改失败',
                position: 'bottom-right',
                type: 'warning'
              })
            } else if (response.data.msg === 'E0007') {
              this.notifyInstance = this.$notify({
                title: '警告信息',
                message: '后台校验异常，请再次点击修改按钮',
                position: 'bottom-right',
                type: 'warning'
              })
            } else {
              this.notifyInstance = this.$notify({
                title: '错误信息',
                message: '后台修改异常',
                position: 'bottom-right',
                type: 'error'
              })
            }
          } else {
            if (response.data.resultData === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                title: '提示信息',
                message: '修改成功',
                position: 'bottom-right',
                type: 'success'
              })
              setTimeout(() => {
                this.dialogUpdateVisible = false
                this.$refs['dataForm'].resetFields()
                this.resetTemp()
              }, 1000)
              this.search()
            } else if (response.data.resultData === 0) { // 语句成功执行但修改数据行数为0
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                title: '错误信息',
                message: '后台修改失败',
                position: 'bottom-right',
                type: 'error'
              })
            }
          }
        })
        .catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误信息',
            message: '前台出现异常，修改失败',
            position: 'bottom-right',
            type: 'warning'
          })
        })
    },
    // 添加框事件
    handleAdd() {
      if (
        !this.temp.paramname ||
        !this.temp.paramsteel
      ) {
        this.add = true
      } else {
        this.add = false
      }
      this.temp.paramname = ''
      this.temp.paramename = ''
      this.temp.paramsteel = ''
      this.dialogAddVisible = true
    },
    // 添加事件
    addSure() {
      var englishinpuit = /^[a-zA-Z0-9_\s]*$/
      var data = {}
      data.steelBrandNo = this.temp.paramsteel
      data.parName = this.temp.paramname
      if (englishinpuit.test(this.temp.paramename)) {
        data.parEName = this.temp.paramename
      }
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/steelparam/insert', data)
        .then(response => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          // 返回值为0后台操作未成功
          if (response.data.status === 0) {
            // 后台添加异常
            if (response.data.msg === 'E0008') {
              this.notifyInstance = this.$notify({
                title: '警告信息',
                message: '此钢牌已存在该参数，添加失败',
                position: 'bottom-right',
                type: 'warning'
              })
            } else if (response.data.msg === 'E0007') {
              this.notifyInstance = this.$notify({
                title: '警告信息',
                message: '后台校验异常，请再次点击添加按钮',
                position: 'bottom-right',
                type: 'warning'
              })
            } else {
              this.notifyInstance = this.$notify({
                title: '错误信息',
                message: '后台添加异常',
                position: 'bottom-right',
                type: 'error'
              })
            }
          } else if (response.data.status === 1) {
            if (response.data.resultData === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                title: '提示信息',
                message: '添加成功！',
                position: 'bottom-right',
                type: 'success'
              })
              setTimeout(() => {
                this.dialogAddVisible = false
                this.$refs['dataForm'].resetFields()
                this.resetTemp()
              }, 1000)
              this.search()
            } else if (response.data.resultData === 0) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                title: '错误信息',
                position: 'bottom-right',
                message: '添加失败！',
                type: 'error'
              })
            }
          }
        })
        .catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误信息',
            position: 'bottom-right',
            message: '前台出现异常，添加失败！',
            type: 'error'
          })
        })
    },
    // 添加并继续
    addSureAgain() {
      var englishinpuit = /^[a-zA-Z0-9_\s]*$/
      var data = {}
      data.steelBrandNo = this.temp.paramsteel
      data.parName = this.temp.paramname
      if (englishinpuit.test(this.temp.paramename)) {
        data.parEName = this.temp.paramename
      }
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/steelparam/insert', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          if (response.data.status === 0) {
            //  后台异常
            if (response.data.msg === 'E0008') {
              this.notifyInstance = this.$notify({
                title: '警告信息',
                message: '此钢牌已存在该参数，添加失败',
                position: 'bottom-right',
                type: 'warning'
              })
            } else if (response.data.msg === 'E0007') {
              this.notifyInstance = this.$notify({
                title: '警告信息',
                message: '后台校验异常，请再次点击添加按钮',
                position: 'bottom-right',
                type: 'warning'
              })
            } else {
              this.notifyInstance = this.$notify({
                title: '错误信息',
                message: '后台添加异常',
                position: 'bottom-right',
                type: 'error'
              })
            }
          } else if (response.data.status === 1) {
            if (response.data.resultData === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                title: '提示信息',
                message: '修改成功！',
                position: 'bottom-right',
                type: 'success'
              })
              setTimeout(() => {
                // 清空表单
                this.$refs['dataForm'].resetFields()
                this.resetTemp()
                if (
                  !this.temp.paramname ||
                  !this.temp.paramsteel
                ) {
                  this.add = true
                } else {
                  this.add = false
                }
                this.search()
              }, 1000)
            } else if (response.data.resultData === 0) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                title: '错误信息',
                message: '后台失败！',
                position: 'bottom-right',
                type: 'error'
              })
            }
          }
        })
        .catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误信息',
            message: '前台出现异常，修改失败！',
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
      const g_paramname = g_paramname
      this.search()
    },
    // 重置搜索框
    handclearsearch() {
      this.g_name = undefined
      this.g_paramname = undefined
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
      return {
        page: this.page,
        rows: this.rows,
        parName: this.g_paramname,
        steelBrandNo: this.g_name
      }
    }
  }
}
</script>
