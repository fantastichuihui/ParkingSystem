<template>
  <div class="g_div">
    <label class="g_label">{{ currentValue.outname }}</label>
    <input :value="currentValue.value" type="text" placeholder="请输入电话" class="g_input1" @input="handleFilter($event)">
  </div>
</template>
<script>
export default {
  name: 'Vphone',
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
    if (this.value.value.length === 11) {
      currentValue = this.value
    }
    if (this.value.value.length > 0 && this.value.value.length < 11) {
      do { this.value.value = this.value.value + '0' }
      while (this.value.value.length < 11)
      currentValue = this.value
    } else {
      this.value.value = this.value.value.slice(0, 11)
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
        this.currentValue.msg = '电话号码不能为空！'
        this.currentValue.status = 0
        this.currentValue.value = ''
      }
      if (this.val.length === 11) {
        var phone = /^1[3|4|5|7|8][0-9]\d{8}$/
        var isRight = phone.test(this.val)
        var yes1 = isRight ? 1 : 0

        var tel = /^(0\d{2}-\d{7})$/
        var isRight2 = tel.test(this.val)
        var yes2 = isRight2 ? 1 : 0

        if (yes1 || yes2) {
          this.currentValue.status = 1
          this.currentValue.msg = '通过验证！'
          this.currentValue.value = this.val
        } else {
          this.currentValue.msg = '电话或手机格式不正确！'
          this.currentValue.status = 0
          this.currentValue.value = this.val
        }
      } else {
        this.currentValue.status = 0
        this.currentValue.msg = '电话或手机长度不正确！'
        this.currentValue.value = this.val
      }
      this.$emit('input', this.currentValue)
    }
  }
}
</script>
