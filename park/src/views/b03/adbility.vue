<template>
  <div>
    <div class="g_button">
      <br>
      <br>
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
      <el-table-column type="selection" width="50px" />
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <el-table-column v-if="false" prop="id" label="逻辑主键" width="10px" align="center" />
      <el-table-column prop="p_name" label="托盘名称" align="center" />
      <el-table-column prop="t_name" label="品类" align="center" />
      <el-table-column prop="ability" label="能力值" align="center" />
      <el-table-column prop="unit" label="能力单位" align="center" />
      <el-table-column prop="createTime" label="创建日期" align="center" />
      <el-table-column prop="createUserName" label="创建人" align="center" />/>
      <el-table-column v-if="false" prop="VERSION" label="版本" width="300px" align="center" />
    </el-table>

    <el-dialog v-if="dialogAddVisible" class="g_form" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="temp" label-position="left">
        <!-- 托盘 -->
        <el-form-item
          label="托盘"
          prop="p_name"
        >
          <el-input v-model="temp.p_name" type="paramsteel" maxlength="64" :disabled="true" />
        </el-form-item>
        <el-form-item label="品类" :rules="[{ required: true, message: '品类不能为空'},]" prop="t_id">
          <el-select v-model="temp.t_id" type="paramsteel" style="width: 100%;" :disabled="editdis">
            <el-option
              v-for="(items,index) in types"
              :key="index"
              :label="items.name"
              :value="items.id"
            />
          </el-select>
        </el-form-item>

        <!-- 能力值 -->
        <el-form-item
          label="能力值"
          :rules="[{ required: true, message: '能力值不能为空'},]"
          prop="ability"
        >
          <el-input v-model="temp.ability" type="name" maxlength="64" />
        </el-form-item>

        <el-form-item label="能力单位" :rules="[{ required: true, message: '能力单位不能为空'},]" prop="unit">
          <el-input v-model="temp.unit" type="name" maxlength="64" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-minus" @click="cancel()">取消</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          @click="addSure()"
        >{{ edit==false?"添加":"修改" }}</el-button>
      </div>
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
      data: {},
      temp: {
        id: '',
        p_name: '',
        p_id: '',
        t_id: '',
        ability: '',
        unit: '',
        VERSION: ''
      },
      dialogUpdateVisible: false,
      pallets: [],
      types: [],
      //   ops: [{ value: 1, status: "正常" }, { value: 2, status: "受损" }],
      //   id: '',
      //   name: '',
      //   status: '',
      //   createUserName: '',
      //   createTime: '',
      //   modifierName: '',
      //   modifyTime: '',
      //   VERSION: '',
      //   page: 1,
      //   rows: 10,
      //   resultlength: 10,
      //   g_name: '',
      //   g_status: '',
      //   temp: {
      //     id: '',
      //     new_name: '',
      //     new_status: '',
      //     update_name: '',
      //     update_status: '',
      //     VERSION: ''
      //   },
      editdis: false,
      flag: false,
      edit: false,
      dialogAddVisible: false,
      dialogDelVisible: false,
      multipleTable: [], // 更新数据数据
      ids: [] // 批量删除id
    }
  },
  created() {
    var data = Object.assign({}, this.$route.params)
    if (JSON.stringify(data) === '{}' || data === '') {
      this.flag = true
    } else {
      this.data = data
    }
    this.temp.p_name = this.data.name
    this.temp.p_id = this.data.id
    this.search()
    this.init()
  },
  methods: {
    // info: function() {
    //   if (this.flag) {
    //     this.$notify({
    //       title: "警告信息",
    //       message: "请先选择托盘!",
    //       type: "warning",
    //       position: "bottom-right"
    //     });
    //   }
    // },
    search() {
      axios
        .get('/api/b03res/palletAbility/search', { params: this.data })
        .then(res => {
          this.tableData = res.data.resultData.datalist
        })
    },
    back() {
      this.$router.push({
        name: 'pallet'
        // params: Object.assign({}, this.multipleTable[0])
      })
    },
    init: function() {
      axios.get('/api/b03res/palletAbility/getAllPalletAndType').then(res => {
        this.pallets = res.data.resultData.allPallet
        this.types = res.data.resultData.allType
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
        return
      } else {
        this.handleDelete()
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
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        list: datalist
      }
      axios
        .put('/api/b03res/palletAbility/delete', data)
        .then(response => {
          if (response.data.status === 1) {
            this.$notify({
              title: '提示信息',
              message: '操作成功',
              type: 'success',
              position: 'bottom-right'
            })
            this.dialogAddVisible = false
            this.search()

            // this.data.splice(0, this.data.length);
            // this.search();
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
        this.edit = true
        this.editdis = true
        this.clear()
        var addTemp = Object.assign({}, this.multipleTable[0])
        this.temp.version = addTemp.version
        this.temp.id = addTemp.id
        this.temp.p_id = addTemp.p_id
        this.temp.t_id = addTemp.t_id
        this.temp.ability = addTemp.ability
        this.temp.unit = addTemp.unit
        this.temp.VERSION = addTemp.version
        this.dialogAddVisible = true
      }
    },
    clear() {
      this.temp.id = ''
      this.temp.p_id = ''
      this.temp.t_id = ''
      this.temp.ability = ''
      this.temp.unit = ''
      this.temp.VERSION = ''
    },
    edityes() {},
    // 添加框事件
    handleAdd() {
      this.edit = false
      this.dialogAddVisible = true
    },
    // 添加事件
    addSure() {
      if (this.edit) {
        var data = {}
        data.id = this.temp.id
        data.palletId = this.temp.p_id
        data.categoryId = this.temp.t_id
        data.ability = this.temp.ability
        data.unit = this.temp.unit
        data.modifierCode = this.$store.state.userInfo.code
        data.modifierName = this.$store.state.userInfo.name
        data.version = this.temp.VERSION
        axios
          .put('/api/b03res/palletAbility/update', data)
          .then(response => {
            // 返回值为0后台操作未成功
            if (response.data.msg === 'EC00003') {
              this.$notify({
                title: '错误信息',
                message: '修改失败',
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
                // this.$refs["dataForm"].resetFields();
                this.clear()
                if (this.flag) {
                  this.back()
                }
                this.edit = false
                this.search()
              }, 1000)
              // this.search();
            }
          })
          .catch(() => {
            this.$notify({
              title: '错误信息',
              message: '修改失败',
              type: 'error',
              position: 'bottom-right'
            })
          })
      } else {
        let j = false
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.temp.t_id === this.tableData[i].t_id) {
            j = true
          }
        }
        if (j === true) {
          this.$notify({
            title: '警告信息',
            message: '品类不能重复添加',
            type: 'warning',
            position: 'bottom-right'
          })
          return
        }
        var data2 = {}
        data2.palletId = this.temp.p_id
        data2.categoryId = this.temp.t_id
        data2.ability = this.temp.ability
        data2.unit = this.temp.unit
        data2.createUserName = this.$store.state.userInfo.name
        data2.createUserCode = this.$store.state.userInfo.code
        data2.modifierCode = this.$store.state.userInfo.code
        data2.modifierName = this.$store.state.userInfo.name
        axios
          .post('/api/b03res/palletAbility/add', data2)
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
                this.edit = false
                this.clear()
                if (this.flag) {
                  this.back()
                }
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
      }
    },
    cancel() {
      this.dialogAddVisible = false
      this.clear()
      this.edit = false
      this.editdis = false
      this.search()
    }
  }
}
</script>
