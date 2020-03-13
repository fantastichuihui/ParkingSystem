<template>
  <div class="g_container">
    <el-form

      class="g_elForm"
      :label-position="labelPosition"
      label-width="150px"
    >
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 服务名称：" prop="editServiceName">
            <el-input
              v-model.trim="editServiceName"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 服务编码：" prop="editServiceName">
            <el-input
              v-model.trim="editServiceCode"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="center">
      <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="5">
        <el-button type="primary" plain style="float:left;" icon="el-icon-back" @click="handleCancel()">返回</el-button>
        <el-button type="primary" plain style="float:left;margin-left:50px;" icon="el-icon-plus" @click="handleEditSer()">确认</el-button>
      </el-col>
    </el-row>
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

export default {
  data() {
    return {
      labelPosition: 'right',
      currentTime: '',
      currentPage: 1,
      id: this.$route.params.service.id,
      editServiceName: this.$route.params.service.serviceName,
      editServiceCode: this.$route.params.service.serviceCode,
      EC00003: '服务表修改出错（后台错误）！'
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
    getParamMap: function() {
      return {
        id: this.id,
        serviceName: this.editServiceName,
        serviceCode: this.editServiceCode,
        modifierCode: this.useInfo.code,
        modifierName: this.useInfo.name,
        /* modifierCode: 'wxs',
        modifierName: 'c001', */
        modifyTime: this.currentTime
      }
    },
    handleEditSer(service) {
      if (this.editServiceName === this.$route.params.service.serviceName &&
      this.editServiceCode === this.$route.params.service.serviceCode
      ) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '您未输入修改数据，无法修改',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        if (this.editServiceName !== '' &&
      this.editServiceCode !== '') {
          axios.put('/api/a01auth/service/updateService', this.getParamMap()).then((res) => {
            if (res.data.status === 1) {
              this.$router.push('service')
            } else {
              // 修改失败，给出提示
              this.msg = res.data.msg
              if (this.msg === 'EC00003') {
                this.open2(this.EC00003)
              }
            }
          })
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'success',
            message: '修改成功',
            position: 'bottom-right'
          })
        } else {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '服务名称或者服务编码不能为空',
            type: 'warning',
            position: 'bottom-right'
          })
        }
      }
      this.$router.push('service')
    },
    handleCancel() {
      this.$router.push('service')
    }
  }
}
</script>

