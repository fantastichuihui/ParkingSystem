<template>
  <div g_container>
    <div class="g_inputForm">
      <el-form v-model="outPlan">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="计划名称:">
              <el-input
                v-model="outPlan.name"
                placeholder="请输入资源名称"
                class="g_elFormInput"
                clearable
                @keyup.enter.native="handleSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="计划状态:">
              <el-select v-model="outPlan.status" placeholder="请选择计划状态" class="g_elFormSelect">
                <el-option v-for="item in outPlanData" :key="item.id" :label="item.value" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <!--  <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          <el-form-item label="计划开始日期：" style="width: 45%;float: left;">
            <el-date-picker
              v-model="outPlan.daterange"
              type="datetimerange"
              range-separator="---"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="计划开始时间"
              end-placeholder="计划结束时间"
            />
          </el-form-item>
        </el-col> -->

          <el-col :xs="2" :sm="4" :md="6" :lg="7" :xl="5">
            <el-form-item label="计划日期:">
              <el-date-picker v-model="outPlan.startTime" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="0.0625" :sm="0.125" :md="0.25" :lg="1" :xl="0.5">
            <el-form-item label="至" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-date-picker v-model="outPlan.endTime" placeholder="请输入内容" clearable />
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="intoPlanPallet">托盘计划</el-button>
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>

      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit">修改</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="onAddDialog">添加</el-button>
    </div>
    <el-table
      :data="tableData"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="60px" />
      <!-- 计划名称 -->
      <el-table-column label="计划名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!-- 计划状态 -->
      <el-table-column label="计划状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status ==1 ? '未执行' : row.status== 2 ? '执行中' : row.status == 3 ? '执行完毕' : '已取消' }}</span>
          <!-- <span>{{ row.status }}</span> -->
        </template>
      </el-table-column>
      <!-- 开始时间 -->
      <el-table-column label="开始时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.startTime }}</span>
        </template>
      </el-table-column>
      <!--结束时间-->
      <el-table-column label="结束时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.endTime }}</span>
        </template>
      </el-table-column>
      <!--创建时间-->
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <!--创建人-->
      <el-table-column label="创建人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserName }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;">
      <el-pagination
        :current-page.sync="outPlan.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="outPlan.rows"
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="添加" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false" @close="offAddDialog">
      <!-- 添加的表单 -->
      <el-form ref="paramList" :rules="rules" :model="paramList" label-width="100px">
        <el-form-item prop="name" label="计划名称">
          <el-input v-model="paramList.name" />
        </el-form-item>
        <el-form-item prop="status" label="计划状态">
          <el-select v-model="paramList.status" placeholder="请选择计划状态" style="width: 100%">
            <el-option v-for="item in outPlanData" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划日期" style="width: 100%;">
          <el-date-picker
            v-model="paramList.daterange"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            range-separator="---"
            start-placeholder="计划开始时间"
            end-placeholder="计划结束时间"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogAddFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAdd">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false" @close="offEditDialog">
      <!-- 修改的表单 -->
      <el-form ref="paramList" :rules="rules" :model="paramList" label-width="100px">
        <el-form-item prop="name" label="计划名称">
          <el-input v-model="paramList.name" />
        </el-form-item>
        <el-form-item prop="status" label="计划状态">
          <el-select v-model="paramList.status" placeholder="请选择计划状态" style="width: 100%">
            <el-option v-for="item in outPlanData" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划日期" style="width: 100%;">
          <el-date-picker
            v-model="paramList.daterange"
            type="datetimerange"
            range-separator="---"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="计划开始时间"
            end-placeholder="计划结束时间"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogEditFormVisible = false">取消</el-button>
          <el-button type="primary" @click="edit()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      outPlan: {
        id: '',
        name: '',
        status: '',
        startTime: '',
        endTime: '',
        page: 1,
        rows: 10,
        daterange: []
      },
      createUserCode: this.$store.state.userInfo.code,
      createUserName: this.$store.state.userInfo.name,
      modifierCode: this.$store.state.userInfo.code,
      modifierName: this.$store.state.userInfo.name,
      total: 0,
      outPlanData: [{
        id: 1,
        value: '未执行'
      },
      {
        id: 2,
        value: '执行中'
      },
      {
        id: 3,
        value: '执行完毕'
      },
      {
        id: 4,
        value: '已取消'
      }
      ],
      multipleTable: [],
      ids: [],
      tableData: [],
      rules: {},
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      paramList: {
        id: '',
        name: '',
        status: '',
        startTime: '',
        endTime: '',
        isDel: 0,
        version: 0,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        daterange: ['2019-11-14 00:00:00', '2019-11-15 00:00:00']
      }
    }
  },
  /* 向后台发送数据 */
  created() {
    this.handleSearch()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 查询
    handleSearch() {
      /*  this.outPlan.startTime = this.outPlan.daterange[0]
                this.outPlan.endTime = this.outPlan.daterange[1] */
      axios.get('/api/b04wms/outPlan/selectOutPlanByPage', {
        params: this.outPlan
      }).then((result) => {
        this.tableData = result.data.resultData.rows
        this.total = result.data.resultData.total
      })
    },
    // 重置
    handleRefresh() {
      this.outPlan = {
        name: '',
        status: '',
        startTime: '',
        endTime: '',
        page: 1,
        rows: 10
      }
      this.handleSearch()
    },
    // 开始删除
    readyDelete() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          position: 'bottom-right',
          type: 'error'
        })
      } else {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const selectLength = this.multipleTable.length
          const listmap = []
          const select = this.multipleTable
          for (let i = 0; i < selectLength; i++) {
            const obj = {
              id: select[i].id,
              version: select[i].version,
              modifierCode: this.$store.state.userInfo.code,
              modifierName: this.$store.state.userInfo.name
            }
            listmap.push(obj)
          }
          /* console.log(listmap) */
          axios.put('/api/b04wms/outPlan/deleteOutPlan', listmap).then((res) => {
            this.handleSearch()
            this.$notify({
              type: 'success',
              message: '删除成功!',
              position: 'bottom-right'
            })
          }).catch(() => {
            this.$notify({
              type: 'info',
              message: '删除失败',
              position: 'bottom-right'
            })
          })
        }).catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除',
            position: 'bottom-right'
          })
        })
      }
    },
    // 添加
    onAddDialog() {
      this.dialogAddFormVisible = true
      this.paramList = {
        id: '',
        name: '',
        status: '',
        startTime: '',
        endTime: '',
        isDel: 0,
        version: 0,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        daterange: []
      }
    },
    offAddDialog() {
      this.dialogAddFormVisible = false
    },
    handleAdd() {
      this.paramList.startTime = this.paramList.daterange[0]
      this.paramList.endTime = this.paramList.daterange[1]
      console.log(this.paramList)
      axios.post('/api/b04wms/outPlan/insertOutPlan', this.paramList).then((res) => {
        this.handleSearch()
        this.$notify({
          type: 'success',
          message: '添加成功!',
          position: 'bottom-right'
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '添加失败',
          position: 'bottom-right'
        })
      })
      this.offAddDialog()
    },
    onEditDialog() {
      this.dialogEditFormVisible = true
    },
    offEditDialog() {
      this.dialogEditFormVisible = false
    },
    // 修改
    handleEdit() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          position: 'bottom-right',
          type: 'error'
        })
      } else if (this.multipleTable.length > 1) {
        this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          position: 'bottom-right',
          type: 'error'
        })
      } else {
        this.onEditDialog()
        this.paramList = this.multipleTable[0]
        this.paramList.daterange = [this.multipleTable[0].startTime, this.multipleTable[0].endTime]
      }
    },
    edit() {
      axios.put('/api/b04wms/outPlan/updateOutPlan', this.paramList).then((res) => {
        this.handleSearch()
        this.$notify({
          type: 'success',
          message: '更新成功!',
          position: 'bottom-right'
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消删除',
          position: 'bottom-right'
        })
      })
      this.offEditDialog()
    },
    handleSizeChange: function(val) {
      this.outPlan.rows = val
      this.handleSearch()
    },
    handleCurrentChange: function(val) {
      this.outPlan.page = val
      this.handleSearch()
    },
    // 托盘计划按钮方法
    intoPlanPallet() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          position: 'bottom-right',
          type: 'error'
        })
      } else if (this.multipleTable.length > 1) {
        this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          position: 'bottom-right',
          type: 'error'
        })
      } else {
        this.$router.push({
          name: 'planPallet',
          params: {
            planId: this.multipleTable[0].id
          }
        })
      }
    }
  }
}
</script>
