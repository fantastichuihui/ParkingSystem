<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="100px"
    class="demo-ruleForm"
    style="margin-bottom:30px;width:50%"
  >
    <el-form-item label="密码:" prop="password">
      <el-input v-model.number="ruleForm.password" placeholder="请输入密码" show-password style="width:250px;float:left;" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    var check = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空!'))
      }
      if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])[A-Za-z\d#?!@$%^&*-]{8,16}$/.test(value)) {
        return callback(new Error('密码必须为8-16位包含大小写字母，数字和特殊符号！'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        password: ''
      },
      rules: {
        password: [{ validator: check, trigger: 'blur' }]
      }
    }
  }
}
</script>

