<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form class="deliveryPlanCompile_form">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="司机名称：" prop="name">
              <el-select
                v-model="name"
                filterable
                clearable
                class="g_input"
                style="width:50%;"
                default-first-option
                placeholder="请选择司机"
              >
                <el-option
                  v-for="item in drivers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">      <!--   联系电话: float: left;-->
            <el-form-item label="手机号码：" prop="phone">
              <el-input
                v-model.trim="phone"
                placeholder="请选择司机"
                style="width:50%;"
                clearable
                :disabled="true"
                class="g_input"
              />

              <!--  <Vphone v-model="phone" /> -->      <!-- <p class="g_com">{{ phone.msg }}</p> -->
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">      <!--  身份证号: -->
            <el-form-item label="身份证号：" prop="idCard">
              <el-input
                v-model.trim="idCard"
                placeholder="请选择司机"
                style="width:50%;"
                clearable
                :disabled="true"
                class="g_input"
              />
              <!--    <ComIdcard v-model="idCard" /> -->
            </el-form-item>
          <!-- <p class="g_com">{{ idCard.msg }}</p> -->
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="配送日期：" prop="planDelDate">
              <el-date-picker
                v-model="planDelDate"
                type="date"
                style="width:50%;"
                class="g_input"
                value-format="yyyy-MM-dd"
                placeholder="选择配送日期"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="车辆牌照：" prop="carNo">
              <el-select
                v-model="carNo"
                clearable
                style="width:50%;"
                class="g_input"
                default-first-option
                placeholder="请选择车辆"
                @input="isFilter($event)"
              >
                <el-option
                  v-for="item in carNoList"
                  :key="item.id"
                  :label="item.carNo"
                  :value="item.carNo"
                />
              </el-select>
            </el-form-item>
          <!--  <p class="g_com">{{ carmsg }}</p> -->
          <!--  <span>&nbsp;&nbsp;&nbsp;</span> -->
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="车辆类型：" prop="carType">
              <el-select
                v-model="carType"
                clearable
                :disabled="true"
                style="width:50%;"
                class="g_input"
                placeholder="请选择车辆类型"
              >
                <el-option
                  v-for="item in carTypeList"
                  :key="item.carType"
                  :label="item.labelName"
                  :value="item.carType"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="所属单位：" prop="comp">
              <el-input
                v-model.trim="comp"
                placeholder="请输入所属单位"
                style="width:50%;"
                clearable
                :disabled="true"
                class="g_input"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
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
      <!-- 子项号 -->
      <el-table-column label="子项号">
        <template slot-scope="{row}">
          <span>{{ row.contractItemNo }}</span>
        </template>
      </el-table-column>
      <!-- 物料号 -->
      <el-table-column label="物料号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.matNo }}</span>
        </template>
      </el-table-column>
      <!--钢牌号-->
      <el-table-column label="钢牌号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.gNo }}</span>
        </template>
      </el-table-column>
      <!--产品名称-->
      <el-table-column label="产品名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!--所属钢种-->
      <el-table-column label="所属钢种" align="center">
        <template slot-scope="{row}">
          <span>{{ row.gp }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="g_pagination">
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
    <div style="clear:both">
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh()">重置</el-button>
      <el-button type="primary" plain icon="el-icon-cancel" @click="handleCancel()">取消</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd()">保存</el-button>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import Vphone from '@/components/com-phone'
// import ComIdcard from '@/components/com-idcard'
import { open2, compile } from '@/utils/systemTips'
// 抓到的后台错误编码
import { getError } from '@/utils/error'
// 抓到的后台错误编码
// import { getError } from '@/utils/error'
// import { open2 } from '@/utils/systemTips'

/* import ComCarNumber from '@/components/com-carNumber' */
export default {
  // components: {
  //   Vphone,
  //   ComIdcard
  //   /* ComCarNumber */
  // },

  data() {
    return {
      drivers: [],
      name: '',
      phone: '',
      idCard: '',
      // carisId: '',
      // driver: '',
      // phone: {
      //   outname: '联系电话：',
      //   status: 1,
      //   /*   value: this.$route.params.deliveryPlan.phone, */
      //   value: '',
      //   msg: ''
      // },
      // idCard: {
      //   outname: '身份证号码：',
      //   status: 1,
      //   /*  value: this.$route.params.deliveryPlan.idcard, */
      //   value: '',
      //   msg: ''
      // },
      msg: '',
      carmsg: '',
      carstatus: 1,

      /* 配送日期 */
      planDelDate: '',
      carNoList: [],
      carNo: '',
      carTypeList: [
        { labelName: '自有车辆',
          carType: 1
        },
        { labelName: '外来车辆',
          carType: 0
        }
      ],
      carType: undefined,
      comp: '',
      multipleTable: [],
      tableData: [],
      /* 分页 */
      total: 100,
      currentPage: 1,
      pageSize: 10,
      newPlanNo: 'ss'
    }
  },
  computed: { useInfo() { return this.$store.state.userInfo } },
  watch: {
    name: function(name) {
      // this.idCard.value = ''
      // this.phone.value = ''
      this.idCard = ''
      this.phone = ''
      for (var i = 0; i < this.drivers.length; i++) {
        if (this.name === this.drivers[i].name) {
          // 选择司机的id
          this.driver = this.drivers[i].id
          // console.log(this.chooseid)
          // this.idCard.value = this.drivers[i].idCard
          // this.phone.value = this.drivers[i].phone
          this.idCard = this.drivers[i].idCard
          this.phone = this.drivers[i].phone
          break
        }
      }
    },
    carNo: function(carNo) {
      this.carType = ''
      this.comp = ''
      this.carmsg = ''
      for (var i = 0; i < this.carNoList.length; i++) {
        if (this.carNo === this.carNoList[i].carNo) {
          // 选择的车辆的id
          this.carstatus = 1
          this.carisId = this.carNoList[i].id
          this.carType = this.carNoList[i].type
          this.comp = this.carNoList[i].comp
          break
        }
      }
    }

  },
  created() {
    // 查找所有司机
    axios.get('/api/b05lms/DriverInfo/selectAllDriverForOthers', {}).then((res) => {
    //   console.log(res.data.resultData.allDrivers)
      this.drivers = res.data.resultData.allDrivers
    })
    // 查所有车辆
    axios.get('/api/b05lms/CarInfo/findAllCarForOthers', {}).then((res) => {
    //   console.log(res.data.resultData.allCars)
      this.carNoList = res.data.resultData.allCars
      // console.log(this.newPlanNo)
    })
    this.getplan()
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // P20191219001  生成新的配车计划号
    getplan() {
      axios.get('/api/b05lms/DeliveryPlan/selectLastPlan').then(res => {
        const plan = res.data.resultData.delPlanNo
        const lastthree = plan.slice(10, 13)
        var a = parseInt(lastthree) + 1

        if (a < 1000 && a > 9) {
          this.newPlanNo = 'P' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate() + '0' + a
          // console.log(this.newPlanNo)
        } else if (a >= 0 && a < 10) {
          this.newPlanNo = 'P' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate() + '00' + a
          // console.log(this.newPlanNo)
        } else {
          this.newPlanNo = 'P' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate() + '000'

          // console.log(this.newPlanNo)
        }
      })
    },
    isFilter(event) {
      if (this.chooseCarid === undefined) {
        var inval = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
        var isRight = inval.test(this.carNo)
        this.carNo = this.carNo
        this.carstatus = isRight ? 1 : 0

        if (this.carstatus === 0) {
          this.carmsg = '车牌号输入格式有误，请重新输入！'
        } else {
          this.carmsg = '车牌号格式正确'
        }
      }
    },
    getTableData: function() {
      var mutilist = this.$route.params.DeliveryPlanCompile
      var datalist = []
      for (var mapa of mutilist) {
        datalist.push({ execOrderId: mapa.execOrderId })
      }
      //   console.log(datalist)
      axios.post('/api/s01/deliveryplanmain/findinbfourandtwo', datalist).then((res) => {
        this.tableData = res.data.resultData
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
      })
    },
    getParamMap: function() {
      return {
        delPlanNo: this.newPlanNo,
        /* 存入配车计划 */
        // 司机名字 电话 身份证
        name: this.name,
        // delDriverPhone: this.phone.value,
        // delDriverCard: this.idCard.value,
        delDriverPhone: this.phone,
        delDriverCard: this.idCard,
        // 车辆 车牌号 车辆类型 所属公司
        carId: this.carNo,
        type: this.carType,
        comp: this.comp,
        // 车辆id
        carisId: this.carisId,
        // planDelDate: this.planDelDate,
        // 司机id
        driver: this.driver,
        planDelDate: this.planDelDate,

        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        matNos: this.multipleTable,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name
      }
    },

    handleSizeChange: function(val) {
      this.pageSize = val
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
    },
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 重置
    handleRefresh() {
      // console.log(this.getParamMap())
      // console.log(this.carmsg)
      this.name = ''
      this.phone = ''
      // this.phone.value = ''
      // this.phone.msg = ''
      // this.idCard.value = ''
      this.idCard = ''
      // this.idCard.msg = ''
      this.planDelDate = ''
      this.carNo = undefined
      this.carmsg = ''
      this.carType = undefined
      this.comp = ''
    },
    // 取消
    handleCancel() {
      this.$router.push('DeliveryPlanAdd')
    },
    // 点击保存跳转到新增的页面
    handleAdd() {
      console.log(this.getParamMap())
      axios.post('/api/b05lms/DeliveryPlan/updateCompile', this.getParamMap()).then((res) => {
        if (res.data.status === 1) {
          compile()
          this.$router.push('DeliveryPlanAdd')
        } else {
          this.msg = res.data.msg
          if (this.msg === 'EC00016') {
            open2(getError().EC00016)
          }
        }
      })
    }

  }

}
</script>
