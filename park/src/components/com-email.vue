<template>
  <div class="g_div">
    <label class="g_label">{{ currentValue.outname }}</label>
    <input :value="currentValue.value" type="text" class="g_input1" @input="handleFilter($event)">
  </div>
</template>
<script>
export default {
  name: 'ComEmail',
  props: {
    value: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  methods: {
    handleFilter(event) {
      this.val = event.target.value.replace(/\s+/g, '') // 去空格
      if (!this.val) {
        this.currentValue.msg = 'email不能为空！'
        this.currentValue.status = 0
      } else {
        // debugger
        var inval = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        // var inval = /^\w[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})$/i
        //  console.log(this.val)
        var isRight = inval.test(this.val)
        console.log(isRight)
        if (isRight) {
          this.currentValue.msg = '恭喜！通过验证！'
          this.currentValue.value = this.val
          this.currentValue.status = 1
        } else {
          this.currentValue.msg = 'email输入格式有误，请重新输入！'
          this.currentValue.value = this.val
          this.currentValue.status = 0
        }
      }
      console.log('======')
      console.log(this.currentValue)
      console.log('==========')
      this.$emit('input', this.currentValue)
    }
  }
}
</script>
