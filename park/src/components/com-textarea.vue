<template>
  <div class="g_div">
    <label class="g_label">{{ currentValue.outname }}</label>
    <span>{{ currentValue.text | filter }}</span>
    <input v-model="currentValue.text" hidden>
  </div>
</template>
<script>
export default {
  name: 'Vtextarea',
  filters: {
    filter(value) {
      // 大于十。。。输出
      if (value.length > 10) {
        return value.slice(0, 10) + '...'
      } else {
        // 原文本输出
        return value
      }
    }
  },
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
  }
}
</script>
