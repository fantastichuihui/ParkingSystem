<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form class="person_form" label-width="100px">
        <el-row style="margin-right:150px;" justify="center">
          <el-col :offset="9" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item label="人员id：" prop="id">
              <el-select v-model.trim="id" placeholder="请选择人员id" class="g_input">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name + '       (id:' + item.id + ')'"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-right: 150px;" justify="center">
          <el-col :offset="9" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item label="归属日期：" prop="ascriptionDate">
              <el-date-picker
                v-model="ascriptionDate"
                type="date"
                style="width:50%;"
                value-format="yyyy-MM-dd"
                placeholder="选择归属日期"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-right: 150px;" justify="center">
          <el-col :offset="9" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item label="发放日期：" prop="grantDate">
              <el-date-picker
                v-model="grantDate"
                type="date"
                style="width:50%;"
                value-format="yyyy-MM-dd"
                placeholder="选择发放日期"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 6个金钱组件 -->
        <!-- 1基本工资 -->
        <el-row style="margin-right: 263px;" justify="center">
          <el-col :offset="8" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item prop="basicWages" style="width: 737px">
              <ComMoney v-model="basicWages" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 2养老保险扣除金额 -->
        <el-row style="margin-right: 295px;" justify="center">
          <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item prop="eiMoney" style="width: 737px">
              <ComMoney v-model="eiMoney" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 3失业保险扣除金额 -->
        <el-row style="margin-right: 295px;" justify="center">
          <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item prop="uiMoney" style="width: 737px">
              <ComMoney v-model="uiMoney" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 4医疗保险扣除金额 -->
        <el-row style="margin-right:295px;" justify="center">
          <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item prop="miMoney" style="width: 737px">
              <ComMoney v-model="miMoney" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 5住房公积金扣除金额 -->
        <el-row style="margin-right:295px;" justify="center">
          <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item prop="hpfMoney" style="width: 737px">
              <ComMoney v-model="hpfMoney" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 6奖惩金额合计 -->
        <el-row style="margin-right:190px;" justify="center">
          <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item prop="rpSum" style="width: 737px">
              <ComMoney v-model="rpSum" />
            </el-form-item>
          </el-col>
        </el-row>

        <div style=" margin-left:650px;width: 250px; height: 100px;">
          <el-button type="primary" plain icon="el-icon-refresh" @click="handleNo()">取消</el-button>
          <el-button type="primary" plain icon="el-icon-plus" style="margin-left:50px;" @click="handleYes()">修改</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
// 金钱的组件
import ComMoney from '@/components/com-money'
// 转时间格式
import { formatDate, getYMDHMS } from '@/utils/datetime'
// 系统登陆人信息
import { getUserInfo } from '@/utils/userInfo'

