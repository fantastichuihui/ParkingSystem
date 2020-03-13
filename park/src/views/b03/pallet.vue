<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          托盘名称：
          <el-input
            v-model="g_name"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          托盘状态：
          <el-select
            v-model="g_status"
            class="g_input"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ops"
              :key="item.value"
              :label="item.status"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="searchbuttonclick()">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handclearsearch()">重置</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleUphold()">能力维护</el-button>
      <!-- <br>
        <br> -->
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
      <el-table-column class="g_tableSelection" type="selection" align="center" />
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <el-table-column v-if="false" prop="id" label="逻辑主键" align="center" />
      <el-table-column prop="name" label="托盘名称" align="center" />
      <el-table-column prop="status" label="状态" align="center" />
      <el-table-column prop="maxability" label="最大能力" align="center" />
      <el-table-column prop="createTime" label="创建日期" align="center" />
      <el-table-column prop="createUserName" label="创建人" align="center" />
      <el-table-column v-if="false" prop="VERSION" label="版本" align="center" />
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
    <el-dialog v-if="dialogAddVisible" class="g_form" :visible.sync="dialogAddVisible" :close-on-click-modal="false" title="新增托盘" @close="cancel">
      <el-form ref="dataForm" :model="temp" label-position="left">
        <!-- 托盘名称 -->
        <el-form-item
          label="托盘名称"
          :rules="[{ required: true, message: '托盘名称不能为空'},]"
          prop="new_name"
        >
          <el-input v-model="temp.new_name" type="name" maxlength="64" @change="inputChage" />
        </el-form-item>
        <!-- 托盘状态 -->
        <el-form-item
          label="托盘状态"
          :rules="[{ required: true, message: '托盘状态不能为空'},]"
          prop="new_status"
        >
          <el-select v-model="temp.new_status" type="paramsteel" style="width: 100%;" @change="inputChage">
            <el-option
              v-for="items in ops"
              :key="items.value"
              :label="items.status"
              :value="items.value"
            />
          </el-select>
        </el-form-item>
        <!-- 最大能力 -->
        <el-form-item
          label="最大能力"
          :rules="[{ required: true, message: '最大能力不能为空'},]"
          prop="new_maxability"
        >
          <el-input v-model="temp.new_maxability" type="name" maxlength="64" @change="inputChage" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-minus" @click="cancel()">取消</el-button>
        <el-button type="primary" plain icon="el-icon-plus" :disabled="add" @click="addSure()">添加</el-button>
        <!-- <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          :disabled="add"
          @click="addSureAgain()"
        >添加并继续</el-button>-->
      </div>
    </el-dialog>
    <!--更改对话框-->
    <el-dialog v-if="dialogUpdateVisible" class="g_form" :visible.sync="dialogUpdateVisible" :close-on-click-modal="false" title="更新托盘" @close="cancel">
      <el-form ref="dataupdateForm" :model="temp" label-position="left">
        <!-- 托盘名称 -->
        <el-form-item
          label="托盘名称"
          :rules="[{ required: true, message: '托盘名称不能为空'},]"
          prop="update_name"
        >
          <el-input v-model="temp.update_name" type="name" maxlength="64" @change="inputChage" />
        </el-form-item>
        <!-- 托盘状态 -->
        <el-form-item
          label="托盘状态"
          :rules="[{ required: true, message: '托盘状态不能为空'},]"
          prop="update_status"
        >
          <el-select v-model="temp.update_status" type="paramsteel" style="width: 100%;" @change="inputChage">
            <el-option
              v-for="items in ops"
              :key="items.value"
              :label="items.status"
              :value="items.value"
            />
          </el-select>
        </el-form-item>

        <!-- 最大能力 -->
        <el-form-item
          label="最大能力"
          :rules="[{ required: true, message: '最大能力不能为空'},]"
          prop="update_maxability"
        >
          <el-input
            v-model="temp.update_maxability"
            type="name"
            maxlength="64"
            @change="inputChage"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          plain
          icon="el-icon-minus"
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
      ops: [{ value: 1, status: '正常' }, { value: 2, status: '受损' }],
      id: '',
      name: '',
      status: '',
      maxability: '',
      createUserName: '',
      createTime: '',
      modifierName: '',
      modifyTime: '',
      VERSION: '',
      page: 1,
      rows: 10,
      resultlength: 10,
      g_name: '',
      g_status: '',
      temp: {
        id: '',
        new_name: '',
        new_status: '',
        new_maxability: '',
        update_name: '',
        update_status: '',
        update_maxability: '',
        VERSION: ''
      },
      add: true,
      edit: true,
      dialogAddVisible: false,
      dialogDelVisible: false,
      dialogUpdateVisible: false,
      multipleTable: [], // 更新数据数据
      ids: [] // 批量删除id
    }
  },
  created() {
    this.search()
  },
  methods: {
    inputChage() {
      if (!this.temp.new_name || !this.temp.new_status || !this.temp.new_maxability) {
        this.add = true
      } else {
        this.add = false
      }
      if (this.multipleTable[0]) {
        var status = ''
        if (this.multipleTable[0].status === '正常') {
          status = 1
        } else if (this.multipleTable[0].status === '受损') {
          status = 2
        }
        if (!this.temp.update_name || !this.temp.update_status || !this.temp.update_maxability) {
          this.edit = true
        } else
        if (this.temp.update_name === this.multipleTable[0].name &&
        this.temp.update_status === status &&
        Number(this.temp.update_maxability) === this.multipleTable[0].maxability
        ) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    disableBuuton() {
      if (!this.temp.new_name || !this.temp.new_status || !this.temp.new_maxability) {
        this.add = true
      } else {
        this.add = false
      }

      if (this.multipleTable[0]) {
        var status = ''
        if (this.multipleTable[0].status === '正常') {
          status = 1
        } else if (this.multipleTable[0].status === '受损') {
          status = 2
        }
        if (!this.temp.update_name || !this.temp.update_status || !this.temp.update_maxability) {
          this.edit = true
        } else
        if (this.temp.update_name === this.multipleTable[0].name &&
        this.temp.update_status === status &&
        Number(this.temp.update_maxability) === this.multipleTable[0].maxability
        ) {
          this.edit = true
        } else {
          this.edit = false
        }
      }
    },
    search: function() {
      axios
        .get('/api/b03res/pallet/search', { params: this.getParam() })
        .then(res => {
          var datalist = res.data.resultData.datalist
          datalist.forEach(element => {
            if (element.status === 1) {
              element.status = '正常'
            } else if (element.status === 2) {
              element.status = '受损'
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
        return
      }
      const selectLength = this.multipleTable.length
      var datalist = []
      for (let i = 0; i < selectLength; i++) {
        var ids = {}
        this.multipleTable[i].isDel = 1
        ids.id = this.multipleTable[i].id
        ids.VERSION = this.multipleTable[i].VERSION
        datalist.push(ids)
      }
      var data = {
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        list: datalist
      }
      axios
        .put('/api/b03res/pallet/delete', data)
        .then(response => {
          if (response.data.status === 1) {
            this.$notify({
              title: '提示信息',
              message: '操作成功',
              type: 'success',
              position: 'bottom-right'
            })
            // this.data.splice(0, this.data.length);
            this.page = 1
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
        this.temp.VERSION = this.addTemp.VERSION
        this.temp.id = this.addTemp.id
        this.temp.update_name = this.addTemp.name
        if (this.addTemp.status === '正常') {
          this.temp.update_status = 1
        } else if (this.addTemp.status === '受损') {
          this.temp.update_status = 2
        }
        // this.temp.update_status = this.addTemp.status
        this.temp.update_maxability = this.addTemp.maxability
        this.disableBuuton()
        this.dialogUpdateVisible = true
      }
    },
    edityes() {
      // 向后台传输的数据
      var data = {}
      data.id = this.temp.id
      data.VERSION = this.temp.VERSION
      data.name = this.temp.update_name
      data.status = this.temp.update_status
      data.maxability = this.temp.update_maxability
      // if (data.status === '正常') {
      //   data.status = 1
      // } else if (data.status === '受损') {
      //   data.status = 2
      // }
      data.modifierCode = this.$store.state.userInfo.code
      data.modifierName = this.$store.state.userInfo.name
      axios
        .put('/api/b03res/pallet/update', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.msg === 'EC00003') {
            this.$notify({
              title: '错误信息',
              message: '更新失败',
              type: 'error',
              position: 'bottom-right'
            })
          } else if (response.data.status === 1) {
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
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误信息',
            message: '更新失败',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    // 添加框事件
    handleAdd() {
      this.dialogAddVisible = true
      this.temp.new_maxability = ''
      this.temp.new_name = ''
      this.temp.new_status = ''
    },
    // 添加事件
    addSure() {
      var data = {}
      data.name = this.temp.new_name
      data.status = this.temp.new_status
      data.maxability = this.temp.new_maxability
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      data.modifierCode = this.$store.state.userInfo.code
      data.modifierName = this.$store.state.userInfo.name
      axios
        .post('/api/b03res/pallet/add', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.msg === 'EC00001') {
            this.$notify({
              title: '错误信息',
              message: '添加失败',
              type: 'error',
              position: 'bottom-right'
            })
          } else if (response.data.status === 1) {
            this.$notify({
              title: '提示信息',
              message: '操作成功',
              type: 'success',
              position: 'bottom-right'
            })
            setTimeout(() => {
              this.dialogAddVisible = false
              this.temp.new_name = ''
              this.temp.new_status = ''
              this.temp.new_maxability = ''
            }, 1000)
            this.search()
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误信息',
            message: '添加失败',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    // 添加并继续
    addSureAgain() {
      var data = {}
      data.name = this.temp.new_name
      data.status = this.temp.new_status
      data.maxability = this.temp.new_maxability
      data.createUserName = this.$store.state.userInfo.name
      data.createUserCode = this.$store.state.userInfo.code
      axios
        .post('/api/b02pdm/steelgrade/insert', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.msg === 'EC00001') {
            this.$notify({
              title: '错误信息',
              message: '添加失败',
              type: 'error',
              position: 'bottom-right'
            })
          } else if (response.data.status === 1) {
            this.$notify({
              title: '提示信息',
              message: '操作成功',
              type: 'success',
              position: 'bottom-right'
            })
            setTimeout(() => {
              // 清空表单
              this.temp.new_name = ''
              this.temp.new_status = ''
              this.temp.new_maxability = ''
              this.search()
            }, 1000)
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误信息',
            message: '添加失败',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    cancel() {
      this.dialogUpdateVisible = false
      this.dialogAddVisible = false
      this.temp.new_name = ''
      this.temp.new_status = ''
      this.temp.update_name = ''
      this.temp.new_maxability = ''
      this.temp.update_maxability = ''
      this.temp.update_status = ''
      this.disableBuuton()
      this.search()
    },
    // 搜索框
    searchbuttonclick() {
      const g_name = g_name
      this.search()
    },
    // 重置搜索框
    handclearsearch() {
      this.g_name = ''
      this.g_status = ''
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
    handleUphold: function() {
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
          message: '至少选择一条数据进行能力维护',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$router.push({
          name: 'adbility',
          params: Object.assign({}, this.multipleTable[0])
        })
      }
    },
    getParam: function() {
      return {
        page: this.page,
        rows: this.rows,
        name: this.g_name,
        status: this.g_status
      }
    }
  }
}
</script>
