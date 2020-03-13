<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form v-model="Cars">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="车牌照号：" prop="carNo">
              <el-select
                v-model="carNo"
                class="carInfo_select"
                clearable
                placeholder="请选择车牌号"
                filterable
              >
                <el-option
                  v-for="item in options"
                  :key="item.index"
                  :label="item.label"
                  :value="item.carNo"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="锁定状态:" prop="state">
              <el-switch
                v-model="state"
                active-value="1"
                inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--添加dialog-->
    <el-dialog title="添加车辆对话框" :visible.sync="dialogAddVisible" :close-on-click-modal="false" width="30%" top="10%">
      <el-form ref="addForm" :model="Cars" :rules="rules" label-width="120px">
        <el-form-item label="车牌照号：" prop="carNo">
          <el-input
            v-model.trim="Cars.carNo"
            placeholder="请输入内容"
            class="carClass"
            clearable
            @input="inputChange()"
          />
        </el-form-item>

        <el-form-item label="车辆类型：" prop="type">
          <el-select
            v-model.trim="Cars.type"
            placeholder="请选择类型"
            class="carClass"
            @change="inputChange()"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所属单位：" prop="comp">
          <el-input
            v-model.trim="Cars.comp"
            placeholder="请输入内容"
            class="carClass"
            clearable
            @input="inputChange()"
          />
        </el-form-item>

        <el-form-item label="锁定状态：" prop="state">
          <el-switch
            v-model.trim="Cars.state"
            active-value="1"
            inactive-value="0"
            style="width: 10%;float:left;margin-top:10px;"
            @change="inputChange()"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-back" @click="addHandleNo()">取消</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          :disabled="add"
          @click="addHandleYes()"
        >添加</el-button>
      </div>
    </el-dialog>

    <!--修改dialog-->
    <el-dialog title="修改车辆对话框" :visible.sync="dialogUpdateVisible" width="30%" top="10%" :close-on-click-modal="false">
      <el-form ref="editForm" :model="Cars" label-width="120px" required="required" :rules="rules">
        <el-form-item label="车牌照号：" prop="carNo">
          <el-input
            v-model="Cars.carNo"
            placeholder="请输入内容"
            class="carClass"
            clearable
            @input="inputChange()"
          />
        </el-form-item>
        <br>
        <el-form-item label="车辆类型：" prop="type">
          <el-select
            v-model="Cars.type"
            placeholder="请选择类型"
            class="carClass"
            @change="inputChange()"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="所属单位：" prop="comp">
          <el-input
            v-model="Cars.comp"
            placeholder="请输入内容"
            class="carClass"
            clearable
            @input="inputChange()"
          />
        </el-form-item>
        <br>
        <el-form-item label="锁定状态：" prop="state">
          <el-switch
            v-model="Cars.state"
            active-value="1"
            inactive-value="0"
            style="width: 10%;float:left;margin-top:10px;"
            @change="inputChange()"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-back" @click="editHandleNo()">取消</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          :disabled="edit"
          @click="editHandleYes()"
        >修改</el-button>

      </div>
    </el-dialog>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="stateOff">锁定</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="stateOn">解锁</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
    </div>

    <!-- @row-click="handleRowClick" -->
    <el-table
      ref="carTable"
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
      <el-table-column v-if="false" label="ID">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column type="index" :index="table_index" label="序号" width="60px" align="center" />
      <el-table-column v-if="false" prop="version" label="版本" align="center" />
      <el-table-column label="车牌号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.carNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属单位" align="center">
        <template slot-scope="{row}">
          <span>{{ row.comp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type === 1?'自有车辆':'外来车辆' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.state === 1?'维修':'正常' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="g_pagination">
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
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TestTable',
  data() {
    // 正则验证carNo
    var InputCarNo = (rule, value, callback) => {
      if (value) {
        value = value.replace(/\s+/g, '') // 去空格
      }
      if (!value) {
        callback(new Error('车牌号不能为空'))
        this.carNoMsg = 0
      } else {
        var inval = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
        var isRight = inval.test(value)
        var status = isRight ? 1 : 0
        if (status === 0) {
          callback(new Error('车牌号输入格式有误，请重新输入！'))
          this.carNoMsg = 0
        } else {
          callback()
          this.carNoMsg = 1
        }
      }
      this.inputChange()
    }
    // 正则验证comp
    var InputComp = (rule, value, callback) => {
      if (value) {
        value = value.replace(/\s+/g, '') // 去空格
      }
      if (!value) {
        callback(new Error('单位不能为空！'))
        this.compMsg = 0
      } else {
        callback()
        this.compMsg = 1
      }
      this.inputChange()
    }
    return {
      carNo: '',
      state: 0,
      oldType: '自有车辆', // 存储类型
      Cars: {
        carNo: '',
        type: 1,
        state: 0,
        comp: ''
      },
      rules: {
        carNo: [
          { required: true, validator: InputCarNo, trigger: 'change' }
        ],
        // type: [
        //   { required: true, validator: InputType, trigger: 'change' }
        // ],
        comp: [
          { required: true, validator: InputComp, trigger: 'change' }
        ]
        // state: [
        //   { required: true, validator: InputState, trigger: 'change' }
        // ]
      },
      options: [],
      currentPage: 1, // 分页当前页
      total: 100, // 查询的总条数
      pageSize: 10, // 每页显示的条数
      tableData: [], // 表格数据
      multipleTable: [], // 选中的表格数据
      add: true, // 添加按钮禁用
      edit: true, // 修改按钮禁用
      carNoMsg: 1, // 按钮禁用条件
      compMsg: 1, // 按钮禁用条件
      dialogAddVisible: false, // 添加对话框
      dialogUpdateVisible: false, // 修改对话框
      typeOptions: [
        {
          value: '1',
          label: '自有车辆'
        },
        {
          value: '0',
          label: '外来车辆'
        }
      ]
    }
  },
  created() {
    this.search()
    this.findCarNo()
  },
  methods: {
    search: function() {
      axios
        .get('/api/b05lms/CarInfo/selectby', { params: this.getParamMap() })
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
    findCarNo: function() {
      axios
        .get('/api/b05lms/CarInfo/selectCarNo')
        .then(response => {
          if (response.data.status === 1) {
            this.options = response.data.resultData.allCarNos // 用list接收这个数据
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
          this.Cars.carNo !== '' &&
          this.Cars.comp !== ''
        ) && (this.carNoMsg === 1 && this.compMsg === 1)) {
          this.add = false
        } else {
          this.add = true
        }
      } else if (this.dialogUpdateVisible === true && this.dialogAddVisible === false) {
        if ((
          this.Cars.carNo !== this.multipleTable[0].carNo ||
          (String(this.Cars.type) !== String(this.multipleTable[0].type) && this.Cars.type !== this.oldType) ||
          this.Cars.comp !== this.multipleTable[0].comp ||
          String(this.Cars.state) !== String(this.multipleTable[0].state)
        ) && (this.carNoMsg === 1 && this.compMsg === 1)) {
          this.edit = false
        } else {
          this.edit = true
        }
      }
    },
    // 锁定
    stateOff: function() {
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
        this.$confirm('此操作将锁定选中数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const selectLength = this.multipleTable.length
            const listmap = []
            const select = this.multipleTable
            for (let i = 0; i < selectLength; i++) {
              const ids = {}
              ids.id = select[i].id
              ids.version = select[i].version
              listmap[i] = ids
            }
            const resultMap = {}
            resultMap.modifierCode = this.$store.state.userInfo.code
            resultMap.modifierName = this.$store.state.userInfo.name
            resultMap.state = 1
            resultMap.list = listmap
            axios
              .put('/api/b05lms/CarInfo/updateState', resultMap)
              .then(res => {
                if (res.data.resultData > 0) {
                  if (this.notifyInstance) {
                    this.notifyInstance.close()
                  }
                  this.notifyInstance = this.$notify({
                    title: '提示信息',
                    type: 'success',
                    message: '锁定成功!',
                    position: 'bottom-right'
                  })
                  this.multipleTable = []
                  this.$refs.carTable.clearSelection()
                  this.search()
                } else if (res.data.msg === 'EC00003') {
                  if (this.notifyInstance) {
                    this.notifyInstance.close()
                  }
                  this.notifyInstance = this.$notify({
                    title: '提示信息',
                    type: 'error',
                    message: '锁定失败!',
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
              message: '锁定操作已取消',
              position: 'bottom-right'
            })
          })
      }
    },
    // 解锁
    stateOn: function() {
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
        this.$confirm('此操作将解锁锁定的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        })
          .then(() => {
            const selectLength = this.multipleTable.length
            const listmap = []
            const select = this.multipleTable
            for (let i = 0; i < selectLength; i++) {
              const ids = {}
              ids.id = select[i].id
              ids.version = select[i].version
              listmap[i] = ids
            }
            const resultMap = {}
            resultMap.modifierCode = this.$store.state.userInfo.code
            resultMap.modifierName = this.$store.state.userInfo.name
            resultMap.state = 0
            resultMap.list = listmap
            axios
              .put('/api/b05lms/CarInfo/updateState', resultMap)
              .then(res => {
                if (res.data.resultData > 0) {
                  if (this.notifyInstance) {
                    this.notifyInstance.close()
                  }
                  this.notifyInstance = this.$notify({
                    title: '提示信息',
                    type: 'success',
                    message: '解锁成功!',
                    position: 'bottom-right'
                  })
                  this.multipleTable = []
                  this.$refs.carTable.clearSelection()
                  this.search()
                } else if (res.data.msg === 'EC00003') {
                  if (this.notifyInstance) {
                    this.notifyInstance.close()
                  }
                  this.notifyInstance = this.$notify({
                    title: '错误信息',
                    type: 'error',
                    message: '解锁失败!',
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
              message: '解锁操作已取消',
              position: 'bottom-right'
            })
          })
      }
    },
    resetCars() {
      this.Cars.carNo = ''
      this.Cars.type = 1
      this.Cars.state = 0
      this.Cars.comp = ''
    },
    getParamMap: function() {
      return {
        page: this.currentPage,
        rows: this.pageSize,
        carNo: this.carNo,
        state: this.state
      }
    },
    handleSizeChange: function(val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.search()
    },
    // 数据表选中
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 获取行
    getRowKeys: function(row) {
      return row.id
    },
    table_index(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    // 查询
    handleFilter: function() {
      this.multipleTable = []
      this.search()
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
            const selectLength = this.multipleTable.length
            const resultMap = {}
            const list = []
            const select = this.multipleTable
            for (let i = 0; i < selectLength; i++) {
              const ids = {}
              ids.id = select[i].id
              ids.version = select[i].version
              list[i] = ids
            }
            resultMap.list = list
            resultMap.modifierCode = this.$store.state.userInfo.code
            resultMap.modifierName = this.$store.state.userInfo.name
            axios
              .put('/api/b05lms/CarInfo/delete', resultMap)
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
                  this.$refs.carTable.clearSelection()
                  this.search()
                } else if (res.data.msg === 'EC00002') {
                  if (this.notifyInstance) {
                    this.notifyInstance.close()
                  }
                  this.notifyInstance = this.$notify({
                    title: '错误信息',
                    type: 'error',
                    message: '删除失败!',
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
    // 修改
    handleEdit: function() {
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
        this.Cars.carNo = this.multipleTable[0].carNo
        if (this.multipleTable[0].type === 0) {
          this.Cars.type = '外来车辆'
        } else if (this.multipleTable[0].type === 1) {
          this.Cars.type = '自有车辆'
        }
        this.oldType = this.Cars.type
        this.Cars.comp = this.multipleTable[0].comp
        this.Cars.state = String(this.multipleTable[0].state)
        this.dialogUpdateVisible = true
        this.inputChange()
        if (
          this.Cars.carNo === this.multipleTable[0].carNo &&
          this.Cars.type === this.oldType &&
          this.Cars.comp === this.multipleTable[0].comp &&
          this.Cars.state === String(this.multipleTable[0].state)
        ) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    // 确认修改
    editHandleYes: function() {
      const data = {}
      if (this.Cars.type === '自有车辆') {
        this.Cars.type = 1
      } else if (this.Cars.type === '外来车辆') {
        this.Cars.type = 0
      }
      data.id = this.multipleTable[0].id
      data.version = this.multipleTable[0].version
      data.carNo = this.Cars.carNo
      data.type = this.Cars.type
      data.comp = this.Cars.comp
      data.state = this.Cars.state
      data.modifierName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code
      axios.put('/api/b05lms/CarInfo/update', data).then(res => {
        if (res.data.resultData === 1) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '提示信息',
            message: '修改成功',
            type: 'success',
            position: 'bottom-right'
          })
          this.dialogUpdateVisible = false
          this.$refs['editForm'].resetFields()
          this.$refs.carTable.clearSelection()
          this.resetCars()
          this.multipleTable = []
          this.oldType = ''
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
      }).catch(() => {
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
    // 添加
    handleAdd: function() {
      // 清空添加表单数据
      this.resetCars()
      this.add = true
      this.Cars.type = '自有车辆'
      // 打开添加对话框
      this.dialogAddVisible = true
    },
    // 确认添加
    addHandleYes: function() {
      const data = {}
      if (this.Cars.type === '自有车辆') {
        this.Cars.type = 1
      } else if (this.Cars.type === '外来车辆') {
        this.Cars.type = 0
      }
      data.carNo = this.Cars.carNo
      data.type = this.Cars.type
      data.comp = this.Cars.comp
      data.state = this.Cars.state
      data.createUserCode = this.$store.state.userInfo.code
      data.createUserName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code
      data.modifierName = this.$store.state.userInfo.name
      axios.post('/api/b05lms/CarInfo/add', data).then(res => {
        if (res.data.status === 1) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            message: '添加成功',
            type: 'success',
            position: 'bottom-right'
          })
          // 添加成功关闭对话框
          this.dialogAddVisible = false
          // 清空表单
          this.$refs['addForm'].resetFields()
          this.resetCars()
          this.search()
        } else {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误信息',
            message: '添加失败（后台错误）',
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
    // 重置
    handleRefresh: function() {
      this.carNo = ''
      this.state = 0
      this.currentPage = 1
      this.pageSize = 10
      this.$refs.carTable.clearSelection()
      this.search()
    },
    // 取消修改
    editHandleNo() {
      this.dialogUpdateVisible = false
      this.$refs['editForm'].resetFields()
    },
    // 取消添加
    addHandleNo: function() {
      this.dialogAddVisible = false
      this.$refs['addForm'].resetFields()
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
.carClass {
  width: 80%;
  float: left;
}
</style>

