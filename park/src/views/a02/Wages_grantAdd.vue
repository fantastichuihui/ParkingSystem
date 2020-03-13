<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form class="person_form" label-width="100px">
        <el-row style="margin-right:150px;" justify="center">
          <el-col :offset="9" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item label="人员id：" prop="id">
              <el-select v-model.trim="id" placeholder="请选择人员id" class="g_elFormSelect">
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
            <el-form-item prop="basicWagesData" style="width: 737px">
              <ComMoney v-model="basicWagesData" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 2养老保险扣除金额 -->
        <el-row style="margin-right: 295px;" justify="center">
          <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item prop="eiMoneyData" style="width: 737px">
              <ComMoney v-model="eiMoneyData" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 3失业保险扣除金额 -->
        <el-row style="margin-right: 295px;" justify="center">
          <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item prop="uiMoneyData" style="width: 737px">
              <ComMoney v-model="uiMoneyData" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 4医疗保险扣除金额 -->
        <el-row style="margin-right:295px;" justify="center">
          <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item prop="miMoneyData" style="width: 737px">
              <ComMoney v-model="miMoneyData" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 5住房公积金扣除金额 -->
        <el-row style="margin-right:351px;" justify="center">
          <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item prop="hpfMoneyData" style="width: 737px">
              <ComMoney v-model="hpfMoneyData" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 6奖惩金额合计 -->
        <el-row style="margin-right:190px;" justify="center">
          <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item prop="rpSumData" style="width: 737px">
              <ComMoney v-model="rpSumData" />
            </el-form-item>
          </el-col>
        </el-row>

        <div style=" margin-left:650px;width: 250px; height: 100px;">
          <el-button type="primary" plain icon="el-icon-refresh" @click="handleNo()">取消</el-button>
          <el-button type="primary" plain icon="el-icon-plus" style="margin-left:50px;" @click="handleYes()">添加</el-button>
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
      id: undefined,
      options: [],
      //   归属日期
      ascriptionDate: '',
      //   发放日期
      grantDate: '',
      //   6个金钱的组件
      basicWagesData: {
        outname: '基本工资：',
        status: 1,
        value: '',
        value1: '',
        maxLength: 8,
        msg: ''
      },
      eiMoneyData: {
        outname: '养老保险扣除金额：',
        status: 1,
        value: '',
        value1: '',
        maxLength: 8,
        msg: ''
      },
      uiMoneyData: {
        outname: '失业保险扣除金额：',
        status: 1,
        value: '',
        value1: '',
        maxLength: 8,
        msg: ''
      },
      miMoneyData: {
        outname: '医疗保险扣除金额：',
        status: 1,
        value: '',
        value1: '',
        maxLength: 8,
        msg: ''
      },
      hpfMoneyData: {
        outname: '住房公积金扣除金额：',
        status: 1,
        value: '',
        value1: '',
        maxLength: 8,
        msg: ''
      },
      rpSumData: {
        outname: '奖惩金额合计：',
        status: 1,
        value: '',
        value1: '',
        maxLength: 8,
        msg: ''
      },
      // 抓到的后台错误编码
      EG00004: '工资发放记录表添加出错（后台错误）！'
    }
  },
  // 页面加载时，加载出接口
  created() {
    this.getPersonId()
  },
  methods: {
    getParamMap: function() {
      // 给date转格式
      // var d = new Date(this.attendDate)
      return {
        personId: this.id,
        ascriptionDate: this.ascriptionDate,
        grantDate: this.grantDate,
        basicWages: this.basicWagesData.value1,
        eiMoney: this.eiMoneyData.value1,
        uiMoney: this.uiMoneyData.value1,
        miMoney: this.miMoneyData.value1,
        hpfMoney: this.hpfMoneyData.value1,
        rpSum: this.rpSumData.value1,
        // 系统登陆人信息
        createUserCode: getUserInfo().usercode,
        createUserName: getUserInfo().username,
        // 系统时间
        createTime: getYMDHMS(),
        // 必填项
        isDel: 0,
        version: 0
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
    // 提示填写数据
    openWarning() {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        title: '警告信息',
        message: '请填写有效数据！',
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
    handleYes() {
      if (undefined === this.id ||
      this.ascriptionDate === '' ||
      this.grantDate === '' ||
      this.basicWagesData.value1 === '' ||
      this.eiMoneyData.value1 === '' ||
      this.uiMoneyData.value1 === '' ||
      this.miMoneyData.value1 === '' ||
      this.hpfMoneyData.value1 === '' ||
      this.rpSumData.value1 === ''
      ) {
        this.openWarning()
      } else if (parseInt(this.basicWagesData.value1) < parseInt(this.eiMoneyData.value1) +
      parseInt(this.uiMoneyData.value1) +
      parseInt(this.miMoneyData.value1) +
      parseInt(this.hpfMoneyData.value1) +
      parseInt(this.rpSumData.value1)) {
        this.openWarningLarge()
      } else {
        axios.post('/api/a02person/wages_grant/add', this.getParamMap()).then((res) => {
        // 添加成功
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
          // 添加失败，给出提示
            this.msg = res.data.msg
            if (this.msg === 'EG00004') {
              this.open2(this.EG00004)
            }
          }
        }).catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'info',
            message: '已取消添加',
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
<style>
.el-form-item__label {
    font-size: 16px;
    color: #606266;
    font-weight: normal;
}
</style>

