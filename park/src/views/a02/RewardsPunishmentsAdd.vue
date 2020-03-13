<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form :label-position="labelPosition" label-width="130px">
        <el-row style="margin-left:20px;">
          <el-col :offset="8" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item label="人员id：" prop="name" label-width="125px">
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
          <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <!--   联系电话: float: left;-->
            <el-form-item prop="count">
              <!-- 金额 -->
              <ComMoney v-model="count" />
            </el-form-item>
          </el-col>
          <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <!--  身份证号: -->
            <el-form-item prop="reason">
              <!-- 事由 -->
              <VtextInput v-model="reason" />
            </el-form-item>
          </el-col>
          <el-col :offset="8" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item label="发生日期：" prop="occurrenceDate" label-width="125px">
              <el-date-picker
                v-model="occurrenceDate"
                type="date"
                style="width:50%;"
                value-format="yyyy-MM-dd"
                placeholder="选择发生日期"
              />
            </el-form-item>
          </el-col>
          <el-col :offset="8" :xs="2" :sm="4" :md="6" :lg="8" :xl="12">
            <el-form-item label="归属工资日期：" prop="wageDate" label-width="125px">
              <el-date-picker v-model="wageDate" type="date" style="width:50%;" value-format="yyyy-MM-dd" placeholder="选择归属工资日期" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleNo()">取消</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleYes()">添加</el-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
// 金钱的组件
import ComMoney from '@/components/com-money'

// 事由(max=100)
import VtextInput from '@/components/com-textInput'
// 转时间格式
import {
  formatDate,
  getYMDHMS
} from '@/utils/datetime'
/*  // 系统登陆人信息
import {
  getUserInfo
} from '@/utils/userInfo'
 */
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
    ComMoney,
    VtextInput
  },
  data() {
    return {
      labelPosition: 'right',
      // 后台拿的personId
      id: undefined,
      options: [],
      //   金钱的组件
      count: {
        outname: '金额：',
        status: 1,
        value: '',
        value1: '',
        maxLength: 8,
        msg: ''
      },
      //   事由zujian
      reason: {
        outname: '事由：',
        status: 1,
        value: '',
        maxLength: 100,
        msg: ''
      },
      //   发生日期：
      occurrenceDate: '',
      // 归属工资日期：
      wageDate: '',
      // 抓到的后台错误编码
      ER00004: '人员奖惩表添加出错（后台错误）！'
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
        count: this.count.value1,
        reason: this.reason.value,
        occurrenceDate: this.occurrenceDate,
        wageDate: this.wageDate,
        // 系统登陆人信息
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
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
    // 提示填写数据
    openWarning() {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        title: '警告信息',
        message: '请填写所有数据！',
        type: 'error',
        position: 'bottom-right'
      })
    },

    // 确认添加
    handleYes() {
      if (this.id === undefined ||
          this.count.value1 === '' ||
          this.reason.value === '' ||
          this.occurrenceDate === '' ||
          this.wageDate === ''
      ) {
        this.openWarning()
      } else {
        axios.post('/api/a02person/RewardsPunishments/add', this.getParamMap()).then((res) => {
          // 修改成功
          if (res.data.status === 1) {
            this.$notify({
              type: 'success',
              message: '添加成功!',
              position: 'bottom-right'
            })
            this.$router.push('Rewards_punishments')
          } else {
            // 修改失败，给出提示
            this.msg = res.data.msg
            if (this.msg === 'ER00004') {
              this.open2(this.ER00004)
            }
          }
        })
      }
    },
    handleNo() {
      this.$router.push('Rewards_punishments')
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
