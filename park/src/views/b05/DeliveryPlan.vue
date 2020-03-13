<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form class="deliveryPlan_form">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="2" :md="4" :lg="8" :xl="6">
            <el-form-item label="执行单号：" prop="execOrderNo">
              <el-input
                v-model.trim="execOrderNo"
                clearable
                placeholder="请输入执行单号"
                class="g_elFormInput"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="2" :md="4" :lg="8" :xl="6">
            <el-form-item label="配车计划号：" prop="delPlanNo">
              <el-select
                v-model.trim="delPlanNo"
                clearable
                class="g_elFormSelect"
                placeholder="请选择配车计划号"
              >
                <el-option
                  v-for="item in optionsDelNo"
                  :key="item.id"
                  :label="item.delPlanNo"
                  :value="item.delPlanNo"
                />
              </el-select>

            </el-form-item></el-col>
          <el-col :xs="2" :sm="2" :md="4" :lg="8" :xl="6">
            <el-form-item label="司机姓名：" prop="delDriverName">
              <el-select
                v-model.trim="delDriverName"
                clearable
                class="g_elFormSelect"
                placeholder="请选择司机"
              >
                <el-option
                  v-for="item in optionsName"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="2" :md="4" :lg="8" :xl="6">
            <el-form-item label="车牌号：" prop="carNo">
              <el-input
                v-model.trim="carNo"
                clearable
                placeholder="请输入车牌号"
                class="g_elFormInput"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="g_button">
      <el-button
        type="primary"
        plain
        icon="el-icon-search"
        :style="{ display: visibleFilter }"
        @click="handleFilter()"
      >查询</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-circle-plus-outline"
        :style="{ display: visibleIn }"
        @click="handleIn()"
      >入园</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-printer"
        :style="{ display: visiblePrint }"
        @click="handlePrint()"
      >打印</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-remove-outline"
        :style="{ display: visibleOut }"
        @click="handleOut()"
      >出园</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-tickets"
        :style="{ display: visibleCheck }"
        @click="handleOpenDialog()"
      >审核</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-view"
        :style="{ display: visibleDetail }"
        @click="handleDetail()"
      >详情</el-button>

      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        :style="{ display: visibleAdd }"
        @click="handleAdd()"
      >添加</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-edit"
        :style="{ display: visibleEdit }"
        @click="handleEdit()"
      >修改</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-delete"
        :style="{ display: visibleDelete }"
        @click="readyDelete()"
      >刪除</el-button>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确认审核通过？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false,handleCheck(multipleTable )">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 打印 -->
    <!--     <el-dialog
      title="打印核对单"
      :visible.sync="dialogVisible2"
      width="800px"
      :before-close="handleClosePrint"
    >
      <div id="printTest">
        <p>锄禾日当午</p>
        <p>汗滴禾下土</p>
        <p>谁知盘中餐</p>
        <p>粒粒皆辛苦</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible2 = false,handlePrint()">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 表格加载 -->
    <el-table
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />

      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="60px" />
      <!-- ID(hidden) -->
      <el-table-column v-if="showing" label="主键ID">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 配车计划号 -->
      <el-table-column label="配车计划号">
        <template slot-scope="{row}">
          <span>{{ row.delPlanNo }}</span>
        </template>
      </el-table-column>
      <!-- 配送单位 -->
      <el-table-column label="配送单位" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deliveryName }}</span>
        </template>
      </el-table-column>
      <!-- 配送司机姓名 -->
      <el-table-column label="配送司机" align="center">
        <template slot-scope="{row}">
          <span>{{ row.delDriverName }}</span>
        </template>
      </el-table-column>
      <!-- 计划配送日期 -->
      <el-table-column label="计划配送日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.planDelDate }}</span>
        </template>
      </el-table-column>
      <!-- 实际配送日期 -->
      <el-table-column label="实际配送日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.actDelDate }}</span>
        </template>
      </el-table-column>
      <!--  nodeId-->
      <el-table-column label="节点Id" align="center">
        <template slot-scope="{row}">
          <span v-if="row.nodeId==1">入园</span>
          <span v-if="row.nodeId==2">装车</span>
          <span v-if="row.nodeId==3">出园</span>
          <span v-if="row.nodeId==4">未入园</span>
        </template>
      </el-table-column>
      <!-- 审核状态 nodeId-->
      <el-table-column label="审核状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.checkState === 1?'已审核' :'未审核' }}</span>
        </template>
      </el-table-column>
      <!-- 配送状态 delState-->
      <el-table-column label="配送状态" align="center">
        <template slot-scope="{row}">
          <!--  <span>{{ row.delState=== 1?'已配送' :'未配送' }}</span> -->
          <span v-if="row.delState==0">已下发</span>
          <span v-if="row.delState==1">打印</span>
          <span v-if="row.delState==2">发车实绩</span>
          <span v-if="row.delState==3">出园</span>
        </template>
      </el-table-column>
      <!-- 配送数量 -->
      <el-table-column label="配送数量" align="center">
        <template slot-scope="{row}">
          <span>{{ row.num }}</span>
        </template>
      </el-table-column>
      <!-- 收货单位 -->
      <el-table-column label="收货单位" align="center">
        <template slot-scope="scope">
          <el-tooltip placement="left">
            <div slot="content" v-html="scope.row.receiving">a</div>
            <span>{{ scope.row.receivingName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div style="float: right;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import {
  open2,
  delSuccess,
  delCancel,
  delSelect,
  editOne,
  editMut,
  carIn,
  planCheck,
  carOut
} from '@/utils/systemTips'
// 抓到的后台错误编码
import { getError } from '@/utils/error'
// 打印
// import { getLodop } from '@/utils/LodopFuncs'
import { getYMDHMS } from '@/utils/datetime'

export default {
  name: 'DeliveryPlanTable',
  data() {
    return {
      showing: false,
      /* 配车计划号 */
      delPlanNo: '',
      optionsDelNo: this.getOptionsDelNo(),

      /* 司机信息表 */
      delDriverName: '',
      optionsName: this.getOptionsName(),
      // id: undefined,

      /* 执行单号 */
      execOrderNo: '',
      /* 车辆牌照 */
      carNo: '',

      /* 按钮是否显示 */
      visibleFilter: '',
      visibleIn: '',
      visiblePrint: '',
      visibleOut: '',
      visibleCheck: '',
      visibleDetail: '',
      visibleAdd: '',
      visibleEdit: '',
      visibleDelete: '',
      /* 当前页面的角色 */
      roleList: [],
      /* 弹出审核对话框 */
      dialogVisible: false,
      dialogVisible2: false,
      // 表格数据
      tableData: [],
      receiving: '',
      // 分页
      currentPage: 1,
      pageSize: 10,
      /* total: 100, */
      // 删除选中的
      multipleTable: [],
      msg: '',
      /* 入园时，门卫穿的数据 */
      delPlanId: undefined,
      /* 审核 数据 */
      delState: '',
      choose: []

    }
  },
  computed: {
    useInfo() {
      return this.$store.state.userInfo
    }
  },
  created() {
    // 根据登陆人的角色显示按钮：下线none
    // 从后台拿数据 role/selectRoleByAccount
    /* 需要S层转发 */
    // 登陆时拿到的配送单位账号
    // console.log(this.$store.state.userInfo.userAccount)
    // axios.get('/api/s01/deliveryplanmain/findinaone', { params: { username: this.$store.state.userInfo.userAccount }}).then(res => {
    //   this.roleList = res.data

    if (this.$store.state.roleInfo.id === 6) {
      this.visibleFilter = ''
      this.visibleIn = 'none'
      this.visiblePrint = ''
      this.visibleOut = 'none'
      this.visibleCheck = ''
      this.visibleDetail = ''
      this.visibleAdd = 'none'
      this.visibleEdit = 'none'
      this.visibleDelete = 'none'
    } else if (this.$store.state.roleInfo.id === 3) {
      this.visibleFilter = ''
      this.visibleIn = ''
      this.visiblePrint = 'none'
      this.visibleOut = ''
      this.visibleCheck = 'none'
      this.visibleDetail = 'none'
      this.visibleAdd = 'none'
      this.visibleEdit = 'none'
      this.visibleDelete = 'none'
    } else if (this.$store.state.roleInfo.id === 5) {
      // console.log('aa')
      this.visibleFilter = ''
      this.visibleIn = 'none'
      this.visiblePrint = 'none'
      this.visibleOut = 'none'
      this.visibleCheck = 'none'
      this.visibleDetail = ''
      this.visibleAdd = ''
      this.visibleEdit = ''
      this.visibleDelete = ''
    } else if (this.$store.state.roleInfo.id === 1) {
      this.visibleFilter = ''
      this.visibleIn = ''
      this.visiblePrint = ''
      this.visibleOut = ''
      this.visibleCheck = ''
      this.visibleDetail = ''
      this.visibleAdd = ''
      this.visibleEdit = ''
      this.visibleDelete = ''
    } else if (this.$store.state.roleInfo.id === 4) {
      this.visibleFilter = ''
      this.visibleIn = 'none'
      this.visiblePrint = 'none'
      this.visibleOut = 'none'
      this.visibleCheck = 'none'
      this.visibleDetail = ''
      this.visibleAdd = 'none'
      this.visibleEdit = 'none'
      this.visibleDelete = 'none'
    }
    // })
    // 页面加载时，加载出表格内容
    this.search()
    // console.log(this.count)
  },
  methods: {

    // 分页
    handleSizeChange: function(val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.search()
    },
    // 传给后台的数据（查）
    getParamMap: function() {
      return {
        delPlanNo: this.delPlanNo,
        delDriverName: this.delDriverName,
        execOrderNo: this.execOrderNo,
        carNo: this.carNo,
        page: this.currentPage,
        rows: this.pageSize

      }
    },

    // 从后台拿数据 配车计划号
    getOptionsDelNo: function() {
      axios.get('/api/b05lms/DeliveryPlan/selectDeliveryPlan').then(res => {
        this.optionsDelNo = res.data.resultData

        // console.log(this.optionsDelNo)
      })
    },
    // 司机信息
    getOptionsName: function() {
      axios.get('/api/b05lms/DriverInfo/selectAllDriverForOthers').then(res => {
        this.optionsName = res.data.resultData.allDrivers
        // console.log(this.optionsName)
      })
    },
    // 查
    search: function() {
      // console.log(this.getParamMap())
      axios.get('/api/b05lms/DeliveryPlan/selectby', { params: this.getParamMap() }).then(res => {
        this.receiving = ''
        if (res.data.status === 1) {
          // console.log(res)
          this.tableDatalist = res.data.resultData
        } else {
          this.tableDatalist = res.data.resultData
          this.msg = res.data.msg
          if (this.msg === 'EC00004') {
            open2(getError().EC00004)
          }
        }
      })
      axios.get('/api/s01/deliveryplanmain/findinfour').then(res => {
        this.serverlist = res.data.resultData
        // console.log(this.serverlist)
        for (var mapa of this.serverlist) {
          var dela = mapa.delPlanNo
          for (var mapb of this.tableDatalist) {
            var delb = mapb.delPlanNo
            if (dela === delb) {
              mapb.listmaps = mapa.list
              mapb.receiving = ''
              const set = new Set()
              for (var newMap of this.mapa.list) {
                set.add(newMap.receivingName)
              }
              for (var receivemap of set) {
                mapb.receiving = mapb.receiving + receivemap.receivingName + '<br/>'
              }
              mapb.receivingName = '共' + set.size + '家'
            }
          }
        }
        this.tableData = this.tableDatalist
        if (this.tableData.length === 0) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'success',
            message: '该条件下无数据!',
            position: 'bottom-right'
          })
        }
        // console.log(this.tableData)
      })
      // this.receivingName
    },
    getReceivingName() {
      for (var receivemap of this.mapa.list) {
        this.receiving = this.receiving + receivemap.receivingName + 'and'
      }
      return this.receiving
    },
    // 查询按钮
    handleFilter() {
      this.search()
    },
    // 勾选中的数据
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 语音播报
    doTTs(mess) {
      var msg = new SpeechSynthesisUtterance(mess)
      msg.volume = 100
      msg.rate = 1
      msg.pitch = 1.5
      window.speechSynthesis.speak(msg)
    },
    // 门卫点击入园按钮 nodeId 设为1入园，可以打印核对单
    handleIn() {
      // console.log(this.multipleTable[0])
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
        if (this.multipleTable[0].nodeId === 4) {
          // 语音播报
          var mess = this.multipleTable[0].carNo + '入园，请做好装车准备'
          this.doTTs(mess)

          axios.put('/api/b05lms/DeliveryPlan/carin', { compId: this.multipleTable[0].compId, delPlanId: this.multipleTable[0].id, version: this.multipleTable[0].version, nodeId: 1,
            parkId: this.$store.state.userInfo.orgId, parkName: this.$store.state.userInfo.orgName, type: 1, carNumber: this.multipleTable[0].carNo, driverName: this.multipleTable[0].delDriverName, driverPhone: this.multipleTable[0].delDriverPhone,
            createUserCode: this.$store.state.userInfo.code, createUserName: this.$store.state.userInfo.name, modifierCode: this.$store.state.userInfo.code, modifierName: this.$store.state.userInfo.name }).then((res) => {
            // res.data.resultData
            if (res.data.status === 1) {
              carIn()
              this.search()
            } else {
              this.msg = res.data.msg
              if (this.msg === 'EC00005') {
                open2(getError().EC00005)
              }
            }
          })
        } else {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '改配车计划不满足入园条件！',
            type: 'warning',
            position: 'bottom-right'
          })
        }
      }
    },
    /* 审核对话框 打开 */
    handleOpenDialog() {
      if (this.multipleTable.length === 0) {
        editOne()
      } else if (this.multipleTable.length > 1) {
        editMut()
      } else {
        // console.log(this.multipleTable[0].checkState)
        this.choose = this.multipleTable[0]
        this.dialogVisible = true
      }
    },
    // 关闭对话框
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 审核按钮-->弹对话框 delState=0配送状态为已下发，nodeId=1代表节点为入园，
    // checkState: 1设为已审核
    handleCheck() {
      // this.multipleTable = this.multipleTable
    // console.log(this.choose)
      if (this.choose.delState === 0 && this.choose.nodeId === 1) {
        // console.log(this.multipleTable[0].checkState)
        axios.put('/api/b05lms/DeliveryPlan/plancheck', { id: this.choose.id, version: this.choose.version, checkState: 1 }).then((res) => {
          // res.data.resultData
          if (res.data.status === 1) {
            planCheck()
            this.search()
          } else {
            this.msg = res.data.msg
            if (this.msg === 'EC00006') {
              open2(getError().EC00006)
            }
          }
        })
      }
    },
    // 工作人员打印核对单
    handleOpenPrintDialog() {

    },
    handleClosePrint() {

    },
    // 审核才能打印（checkState === 1）
    // delState: 1 配送状态变为 打印
    //  nodeId: 2  节点变为 装车
    handlePrint() {
      // console.log('fdf打印')
      // console.log(this.multipleTable[0].checkState)
      if (this.multipleTable[0].checkState === 1) {
        // 先拿S数据，打印，再改数据库（状态、核对单号）
        axios.get('/api/s01/deliveryplanmain/findinbfivetoone', { params: { delPlanId: this.multipleTable[0].id }}).then((res) => {
          // debugger
          // console.log(res.data.resultData)
          if (res.data.status === 1) {
            axios.put('/api/b05lms/DeliveryPlan/planprint', { id: this.multipleTable[0].id, version: this.multipleTable[0].version, delState: 1, nodeId: 2 }).then((res) => {
              // res.data.resultData
              if (res.data.status === 1) {
                // planPrint()
                this.search()
              } else {
                this.msg = res.data.msg
                if (this.msg === 'EC00007') {
                  open2(getError().EC00007)
                }
              }
            })
            const imageList = []
            let index = 0
            for (var beforemap of res.data.resultData) {
              var lists = []
              for (var innermap of beforemap.checklist) {
                // beforemap.quark = innermap.matNo
                lists.push(innermap.matNo)
              }
              beforemap.nowData = getYMDHMS()
              beforemap.delPlanNo = this.multipleTable[0].delPlanNo
              beforemap.delDriverName = this.multipleTable[0].delDriverName
              beforemap.carNo = this.multipleTable[0].carNo
              beforemap.delDriverCard = this.multipleTable[0].delDriverCard
              beforemap.delDriverPhone = this.multipleTable[0].delDriverPhone
              beforemap.makePone = this.$store.state.userInfo.name

              imageList[index] = lists.join(',')
              index++
              // beforemap.nowData = this.getTime()
            }

            axios.post('/api/b05lms/image/code', { content: imageList }).then((ress) => {
              //
              index = 0
              console.log(ress)
              for (var a of ress.data) {
                // beforemap.quark = res.data[index++]
                beforemap.quark = a
              }
              this.$router.push({
                name: 'Print',
                params: { Print: res.data.resultData }
              })
            })

            // const LODOP = getLodop()
            // LODOP.PRINT_INIT('打印任务名')
            // LODOP.SET_PRINT_STYLE('FontSize', 18)
            // LODOP.SET_PRINT_STYLE('Bold', 1)
            // // LODOP.SET_PRINT_PAGESIZE(3, '6cm', '2cm', 2)
            // LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, '打印页面部分内容')
            // LODOP.ADD_PRINT_HTM(88, 200, 350, 600, document.getElementById('textDY').innerHTML)
            // LODOP.PRINT()
            // // LODOP.PREVIEW()
            // LODOP.NewPage()
          }
        })
      } else {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '改配车计划不满足打印条件！请先审核',
          type: 'warning',
          position: 'bottom-right'
        })
      }
    },
    // 门卫点击出园按钮
    // delState === 2  配送状态变为 发车实绩 才能出园（手机端传过来）
    /* 改为：delState = 3出园， nodeId = 3出园 */
    handleOut() {
      if (this.multipleTable[0].delState === 2) {
        axios.put('/api/b05lms/DeliveryPlan/carout', { compId: this.multipleTable[0].compId, id: this.multipleTable[0].id, version: this.multipleTable[0].version, delState: 3, nodeId: 3,
          delPlanId: this.multipleTable[0].id,
          parkId: this.$store.state.userInfo.orgId, parkName: this.$store.state.userInfo.orgName,
          type: 1, carNumber: this.multipleTable[0].carNo, driverName: this.multipleTable[0].delDriverName,
          driverPhone: this.multipleTable[0].delDriverPhone, createUserCode: this.$store.state.userInfo.code, createUserName: this.$store.state.userInfo.name,
          modifierCode: this.$store.state.userInfo.code, modifierName: this.$store.state.userInfo.name }).then((res) => {
          // res.data.resultData
          if (res.data.status === 1) {
            carOut()
            this.search()

            // 语音播报
            var mess = this.multipleTable[0].carNo + '出园，欢迎下次光临'
            this.doTTs(mess)
          } else {
            this.msg = res.data.msg
            if (this.msg === 'EC00008') {
              open2(getError().EC00008)
            }
          }
        })
        const listmap = this.multipleTable[0].listmaps
        const matList = []
        for (var i = 0; i < listmap.length; i++) {
          const matMap = {}
          matMap.matNo = listmap[i].matNo
          matList[i] = matMap
        }

        axios.put('/api/b04wms/storeLimit/updateMaterielStockStatusByMatNo2', matList
        ).then((res) => {

        })
      } else {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告',
          message: '该配送状态不是发车实绩，不能出园，请扫码出园',
          type: 'warning',
          position: 'bottom-right'
        })
      }
    },

    // 详情按钮跳--->详情页面
    handleDetail() {
      if (this.multipleTable.length === 0) {
        editOne()
      } else if (this.multipleTable.length > 1) {
        editMut()
      } else {
        this.$router.push({
          name: 'DeliveryDetails',
          params: { updateDeliveryPlan: this.multipleTable[0] }
        })
      }
    },
    // 添加按钮--->跳添加页面
    handleAdd() {
      this.$router.push('DeliveryPlanAdd')
    },
    // 修改按钮-->跳修改页面
    handleEdit() {
      if (this.multipleTable.length === 0) {
        editOne()
      } else if (this.multipleTable.length > 1) {
        editMut()
      } else {
        this.$router.push({
          name: 'updateDeliveryPlan',
          params: { updateDeliveryPlan: this.multipleTable[0] }
        })
      }
    },
    // 删除按钮
    readyDelete() {
      if (this.multipleTable.length === 0) {
        delSelect()
      } else {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const listmap = []
          const select = this.multipleTable
          // console.log(select)
          for (let i = 0; i < this.multipleTable.length; i++) {
            const ids = {}
            ids.id = select[i].id
            listmap[i] = ids
          }
          // console.log(listmap)
          // debugger
          axios.post('/api/b05lms/DeliveryPlan/dropDeliveryPlan', { modifierCode: this.$store.state.userInfo.code,
            modifierName: this.$store.state.userInfo.name, list: listmap }).then((res) => {
            if (res.data.status === 1) {
              delSuccess()
              this.search()
            } else {
              this.msg = res.data.msg
              if (this.msg === 'EC00002') {
                open2(getError().EC00002)
              }
            }
          })
        }).catch(() => {
          delCancel()
        })
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
</style>
