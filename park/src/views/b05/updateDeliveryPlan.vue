<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form>
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="司机名称：" prop="driverId">

              <el-select
                v-model.trim="driverId"
                class="g_elFormSelect"
                filterable
                allow-create
                default-first-option
                placeholder="请选择司机"
              >
                <el-option
                  v-for="item in drivers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">      <!--   联系电话: float: left;-->
            <el-form-item prop="phone">
              <Vphone v-model.trim="phone" />      <!-- <p class="g_com">{{ phone.msg }}</p> -->
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">      <!--  身份证号: -->
            <el-form-item prop="idCard">
              <ComIdcard v-model.trim="idCard" />
            </el-form-item>
          <!-- <p class="g_com">{{ idCard.msg }}</p> -->
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="车辆牌照：" prop="carId">
              <el-select
                v-model.trim="carId"
                class="g_elFormSelect"
                filterable
                allow-create
                default-first-option
                placeholder="请选择车辆"
                @input="handleFilter($event)"
              >
                <el-option
                  v-for=" item in carNos"
                  :key="item.id"
                  :label="item.carNo"
                  :value="item.id"
                />
              </el-select>
            </el-form-item></el-col>
          <!--   <p class="g_com">{{ carmsg }}</p> -->
          <!-- <ComCarNumber v-model="carNumber" style="float: left;" /> -->
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="车辆类型：" prop="type">

              <!--  <el-select v-model.trim="type" placeholder="请选择车辆类型" class="g_elFormSelect">
                <el-option label="自有车辆" value="1" />
                <el-option label="外来车辆" value="0" />
              </el-select> -->

              <el-select
                v-model.trim="type"
                placeholder="请选择类型"
                clearable
                class="g_elFormSelect"
              >
                <el-option
                  v-for="item in addOptions"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item></el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="所属单位：" prop="comp">

              <el-input
                v-model.trim="comp"
                placeholder="请输入所属单位"
                class="g_elFormInput"
                clearable
              />
            </el-form-item></el-col>
        </el-row></el-form></div>
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
          <span>{{ row.contractIdAndItemNo }}</span>
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
    </div><br><br>

    <div style="clear:both">

      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh()">重置</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-back"
        @click="handleCannel()"
      >取消</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-delete"
        @click="readyDelete()"
      >刪除</el-button>

      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        @click="handleAdd()"
      >添加</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-check"
        @click="handleSure()"
      >确定</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Vphone from '@/components/com-phone'
import ComIdcard from '@/components/com-idcard'

