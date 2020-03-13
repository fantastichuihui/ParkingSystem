<template>
  <div class="g_container">
    <el-form ref="res" :model="res" :rules="rules" class="g_elForm" label-width="150px">
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="资源名称：" prop="name">
            <el-input v-model="res.name" class="g_elFormInput_other" placeholder="请输入资源名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="资源编码：" prop="code">
            <el-input v-model="res.code" class="g_elFormInput_other" placeholder="请输入资源code" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="服务名称：" prop="serviceId">
            <el-select v-model="res.serviceId" class="g_elFormSelect_other" placeholder="请选择服务">
              <el-option v-for="item in serviceData" :key="item.id" :label="item.serviceName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="对象类型：" prop="resType">
            <el-input v-model="res.resType" class="g_elFormInput_other" placeholder="请输入对象类型" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row type="flex" justify="center">
      <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="5">
        <el-button type="primary" plain icon="el-icon-search" style="float:left;" @click="handleNo()">取消</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" style="float:left;margin-left:50px;" @click="handleYes('res')">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      res: {
        id: this.$route.params.res.id,
        name: this.$route.params.res.name,
        code: this.$route.params.res.code,
        serviceId: this.$route.params.res.serviceId,
        resType: this.$route.params.res.resType,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name
      },
      serviceData: [],
      rules: {
        name: [{
          max: 20,
          type: 'string',
          required: true,
          message: '请输入资源名称,长度在20个字符以内',
          trigger: 'blur'
        }],
        code: [{
          max: 20,
          type: 'string',
          required: true,
          message: '请输入资源code,长度在20个字符以内',
          trigger: 'blur'
        }],
        serviceId: [{
          type: 'number',
          required: true,
          message: '请输入服务id,必须是数字,长度在11个字符以内',
          trigger: 'change'
        }],
        resType: [{
          max: 10,
          type: 'string',
          required: true,
          message: '请输入对象类型,长度在10个字符以内',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getServiceId()
  },
  methods: {
    getServiceId() {
      axios.get('/api/a01auth/service/findAllService').then((result) => {
        this.serviceData = result.data
      })
    },

    handleYes(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.put('/api/a01auth/res/updateRes', this.res).then((res) => {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '更新成功!',
              position: 'bottom-right'
            })
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
        } else {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '更新失败',
            type: 'error',
            message: '更新失败',
            position: 'bottom-right'
          })
          return false
        }
        this.$router.push('res')
      })
    },
    handleNo() {
      this.$router.push('res')
    }
  }
}
</script>
