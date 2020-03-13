<template>
  <div>
    <!-- <label>身份证:</label>
		<input type="text" v-model="idcode" v-on:blur="checkIdCard" /><br />{{idcode}}
		<span>------{{this.flag}}</span> -->
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
      <el-form-item label="身份证:" prop="idcode">
        <el-input v-model="ruleForm.idcode" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var check = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空!'))
      }
      // 加权因子
      var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验码
      var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

      var code = this.ruleForm.idcode
      var last = this.ruleForm.idcode[17] // 最后一位

      var seventeen = code.substring(0, 17)

      // ISO 7064:1983.MOD 11-2
      // 判断最后一位校验码是否正确
      var arr = seventeen.split('')
      var len = arr.length
      var num = 0
      for (var i = 0; i < len; i++) {
        num = num + arr[i] * weight_factor[i]
      }

      // 获取余数
      var resisue = num % 11
      var last_no = check_code[resisue]

      // 格式的正则
      // 正则思路
      /*
      第一位不可能是0
      第二位到第六位可以是0-9
      第七位到第十位是年份，所以七八位为19或者20
      十一位和十二位是月份，这两位是01-12之间的数值
      十三位和十四位是日期，是从01-31之间的数值
      十五，十六，十七都是数字0-9
      十八位可能是数字0-9，也可能是X
      */
      var idcard_patter =
      /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/

      // 判断格式是否正确
      var format = idcard_patter.test(this.ruleForm.idcode)
      var flag = last === last_no && format ? 1 : 0

      if (flag) {
        callback()
      } else {
        callback(new Error('请输入正确身份证号码！'))
      }
    }
    return {
      ruleForm: {
        idcode: ''
      },
      maxLength: 10,
      rules: {
        idcode: [{
          validator: check,
          trigger: 'blur'
        }]
      }
    }
  }
}
</script>

<style>
</style>
