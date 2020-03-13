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
        <el-button type="primary" plain icon="el-icon-edit" style="float:left;margin-left:50px;" @click="handleYes()">修改</el-button>
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
      modifierName: '',
      modifierCode: '',
      obj: {
        id: undefined,
        attendDate: '',
        attendType: undefined,
        personId: '',
        version: ''
      },
      mainid: this.$route.params.attendance.id,
      id: this.$route.params.attendance.personId,
      personId: undefined,
      options: [],
      value: this.$route.params.attendance.attendType,
      attendDate: this.$route.params.attendance.attendDate,
      // attendType: this.$route.params.attendance.attendType,
      // 抓到的后台错误编码
      EC00003: '考勤信息表修改出错（后台错误）！',
      typeOptions: [
        {
          label: '签到',
          value: 1
        }, {
          label: '签退',
          value: 0
        }
      ]
    }
  },
  created() {
    this.modifierCode = this.$store.state.userInfo.code
    this.modifierName = this.$store.state.userInfo.name
    this.getPersonId()
    this.obj = Object.assign({}, this.$route.params) // copy obj  将选中的数据放入表格中
    this.temp.id = this.obj.attendance.personId // 人员id
    this.temp.attendDate = this.obj.attendance.attendDate // 考勤日期
    this.temp.attendType = this.obj.attendance.type // 考勤类型
  },
  methods: {
    getParamMap: function() {
      return {
        id: this.obj.attendance.id,
        personId: this.temp.id,
        attendDate: this.temp.attendDate,
        attendType: this.temp.attendType,
        modifierCode: this.modifierCode,
        modifierName: this.modifierName,
        version: this.obj.attendance.version
      }
    },
    getParamMap2: function() {
      return {
        id: this.obj.attendance.id,
        personId: this.temp.id,
        attendDate: this.temp.attendDate,
        modifierCode: this.modifierCode,
        modifierName: this.modifierName,
        version: this.obj.attendance.version
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
    // 修改成功的提示
    open1() {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        title: '成功',
        message: '修改成功',
        type: 'success',
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
      if (undefined === this.temp.id || this.temp.attendDate === '' || undefined === this.temp.attendType) {
        this.open3()
      } else {
        if (this.temp.attendType === '签到' || this.temp.attendType === '签退') {
          axios.post('/api/a02person/attendence/update', this.getParamMap2()).then((res) => {
          // 修改成功
            if (res.data.status === 1) {
              if (res.data.resultData > 0) {
                this.open1()
                this.$router.push('Attendance')
              } else {
                this.notifyInstance = this.$notify({
                  title: '警告信息',
                  message: '后台修改失败！',
                  type: 'warning',
                  position: 'bottom-right'
                })
              }
            } else {
            // 修改失败，给出提示
              this.msg = res.data.msg
              if (this.msg === 'EC00003') {
                this.open2(this.EC00003)
              }
            }
          })
        } else {
          axios.post('/api/a02person/attendence/update', this.getParamMap()).then((res) => {
          // 修改成功
            if (res.data.status === 1) {
              if (res.data.resultData > 0) {
                this.open1()
                this.$router.push('Attendance')
              } else {
                this.notifyInstance = this.$notify({
                  title: '警告信息',
                  message: '后台修改失败！',
                  type: 'warning',
                  position: 'bottom-right'
                })
              }
            } else {
            // 修改失败，给出提示
              this.msg = res.data.msg
              if (this.msg === 'EC00003') {
                this.open2(this.EC00003)
              }
            }
          })
        }
      }
    },
    handleNo() {
      this.$router.push('Attendance')
    }
  }
}
</script>
