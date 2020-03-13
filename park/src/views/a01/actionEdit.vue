<template>
  <div class="g_container">
    <el-form
      ref="actionEdit"
      :model="actionEdit"
      label-width="150px"
      class="g_elForm"
      :rules="rules"
    >
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="动作名称：" prop="editActName">
            <el-input
              v-model.trim="actionEdit.editActName"
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
          <el-form-item label="动作类型：" prop="editActType">
            <el-select v-model="actionEdit.editActType" placeholder="1:菜单 2：按钮" class="g_elFormSelect_other" @change="inputChange">
              <el-option label="菜单" value="1" />
              <el-option label="按钮" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="动作内容：" prop="editActContent">
            <el-input
              v-model.trim="actionEdit.editActContent"
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
          <el-form-item label="动作图标：" prop="editActIcon">
            <el-input
              v-model.trim="actionEdit.editActIcon"
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
          <el-form-item label="动作样式：" prop="editActaClass">
            <el-input
              v-model.trim="actionEdit.editActaClass"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
              @input="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="5">
          <el-button type="primary" plain style="float:left;" icon="el-icon-back" @click="handleCancel()">返回</el-button>
          <el-button type="primary" plain style="float:left;margin-left:50px;" :disabled="edit" icon="el-icon-plus" @click="handleEditAct('actionEdit')">确认</el-button>
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
import { getUserInfo } from '@/utils/userInfo'
export default {
  data() {
    return {
      // 修改按钮初始状态禁用
      edit: true,
      currentTime: '',
      resData: [],
      currentPage: 1,
      actionEdit: {
        id: this.$route.params.action.id,
        editActName: this.$route.params.action.name,
        editActType: this.$route.params.action.type,
        editActContent: this.$route.params.action.content,
        editActIcon: this.$route.params.action.icon,
        editActaClass: this.$route.params.action.aClass,
        isDel: this.$route.params.action.isDel
      },
      EC00003: '动作表修改出错（后台错误）！',
      // 校验
      rules: {
        editActName: [
          { required: true, message: '请输入动作名称', trigger: 'blur' },
          { max: 20, message: '长度在20个字符以内!' },
          { pattern: /^[\u0391-\uFFE5A-Za-z0-9]+$/, message: '执行单号只能为中英文或数字，不包含特殊字符！', trigger: 'blur' }
        ],
        editActType: [
          { required: true, message: '请选择动作类型', trigger: 'change' }
        ],
        editActContent: [
          { required: true, message: '请输入动作内容', trigger: 'blur' },
          { max: 255, message: '长度在255个字符以内!' },
          { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '名称只能为中文或英文，不包含特殊字符！' }
        ],
        editActIcon: [
          { required: true, message: '请输入动作图标', trigger: 'blur' },
          { max: 255, message: '长度在255个字符以内!' },
          { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '名称只能为中文或英文，不包含特殊字符！' }
        ],
        editActaClass: [
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
    getTime() {
      this.currentTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
    },
    // 用户不修改时确定按钮为禁用
    inputChange() {
      if (this.actionEdit.editActName === this.$route.params.action.name &&
        this.actionEdit.editActType === this.$route.params.action.type &&
        this.actionEdit.editActContent === this.$route.params.action.content &&
        this.actionEdit.editActIcon === this.$route.params.action.icon &&
        this.actionEdit.editActaClass === this.$route.params.action.aClass) {
        this.edit = true
      } else {
        this.edit = false
      }
    },
    actionEditData: function() {
      axios.put('/api/a01auth/action/updateAction', this.getParamMap()).then((res) => {
        if (res.data.status === 1) {
          this.$router.push('action')
        } else {
          // 修改失败，给出提示
          this.msg = res.data.msg
          if (this.msg === 'EC00003') {
            this.open2(this.EC00003)
          }
        }
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
    getParamMap: function() {
      return {
        id: this.$route.params.action.id,
        name: this.actionEdit.editActName,
        type: this.actionEdit.editActType,
        content: this.actionEdit.editActContent,
        icon: this.actionEdit.editActIcon,
        aClass: this.actionEdit.editActaClass,
        modifierCode: getUserInfo().usercode,
        modifierName: getUserInfo().username,
        modifyTime: this.currentTime,
        isDel: this.$route.params.action.isDel
      }
    },
    handleEditAct(actionEdit) {
      this.$refs[actionEdit].validate((valid) => {
        if (valid) {
          console.log(this.getParamMap())
          axios.put('/api/a01auth/action/updateAction', this.getParamMap()).then((res) => {
            if (res.data.status === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '修改成功!',
                position: 'bottom-right'
              })
              this.$router.push('action')
            } else {
              this.msg = res.data.msg
              if (this.msg === 'EC00003') {
                this.open2(this.EC00003)
              }
            }
          })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.$router.push('action')
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        type: 'info',
        message: '已取消修改',
        position: 'bottom-right'
      })
    }
  }
}
</script>

