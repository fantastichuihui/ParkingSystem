<template>
  <div class="g_div">
    <label class="g_label">{{ currentValue.outname }}</label>
    <input :value="currentValue.value" type="text" class="g_input1" @input="handleFilter($event)">
  </div>
</template>
<script>
export default {
  name: 'ComCarNumber',
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
      currentValue = this.value
    }
    return {
      currentValue: currentValue
    }
  },
  methods: {
    handleFilter(event) {
      this.val = event.target.value.replace(/\s+/g, '') // 去空格
      if (!this.val) {
        this.currentValue.msg = '车牌号不能为空！'
      } else {
        var inval = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
        console.log(this.val)
        var isRight = inval.test(this.val)
        this.currentValue.value = this.val
        this.currentValue.status = isRight ? 1 : 0
        if (this.currentValue.status === 0) {
          this.currentValue.msg = '车牌号输入格式有误，请重新输入！'
        } else {
          this.currentValue.msg = ''
        }
        this.$emit('input', this.currentValue)
      }
    }
  }
}
</script>
