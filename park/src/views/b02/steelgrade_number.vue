<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          钢种名称：
          <el-select v-model="g_name" placeholder="请选择">
            <el-option v-for="item in ops" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          国际牌号：
          <el-select v-model="g_gb_number" placeholder="请选择">
            <el-option
              v-for="item in ops1"
              :key="item.id"
              :label="item.gb_number"
              :value="item.gb_number"
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
    <!-- 表格控件区 -->
    <el-table
      :data="tableData"
      border
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" class="g_tableSelection" align="center" />
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <el-table-column v-if="false" prop="id" label="逻辑主键" align="center" />
      <el-table-column prop="name" label="钢种名称" align="center" />
      <el-table-column prop="gb_number" label="国际牌号" align="center" />
      <el-table-column prop="jis_number" label="JIS牌号" align="center" />
      <el-table-column prop="astm_number" label="ASTM牌号" align="center" />
      <el-table-column v-if="false" prop="gradeId" label="材料ID" align="center" />
      <el-table-column v-if="false" prop="version" label="版本" align="center" />
    </el-table>

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
      title="添加钢牌号信息"
      width="30%"
      :visible.sync="dialogAddVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px">
        <!-- 钢材名称 -->
        <el-form-item label="钢材名称：" prop="g_newgradeId">
          <el-select
            v-model="temp.g_newgradeId"
            placeholder="请选择"
            style="width: 80%;"
            @change="inputChage"
          >
            <el-option v-for="item in ops" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- 国际牌号 -->
        <el-form-item label="国际牌号：" prop="gb_number">
          <el-input
            v-model="temp.gb_number"
            type="gb_number"
            style="width: 80%;"
            maxlength="50"
            @change="inputChage"
          />
        </el-form-item>
        <!-- JIS牌号 -->
        <el-form-item label="JIS牌号：" prop="jis_number">
          <el-input
            v-model="temp.jis_number"
            type="jis_number"
            style="width: 80%;"
            maxlength="50"
            @change="inputChage"
          />
        </el-form-item>
        <!-- ASTM牌号 -->
        <el-form-item label="ASTM牌号：" prop="astm_number">
          <el-input
            v-model="temp.astm_number"
            type="astm_number"
            style="width: 80%;"
            maxlength="50"
            @change="inputChage"
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
      title="更改钢牌号信息"
      :visible.sync="dialogUpdateVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form ref="dataupdateForm" :rules="rules" :model="temp" label-width="120px">
        <!-- 钢材名称 -->
        <el-form-item label="钢材名称：" prop="g_updategradeId">
          <el-select
            v-model="temp.g_updategradeId"
            placeholder="请选择"
            style="width: 80%;"
            @change="inputChage"
          >
            <el-option v-for="item in ops" :key="item.value" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- 国际牌号 -->
        <el-form-item label="国际牌号：" prop="gb_number">
          <el-input
            v-model="temp.gb_number"
            type="gb_number"
            style="width: 80%;"
            maxlength="50"
            @change="inputChage"
          />
        </el-form-item>
        <!-- JIS牌号 -->
        <el-form-item label="JIS牌号：" prop="jis_number">
          <el-input
            v-model="temp.jis_number"
            type="jis_number"
            style="width: 80%;"
            maxlength="50"
            @change="inputChage"
          />
        </el-form-item>
        <!-- ASTM牌号 -->
        <el-form-item label="ASTM牌号：" prop="astm_number">
          <el-input
            v-model="temp.astm_number"
            type="astm_number"
            style="width: 80%;"
            maxlength="50"
            @change="inputChage"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-refresh" @click="cancel()">取消</el-button>
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
  name: 'SteelGradeNumberTable',
  data: () => {
    return {
      tableData: [],
      ops: [],
      ops1: [],
      id: undefined,
      name: undefined,
      gb_number: undefined,
      jis_number: undefined,
      astm_number: undefined,
      gradeId: undefined,
      version: undefined,
      page: 1,
      rows: 10,
      resultlength: 10,
      g_name: undefined,
      g_gb_number: undefined,
      temp: {
        id: undefined,
        gb_number: undefined,
        jis_number: undefined,
        astm_number: undefined,
        version: undefined,
        g_newgradeId: undefined,
        g_updategradeId: undefined
      },
      add: true,
      edit: true,
      dialogAddVisible: false,
      dialogDelVisible: false,
      dialogUpdateVisible: false,
      dialogSuccess: false,
      dialogFaile: false,
      multipleTable: [], // 更新数据数据
      ids: [], // 批量删除id
      rules: {
        g_newgradeId: [{ required: true, message: '钢种名称不能为空' }],
        g_updategradeId: [{ required: true, message: '钢种名称不能为空' }],
        gb_number: [{ required: true, message: '国际牌号不能为空' }],
        jis_number: [{ required: true, message: 'JIS牌号不能为空' }],
        astm_number: [{ required: true, message: 'ASTM牌号不能为空' }]
      }
    }
  },
  created() {
    this.search()
  },
  methods: {
    inputChage() {
      if (
        !this.temp.gb_number ||
        !this.temp.jis_number ||
        !this.temp.astm_number ||
        !this.temp.g_newgradeId
      ) {
        this.add = true
      } else {
        this.add = false
      }
      if (this.multipleTable[0]) {
        if (
          !this.temp.gb_number ||
        !this.temp.jis_number ||
        !this.temp.astm_number ||
        !this.temp.g_updategradeId
        ) {
          this.edit = true
        } else if (this.temp.gb_number === this.multipleTable[0].gb_number &&
        this.temp.astm_number === this.multipleTable[0].astm_number &&
        this.temp.jis_number === this.multipleTable[0].jis_number &&
        this.temp.g_updategradeId === this.multipleTable[0].gradeId) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    disableButton() {
      if (
        !this.temp.gb_number ||
        !this.temp.jis_number ||
        !this.temp.astm_number ||
        !this.temp.g_newgradeId
      ) {
        this.add = true
      } else {
        this.add = false
      }
      if (this.multipleTable[0]) {
        if (
          !this.temp.gb_number ||
        !this.temp.jis_number ||
        !this.temp.astm_number ||
        !this.temp.g_updategradeId
        ) {
          this.edit = true
        } else if (this.temp.gb_number === this.multipleTable[0].gb_number &&
        this.temp.astm_number === this.multipleTable[0].astm_number &&
        this.temp.jis_number === this.multipleTable[0].jis_number &&
        this.temp.g_updategradeId === this.multipleTable[0].gradeId) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    search: function() {
      axios
        .post('/api/b02pdm/steelgrade_number/findbycondition', this.getParam())
        .then(res => {
          if (res.data.status === 1) {
            this.tableData = res.data.resultData.rows
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
      axios.get('/api/b02pdm/steelgrade_number/findAllName').then(res => {
        if (res.data.status === 1) {
          this.ops = res.data.resultData
        } else if (res.data.msg === 'EC00004') {
          this.$notify({
            title: '错误',
            message: '后台查询出错',
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
      axios.get('/api/b02pdm/steelgrade_number/findAllGBN').then(res => {
        if (res.data.status === 1) {
          this.ops1 = res.data.resultData
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
          type: 'warning',
          position: 'bottom-right'
        })
        this.dialogDelVisible = false
      } else {
        this.dialogDelVisible = true
      }
    },
    // 删除事件
    handleDelete() {
      const selectLength = this.multipleTable.length
      var data = []
      for (let i = 0; i < selectLength; i++) {
        var ids = {}
        this.multipleTable[i].isDel = 1
        ids.id = this.multipleTable[i].id
        ids.version = this.multipleTable[i].version
        ids.modifierName = this.$store.state.userInfo.name
        ids.modifierCode = this.$store.state.userInfo.code
        data.push(ids)
      }
      axios
        .post('/api/b02pdm/steelgrade_number/logicaldelete', data)
        .then(response => {
          if (response.data.status === 1) {
            if (response.data.resultData > 0) {
              this.$notify({
                title: '提示信息',
                message: '操作成功',
                type: 'success',
                position: 'bottom-right'
              })
              this.search()
            } else {
              this.$notify({
                title: '错误信息',
                message: '后台删除失败',
                type: 'error',
                position: 'bottom-right'
              })
            }
          } else if (response.data.msg === 'EC00002') {
            this.$notify({
              title: '错误信息',
              message: '后台删除异常',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误信息',
            message: '前台删除失败',
            type: 'error',
            position: 'bottom-right'
          })
        })
      this.dialogDelVisible = false
    },
    // 更新框事件
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
        this.addTemp = Object.assign({}, this.multipleTable[0])
        this.temp.id = this.addTemp.id
        this.temp.version = this.addTemp.version
        this.temp.gb_number = this.addTemp.gb_number
        this.temp.astm_number = this.addTemp.astm_number
        this.temp.jis_number = this.addTemp.jis_number
        this.temp.g_updategradeId = this.addTemp.gradeId
        this.dialogUpdateVisible = true
        // if (
        //   !this.temp.gb_number ||
        //   !this.temp.jis_number ||
        //   !this.temp.astm_number ||
        //   !this.temp.g_updategradeId
        // ) {
        //   this.edit = true
        // } else {
        //   this.edit = false
        // }
        this.disableButton()
      }
    },
    edityes() {
      // 向后台传输的数据
      var data = {}
      data.id = this.temp.id
      data.version = this.temp.version
      data.gb_number = this.temp.gb_number
      data.astm_number = this.temp.astm_number
      data.jis_number = this.temp.jis_number
      data.gradeId = this.temp.g_updategradeId
      data.modifierName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/steelgrade_number/update', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.msg === 'EC00003') {
            this.$notify({
              title: '错误信息',
              message: '后台更新异常',
              type: 'error',
              position: 'bottom-right'
            })
          } else if (response.data.status === 1) {
            if (response.data.resultData > 0) {
              this.$notify({
                title: '提示信息',
                message: '操作成功',
                type: 'success',
                position: 'bottom-right'
              })
              setTimeout(() => {
                this.dialogUpdateVisible = false
                this.search()
              }, 1000)
            } else {
              this.$notify({
                title: '错误信息',
                message: '后台更新失败',
                type: 'error',
                position: 'bottom-right'
              })
            }
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误信息',
            message: '前台更新失败',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    // 添加框事件
    handleAdd() {
      this.dialogAddVisible = true
      if (
        !this.temp.gb_number ||
        !this.temp.jis_number ||
        !this.temp.astm_number ||
        !this.temp.g_newgradeId
      ) {
        this.add = true
      } else {
        this.add = false
      }
      this.temp.gb_number = ''
      this.temp.astm_number = ''
      this.temp.jis_number = ''
      this.temp.g_newgradeId = ''
    },
    // 添加事件
    addSure() {
      var data = {}
      data.gb_number = this.temp.gb_number
      data.jis_number = this.temp.jis_number
      data.astm_number = this.temp.astm_number
      data.gradeId = this.temp.g_newgradeId
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/steelgrade_number/insert', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.msg === 'EC00001') {
            this.$notify({
              title: '错误信息',
              message: '后台添加异常',
              type: 'error',
              position: 'bottom-right'
            })
          } else if (response.data.status === 1) {
            if (response.data.resultData > 0) {
              this.$notify({
                title: '提示信息',
                message: '操作成功',
                type: 'success',
                position: 'bottom-right'
              })
              setTimeout(() => {
                this.dialogAddVisible = false
                // 清空表单
                this.temp.gb_number = ''
                this.temp.astm_number = ''
                this.temp.jis_number = ''
                this.temp.g_newgradeId = ''
              }, 1000)
              this.search()
            } else {
              this.$notify({
                title: '错误信息',
                message: '后台添加失败',
                type: 'error',
                position: 'bottom-right'
              })
            }
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误信息',
            message: '前台添加失败',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    // 添加并继续
    addSureAgain() {
      var data = {}
      data.gb_number = this.temp.gb_number
      data.jis_number = this.temp.jis_number
      data.astm_number = this.temp.astm_number
      data.gradeId = this.temp.g_newgradeId
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/steelgrade_number/insert', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.msg === 'EC00002') {
            this.$notify({
              title: '错误信息',
              message: '后台添加异常',
              type: 'error',
              position: 'bottom-right'
            })
          } else if (response.data.status === 1) {
            if (response.data.resultData > 0) {
              this.$notify({
                title: '提示信息',
                message: '操作成功',
                type: 'success',
                position: 'bottom-right'
              })
              // setTimeout(() => {
              // 清空表单
              this.$refs['dataForm'].resetFields()
              this.temp.gb_number = ''
              this.temp.astm_number = ''
              this.temp.jis_number = ''
              this.temp.g_newgradeId = ''
              // }, 1000)
              this.disableButton()
              this.search()
            } else {
              this.$notify({
                title: '错误信息',
                message: '后台添加失败',
                type: 'error',
                position: 'bottom-right'
              })
            }
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误信息',
            message: '前台添加失败',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    cancel() {
      this.dialogUpdateVisible = false
      this.dialogAddVisible = false
      this.temp.gb_number = ''
      this.temp.astm_number = ''
      this.temp.jis_number = ''
      this.temp.g_newgradeId = ''
      this.search()
    },
    // 搜索框
    searchbuttonclick() {
      const g_name = g_name
      const g_gb_number = g_gb_number
      this.search()
    },
    // 重置搜索框
    handclearsearch() {
      this.g_name = undefined
      this.g_gb_number = undefined
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
        name: this.g_name,
        gb_number: this.g_gb_number
      }
    }
  }
}
</script>
