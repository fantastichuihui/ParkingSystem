<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
      <el-form-item label="邮箱:" prop="email" status-icon>
        <el-input v-model="ruleForm.email" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const mail = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/
      if (!value) {
        return callback(new Error('不能为空'))
      }
      if (!(mail.test(value))) {
        callback(new Error('请输入正确邮箱！'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        email: ''
      },
      rules: {
        email: [{
          validator: checkEmail,
          trigger: 'blur'
        }]
      }
    }
  }
}
</script>

<style>

</style>
