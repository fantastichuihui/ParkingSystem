<template>
  <div class="g_container">
    <el-form
      ref="actionAdd"
      :model="actionAdd"
      :label-position="labelPosition"
      label-width="150px"
      class="g_elForm"
      :rules="rules"
    >
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="动作名称：" prop="addActName">
            <el-input
              v-model.trim="actionAdd.addActName"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
              @input="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="动作类型：" prop="addActType">
            <el-select
              v-model="actionAdd.addActType"
              placeholder="1:菜单 2：按钮"
              class="g_elFormSelect_other"
              clearable
              @change="inputChange"
            >
              <el-option label="菜单" value="1" />
              <el-option label="按钮" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="动作内容：" prop="addActContent">

            <el-input
              v-model.trim="actionAdd.addActContent"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
              @input="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="动作图标：" prop="addActIcon">
            <el-input
              v-model.trim="actionAdd.addActIcon"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
              @input="inputChange"
            /></el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="动作样式：" prop="addActaClass">
            <el-input
              v-model.trim="actionAdd.addActaClass"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
              @input="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="center">
      <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="5">
        <el-button type="primary" plain style="float:left;" icon="el-icon-back" @click="handleCancel()">取消</el-button>
        <el-button type="primary" plain style="float:left;margin-left:50px;" :disabled="add" icon="el-icon-plus" @click="handleAdd('actionAdd')">确认</el-button>
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
// 系统登陆人信息
import { getUserInfo } from '@/utils/userInfo'
export default {
  name: 'ActionAdd',
  data() {
    return {
      add: true,
      labelPosition: 'right',
      currentTime: '',
      resData: [],
      actionAdd: {
        addActName: '',
        addActType: '',
        addActContent: '',
        addActIcon: '',
        addActaClass: ''
      },
      EC00001: '动作表添加出错（后台错误）！',
      // 校验
      rules: {
        addActName: [
          { required: true, message: '请输入动作名称', trigger: 'blur' },
          { max: 20, message: '长度在20个字符以内!' },
          { pattern: /^[\u0391-\uFFE5A-Za-z0-9]+$/, message: '执行单号只能为中英文或数字，不包含特殊字符！', trigger: 'blur' }
        ],
        addActType: [
          { required: true, message: '请选择动作类型', trigger: 'change' }
        ],
        addActContent: [
          { required: true, message: '请输入动作内容', trigger: 'blur' },
          { max: 255, message: '长度在255个字符以内!' },
          { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '名称只能为中文或英文，不包含特殊字符！' }
        ],
        addActIcon: [
          { required: true, message: '请输入动作图标', trigger: 'blur' },
          { max: 255, message: '长度在255个字符以内!' },
          { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '名称只能为中文或英文，不包含特殊字符！' }
        ],
        addActaClass: [
          { required: true, message: '请输入动作样式', trigger: 'blur' },
          { max: 255, message: '长度在255个字符以内!' },
          { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '名称只能为中文或英文，不包含特殊字符！' }
        ]
      }
    }
  },
  created() {
    this.getTime()
  },
  methods: {
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
    getTime() {
      this.currentTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() +
          ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
      console.log(this.currentTime)
    },
    // 不输入不允许点击确定按钮
    inputChange() {
      if (this.actionAdd.addActName === '' &&
        (this.actionAdd.addActType === '' || this.actionAdd.addActType === null) &&
        this.actionAdd.addActContent === '' &&
        this.actionAdd.addActIcon === '' &&
        this.actionAdd.addActaClass === '') {
        this.add = true
      } else {
        this.add = false
      }
    },
    // 取消
    handleCancel() {
      this.$router.push('action')
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        type: 'info',
        message: '已取消添加',
        position: 'bottom-right'
      })
    },
    getParam: function() {
      return {
        name: this.actionAdd.addActName,
        type: this.actionAdd.addActType,
        content: this.actionAdd.addActContent,
        icon: this.actionAdd.addActIcon,
        aClass: this.actionAdd.addActaClass,
        modifierCode: getUserInfo().usercode,
        modifierName: getUserInfo().username,
        modifyTime: this.currentTime,
        createUserCode: getUserInfo().usercode,
        createUserName: getUserInfo().username,
        createTime: this.currentTime,
        version: 0,
        isDel: 0
      }
    },
    handleAdd(actionAdd) {
      // 检查表单
      this.$refs[actionAdd].validate((valid) => {
        if (valid) {
          console.log(this.getParam())
          axios.post('/api/a01auth/action/insertAction', this.getParam()).then((res) => {
            if (res.data.status === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '添加成功!',
                position: 'bottom-right'
              })
              this.$router.push('action')
            } else {
              this.msg = res.data.msg
              if (this.msg === 'EC00001') {
                this.open2(this.EC00001)
              }
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