export default {
  components: {
    Vphone,
    ComIdcard
    /* ComCarNumber */
  },
  data() {
    var currentValue = {}

    return {
      addOptions: [
        {
          value: '1',
          label: '自有车辆'
        },
        {
          value: '0',
          label: '外来车辆'
        }
      ],
      currentValue: currentValue,
      drivers: [],
      driverId: this.$route.params.updateDeliveryPlan.driverId,
      carNos: [],
      carId: this.$route.params.updateDeliveryPlan.delCarId,
      carmsg: '',
      carstatus: 1,
      type: this.$route.params.updateDeliveryPlan.type,

      comp: this.$route.params.updateDeliveryPlan.comp,
      phone: {
        outname: '联系电话:',
        status: 1,
        value: this.$route.params.updateDeliveryPlan.delDriverPhone,
        msg: ''
      },
      idCard: {
        outname: '身份证号码:',
        status: 1,
        value: this.$route.params.updateDeliveryPlan.delDriverCard,
        msg: ''
      },
      currentPage: 1,
      multipleTable: [],

      tableData: this.$route.params.updateDeliveryPlan.listmaps,
      total: 0,
      pageSize: 10,
      show: false,
      driversIds: [],
      chooseid: undefined,
      chooseCarid: undefined,
      carNewId: undefined,
      delPlanId: this.$route.params.updateDeliveryPlan.id,
      name: this.$route.params.updateDeliveryPlan.delDriverName

    }
  },
  computed: {
    useInfo() {
      return this.$store.state.userInfo
    }
  },
  watch: {
    driverId: function(driverId) {
      this.idCard.value = ''
      this.phone.value = ''
      for (var i = 0; i < this.drivers.length; i++) {
        if (this.driverId === this.drivers[i].id) {
          // 选择司机的id
          this.chooseid = this.drivers[i].id
          console.log(this.chooseid)
          this.name = this.drivers[i].name
          this.idCard.value = this.drivers[i].idCard
          this.phone.value = this.drivers[i].phone
          break
        }
      }
    },
    carId: function(carId) {
      this.type = ''
      this.comp = ''
      this.carmsg = ''
      for (var i = 0; i < this.carNos.length; i++) {
        if (this.carId === this.carNos[i].id) {
          // 选择的车辆的id
          this.carstatus = 1
          this.chooseCarid = this.carNos[i].id
          this.type = this.carNos[i].type
          if (this.type === 1) {
            this.type = '自有车辆'
          }
          if (this.type === 0) {
            this.type = '外来车辆'
          }
          this.comp = this.carNos[i].comp
          break
        }
      }
    }

  },
  created() {
    // 查找所有司机
    axios.get('/api/b05lms/DriverInfo/selectAll').then((res) => {
      this.drivers = res.data.resultData.allDrivers
      console.log(res.data)
      // console.log(this.$route.params.updateDeliveryPlan.driverId)
      // console.log(this.$route.params.updateDeliveryPlan)
    })
    axios.get('/api/b05lms/CarInfo/findAll').then((res) => {
      this.carNos = res.data.resultData.allCars

      console.log(res.data)
    })

    if (this.$route.params.updateDeliveryPlan.type === 1) {
      this.type = '自有车辆'
      console.log(this.type)
    }
    if (this.$route.params.updateDeliveryPlan.type === 0) {
      this.type = '外来车辆'
    }
  },

  methods: {

    getParamMap: function() {
      return {
        driver: this.driverId,
        name: this.name,
        delDriverPhone: this.phone.value,
        delDriverCard: this.idCard.value,
        carId: this.carId,
        type: this.type,
        comp: this.comp,
        version: this.$route.params.updateDeliveryPlan.version,
        delPlanId: this.$route.params.updateDeliveryPlan.id,
        carversion: this.$route.params.updateDeliveryPlan.carversion,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name
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
    // 错误消息过滤
    open2: function(msg) {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        title: '警告',
        message: msg,
        type: 'warning',
        position: 'bottom-right'
      })
    },
    // 删除
    readyDelete() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择您需要删除的物料',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('删除该配车计划中的这些物料, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {}

          const matNos = []
          for (var i = 0; i < this.multipleTable.length; i++) {
            matNos[i] = this.multipleTable[i].matNo
          }
          param.matNos = matNos

          param.modifierCode = this.$store.state.userInfo.code
          param.modifierName = this.$store.state.userInfo.name
          // 配车计划id是路由参数
          param.delPlanId = this.delPlanId
          console.log(param.modifierCode)
          // 将执行单与物料对照关系表中 【物料号在matNos中的，让其为空】
          axios.put('/api/b05lms/DeliveryPlan/upmatToNull', param).then((res) => {
            if (res.data.status === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '删除成功!',
                position: 'bottom-right'
              })
              this.$router.push('DeliveryPlan')
            } else {
              this.msg = res.data.msg
              if (this.msg === 'EC000011') {
                this.open2(this.EC000011)
              }
            }
          })
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
    // 重置将数据回到编辑前
    handleRefresh() {
      // /* /* /* /*   /*   this.type = this.$route.params.updateDeliveryPlan.type
      if (this.type === 1) {
        this.type = '自有车辆'
        console.log(this.type)
      } else {
        this.type = '外来车辆'
      }
      /*  if (this.type === 0) {

 }  */
      /*
      setTimeout(() => {
        this.type = this.$route.params.updateDeliveryPlan.type
      }, 50) */
      console.log(this.$route.params.updateDeliveryPlan)
      this.driverId = this.$route.params.updateDeliveryPlan.driverId
      this.phone.value = this.$route.params.updateDeliveryPlan.delDriverPhone
      this.idCard.value = this.$route.params.updateDeliveryPlan.delDriverCard
      this.carId = this.$route.params.updateDeliveryPlan.delCarId
      // this.type = this.$route.params.updateDeliveryPlan.type
      this.comp = this.$route.params.updateDeliveryPlan.comp
    },
    // 取消
    handleCannel() {
      this.$router.push('DeliveryPlan')
    },
    // 点击添加跳转到添加物料的页面
    handleAdd() {
      this.$router.push({ name: 'AddMat', params: { delPlanId: this.delPlanId }})
    },
    handleFilter(event) {
      if (this.chooseCarid === undefined) {
        var inval = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
        var isRight = inval.test(this.carId)
        this.carId = this.carId
        this.carstatus = isRight ? 1 : 0

        if (this.carstatus === 0) {
          this.carmsg = '车牌号输入格式有误，请重新输入！'
        } else {
          this.carmsg = '车牌号格式正确'
        }
      }
    },

    handleSure() {
      if (this.phone.status === 1 && this.idCard.status === 1 && this.carstatus === 1) {
        if (this.type === '自有车辆') {
          this.type = 1
        }
        if (this.type === '外来车辆') {
          this.type = 0
        }
        if (this.driverId === this.$route.params.updateDeliveryPlan.driverId &&
      this.phone.value === this.$route.params.updateDeliveryPlan.delDriverPhone &&
      this.idCard.value === this.$route.params.updateDeliveryPlan.delDriverCard &&
      this.carId === this.$route.params.updateDeliveryPlan.delCarId &&
      this.type === this.$route.params.updateDeliveryPlan.type &&
      this.comp === this.$route.params.updateDeliveryPlan.comp) {
          if (this.type === 1) {
            this.type = '自有车辆'
          }
          if (this.type === 0) {
            this.type = '外来车辆'
          }
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '您没有修改数据，请按取消按钮返回上一个页面',
            type: 'error',
            position: 'bottom-right'
          })
        } else if (this.driverId !== '' && this.type !== '' && this.comp !== '') {
          axios.put('/api/b05lms/DeliveryPlan/upPlan', this.getParamMap()).then((res) => {
            if (res.data.status === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '更新配车计划成功!',
                position: 'bottom-right'
              })
              this.$router.push('DeliveryPlan')
            } else {
              this.msg = res.data.msg
              if (this.msg === 'EC000013') {
                this.open2(this.EC000013)
              }
            }
          })
        } else {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '警告',
            type: 'warning',
            message: '请填写完整的信息!',
            position: 'bottom-right'
          })
        }
      } else {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '电话，或身份证，或车牌号格式错误',
          type: 'error',
          position: 'bottom-right'
        })
      }
    }
  }
}
</script>
