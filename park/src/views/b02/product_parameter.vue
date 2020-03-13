<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          产品名称：
          <el-select v-model="proNameSelect" placeholder="请选择">
            <el-option v-for="item in ops" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          参数名称：
          <el-input v-model.trim="praName" prefix-icon="el-icon-search" class="g_input" />
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
      fit
      highlight-current-row
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column type="index" label="序号" align="center" width="60px" />
      <el-table-column v-if="false" prop="id" label="参数id" align="center" />
      <el-table-column prop="pvalue" label="参数值" align="center" />
      <el-table-column prop="parName" label="参数名称" align="center" />
      <el-table-column v-if="false" prop="parId" label="标准参数id" align="center" />
      <el-table-column prop="parEName" label="参数英文名" align="center" />
      <el-table-column v-if="false" prop="proId" label="所属产品Id" align="center" />
      <el-table-column prop="proName" label="所属产品" align="center" />
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
    <el-dialog v-if="dialogAddVisible" title="添加钢材产品参数信息" class="g_form" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left">

        <el-form-item label="参数值" prop="pvalue">
          <el-input v-model="temp.pvalue" type="pvalue" maxlength="100" @change="inputAddChage" />
        </el-form-item>
        <!-- 参数名称 -->
        <el-form-item label="参数名称" prop="parName">
          <el-select v-model="temp.parName" placeholder="请选择" style="width: 370px; margin-left:0px;" :readonly="false" @change="inputAddChage">
            <el-option
              v-for="item in ops1"
              :key="item.id"
              :label="item.parName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 参数英文名 -->
        <el-form-item label="参数英文名" prop="parEName">
          <el-input
            v-model="temp.parEName"
            type="parEName"
            maxlength="50"
            :disabled="true"
            @change="inputAddChage"
          />
        </el-form-item>
        <!-- 所属产品 -->
        <el-form-item label="所属产品" prop="proName">
          <el-select
            v-model="temp.proName"
            placeholder="请选择所属产品"
            style="width: 370px; margin-left:0px;"
            @change="inputAddChage"
          >
            <el-option v-for="item in ops" :key="item.id" :label="item.name" :value="item.id" />
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
    <!--更改对话框-->
    <el-dialog v-if="dialogUpdateVisible" title="修改钢材产品参数信息" class="g_form" :visible.sync="dialogUpdateVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left">
        <el-form-item label="参数值" prop="pvalue">
          <el-input v-model="temp.pvalue" type="pvalue" maxlength="100" @change="inputEditChage" />
        </el-form-item>
        <!-- 参数名称 -->
        <el-form-item label="参数名称" prop="parName">
          <el-select v-model="temp.parName" placeholder="请选择" style="width: 370px; margin-left:0px;" :readonly="false" @change="inputEditChage">
            <el-option
              v-for="item in ops1"
              :key="item.id"
              :label="item.parName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 参数英文名 -->
        <el-form-item label="参数英文名" prop="parEName">
          <el-input
            v-model="temp.parEName"
            type="parEName"
            maxlength="50"
            :disabled="true"
            @change="inputEditChage"
          />
        </el-form-item>
        <!-- 所属产品 -->
        <el-form-item label="所属产品" prop="proName">
          <el-select v-model="temp.proName" placeholder="请选择所属产品" @change="inputEditChage">
            <el-option v-for="item in ops" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-refresh" @click="cancleYes">取消</el-button>
        <el-button type="primary" plain icon="el-icon-edit" :disabled="edit" @click="edityes()">修改</el-button>
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
      proNameSelect: undefined, // 产品名称下拉框
      ops: [],
      praName: undefined, // 参数名称搜索框
      ops1: [], // 参数名称下拉框
      page: 1,
      rows: 10,
      resultlength: 10,
      temp: {
        parName: undefined,
        pvalue: undefined,
        proName: undefined,
        parEName: undefined
      },
      add: true,
      edit: true,
      dialogAddVisible: false,
      dialogDelVisible: false,
      dialogUpdateVisible: false,
      dialogAddCancleVisible: false,
      dialogEditCancleVisible: false,
      multipleTable: [], // 更新数据数据
      rules: {
        parName: [
          { required: true, message: '参数名称不能为空' }
        ],
        proName: [
          { required: true, message: '所属产品' }
        ],
        pvalue: [
          { required: true, message: '参数值不能为空' }
        ],
        parEName: [
          { required: true, message: '参数英文值不能为空' }
        ]
      }
    }
  },
  computed: {
    wparName() {
      return this.temp.parName
    }
  },
  watch: {
    wparName: function(newValue, oldValue) {
      for (var i = 0; i < this.ops1.length; i++) {
        if (newValue === this.ops1[i].id) {
          this.temp.parEName = this.ops1[i].parEName
        }
      }
    }
  },
  created() {
    this.search()
  },
  methods: {
    inputAddChage() {
      if (
        !this.temp.parName ||
        !this.temp.pvalue ||
        !this.temp.proName ||
        !this.temp.parEName
      ) {
        this.add = true
      } else {
        this.add = false
      }
    },
    inputEditChage() {
      if (
        !this.temp.parName ||
        !this.temp.pvalue ||
        !this.temp.proName ||
        !this.temp.parEName
      ) {
        this.edit = true
      } else if (this.temp.pvalue === this.multipleTable[0].pvalue &&
        this.temp.parName === this.multipleTable[0].parId &&
        this.temp.proName === this.multipleTable[0].proId) {
        this.edit = true
      } else {
        this.edit = false
      }
    },
    search: function() {
      axios.get('/api/b02pdm/product_parameter/selectproductId').then(res => {
        this.ops = res.data.resultData
      })
      axios.get('/api/b02pdm/product_parameter/selectAllPar').then(res => {
        this.ops1 = res.data.resultData
      })
      // 表格数据填入
      axios
        .post('/api/b02pdm/product_parameter/findbycondition', this.getParam())
        .then(res => {
          this.tableData = res.data.resultData.rows
          this.resultlength = res.data.resultData.total
        })
    },
    resetTemp() {
      this.temp.parName = undefined
      this.temp.pvalue = undefined
      this.temp.proName = undefined
      this.temp.parEName = undefined
    },
    disableBuuton() {
      if (
        !this.temp.parName ||
        !this.temp.pvalue ||
        !this.temp.proName ||
        !this.temp.parEName
      ) {
        this.add = true
        // this.edit = true
      } else {
        this.add = false
        // this.edit = false
      }
      if (this.multipleTable[0]) {
        if (
          !this.temp.parName ||
        !this.temp.pvalue ||
        !this.temp.proName ||
        !this.temp.parEName
        ) {
          this.edit = true
        } else if (this.temp.pvalue === this.multipleTable[0].pvalue &&
        this.temp.parName === this.multipleTable[0].parId &&
        this.temp.proName === this.multipleTable[0].proId) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
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
        ids.id = this.multipleTable[i].id
        ids.version = this.multipleTable[i].version
        ids.modifierName = this.$store.state.userInfo.name
        ids.modifierCode = this.$store.state.userInfo.code
        data.push(ids)
      }
      axios
        .post('/api/b02pdm/product_parameter/logicaldelete', data)
        .then(res => {
          if (res.data.status === 1) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            })
            this.dialogDelVisible = false
            this.multipleTable = []
            this.search()
          } else if (res.data.msg === 'EC00002') {
            this.$notify({
              title: '错误',
              message: '后台删除出错',
              type: 'error',
              position: 'bottom-right'
            })
            this.dialogDelVisible = false
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误',
            message: '前台删除请求出错',
            type: 'error',
            position: 'bottom-right'
          })
          this.dialogDelVisible = false
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
        this.temp.id = this.multipleTable[0].id
        this.temp.version = this.multipleTable[0].version
        this.temp.pvalue = this.multipleTable[0].pvalue
        this.temp.parName = this.multipleTable[0].parId
        this.temp.proName = this.multipleTable[0].proId
        for (var i = 0; i < this.ops1.length; i++) {
          if (this.multipleTable[0].parId === this.ops1[i].parId) {
            this.temp.parEName = this.ops1[i].parEName
          }
        }
        this.disableBuuton()
        this.dialogUpdateVisible = true
      }
    },
    edityes() {
      // 向后台传输的数据
      var data = {}
      data.id = this.temp.id
      data.version = this.temp.version
      data.pvalue = this.temp.pvalue
      data.proid = this.temp.proName
      data.stpid = this.temp.parName
      data.modifierName = this.$store.state.userInfo.name
      data.modifierCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/product_parameter/update', data)
        .then(res => {
          if (res.data.status === 1) {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              position: 'bottom-right'
            })
            this.$refs['dataForm'].resetFields()
            this.resetTemp()
            this.multipleTable = []
            this.dialogUpdateVisible = false
            this.search()
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
    // 添加框事件
    handleAdd() {
      this.resetTemp()
      this.dialogAddVisible = true
      if (
        !this.temp.parName ||
        !this.temp.pvalue ||
        !this.temp.proName ||
        !this.temp.parEName
      ) {
        this.add = true
      } else {
        this.add = false
      }
    },
    // 添加事件
    addSure() {
      var data = {}
      data.proid = this.temp.proName
      data.stpid = this.temp.parName
      data.pvalue = this.temp.pvalue
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/product_parameter/insert', data)
        .then(res => {
          if (res.data.status === 1) {
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
    // 添加并继续
    addSureAgain() {
      var data = {}
      data.proid = this.temp.proName
      data.stpid = this.temp.parName
      data.pvalue = this.temp.pvalue
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/product_parameter/insert', data)
        .then(res => {
          if (res.data.status === 1) {
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
      this.dialogUpdateVisible = false
      this.dialogDelVisible = false
      this.resetTemp()
      this.search()
    },
    // 搜索框
    searchbuttonclick() {
      this.search()
    },
    // 重置搜索框
    handclearsearch() {
      this.proNameSelect = undefined
      this.praName = undefined
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
      if (!this.proNameSelect) {
        this.proNameSelect = undefined
      }
      if (!this.praName) {
        this.praName = undefined
      }
      return {
        page: this.page,
        rows: this.rows,
        id: this.proNameSelect,
        parName: this.praName
      }
    }
  }
}
</script>
