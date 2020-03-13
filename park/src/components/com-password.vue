<template>
  <div class="g_div">
    <label class="g_label">{{ currentValue.outname }}</label>
    <input :value="currentValue.value" type="password" class="g_input1" @input="handleFilter($event)">
  </div>
</template>
<script>
export default {
  name: 'Vusername',
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
        this.currentValue.msg = '用户名不能为空！'
      } else {
        var inval = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
        // 只能是数字和小数点，不能是其他输入
        console.log(this.val)
        var isRight = inval.test(this.val)
        this.currentValue.value = this.val
        this.currentValue.status = isRight ? 1 : 0
        if (this.currentValue.status === 0) {
          this.currentValue.msg = '密码至少包含数字和字母且6-20位，请重新输入！'
        }
        this.$emit('input', this.currentValue)
      }
    }
  }
}
</script>
