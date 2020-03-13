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
          <ComMoney v-model.trim="grossPayData" style="width: 50%;" />
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="5">
          <el-button type="primary" plain icon="el-icon-back" style="float:right;margin-top:30px" @click="handleNo()">取消</el-button>
          <el-button type="primary" plain icon="el-icon-edit" style="float:right;margin-top:30px;margin-right:50px;" @click="handleYes()">修改</el-button>
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
  /* 转换时间戳 */
  filters: {
    formatDate(time) {
      time = time * 1000
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  /* 引入金钱的组件 */
  components: {
    ComMoney
  },
  data() {
    return {
      mainid: this.$route.params.wages.id,
      id: this.$route.params.wages.personId,
      options: [],
      //   金钱的组件
      grossPayData: {
        outname: '基本工资(税前)：',
        status: 1,
        value: this.$route.params.wages.grossPay,
        value1: this.$route.params.wages.grossPay,
        maxLength: 10,
        msg: ''
      },
      // 抓到的后台错误编码
      EW00003: '人员工资表修改出错！'
    }
  },
  created() {
    this.getPersonId()
  },
  methods: {
    getParamMap: function() {
      return {
        id: this.mainid,
        personId: this.id,
        grossPay: this.grossPayData.value1,
        // 系统登陆人信息
        modifierCode: getUserInfo().usercode,
        modifierName: getUserInfo().username,
        // modifyTime: modifyd.getFullYear() + '-' + modifyd.getMonth() + '-' + modifyd.getDate() + ' ' + modifyd.getHours() + ':' + modifyd.getMinutes() + ':' + modifyd.getSeconds(),
        // 系统时间
        modifyTime: getYMDHMS(),
        // 其他未选的传-->原值
        createUserCode: this.$route.params.wages.createUserCode,
        createUserName: this.$route.params.wages.createUserName,
        createTime: getYMDHMS(),
        version: this.$route.params.wages.version,
        isDel: this.$route.params.wages.isDel
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
    // 修改选中的那行数据
    handleYes(pagers) {
      if (this.id === this.$route.params.wages.personId && this.grossPayData === this.$route.params.wages.grossPay) {
        this.open3()
      } else {
        axios.put('/api/a02person/wages/update', this.getParamMap()).then((res) => {
          // 修改成功
          if (res.data.status === 1) {
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '修改成功!',
              position: 'bottom-right'
            })
            this.$router.push('Wages')
          } else {
            // 修改失败，给出提示
            this.msg = res.data.msg
            if (this.msg === 'EW00003') {
              this.open2(this.EW00003)
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
