<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form v-model="exeOrder" class="exeOrder_form">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="配送单位：" prop="deliveryId">
              <el-select
                v-model.trim="exeOrder.deliveryId"
                placeholder="请选择单位名称"
                class="g_elFormSelect"
                clearable
              >
                <el-option
                  v-for="item in deliveryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="7" :xl="6">
            <el-form-item label="计划配送日期：" prop="planStartTime1">
              <el-date-picker
                v-model.trim="exeOrder.planStartTime1"
                align="right"
                type="datetime"
                placeholder="选择日期"
                style="width:60%;"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :picker-options="startTime"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="0.0625" :sm="0.125" :md="0.25" :lg="1" :xl="0.5">
            <el-form-item label="至" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item prop="planStartTime2">
              <el-date-picker
                v-model.trim="exeOrder.planStartTime2"
                align="right"
                type="datetime"
                placeholder="选择日期"
                style="width:60%;"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :picker-options="endTime"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="5">
            <el-form-item label="配送类型：" prop="delType">
              <el-select
                v-model.trim="exeOrder.delType"
                placeholder="请选择配送类型"
                style="width:60%;"
                clearable
              >
                <el-option
                  v-for="item in delTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="执行单号：" prop="execOrderNo">
              <el-input
                v-model.trim="exeOrder.execOrderNo"
                placeholder="请输入内容"
                class="g_elFormInput"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog title="分配配送单位对话框" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="30%" top="10%">
      <el-form ref="exeOrderDialog" :model="exeOrderDialog" label-width="120px" required="required">
        <el-form-item label="配送单位：" prop="deliveryId">
          <el-select
            v-model.trim="exeOrderDialog.deliveryId"
            style="width: 80%;"
            placeholder="请选择单位名称"
            clearable
            @change="inputChange"
          >
            <el-option
              v-for="item in deliveryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAssign">取 消</el-button>
        <el-button type="primary" :disabled="assign" @click="add('exeOrderDialog')">确 定</el-button>
      </div>
    </el-dialog>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
      <el-button v-show="isShow" type="primary" plain icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button v-show="isShow" type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>
      <el-button v-show="isShow" type="primary" plain icon="el-icon-circle-plus-outline" @click="handleSend()">下发</el-button>
      <el-button v-show="isShow" type="primary" plain icon="el-icon-tickets" @click="handleAssign()">分配</el-button>
      <el-button v-show="isShow" type="primary" plain icon="el-icon-remove-outline" @click="handleWithdraw()">撤回</el-button>
      <el-button type="primary" plain icon="el-icon-view" @click="handleDetail()">详情</el-button>
      <el-button v-show="isShow" type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
    </div>
    <el-table
      :data="tableData"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 勾选框 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="60px" />
      <!-- 执行单ID -->
      <el-table-column v-if="show" label="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 配送单位 -->
      <el-table-column label="配送单位" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deliveryName }}</span>
        </template>
      </el-table-column>
      <!-- 执行单号 -->
      <el-table-column label="执行单号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.execOrderNo }}</span>
        </template>
      </el-table-column>
      <!-- 配送ID -->
      <el-table-column v-if="show" label="配送ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deliveryId }}</span>
        </template>
      </el-table-column>
      <!-- 计划开始执行时间 -->
      <el-table-column label="计划开始执行时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.planStartTime }}</span>
        </template>
      </el-table-column>
      <!-- 计划结束执行时间 -->
      <el-table-column label="计划结束执行时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.planFinishTime }}</span>
        </template>
      </el-table-column>
      <!-- 实际开始执行时间 -->
      <el-table-column label="实际开始执行时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.actStartTime }}</span>
        </template>
      </el-table-column>
      <!-- 实际结束执行时间 -->
      <el-table-column label="实际结束执行时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.actFinishTime }}</span>
        </template>
      </el-table-column>
      <!-- 下发状态 -->
      <el-table-column label="下发状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sendState === 1?'已下发':'未下发' }}</span>
        </template>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <!-- 配送类型 -->
      <el-table-column label="配送类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.delType === 1?'配送':'自提' }}</span>
        </template>
      </el-table-column>
      <!-- 联系人姓名 -->
      <el-table-column label="联系人姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.contactsName }}</span>
        </template>
      </el-table-column>
      <!-- 联系电话 -->
      <el-table-column label="联系电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.contactsPhone }}</span>
        </template>
      </el-table-column>
      <!-- 更改人编码 -->
      <el-table-column v-if="show" label="更改人编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifierCode }}</span>
        </template>
      </el-table-column>
      <!-- 更改人姓名 -->
      <el-table-column v-if="show" label="更改人姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifierName }}</span>
        </template>
      </el-table-column>
      <!-- 更改时间 -->
      <el-table-column v-if="show" label="更改时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifyTime }}</span>
        </template>
      </el-table-column>
      <!-- 创建人编码 -->
      <el-table-column v-if="show" label="创建人编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserCode }}</span>
        </template>
      </el-table-column>
      <!-- 创建人名称 -->
      <el-table-column v-if="show" label="创建人名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserName }}</span>
        </template>
      </el-table-column>
      <!-- 创建时间 -->
      <el-table-column v-if="show" label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <!-- 乐观锁 -->
      <el-table-column v-if="show" label="乐观锁" align="center">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <!-- 是否删除 -->
      <el-table-column v-if="show" label="是否删除" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isDel }}</span>
        </template>
      </el-table-column>
      <!-- 是否完成 -->
      <el-table-column label="是否完成" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isFinish === 1?'已完成':'未完成' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="g_pagination">
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
</template>

