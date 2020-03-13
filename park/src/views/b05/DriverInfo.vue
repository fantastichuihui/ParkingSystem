<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form v-model="Drivers">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="司机姓名：" prop="name">

              <el-select
                v-model.trim="name"
                filterable
                style="width:50%;"
                clearable
                placeholder="请选择姓名"
                @blur="searchBlur"
              >
                <el-option
                  v-for="item in options"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item></el-col>

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="身份证号：" prop="idCard">
              <!-- 身份证号 -->
              <el-input
                v-model.trim="idCard"
                prefix-icon="el-icon-search"
                placeholder="请输入内容"
                style="width:50%;"
                maxlength="18"
                clearable
              />
            </el-form-item></el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="联系电话：" prop="phone">
              <el-input
                v-model.trim="phone"
                prefix-icon="el-icon-search"
                placeholder="请输入内容"
                style="width:50%;"
                maxlength="11"
                clearable
              />
            </el-form-item></el-col>
        </el-row>
      </el-form>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleFilter()">查询</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh()">重置</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd()">添加</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
    </div>

    <!-- 表格控件区 -->
    <el-table
      ref="driverTable"
      :data="tableData"
      :row-key="getRowKeys"
      class="g_table"
      style="width: 100%"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column class="g_tableSelection" type="selection" :reserve-selection="true" />
      <el-table-column type="index" :index="table_index" label="序号" width="60px" align="center" />
      <el-table-column v-if="false" prop="id" label="逻辑主键" width="10px" align="center" />
      <el-table-column prop="name" label="司机姓名" align="center" />
      <el-table-column prop="phone" label="联系电话" align="center" />
      <el-table-column prop="idCard" label="身份证号" align="center" />
      <el-table-column v-if="false" prop="version" label="版本" width="300px" align="center" />
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
    <!-- 添加对话框 -->
    <el-dialog title="添加司机信息对话框" :visible.sync="dialogAddVisible" width="30%" center :close-on-click-modal="false">
      <el-form ref="dataAddForm" :rules="rules" :model="Drivers" label-width="120px" required="required">
        <!-- 司机姓名 -->
        <el-form-item label="司机姓名：" prop="name">
          <el-input
            v-model="Drivers.name"
            style="width: 80%;"
            type="gb_number"
            maxlength="20"
            @input="inputChange"
          />
        </el-form-item>
        <!-- 联系电话 -->
        <el-form-item label="联系电话：" prop="phone">
          <el-input
            v-model="Drivers.phone"
            type="phone"
            style="width: 80%;"
            maxlength="11"
            @input="inputChange"
          />
        </el-form-item>
        <!-- 身份证号 -->
        <el-form-item label="身份证号：" prop="idCard">
          <el-input
            v-model="Drivers.idCard"
            type="idCard"
            style="width: 80%;"
            maxlength="18"
            @input="inputChange"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-refresh" @click="cancelYes()">取消</el-button>
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
    <el-dialog title="更新司机信息对话框" :visible.sync="dialogUpdateVisible" width="30%" :close-on-click-modal="false">
      <el-form ref="dataUpdateForm" :rules="rules" :model="Drivers" label-width="120px" required="required">
        <!-- 司机姓名 -->
        <el-form-item label="司机姓名：" prop="name">
          <el-input v-model="Drivers.name" type="gb_number" style="width: 70%;float:left;" maxlength="20" @input="inputChange" />
        </el-form-item>
        <!-- 联系电话 -->
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model="Drivers.phone" type="phone" style="width: 70%;float:left;" maxlength="11" @input="inputChange" />
        </el-form-item>
        <!-- 身份证号 -->
        <el-form-item label="身份证号：" prop="idCard">
          <el-input v-model="Drivers.idCard" type="idCard" style="width: 70%;float:left;" maxlength="18" @input="inputChange" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-refresh" @click="cancelYes()">取消</el-button>
        <el-button type="primary" plain icon="el-icon-edit" :disabled="edit" @click="editYes()">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TestTable',
  data() {
    // 正则验证idCard
    var inputIdCard = (rule, value, callback) => {
      value = value.replace(/\s+/g, '').toUpperCase() // 去空格
      value = value.toString()
      value = value.charAt(0).toUpperCase() + value.slice(1)
      if (!value) {
        callback(new Error('身份证号不能为空！'))
        this.idCardMsg = 0
      } else {
        var inval = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
        var isRight = inval.test(value)
        var status = isRight ? 1 : 0
        if (status === 0) {
          callback(new Error('身份证号输入格式有误，请重新输入！'))
          this.idCardMsg = 0
        } else {
          callback()
          this.idCardMsg = 1
        }
      }
      this.inputChange()
    }
    // 正则验证phone
    var inputPhone = (rule, value, callback) => {
      value = value.replace(/\s+/g, '') // 去空格
      if (!value) {
        callback(new Error('电话号码不能为空！'))
        this.phoneMsg = 0
      } else if (value.length === 11) {
        var phone = /^1[3|4|5|7|8][0-9]\d{8}$/
        var isRight = phone.test(value)
        var status = isRight ? 1 : 0

        var tel = /^(0\d{2}-\d{7})$/
        var isRight2 = tel.test(value)
        var status2 = isRight2 ? 1 : 0

        if (status === 1 || status2 === 1) {
          callback()
          this.phoneMsg = 1
        } else {
          callback(new Error('电话或手机格式不正确！'))
          this.phoneMsg = 0
        }
      } else {
        callback(new Error('电话或手机长度不正确！'))
        this.phoneMsg = 0
      }
      this.inputChange()
    }
    // 正则验证name
    var inputName = (rule, value, callback) => {
      if (value) {
        value = value.replace(/\s+/g, '') // 去空格
      }
      if (!value) {
        callback(new Error('姓名不能为空！'))
        this.nameMsg = 0
      } else {
        callback()
        this.nameMsg = 1
      }
      this.inputChange()
    }
    return {
      Drivers: { // 添加表单数据
        name: '',
        idCard: '',
        phone: ''
      },
      rules: {
        name: [
          { required: true, validator: inputName, trigger: 'change' }
        ],
        phone: [
          { required: true, validator: inputPhone, trigger: 'change' }
        ],
        idCard: [
          { required: true, validator: inputIdCard, trigger: 'change' }
        ]
      },
      options: [], // 司机姓名数据
      name: '', // 司机姓名
      idCard: '', // 身份证号
      phone: '', // 电话号码
      id: '',
      version: '',
      currentPage: 1, // 分页当前页
      total: 100, // 查询的总条数
      pageSize: 10, // 每页显示的条数
      tableData: [], // 表格数据
      multipleTable: [], // 选中的表格数据
      add: true, // 添加按钮禁用
      edit: true, // 修改按钮禁用
      nameMsg: 1, // 按钮禁用条件
      phoneMsg: 1, // 按钮禁用条件
      idCardMsg: 1, // 按钮禁用条件
      dialogAddVisible: false, // 添加对话框
      dialogUpdateVisible: false, // 修改对话框
      count: []
    }
  },
  // computed: {
  //   userInfo() {
  //     return this.$store.state.userInfo
  //   }
  // },
  created() {
    this.search()
    // 司机姓名下拉框填入数据
    axios.get('/api/b05lms/DriverInfo/selectAllDriverNames').then(response => {
      if (response.data.status === 1) {
        this.options = response.data.resultData.allDriverNames // 用list接收这个数据
      } else if (response.data.msg === 'EC00004') {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '错误',
          message: '后台查询出错',
          type: 'error',
          position: 'bottom-right'
        })
      }
    })
  },
  // components: {
  // count() {
  //   return this.$store.state.userInfo
  // }
  // },
  methods: {
    searchBlur(e) {
      this.name = e.target.name
    },
    search() {
      axios
        .get('/api/b05lms/DriverInfo/selectAllDriver', { params: this.getParamMap() })
        .then(response => {
          if (response.data.status === 1) {
            this.tableData = response.data.resultData.rows // 用list接收这个数据
            this.total = response.data.resultData.total
          } else if (response.data.msg === 'EC00004') {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误',
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
          this.Drivers.name !== '' &&
          this.Drivers.phone !== '' &&
          this.Drivers.idCard !== ''
        ) && (this.nameMsg === 1 && this.phoneMsg === 1 && this.idCardMsg === 1)) {
          this.add = false
        } else {
          this.add = true
        }
      } else if (this.dialogUpdateVisible === true && this.dialogAddVisible === false) {
        this.addTemp = Object.assign({}, this.multipleTable[0])
        if ((
          this.Drivers.name !== this.addTemp.name ||
          this.Drivers.phone !== this.addTemp.phone ||
          this.Drivers.idCard !== this.addTemp.idCard
        ) && (this.nameMsg === 1 && this.phoneMsg === 1 && this.idCardMsg === 1)) {
          this.edit = false
        } else {
          this.edit = true
        }
      }
    },
    resetDrivers() {
      this.Drivers.name = ''
      this.Drivers.phone = ''
      this.Drivers.idCard = ''
    },
    getParamMap() {
      if (this.name) {
        this.name = this.name.replace(/\s+/g, '')
      }
      this.phone = this.phone.replace(/\s+/g, '')
      this.idCard = this.idCard.replace(/\s+/g, '')
      return {
        page: this.currentPage,
        rows: this.pageSize,
        name: this.name,
        idCard: this.idCard,
        phone: this.phone
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
    getRowKeys(row) {
      return row.id
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
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const data = []
            const resultMap = {}
            for (var i = 0; i < this.multipleTable.length; i++) {
              const map = {}
              map.id = this.multipleTable[i].id
              map.version = this.multipleTable[i].version
              data.push(map)
            }
            resultMap.list = data
            resultMap.modifierCode = this.$store.state.userInfo.code
            resultMap.modifierName = this.$store.state.userInfo.name
            axios
              .put('/api/b05lms/DriverInfo/logicalDeleteDriver', resultMap)
              .then(response => {
                if (response.data.resultData > 0) {
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
                  this.$refs.driverTable.clearSelection()
                  this.search()
                } else if (response.data.msg === 'EC00002') {
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
    // 更新框事件
    handleEdit() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.addTemp = Object.assign({}, this.multipleTable[0])
        this.Drivers.name = this.addTemp.name
        this.Drivers.phone = this.addTemp.phone
        this.Drivers.idCard = this.addTemp.idCard
        this.dialogUpdateVisible = true
        this.inputChange()
        if (
          this.Drivers.name === this.addTemp.name &&
          this.Drivers.phone === this.addTemp.phone &&
          this.Drivers.idCard === this.addTemp.idCard
        ) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    editYes() {
      // 向后台传输的数据
      var data = {}
      data.id = this.multipleTable[0].id
      data.version = this.multipleTable[0].version
      data.name = this.Drivers.name
      data.phone = this.Drivers.phone
      data.idCard = this.Drivers.idCard
      data.modifierName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code
      axios
        .put('/api/b05lms/DriverInfo/updateDriver', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.resultData === 1) {
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
            this.$refs['dataUpdateForm'].resetFields()
            this.$refs.driverTable.clearSelection()
            this.resetDrivers()
            this.multipleTable = []
            this.search()
          } else if (response.data.msg === 'EC00003') {
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
    // 添加框事件
    handleAdd() {
      // 清空添加表单数据
      this.resetDrivers()
      this.add = true
      // 打开添加对话框
      this.dialogAddVisible = true
    },
    // 添加
    addSure() {
      var data = {}
      data.name = this.Drivers.name
      data.phone = this.Drivers.phone
      data.idCard = this.Drivers.idCard
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      data.modifierName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code
      axios.post('/api/b05lms/DriverInfo/saveDriver', data).then(response => {
        // 返回值为0后台操作未成功
        if (response.data.status === 1) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '提示信息',
            message: '操作成功',
            type: 'success',
            position: 'bottom-right'
          })
          // 添加成功关闭对话框
          this.dialogAddVisible = false
          // 清空表单
          this.$refs['dataAddForm'].resetFields()
          this.resetDrivers()
          // 刷新表格
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
    // 添加并继续
    addSureAgain() {
      var data = {}
      data.name = this.Drivers.name
      data.phone = this.Drivers.phone
      data.idCard = this.Drivers.idCard
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      data.modifierName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code
      axios.post('/api/b05lms/DriverInfo/saveDriver', data).then(response => {
        // 返回值为0后台操作未成功
        if (response.data.status === 1) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '提示信息',
            message: '操作成功',
            type: 'success',
            position: 'bottom-right'
          })
          // 添加成功关闭对话框
          this.dialogAddVisible = false
          // 清空表单
          this.$refs['dataAddForm'].resetFields()
          this.resetDrivers()
          this.dialogAddVisible = true
          this.inputChange()
          // 刷新表格
          // this.search()
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
    cancelYes() {
      if (this.dialogAddVisible) {
        this.dialogAddVisible = false
        this.$refs['dataAddForm'].resetFields()
        // this.$refs.driverTable.clearSelection()
      } else if (this.dialogUpdateVisible) {
        this.dialogUpdateVisible = false
        this.$refs['dataUpdateForm'].resetFields()
      }
    },
    // 查询
    handleFilter() {
      this.search()
    },
    // 重置
    handleRefresh() {
      this.name = ''
      this.phone = ''
      this.idCard = ''
      this.currentPage = 1
      this.pageSize = 10
      this.$refs.driverTable.clearSelection()
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
