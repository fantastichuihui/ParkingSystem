<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          编码：
          <el-input v-model.trim="qcode" prefix-icon="el-icon-search" class="g_input" />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          名称：
          <el-input v-model.trim="qname" prefix-icon="el-icon-search" class="g_input" />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          值：
          <el-input v-model.trim="qvalue" prefix-icon="el-icon-search" class="g_input" />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          状态：
          <el-select v-model="qstatus" placeholder="请选择状态" class="g_select">
            <el-option
              v-for="item in sts"
              :key="item.id"
              :label="item.statuname"
              :value="item.statucode"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          说明：
          <el-input v-model.trim="qdescription" prefix-icon="el-icon-search" class="g_input" />
        </el-col>
      </el-row>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="searchbuttonclick()">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="clearqueryform()">重置</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd()">添加</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%; "
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50px" />
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <el-table-column v-if="false" prop="id" label="逻辑主键" align="center" />
      <el-table-column prop="code" label="编码" align="center" />
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="value" label="值" align="center" />
      <el-table-column prop="status" label="状态" align="center" />
      <el-table-column prop="description" label="说明" align="center" />
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
      code: undefined,
      name: undefined,
      value: undefined,
      status: undefined,
      description: undefined,
      remark: undefined,
      page: 1,
      rows: 10,
      resultlength: 10,
      qcode: undefined,
      qname: undefined,
      qvalue: undefined,
      qstatus: undefined,
      qdescription: undefined,
      show: false,
      dialogStatus: '',
      dialogDelVisible: false,
      // dialogSuccess: false,
      // dialogFaile: false,
      multipleTable: [] // 更新数据数据
      // ids: [] // 批量删除id
    }
  },
  created() {
    this.search()
  },
  methods: {
    clearqueryform: function() {
      this.qcode = undefined
      this.qname = undefined
      this.qvalue = undefined
      this.qstatus = undefined
      this.qdescription = undefined
      this.search()
      return {}
    },
    search: function() {
      // 状下拉框数据填入
      axios.get('/api/a04ds/systemparam/findstatus').then(res => {
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
        .post('/api/a04ds/systemparam/findbycondition', this.getParam())
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
    getParam: function() {
      if (!this.qcode) {
        this.qcode = undefined
      }
      if (!this.qname) {
        this.qname = undefined
      }
      if (!this.qvalue) {
        this.qvalue = undefined
      }
      if (!this.qstatus) {
        this.qstatus = undefined
      }
      if (!this.qdescription) {
        this.qdescription = undefined
      }
      return {
        page: this.page,
        rows: this.rows,
        code: this.qcode,
        name: this.qname,
        value: this.qvalue,
        status: this.qstatus,
        description: this.qdescription
      }
    },
    // 获取表格选中值
    handleSelectionChange(val) {
      this.multipleTable = val
      // console.log(this.multipleTable)
    },
    handleSizeChange: function(size) {
      this.rows = size
      this.search()
    },
    handleCurrentChange: function(page) {
      this.page = page
      this.search()
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
        var map = {}
        map.id = this.multipleTable[i].id
        map.version = this.multipleTable[i].version
        list.push(map)
      }
      data.modifierName = '张三'
      data.modifierCode = 'm001'
      data.list = list
      axios
        .post('/api/a04ds/systemparam/logicaldelete',
          data
        )
        .then(response => {
          // 后台无异常，请求成功
          if (response.data.status === 1) {
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
            }
          } else if (response.data.msg === 'EC00002') {
            // 后台出现异常
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
        this.$router.push({
          name: 'systemParameterEdit',
          params: Object.assign({}, this.multipleTable[0])
        })
      }
    },
    searchbuttonclick: function() {
      const qcode = qcode
      const qname = qname
      const qvalue = qvalue
      const qstatus = qstatus
      const qdescription = qdescription
      this.search()
    },
    handleAdd: function() {
      this.$router.push({
        name: 'systemParameterAdd'
      })
    }
  }
}
</script>
