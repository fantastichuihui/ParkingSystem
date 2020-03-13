<template>
  <div class="g_div">
    <label class="g_label">{{ currentValue.outname }}</label>
    <input :value="currentValue.value" type="text" placeholder="请输入身份证号" class="g_input1" @input="handleFilter($event)">
  </div>
</template>
<script>
export default {
  name: 'ComIdcard',
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
        this.currentValue.msg = '身份证号不能为空！'
      } else {
        var inval = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
        console.log(this.val)
        var isRight = inval.test(this.val)
        this.currentValue.value = this.val
        this.currentValue.status = isRight ? 1 : 0
        if (this.currentValue.status === 0) {
          this.currentValue.msg = '身份证号输入格式有误，请重新输入！'
        } else {
          this.currentValue.msg = '身份证号输入通过'
        }
        this.$emit('input', this.currentValue)
      }
    }
  }
}
</script>
