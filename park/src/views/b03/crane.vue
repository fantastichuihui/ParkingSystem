<template>
  <div>
    <div class="g_inputForm">
      园区名称：
      <el-select v-model="g_p_name" placeholder="请选择">
        <el-option v-for="item in ops" :key="item" :label="item" :value="item" />
      </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      库房名称：
      <el-select v-model="g_s_name" placeholder="请选择">
        <el-option v-for="item in ops1" :key="item" :label="item" :value="item" />
      </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <br>
      <br>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="searchbuttonclick()">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handclearsearch()">重置</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">管理</el-button>
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
      <el-table-column class="g_tableSelection" type="selection" width="60px" />
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <el-table-column v-if="false" prop="id" label="逻辑主键" align="center" />
      <el-table-column prop="p_name" label="园区名称" align="center" />
      <el-table-column prop="s_name" label="库房名称" align="center" />
      <el-table-column prop="s_code" label="库房编码" align="center" />
      <el-table-column prop="a_number" label="作业区号" align="center" />
      <el-table-column prop="number" label="天吊编码" align="center" />
      <el-table-column prop="state" label="使用状态" align="center" />
      <el-table-column v-if="false" prop="s_id" label="库房ID" align="center" />
      <el-table-column
        v-if="false"
        prop="s_chargeName"
        label="负责人姓名"
        width="300px"
        align="center"
      />
      <el-table-column v-if="false" prop="p_id" label="园区ID" width="300px" align="center" />
      <el-table-column v-if="false" prop="p_province" label="省份" width="300px" align="center" />
      <el-table-column v-if="false" prop="p_city" label="所在城市" width="300px" align="center" />
      <el-table-column
        v-if="false"
        prop="p_concateName"
        label="联系人姓名"
        width="300px"
        align="center"
      />
      <el-table-column
        v-if="false"
        prop="p_concatePhone"
        label="联系电话"
        width="300px"
        align="center"
      />
      <el-table-column v-if="false" prop="version" label="版本" width="300px" align="center" />
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
  name: 'AreaTable',
  data: () => {
    return {
      tableData: [],
      ops: [],
      ops1: [],
      id: '',
      p_name: '',
      s_name: '',
      s_code: '',
      a_number: '',
      number: '',
      state: '',
      s_id: '',
      s_chargeName: '',
      p_id: '',
      p_province: '',
      p_city: '',
      p_concateName: '',
      p_concatePhone: '',
      version: '',
      page: 1,
      rows: 10,
      resultlength: 10,
      g_p_name: '',
      g_s_name: '',
      dialogDelVisible: false,
      multipleTable: [], // 更新数据数据
      ids: [] // 批量删除id
    }
  },
  created() {
    this.search()
    axios.get('/api/b03res/area/getAllParkAndRoom').then(res => {
      this.ops = res.data.resultData.allParks
      this.ops1 = res.data.resultData.allRooms
    })
  },
  methods: {
    search: function() {
      axios
        .get('/api/b03res/crane/search', { params: this.getParam() })
        .then(res => {
          var datalist = res.data.resultData.datalist
          datalist.forEach(element => {
            if (element.state === 1) {
              element.state = '正常'
            } else if (element === 2) {
              element.state = '维修'
            } else {
              element.state = '锁定'
            }
          })
          this.tableData = datalist
          this.resultlength = res.data.resultData.total
        })
    },
    // 获取表格选中值
    handleSelectionChange(val) {
      this.multipleTable = val
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
      var datalist = []
      for (let i = 0; i < selectLength; i++) {
        var ids = {}
        this.multipleTable[i].isDel = 1
        ids.id = this.multipleTable[i].id
        ids.version = this.multipleTable[i].version
        datalist.push(ids)
      }
      var data = {
        modifierName: this.$store.state.userInfo.code,
        modifierCode: this.$store.state.userInfo.name,
        list: datalist
      }
      axios
        .put('/api/b03res/crane/delete', data)
        .then(response => {
          if (response.data.status === 1) {
            this.$notify({
              title: '提示信息',
              message: '操作成功',
              type: 'success',
              position: 'bottom-right'
            })
            // this.data.splice(0, this.data.length);
            this.search()
          } else if (response.data.msg === 'EC00002') {
            this.$notify({
              title: '错误信息',
              message: '删除失败',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误信息',
            message: '删除失败',
            type: 'error',
            position: 'bottom-right'
          })
        })
      this.dialogDelVisible = false
    },
    // 修改
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
      } else {
        // 跳转页面
        this.$router.push({
          name: 'editCrane',
          params: Object.assign({}, this.multipleTable[0])
        })
      }
    },
    // 搜索框
    searchbuttonclick() {
      this.search()
    },
    // 重置搜索框
    handclearsearch() {
      this.g_p_name = ''
      this.g_s_name = ''
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
        p_name: this.g_p_name,
        s_name: this.g_s_name
      }
    }
  }
}
</script>
