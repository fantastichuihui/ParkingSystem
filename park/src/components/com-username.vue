<template>
  <div class="g_div">
    <label class="g_label">{{ currentValue.outname }}</label>
    <input :value="currentValue.value" type="text" class="g_input1" @input="handleFilter($event)">
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
    if (this.value.value) {
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
        var inval = /[^A-Za-z0-9]/
        // 只能是数字和小数点，不能是其他输入
        console.log(this.val)
        var isRight = inval.test(this.val)
        this.currentValue.value = this.val.toUpperCase()
        this.currentValue.status = isRight ? 1 : 0
      }
      this.$emit('input', this.currentValue)
    }
  }
}
</script>
