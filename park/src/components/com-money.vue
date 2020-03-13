<template>
  <div class="g_div">
    <label class="g_label">{{ currentValue.outname }}</label>
    <input :value="currentValue.value" :maxlength="currentValue.maxLength " type="text" class="g_input1" @input="handleFilter($event)">
  </div>
</template>
<script>
export default {
  name: 'ComMoney',
  props: {
    value: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    var currentValue = {}
    if (this.value) {
      if (!this.value.maxLength) {
        this.value.maxLength = 10000
      } else {
        this.value.maxLength = this.value.maxLength + parseInt((this.value.maxLength - 1) / 3)
      }
      currentValue = this.value
    }
    return {
      currentValue: currentValue
    }
  },
  methods: {
    handleFilter(event) {
      this.val = event.target.value
      var value2Array = this.val.split('.')
      if (!this.val) {
        this.currentValue.msg = '金额不能为空！'
      }

      var intPart = value2Array[0]
      // var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
      var intPartFormat = intPart.replace(/,/g, '')
      var floatPart = '.00' // 预定义小数部分
      var append = ''
      // // =2表示数据有小数位
      if (value2Array.length === 2) {
        floatPart = value2Array[1].toString() // 拿到小数部分

        if (floatPart.length === 1) {
          append = '.' + floatPart + '0'
        } else {
          append = '.' + floatPart
        }
      }
      // var inval = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/
      intPart = intPartFormat.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      var inval = /^(-)?\d{1,3}(,\d{3})*(.\d+)?$/
      this.currentValue.value = intPart + append
      this.currentValue.value1 = intPartFormat + append
      var isRight = inval.test(intPart)
      this.currentValue.status = isRight ? 1 : 0
      if (this.currentValue.status === 0) {
        this.currentValue.msg = '金额输入格式有误，请重新输入！'
      } else {
        this.currentValue.msg = ''
      }
      this.$emit('input', this.currentValue)
    }
  }
}
</script>
