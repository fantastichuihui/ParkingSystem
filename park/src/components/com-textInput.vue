<template>
  <div class="g_div">
    <label class="g_label">{{ currentValue.outname }}</label>
    <input :value="currentValue.value" type="text" class="g_input1" @input="handleFilter($event)">
  </div>
</template>
<script>
export default {
  name: 'VtextInput',
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
    if (this.value.value !== undefined) {
      this.value.value = this.value.value.slice(0, 99)
      currentValue = this.value
    }

    return {
      currentValue: currentValue
    }
  },
  methods: {
    handleFilter(event) {
      this.val = event.target.value
      // if (!this.val) {
      //   // return '不能为空！'
      //   this.currentValue.msg = '不能为空！'
      //   this.currentValue.status = 0
      // }
      if (this.val.length > this.currentValue.maxLength) {
        // return '超出最大长度！'
        this.currentValue.msg = '超出最大长度100！' + this.currentValue.maxLength
        this.currentValue.status = 0
        this.currentValue.value = ''
      } else {
        // this.currentValue.msg = '最大长度是' + this.currentValue.maxLength
        this.currentValue.msg = '最大长度是100'
        this.currentValue.status = 1
        this.currentValue.value = this.val
      }
      this.$emit('input', this.currentValue)
    }
  }
}
</script>
