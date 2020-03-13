<template>
  <div class="g_container">
    <el-form
      ref="dataForm"
      v-model="temp"
      class="person_form"
      label-position="right"
      label-width="150px"
      style="margin-top:10%"
    >

      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item
            label="人员id："
            prop="id"
            class="g_item_label"
          >
            <el-select v-model.trim="temp.id" placeholder="请选择人员id" class="g_elFormSelect_other" :readonly="false">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name + '       [' + item.id + ']'"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item
            label="考勤时间："
            prop="attendDate"
            class="g_item_label"
          >
            <el-date-picker
              v-model="temp.attendDate"
              class="g_elFormSelect_other"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item
            label="考勤类型："
            prop="attendType"
            class="g_item_label"
          >
            <el-select v-model="temp.attendType" placeholder="请选择考勤类型" class="g_elFormSelect_other">
              <el-option label="签到" value="1" />
              <el-option label="签退" value="0" />
            </el-select><br>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="center">
      <el-col :xs="2" :sm="4" :md="6" :lg="4" :xl="5">
        <el-button type="primary" plain icon="el-icon-refresh" style="float:left;" @click="handleNo()">取消</el-button>
        <el-button type="primary" :disabled="add" plain icon="el-icon-plus" style="float:left;margin-left:50px;" @click="handleYes()">添加</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
// 转时间格式
// eslint-disable-next-line no-unused-vars
import { formatDate, getYMDHMS } from '@/utils/datetime'
// 系统登陆人信息
// eslint-disable-next-line no-unused-vars
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
  data() {
    return {
      temp: {
        id: undefined,
        attendDate: '',
        attendType: undefined
      },
      // attendDate: '',
      // attendType: undefined,
      add: false,
      options: [],
      // 抓到的后台错误编码
      EC00004: '考勤信息表添加出错（后台错误）！',
      createUserCode: '',
      createUserName: ''
    }
  },
  // 页面加载时，加载出接口
  created() {
    this.createUserCode = this.$store.state.userInfo.code
    this.createUserName = this.$store.state.userInfo.name
    this.getPersonId()
  },
  methods: {
    getParamMap: function() {
      // 给date转格式
      // var d = new Date(this.attendDate)
      return {
        personId: this.temp.id,
        attendDate: this.temp.attendDate,
        attendType: this.temp.attendType,
        // 系统登陆人信息
        createUserCode: this.createUserCode,
        createUserName: this.createUserName
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
        message: '人员id和考勤时间考勤类型均不能为空！',
        type: 'warning',
        position: 'bottom-right'
      })
    },
    handleYes() {
      if (undefined === this.temp.id || this.temp.attendDate === '' || undefined === this.temp.attendType) {
        this.openWarning()
      } else {
        axios.post('/api/a02person/attendence/add', this.getParamMap()).then((res) => {
          // 修改成功
          if (res.data.status === 1) {
            if (res.data.resultData > 0) {
              this.notifyInstance = this.$notify({
                title: '成功信息',
                message: '操作成功！',
                type: 'success',
                position: 'bottom-right'
              })
              this.$router.push('Attendance')
            } else {
              this.notifyInstance = this.$notify({
                title: '错误信息',
                message: '后台添加失败！',
                type: 'success',
                position: 'bottom-right'
              })
            }
          } else {
            this.notifyInstance = this.$notify({
              title: '警告信息',
              message: '后台添加异常！',
              type: 'warning',
              position: 'bottom-right'
            })
          }
        })
      }
    },
    handleNo() {
      this.$router.push('Attendance')
    }
  }
}
</script>