<script>
import axios from 'axios'
export default {
  name: 'TestTable',
  data() {
    return {
      // 分配配送对话框默认关闭
      dialogFormVisible: false,
      // 分配配送对话框的输入框
      exeOrderDialog: {
        deliveryId: ''
      },
      // 条件查询输入框
      exeOrder: {
        deliveryId: '',
        delType: '',
        execOrderNo: '',
        planStartTime1: '',
        planStartTime2: ''
      },
      // 计划开始时间1限制
      startTime: {
        disabledDate: time => {
          if (this.endtime) {
            return (
              time.getTime() < new Date(this.endtime).getTime()
            )
          } else {
            return time.getTime() < Date.now() - 3600 * 1000 * 24 * 7
          }
        }
      },
      // 计划开始时间2限制
      endTime: {
        disabledDate: time => {
          if (this.exeOrder.planStartTime1) {
            return (
              time.getTime() < Date.now() - 3600 * 1000 * 24 * 7 ||
              time.getTime() < new Date(this.exeOrder.planStartTime1).getTime()
            )
          } else {
            return time.getTime() < Date.now() - 3600 * 1000 * 24 * 7
          }
        }
      },
      // 分配对话框初始状态为禁用
      assign: true,
      // 配送单位列表
      deliveryOptions: [],
      // 配送类型列表
      delTypeOptions: [{
        value: '1',
        label: '配送'
      }, {
        value: '0',
        label: '自提'
      }],
      // 表格部分属性默认不显示
      show: false,
      // 按钮初始状态默认不显示
      isShow: true,
      // 当前页
      currentPage: 1,
      total: 10,
      // 每页条数
      pageSize: 10,
      // 表格数据源
      tableData: [],
      // 勾选行数据
      multipleTable: [],
      // 抓到的后台错误编码
      EC00001: '执行单表查询出错（后台错误）！',
      EC00002: '执行单表删除出错（后台错误）！',
      EC00003: '执行单修改出错（后台错误）！',
      EC00004: '执行单添加出错（后台错误）！',
      EC00005: '执行单查询执行单id和执行单号（后台错误）！',
      EC00006: '执行单撤回出错（后台错误）！',
      EC00007: '执行单分配出错（后台错误）！',
      EC00008: '执行单查询物料号出错（后台错误）！',
      EC00009: '执行单查询是否存在对应的配车id出错（后台错误）！',
      EC000010: '执行单查询对应的配车id数量出错（后台错误）！',
      // 错误消息
      msg: ''
    }
  },
  created() {
    this.search()
    this.control()
    this.findDeliveryName()
  },
  methods: {
    // 管理员分页按条件查询数据
    getParamMap: function() {
      return {
        page: this.currentPage,
        rows: this.pageSize,
        createUserCode: this.$store.state.userInfo.code,
        deliveryId: this.exeOrder.deliveryId,
        delType: this.exeOrder.delType,
        execOrderNo: this.exeOrder.execOrderNo,
        planStartTime1: this.exeOrder.planStartTime1,
        planStartTime2: this.exeOrder.planStartTime2
      }
    },
    // 订货单位分页按条件查询数据
    getParamByCustomer: function() {
      return {
        page: this.currentPage,
        rows: this.pageSize,
        createUserCode: this.$store.state.userInfo.code,
        deliveryId: this.exeOrder.deliveryId,
        delType: this.exeOrder.delType,
        execOrderNo: this.exeOrder.execOrderNo,
        planStartTime1: this.exeOrder.planStartTime1,
        planStartTime2: this.exeOrder.planStartTime2,
        orgCode: this.$store.state.userInfo.orgCode
      }
    },
    // 配送单位分页按条件查询数据
    getParamByDelivery: function() {
      return {
        page: this.currentPage,
        rows: this.pageSize,
        deliveryId: this.exeOrder.deliveryId,
        delType: this.exeOrder.delType,
        execOrderNo: this.exeOrder.execOrderNo,
        planStartTime1: this.exeOrder.planStartTime1,
        planStartTime2: this.exeOrder.planStartTime2,
        orgCode: this.$store.state.userInfo.orgCode
      }
    },
    // 切换每页条数
    handleSizeChange: function(val) {
      this.pageSize = val
      this.search()
    },
    // 切换页面
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.search()
    },
    // 获取勾选list
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 根据当前登陆人控制按钮是否显示
    control: function() {
      const orgCode = this.$store.state.userInfo.orgCode
      // console.log(this.$store.state.userInfo.orgCode)
      if (orgCode === '6') {
        // 配送单位不可显示
        this.isShow = false
      } else {
        // 管理员或者订货单位按钮可显示
        this.isShow = true
      }
    },

    // 查询执行单表格数据
    search: function() {
      // const orgCode = this.$store.state.userInfo.orgCode
      const roleId = this.$store.state.roleInfo.id
      console.log(this.$store.state)
      // 管理员
      if (roleId === 6 || roleId === 1) {
        axios.get('/api/b05lms/ExecutionOrder/selectAllExecutionOrder',
          { params: this.getParamMap() }).then((response) => {
          if (response.data.status === 1) {
            this.tableData = response.data.resultData.rows // 用list接收这个数据
            this.total = response.data.resultData.total
          } else {
            this.tableData = response.data.resultData
            this.msg = response.data.msg
            if (this.msg === 'EC00001') {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                title: '错误信息',
                message: this.EC00001,
                type: 'error',
                position: 'bottom-right'
              })
            }
          }
        })
      } else if (roleId === 4) {
        // 当前登录为客户
        axios.get('/api/b05lms/ExecutionOrder/selectAllOrderByCustomer',
          { params: this.getParamByCustomer() }).then((response) => {
          if (response.data.status === 1) {
            this.tableData = response.data.resultData.rows // 用list接收这个数据
            this.total = response.data.resultData.total
          } else {
            this.tableData = response.data.resultData
            this.msg = response.data.msg
            if (this.msg === 'EC00001') {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                title: '错误信息',
                message: this.EC00001,
                type: 'error',
                position: 'bottom-right'
              })
            }
          }
        })
      } else if (roleId === 5) {
        // 当前登录为配送单位
        axios.get('/api/b05lms/ExecutionOrder/selectAllOrderByDelivery',
          { params: this.getParamByDelivery() }).then((response) => {
          if (response.data.status === 1) {
            this.tableData = response.data.resultData.rows // 用list接收这个数据
            this.total = response.data.resultData.total
          } else {
            this.tableData = response.data.resultData
            this.msg = response.data.msg
            if (this.msg === 'EC00001') {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                title: '错误信息',
                message: this.EC00001,
                type: 'error',
                position: 'bottom-right'
              })
            }
          }
        })
      }
    },
    // 查询配送单位名称
    findDeliveryName: function() {
      axios.get('/api/b05lms/deliverycompany/findAllDeliveryCompany').then((response) => {
        if (response.data.status === 1) {
          this.deliveryOptions = response.data.resultData
        } else {
          this.tableData = response.data.resultData
          this.msg = response.data.msg
          if (this.msg === 'EC00005') {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: this.EC00005,
              type: 'error',
              position: 'bottom-right'
            })
          }
        }
      })
    },
    // 重置查询框
    handleRefresh: function() {
      this.exeOrder = {}
      this.search()
    },
    // 点击查询按钮查询数据
    handleFilter: function() {
      this.search()
    },
    // 添加
    handleAdd: function() {
      this.$router.push('executionOrderAdd')
    },
    // 逻辑删除执行单信息
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
        this.$confirm('此操作将永久删除该批数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const selectLength = this.multipleTable.length
          const listmap = []
          const select = this.multipleTable
          let sorts = ''
          let sends = ''
          let finishs = ''
          for (let i = 0; i < selectLength; i++) {
            const ids = {}
            if (select[i].isFinish === 1) { // 判断执行单是否已完成
              if (finishs === '') {
                finishs += this.tableData.indexOf(select[i]) + 1
              } else {
                finishs += ',' + (this.tableData.indexOf(select[i]) + 1)
              }
            } else if (select[i].deliveryId != null) { // 判断deliveryId是否为空，不为空表示已分配配送单位
              if (sorts === '') {
                sorts += this.tableData.indexOf(select[i]) + 1
              } else {
                sorts += ',' + (this.tableData.indexOf(select[i]) + 1)
              }
            } else if (select[i].sendState === 1) { // 判断执行单是否已下发
              if (sends === '') {
                sends += this.tableData.indexOf(select[i]) + 1
              } else {
                sends += ',' + (this.tableData.indexOf(select[i]) + 1)
              }
            } else {
              ids.id = select[i].id
              listmap[i] = ids
            }
          }
          if (finishs) { // 如果勾选行都未完成，则可以弹出对话框，否则显示错误提示
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: '序号为' + finishs + '执行单已完成,不可操作！',
              type: 'error',
              position: 'bottom-right'
            })
          } else if (sorts) { // 如果勾选行都未分配配送单位，则可以弹出对话框，否则显示错误提示
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: '序号为' + sorts + '执行单已经分配配送单位,不允许删除！',
              type: 'error',
              position: 'bottom-right'
            })
          } else if (sends) { // 如果勾选行都未下发，则可以弹出对话框，否则显示错误提示
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: '序号为' + sends + '执行单已经下发,不允许删除！',
              type: 'error',
              position: 'bottom-right'
            })
          } else {
            axios.put('/api/b05lms/ExecutionOrder/logicalDeleteExecutionOrder', { modifierCode: this.$store.state.userInfo.code,
              modifierName: this.$store.state.userInfo.name, list: listmap }).then((res) => {
              this.search()
              if (res.data.status === 1) {
                if (this.notifyInstance) {
                  this.notifyInstance.close()
                }
                this.notifyInstance = this.$notify({
                  type: 'success',
                  message: '已删除未分配的执行单!',
                  position: 'bottom-right'
                })
              } else {
              // 如果后台错误，则弹出提示
                this.msg = res.data.msg
                if (this.msg === 'EC00002') {
                  if (this.notifyInstance) {
                    this.notifyInstance.close()
                  }
                  this.notifyInstance = this.$notify({
                    title: '错误信息',
                    message: this.EC00002,
                    type: 'error',
                    position: 'bottom-right'
                  })
                }
              }
            })
          }
        }).catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'info',
            message: '已取消删除',
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
          message: '请选择至少一条数据！',
          type: 'warning',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作！',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        let finishs = ''
        const selectLength = this.multipleTable.length
        const select = this.multipleTable
        for (let i = 0; i < selectLength; i++) {
          if (select[i].isFinish === 1) { // 判断执行单是否已完成
            if (finishs === '') {
              finishs += this.tableData.indexOf(select[i]) + 1
            } else {
              finishs += ',' + (this.tableData.indexOf(select[i]) + 1)
            }
          }
        }
        if (finishs) { // 如果勾选行都未完成，则可以弹出对话框，否则显示错误提示
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误信息',
            message: '序号为' + finishs + '执行单已完成,不可操作！',
            type: 'error',
            position: 'bottom-right'
          })
        } else {
          this.$router.push({ name: 'executionOrderEdit', params: { executionOrders: this.multipleTable[0] }})
        }
      }
    },

    // 一条数据下发
    handleSend: function() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据！',
          type: 'warning',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作！',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        if (this.multipleTable[0].isFinish === 1) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '该执行单已完成,不可操作！',
            type: 'warning',
            position: 'bottom-right'
          })
        } else if (this.multipleTable[0].sendState === 1) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '该执行单已下发,请重新选择！',
            type: 'warning',
            position: 'bottom-right'
          })
        } else {
          this.$router.push({ name: 'materialDown', params: { executionOrders: this.multipleTable[0] }})
        }
      }
    },

    // 多条数据下发
    // handleSend: function() {
    //   if (this.multipleTable.length === 0) {
    //     this.$notify({
    //       title: '警告信息',
    //       message: '请选择至少一条数据！',
    //       type: 'warning',
    //       position: 'bottom-right'
    //     })
    //   } else {
    //     const selectLength = this.multipleTable.length
    //     const select = this.multipleTable
    //     let sorts = ''
    //     let finishs = ''
    //     for (let i = 0; i < selectLength; i++) {
    //       // console.log(this.tableData.indexOf(select[i]) + 1)  // 获取选中行序号
    //       if (select[i].isFinish === 1) { // 判断执行单是否已完成
    //         if (finishs === '') {
    //           finishs += this.tableData.indexOf(select[i]) + 1
    //         } else {
    //           finishs += ',' + (this.tableData.indexOf(select[i]) + 1)
    //         }
    //       } else if (select[i].sendState === 1) { // 勾选行已下发
    //         if (sorts === '') {
    //           sorts += this.tableData.indexOf(select[i]) + 1
    //         } else {
    //           sorts += ',' + (this.tableData.indexOf(select[i]) + 1)
    //         }
    //       }
    //     }
    //     if (finishs) { // 如果勾选行都未完成，则可以弹出对话框，否则显示错误提示
    //       if (this.notifyInstance) {
    //         this.notifyInstance.close()
    //       }
    //       this.notifyInstance = this.$notify({
    //         title: '错误信息',
    //         message: '序号为' + finishs + '执行单已完成,不可操作！',
    //         type: 'error',
    //         position: 'bottom-right'
    //       })
    //     } else if (sorts) { // 如果勾选行都未下发，则可以弹出对话框，否则显示错误提示
    //       if (this.notifyInstance) {
    //         this.notifyInstance.close()
    //       }
    //       this.notifyInstance = this.$notify({
    //         title: '错误信息',
    //         message: '序号为' + finishs + '执行单已完成,不可操作！',
    //         type: 'error',
    //         position: 'bottom-right'
    //       })
    //     } else {
    //       this.$router.push({ name: 'materialDown', params: { executionOrders: this.multipleTable[0] }})
    //     }
    //   }
    // },
    // 点击分配按钮出现分配对话框
    handleAssign: function() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据！',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        const selectLength = this.multipleTable.length
        const select = this.multipleTable
        let sorts = ''
        let finishs = ''
        for (let i = 0; i < selectLength; i++) {
          if (select[i].isFinish === 1) { // 判断勾选行执行单是否已完成
            if (finishs === '') {
              finishs += this.tableData.indexOf(select[i]) + 1
            } else {
              finishs += ',' + (this.tableData.indexOf(select[i]) + 1)
            }
          } else if (select[i].deliveryId != null) { // 勾选行已分配配送单位
            if (sorts === '') {
              sorts += this.tableData.indexOf(select[i]) + 1
            } else {
              sorts += ',' + (this.tableData.indexOf(select[i]) + 1)
            }
          }
        }
        if (finishs) { // 如果勾选行都未完成，则可以弹出对话框，否则显示错误提示
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误信息',
            message: '序号为' + finishs + '执行单已完成,不可操作！',
            type: 'error',
            position: 'bottom-right'
          })
        } else if (sorts) { // 如果勾选行都未分配配送单位，则可以弹出对话框，否则显示错误提示
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误信息',
            message: '序号为' + sorts + '执行单已经分配配送单位,请重新选择！',
            type: 'error',
            position: 'bottom-right'
          })
        } else {
          this.dialogFormVisible = true
        }
      }
    },
    // 分配配送单位时,如果不选择配送单位,确定按钮为禁用状态
    inputChange() {
      if (this.exeOrderDialog.deliveryId === '' || this.exeOrderDialog.deliveryId === null || this.exeOrderDialog.deliveryId === undefined) {
        this.assign = true
      } else {
        this.assign = false
      }
    },
    // 点击确定给执行单分配配送单位按钮
    add(exeOrderDialog) {
      // 检查是否拿到了正确的需要验证的表单
      this.$refs[exeOrderDialog].validate((valid) => {
        if (valid) {
          const selectLength = this.multipleTable.length
          const listmap = []
          const select = this.multipleTable
          for (let i = 0; i < selectLength; i++) {
            const lists = {}
            lists.id = select[i].id
            // lists.orgCode = this.exeOrderDialog.deliveryId.companyNo
            lists.deliveryId = this.exeOrderDialog.deliveryId
            this.deliveryOptions.forEach((item, index) => {
              if (item.id === this.exeOrderDialog.deliveryId) {
                lists.orgCode = item.companyNo
              }
            })
            listmap[i] = lists
          }
          axios.put('/api/b05lms/ExecutionOrder/AssignExecutionOrder', { modifierCode: this.$store.state.userInfo.code,
            modifierName: this.$store.state.userInfo.name, list: listmap }).then((res) => {
            this.search()
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              message: '分配成功！',
              type: 'success',
              position: 'bottom-right'
            })
          }).catch(() => {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              message: this.EC00007,
              type: 'error',
              position: 'bottom-right'
            })
          })
          this.dialogFormVisible = false
          this.exeOrderDialog.deliveryId = ''
          this.assign = true
        } else {
          return false
        }
      })
    },
    // 取消给执行单分配配送单位按钮
    cancelAssign: function() {
      this.search()
      this.dialogFormVisible = false
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        type: 'info',
        message: '已取消分配',
        position: 'bottom-right'
      })
      this.exeOrderDialog.deliveryId = ''
      this.assign = true
    },
    // 撤回执行单
    handleWithdraw: function() {
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
        this.$confirm('此操作将撤回该批数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const selectLength = this.multipleTable.length
          const listmap = []
          const list = []
          const select = this.multipleTable
          let sorts = ''
          let finishs = ''
          for (let i = 0; i < selectLength; i++) {
            const ids = {}
            const execOrdersIds = {}
            if (select[i].isFinish === 1) { // 判断勾选行执行单是否已完成
              if (finishs === '') {
                finishs += this.tableData.indexOf(select[i]) + 1
              } else {
                finishs += ',' + (this.tableData.indexOf(select[i]) + 1)
              }
            } else if (select[i].deliveryId == null) { // 判断勾选行执行单是否分配配送单位
              if (sorts === '') {
                sorts += this.tableData.indexOf(select[i]) + 1
              } else {
                sorts += ',' + (this.tableData.indexOf(select[i]) + 1)
              }
            } else {
              ids.id = select[i].id
              listmap[i] = ids
              execOrdersIds.execOrderId = select[i].id
              list[i] = execOrdersIds
            }
          }
          if (finishs) { // 如果勾选行都未完成，则可以弹出对话框，否则显示错误提示
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: '序号为' + finishs + '执行单已完成,不可操作！',
              type: 'error',
              position: 'bottom-right'
            })
          } else if (sorts) { // 如果勾选行都未分配配送单位，则可以撤回，否则显示错误提示(sorts为空表示均分配配送单位)
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: '序号为' + sorts + '的执行单没有分配配送单位，无法撤回，请重新选择！',
              type: 'error',
              position: 'bottom-right'
            })
          } else {
            // 查看是否创建配车计划
            axios.post('/api/b05lms/ExecutionOrder/selectExeOrderMatRefCount', list).then((res) => {
              // console.log(res.data.resultData)
              // 选中行内有已经创建配车计划的执行单
              if (res.data.resultData > 0) {
                // 查看是哪一条执行单创建了配车计划
                axios.post('/api/b05lms/ExecutionOrder/selectOrderMatCount', list).then((response) => {
                  // console.log(response.data.resultData)
                  if (res.data.status === 1) {
                    let tips = ''
                    this.tableData.forEach((item, index) => {
                      response.data.resultData.forEach((item1, index1) => {
                        if (item.id === item1.execOrderId) {
                          // console.log(index + 1)
                          if (tips === '') {
                            tips += index + 1
                          } else {
                            tips += ',' + (index + 1)
                          }
                        }
                      })
                    })
                    if (tips) {
                      if (this.notifyInstance) {
                        this.notifyInstance.close()
                      }
                      this.notifyInstance = this.$notify({
                        type: 'error',
                        message: '序号为' + tips + '的执行单已创建配车计划，不可以撤回！',
                        position: 'bottom-right'
                      })
                    }
                  } else {
                  // 如果后台错误，则弹出提示
                    this.msg = res.data.msg
                    if (this.msg === 'EC000010') {
                      if (this.notifyInstance) {
                        this.notifyInstance.close()
                      }
                      this.notifyInstance = this.$notify({
                        title: '错误信息',
                        message: this.EC000010,
                        type: 'error',
                        position: 'bottom-right'
                      })
                    }
                  }
                })
              } else if (res.data.resultData === 0) {
                // 选中行均没有创建配车计划的执行单,撤回执行单
                axios.put('/api/b05lms/ExecutionOrder/withdrawExecutionOrder', { modifierCode: this.$store.state.userInfo.code,
                  modifierName: this.$store.state.userInfo.name, list: listmap }).then((res) => {
                  this.search()
                  // 返回状态为1表示成功
                  if (res.data.status === 1) {
                    if (this.notifyInstance) {
                      this.notifyInstance.close()
                    }
                    this.notifyInstance = this.$notify({
                      type: 'success',
                      message: '已撤回执行单!',
                      position: 'bottom-right'
                    })
                  } else {
                    // 如果后台错误，则弹出提示
                    this.msg = res.data.msg
                    if (this.msg === 'EC00006') {
                      if (this.notifyInstance) {
                        this.notifyInstance.close()
                      }
                      this.notifyInstance = this.$notify({
                        title: '错误信息',
                        message: this.EC00006,
                        type: 'error',
                        position: 'bottom-right'
                      })
                    }
                  }
                })
              } else {
                if (this.notifyInstance) {
                  this.notifyInstance.close()
                }
                this.notifyInstance = this.$notify({
                  message: this.EC00009,
                  type: 'error',
                  position: 'bottom-right'
                })
              }
            })
          }
        }).catch(() => {
          this.search()
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'info',
            message: '已取消撤回',
            position: 'bottom-right'
          })
        })
      }
    },
    // 详情
    handleDetail: function() {
      if (this.multipleTable.length === 0 || this.multipleTable.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择一条数据！',
          type: 'warning',
          position: 'bottom-right'
        })
      } else if (this.multipleTable[0].sendState === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '未下发物料，无法查询详情！',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$router.push({ name: 'materialDetails', params: { executionOrders: this.multipleTable }})
      }
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
.exeOrder_form {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
