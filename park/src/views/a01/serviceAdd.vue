<template>
  <div class="g_container">
    <el-form

      class="g_elForm"
      :label-position="labelPosition"
      label-width="150px"
    >
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 服务名称：" prop="addServiceName">

            <el-input
              v-model.trim="addServiceName"
              class="g_elFormInput_other"
              placeholder="请输入内容"

              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 服务编码：" prop="addServiceCode">

            <el-input
              v-model.trim="addServiceCode"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="5">
          <el-button type="primary" plain style="float:left;" icon="el-icon-back" @click="handleCancel()">取消</el-button>
          <el-button type="primary" plain style="float:left;margin-left:50px;" icon="el-icon-plus" @click="handleAdd()">确认</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style>
.el-form-item__label {
    font-size: 16px;
    color: #606266;
    font-weight: normal;
}
</style>

<script>
import axios from 'axios'
// 系统登陆人信息

export default {
  name: 'ServiceAdd',
  data() {
    return {
      labelPosition: 'right',
      currentTime: '',
      addServiceName: '',
      addServiceCode: '',
      EC00001: '服务表添加出错（后台错误）！'
    }
  },
  computed: {
    useInfo() {
      return this.$store.state.userInfo
    }
  },
  created() {
    this.getTime()
  },
  methods: {
    getTime() {
      this.currentTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
    },
    addServiceData() {
      axios.post('/api/a01auth/service/insertService', this.getParam()).then((res) => {
        if (res.data.status === 1) {
          this.$router.push('service')
        } else {
          this.msg = res.data.msg
          if (this.msg === 'EC00001') {
            this.open2(this.EC00001)
          }
        }
      })
    },
    handleCancel() {
      this.$router.push('service')
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
    getParam: function() {
      return {
        serviceName: this.addServiceName,
        serviceCode: this.addServiceCode,
        modifierCode: this.useInfo.code,
        modifierName: this.useInfo.name,
        /* modifierCode: 'wxs',
        modifierName: 'wxs', */
        modifyTime: this.currentTime,
        createUserCode: this.useInfo.code,
        createUserName: this.useInfo.name,
        /* createUserCode: 'wxs',
        createUserName: 'wxs', */
        createTime: this.currentTime,
        version: 0,
        isDel: 0
      }
    },
    handleAdd() {
      if (this.addServiceName === '' ||
      this.addServiceCode === ''
      ) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请输入添加数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.addServiceData()
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          type: 'success',
          message: '添加成功!',
          position: 'bottom-right'
        })
      }
    }
  }
}

</script>
