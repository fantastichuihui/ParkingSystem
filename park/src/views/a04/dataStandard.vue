<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          逻辑编码：
          <el-input v-model.trim="qlcode" prefix-icon="el-icon-search" class="g_input" clearable />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          中文值：
          <el-input v-model.trim="qcnvalue" prefix-icon="el-icon-search" class="g_input" clearable />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          编码：
          <el-select v-model="qcode" placeholder="请选择编码" class="g_select">
            <el-option v-for="item in ops" :key="item.id" :label="item.code" :value="item.code" clearable />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          排序号：
          <el-input v-model.trim="qsort" prefix-icon="el-icon-search" class="g_input" clearable />
        </el-col>
      </el-row>
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          上级编码：
          <el-input v-model.trim="qpcode" prefix-icon="el-icon-search" class="g_input" clearable />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          英文值：
          <el-input v-model.trim="qenvalue" prefix-icon="el-icon-search" class="g_input" clearable />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          状态：
          <el-select v-model="qstatus" placeholder="请选择状态" class="g_select" clearable>
            <el-option
              v-for="item in sts"
              :key="item.id"
              :label="item.statuname"
              :value="item.statucode"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="searchbuttonclick()">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handclearsearch()">重置</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd()">添加</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>
    </div>
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
      <el-table-column v-if="false" prop="id" label="逻辑主键" align="center" />
      <el-table-column prop="lCode" label="逻辑编码" align="center" />
      <el-table-column prop="pCode" label="上级编码" align="center" />
      <el-table-column prop="code" label="编码" align="center" />
      <el-table-column prop="cnValue" label="中文值" align="center" />
      <el-table-column prop="enValue" label="英文值" align="center" />
      <el-table-column v-if="false" prop="sort" label="序号" align="center" />
      <el-table-column prop="status" label="状态" align="center" />
      <el-table-column prop="remark" :show-overflow-tooltip="true" label="备注" align="center" />
      <el-table-column v-if="show" prop="version" label="版本" align="center" />
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

    <div>
      <!-- 分页控件区 -->
    </div>
    <!--删除对话框-->
    <el-dialog class="g_form" :visible.sync="dialogDelVisible" :close-on-click-modal="false">
      <div>删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelete()">确 定</el-button>
      </span>
    </el-dialog>

    <!--成功对话框-->
    <!-- <el-dialog class="g_form" :visible.sync="dialogSuccess">
      <div>操作成功!</div>
    </el-dialog> -->
    <!--失败对话框-->
    <!-- <el-dialog class="g_form" :visible.sync="dialogFaile">
      <div>操作失败!</div>
    </el-dialog> -->
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TestTable',
  data: () => {
    return {
      tableData: [],
      sts: [],
      lcode: undefined,
      pcode: undefined,
      code: undefined,
      status: undefined,
      envalue: undefined,
      cnvalue: undefined,
      sort: undefined,
      page: 1,
      rows: 10,
      resultlength: 10,
      qlcode: undefined,
      qpcode: undefined,
      qcode: undefined,
      qstatus: undefined,
      qenvalue: undefined,
      qcnvalue: undefined,
      qsort: undefined,
      ops: [],
      temp: {
        id: undefined,
        lCode: '',
        code: '',
        pCode: '',
        cnValue: '',
        enValue: '',
        sort: undefined,
        status: '',
        remark: '',
        version: ''
      },
      show: false,
      dialogStatus: '',
      dialogDelVisible: false,
      // dialogSuccess: false,
      // dialogFaile: false,
      multipleTable: [], // 更新数据数据
      // ids: [], // 批量删除id
      rules: {
        // time: [{ type: 'string', required: true, message: 'time is required', trigger: 'change' }]
      }
    }
  },
  created() {
    this.search()
  },
  methods: {
    search: function() {
      axios.get('/api/a04ds/datastandard/findcodes').then(res => {
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
      axios.get('/api/a04ds/datastandard/findstatus').then(res => {
        if (res.data.status === 1) {
          this.sts = res.data.resultData
        } else if (res.data.msg === 'EC00004') {
          this.$notify({
            title: '错误',
            message: '后台查询出错',
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
      // 表格数据填入
      axios
        .post(
          '/api/a04ds/datastandard/findbycondition',
          this.getParam()
        )
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
      var data = {}
      var list = []
      for (let i = 0; i < selectLength; i++) {
        // this.multipleTable[i].isDel = 1
        // this.ids.push(this.multipleTable[i].id)
        list.push(this.multipleTable[i].id)
      }
      data.modifierName = '张三'
      data.modifierCode = 'm001'
      data.list = list
      axios
        .post('/api/a04ds/datastandard/delete',
          data
        )
        .then(response => {
          // 数据未删除
          if (response.data.resultData === 0) {
            this.$notify({
              title: '错误',
              message: '后台删除出错',
              type: 'error',
              position: 'bottom-right'
            })
          } else if (response.data.resultData > 0) {
            // 数据删除成功
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right'
            })
            // this.ids.splice(0, this.ids.length)
            // 3秒后提示框自动关闭
            this.dialogDelVisible = false
            this.search()
          } else if (response.data.msg === 'EC00002') {
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
      this.dialogDelVisible = false
    },
    // 更新
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
        // 跳转页面
        this.$router.push({ name: 'dataStandardEdit', params: Object.assign({}, this.multipleTable[0]) })
        // this.$nextTick(() => {
        //   this.$refs['dataFormEdit'].clearValidate()
        // })
      }
    },
    // 添加事件
    handleAdd() {
      this.$router.push({ name: 'dataStandardAdd', params: Object.assign({}, this.multipleTable[0]) })
    },
    // 搜索框
    searchbuttonclick() {
      const qlcode = qlcode
      const qpcode = qpcode
      const qcode = qcode
      const qstatus = qstatus
      const qenvalue = qenvalue
      const qcnvalue = qcnvalue
      const qsort = qsort
      this.search()
    },
    // 重置搜索框
    handclearsearch() {
      this.qlcode = undefined
      this.qpcode = undefined
      this.qcode = undefined
      this.qstatus = undefined
      this.qenvalue = undefined
      this.qcnvalue = undefined
      this.qsort = undefined
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
      if (!this.qlcode) {
        this.qlcode = undefined
      }
      if (!this.qpcode) {
        this.qpcode = undefined
      }
      if (!this.qcode) {
        this.qcode = undefined
      }
      if (!this.qstatus) {
        this.qstatus = undefined
      }
      if (!this.qenvalue) {
        this.qenvalue = undefined
      }
      if (!this.qcnvalue) {
        this.qcnvalue = undefined
      }
      if (!this.qsort) {
        this.qsort = undefined
      }
      return {
        page: this.page,
        rows: this.rows,
        lCode: this.qlcode,
        pCode: this.qpcode,
        code: this.qcode,
        status: this.qstatus,
        enValue: this.qenvalue,
        cnValue: this.qcnvalue,
        sort: this.qsort
      }
    }
  }
}
</script>
