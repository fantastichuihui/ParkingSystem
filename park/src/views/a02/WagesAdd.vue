<template>
  <div class="g_container">
    <el-form
      class="g_elForm"
      label-width="150px"
    >
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="8">
          <el-form-item label="人员id：" prop="id" label-width="188px">

            <el-select
              v-model.trim="id"
              placeholder="请选择人员id"
              style="width: 83%;float:left;margin-left:10px;"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name + '(id:' + item.id + ')'"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="18">
          <!-- 金钱的组件 -->
          <ComMoney v-model="moneyData" style="width: 50%;" />
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="5">
          <el-button type="primary" plain style="float:right;margin-top:30px" icon="el-icon-back" @click="handleNo()">取消</el-button>
          <el-button type="primary" plain style="float:right;margin-top:30px;margin-right:50px;" icon="el-icon-edit" @click="handleYes()">添加</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
/* 金钱的组件 */
import ComMoney from '@/components/com-money'
/* 转时间格式 */
import {
  formatDate,
  getYMDHMS
} from '@/utils/datetime'
  /* 系统登陆人信息 */
import {
  getUserInfo
} from '@/utils/userInfo'

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
      // 后台拿的personId
      id: undefined,
      options: [],
      //   金钱的组件
      moneyData: {
        outname: '基本工资(税前)：',
        status: 1,
        value: '',
        value1: '',
        maxLength: 10,
        msg: ''
      },
      // 抓到的后台错误编码
      EW00004: '人员工资表添加出错！'
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
        grossPay: this.moneyData.value1,
        // 系统登陆人信息
        createUserCode: getUserInfo().usercode,
        createUserName: getUserInfo().username,
        // 系统时间
        createTime: getYMDHMS(),
        modifierCode: getUserInfo().usercode,
        modifierName: getUserInfo().username,
        modifyTime: getYMDHMS(),
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
    openWarning() {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        title: '警告信息',
        message: '请填写这两项数据！',
        type: 'error',
        position: 'bottom-right'
      })
    },
    // 确认添加
    handleYes() {
      if (undefined === this.id || this.moneyData.value1 === '') {
        this.openWarning()
      } else {
        /* console.log(this.getParamMap()) */
        axios.post('/api/a02person/wages/add', this.getParamMap()).then((res) => {
          // 修改成功
          if (res.data.status === 1) {
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '添加成功!',
              position: 'bottom-right'
            })
            this.$router.push('Wages')
          } else {
            // 修改失败，给出提示
            this.msg = res.data.msg
            if (this.msg === 'EW00004') {
              this.open2(this.EW00004)
            }
          }
        }).catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'info',
            message: '已取消',
            position: 'bottom-right'
          })
        })
      }
    },
    handleNo() {
      this.$router.push('Wages')
    }
  }
}
</script>