export default {
  // 转换时间戳
  filters: {
    formatDate(time) {
      time = time * 1000
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  //   引入金钱的组件
  components: {
    ComMoney
  },
  data() {
    return {
      mainid: this.$route.params.wages_grant.id,
      id: this.$route.params.wages_grant.personId,
      options: [],
      // 日期
      ascriptionDate: this.$route.params.wages_grant.ascriptionDate,
      grantDate: this.$route.params.wages_grant.grantDate,
      // 金钱
      // basicWages: this.$route.params.wages_grant.basicWages,
      // eiMoney: this.$route.params.wages_grant.eiMoney,
      // uiMoney: this.$route.params.wages_grant.uiMoney,
      // miMoney: this.$route.params.wages_grant.miMoney,
      // hpfMoney: this.$route.params.wages_grant.hpfMoney,
      // rpSum: this.$route.params.wages_grant.rpSum,
      //   6个金钱的组件
      basicWages: {
        outname: '基本工资：',
        status: 1,
        value: this.$route.params.wages_grant.basicWages,
        value1: this.$route.params.wages_grant.basicWages,
        maxLength: 10,
        msg: ''
      },
      eiMoney: {
        outname: '养老保险扣除金额：',
        status: 1,
        value: this.$route.params.wages_grant.eiMoney,
        value1: this.$route.params.wages_grant.eiMoney,
        maxLength: 10,
        msg: ''
      },
      uiMoney: {
        outname: '失业保险扣除金额：',
        status: 1,
        value: this.$route.params.wages_grant.uiMoney,
        value1: this.$route.params.wages_grant.uiMoney,
        maxLength: 10,
        msg: ''
      },
      miMoney: {
        outname: '医疗保险扣除金额：',
        status: 1,
        value: this.$route.params.wages_grant.miMoney,
        value1: this.$route.params.wages_grant.miMoney,
        maxLength: 10,
        msg: ''
      },
      hpfMoney: {
        outname: '住房公积金扣除金额：',
        status: 1,
        value: this.$route.params.wages_grant.hpfMoney,
        value1: this.$route.params.wages_grant.hpfMoney,
        maxLength: 10,
        msg: ''
      },
      rpSum: {
        outname: '奖惩金额合计：',
        status: 1,
        value: this.$route.params.wages_grant.rpSum,
        value1: this.$route.params.wages_grant.rpSum,
        maxLength: 10,
        msg: ''
      },
      // 抓到的后台错误编码
      EG00003: '工资发放记录表修改出错（后台错误）！'
    }
  },
  created() {
    // console.log(this.$route)
    // this.$route.matched[0].components.methods.getPersonId()
    this.getPersonId()
  },
  methods: {
    getParamMap: function() {
      // 给date转格式
      //   var d = new Date(this.attendDate)
      //   var modifyd = new Date(this.$route.params.wages_grant.modifyTime)
      //   var created = new Date(this.$route.params.wages_grant.createTime)
      // console.log(new Date().toLocaleString())
      // console.log(getYMDHMS())
      return {
        id: this.mainid,
        personId: this.id,
        // 日期
        ascriptionDate: this.ascriptionDate,
        grantDate: this.grantDate,
        // 金钱
        basicWages: this.basicWages.value1,
        eiMoney: this.eiMoney.value1,
        uiMoney: this.uiMoney.value1,
        miMoney: this.miMoney.value1,
        hpfMoney: this.hpfMoney.value1,
        rpSum: this.rpSum.value1,
        // 系统登陆人信息
        modifierCode: getUserInfo().usercode,
        modifierName: getUserInfo().username,
        // modifyTime: modifyd.getFullYear() + '-' + modifyd.getMonth() + '-' + modifyd.getDate() + ' ' + modifyd.getHours() + ':' + modifyd.getMinutes() + ':' + modifyd.getSeconds(),
        // 系统时间
        modifyTime: getYMDHMS(),
        // 其他未选的传-->原值
        createUserCode: this.$route.params.wages_grant.createUserCode,
        createUserName: this.$route.params.wages_grant.createUserName,
        createTime: this.$route.params.wages_grant.createUserName,
        version: this.$route.params.wages_grant.version,
        isDel: this.$route.params.wages_grant.isDel
      }
    },
    // 从后台拿人员id\name
    getPersonId: function() {
      axios.get('/api/a02person/person/findPersonname').then((res) => {
        this.options = res.data
      })
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
    // 未修改数据，弹框提示
    open3() {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        title: '警告信息',
        message: '您未输入修改数据，无法修改！',
        type: 'error',
        position: 'bottom-right'
      })
    },

    openWarningLarge() {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        title: '警告信息',
        message: '基本工资应大于其他金额之和！',
        type: 'error',
        position: 'bottom-right'
      })
    },
    // 修改选中的那行数据
    handleYes(pagers) {
      if (this.id === this.$route.params.wages_grant.personId &&
      this.ascriptionDate === this.$route.params.wages_grant.ascriptionDate &&
      this.grantDate === this.$route.params.wages_grant.grantDate &&
      this.basicWages.value1 === this.$route.params.wages_grant.basicWages &&
      this.eiMoney.value1 === this.$route.params.wages_grant.eiMoney &&
      this.uiMoney.value1 === this.$route.params.wages_grant.uiMoney &&
      this.miMoney.value1 === this.$route.params.wages_grant.miMoney &&
      this.hpfMoney.value1 === this.$route.params.wages_grant.hpfMoney &&
      this.rpSum.value1 === this.$route.params.wages_grant.rpSum
      ) {
        this.open3()
      } else if (parseInt(this.$route.params.wages_grant.basicWages) < parseInt(this.$route.params.wages_grant.eiMoney) +
      parseInt(this.$route.params.wages_grant.uiMoney) +
      parseInt(this.$route.params.wages_grant.miMoney) +
      parseInt(this.$route.params.wages_grant.hpfMoney) +
      parseInt(this.$route.params.wages_grant.rpSum)) {
        this.openWarningLarge()
      } else {
        axios.put('/api/a02person/wages_grant/update', this.getParamMap()).then((res) => {
        // 修改成功
          if (res.data.status === 1) {
            this.$router.push('Wages_grant')
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '添加成功'
            })
          } else {
          // 修改失败，给出提示
            this.msg = res.data.msg
            if (this.msg === 'EG00003') {
              this.open2(this.EG00003)
            }
          }
        }).catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'info',
            message: '已取消修改',
            position: 'bottom-right'
          })
        })
      }
    },
    handleNo() {
      this.$router.push('Wages_grant')
    }
  }
}
</script>

